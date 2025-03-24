// src/app/api/spoc/assignments/upload-photos/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';
import { uploadVerificationPhotos } from '@/app/lib/supabase';

export async function POST(request: Request) {
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
    // Parse form data
    const formData = await request.formData();
    const assignmentId = formData.get('assignmentId') as string;
    const photos = formData.getAll('photos') as File[];

    if (!assignmentId) {
      return NextResponse.json({ message: 'Assignment ID is required' }, { status: 400 });
    }

    if (!photos || photos.length === 0) {
      return NextResponse.json({ message: 'No photos provided' }, { status: 400 });
    }

    // Verify that the assignment belongs to this SPOC
    const assignment = await prisma.spocAssignment.findFirst({
      where: {
        id: assignmentId,
        spocId: decoded.userId,
      },
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found or you do not have permission' }, { status: 404 });
    }

    // Upload photos to Supabase
    const photoUrls = await uploadVerificationPhotos(photos, assignmentId);

    if (photoUrls.length === 0) {
      return NextResponse.json({ message: 'Failed to upload photos' }, { status: 500 });
    }

    // Update the assignment with the new photo URLs
    const updatedAssignment = await prisma.spocAssignment.update({
      where: { id: assignmentId },
      data: {
        // Merge existing photos with new ones
        verificationPhotos: {
          push: photoUrls,
        },
        // If this is the first photo, update the status to ACTIVE if it was PENDING
        status: assignment.status === 'PENDING' ? 'ACTIVE' : assignment.status,
      },
    });

    return NextResponse.json({ 
      message: 'Photos uploaded successfully',
      photoUrls,
      assignmentId,
    });
  } catch (error) {
    console.error('Error uploading verification photos:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to upload photos', 
      status: 'error' 
    }, { status: 500 });
  }
}