// src/app/api/spoc/assignments/submit-report/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';

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
    // Parse request body
    const body = await request.json();
    const { assignmentId, report } = body;

    if (!assignmentId) {
      return NextResponse.json({ message: 'Assignment ID is required' }, { status: 400 });
    }

    if (!report || report.trim() === '') {
      return NextResponse.json({ message: 'Report content is required' }, { status: 400 });
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

    // Update the assignment with the report
    const updatedAssignment = await prisma.spocAssignment.update({
      where: { id: assignmentId },
      data: {
        report,
        // If there are photos and now a report, mark as COMPLETED
        status: assignment.verificationPhotos.length > 0 ? 'COMPLETED' : assignment.status,
      },
    });

    return NextResponse.json({ 
      message: 'Report submitted successfully',
      assignmentId,
      status: updatedAssignment.status,
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to submit report', 
      status: 'error' 
    }, { status: 500 });
  }
}