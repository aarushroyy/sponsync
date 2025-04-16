// src/app/api/spoc/assignments/[assignmentId]/upload-photos/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import { uploadVerificationPhotos } from '@/app/lib/supabase';

interface RouteContext {
  params: {
    assignmentId: string;
  };
}

export async function POST(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { assignmentId } = params;

  // Verify JWT from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  let decoded: { userId: string; role: string };
  
  try {
    decoded = verifyToken(token) as { userId: string; role: string };
  } catch (jwtError: unknown) {
    console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Verify the SPOC is assigned to this assignment
    const assignment = await prisma.spocAssignment.findFirst({
      where: {
        id: assignmentId,
        spocId: decoded.userId,
      },
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found or unauthorized' }, { status: 404 });
    }

    // Check if the assignment is already completed
    if (assignment.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Cannot upload photos for a completed assignment' }, { status: 400 });
    }

    // Parse form data
    const formData = await request.formData();
    const photos = formData.getAll('photos') as File[];

    if (!photos || photos.length === 0) {
      return NextResponse.json({ message: 'No photos provided' }, { status: 400 });
    }

    // Upload photos to Supabase
    const photoUrls = await uploadVerificationPhotos(photos, assignmentId);

    if (photoUrls.length === 0) {
      return NextResponse.json({ message: 'Failed to upload photos' }, { status: 500 });
    }

    // Update the assignment with the new photo URLs
    const existingPhotos = assignment.verificationPhotos || [];
    const updatedAssignment = await prisma.spocAssignment.update({
      where: { id: assignmentId },
      data: {
        verificationPhotos: [...existingPhotos, ...photoUrls],
        status: assignment.status === 'PENDING' ? 'ACTIVE' : assignment.status,
        updatedAt: new Date(),
      },
    });

    // Check if assignment is now complete
    let isCompleted = false;
    if (updatedAssignment.report && updatedAssignment.verificationPhotos.length > 0) {
      await prisma.spocAssignment.update({
        where: { id: assignmentId },
        data: {
          status: 'COMPLETED',
        },
      });
      isCompleted = true;
    }

    return NextResponse.json({ 
      message: 'Photos uploaded successfully',
      photoUrls,
      status: isCompleted ? 'COMPLETED' : updatedAssignment.status,
    });
  } catch (error: unknown) {
    console.error('Error uploading photos:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to upload photos', 
      status: 'error' 
    }, { status: 500 });
  }
}