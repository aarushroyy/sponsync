// src/app/api/spoc/assignments/[assignmentId]/update-metrics/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    assignmentId: string;
  };
}

interface MetricUpdate {
  type: string;
  currentValue: number;
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
      include: {
        spoc: true,
      }
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found or unauthorized' }, { status: 404 });
    }

    // Get metrics updates from request body
    const { metrics } = await request.json();
    
    if (!metrics || !Array.isArray(metrics)) {
      return NextResponse.json({ message: 'Invalid metrics data' }, { status: 400 });
    }

    // Validate metrics format
    const validMetrics = metrics.every((metric: any) => 
      typeof metric.type === 'string' && 
      typeof metric.currentValue === 'number' && 
      metric.currentValue >= 0
    );

    if (!validMetrics) {
      return NextResponse.json({ message: 'Invalid metrics format' }, { status: 400 });
    }

    // Normalize metric updates
    const metricsUpdates: MetricUpdate[] = metrics.map((metric: any) => ({
      type: metric.type,
      currentValue: Math.max(0, Number(metric.currentValue)),
    }));

    // Update assignment metrics
    const updatedAssignment = await prisma.spocAssignment.update({
      where: { id: assignmentId },
      data: {
        metricsProgress: metricsUpdates,
        status: assignment.status === 'PENDING' ? 'ACTIVE' : assignment.status,
        updatedAt: new Date(),
      },
    });

    // Check if assignment is completed
    let isCompleted = false;
    
    // If it has both report and verification photos, mark as completed
    if (
      updatedAssignment.report && 
      updatedAssignment.verificationPhotos && 
      updatedAssignment.verificationPhotos.length > 0
    ) {
      await prisma.spocAssignment.update({
        where: { id: assignmentId },
        data: {
          status: 'COMPLETED',
        },
      });
      isCompleted = true;
    }

    return NextResponse.json({
      message: 'Metrics updated successfully',
      status: isCompleted ? 'COMPLETED' : updatedAssignment.status,
      metrics: metricsUpdates,
    });
  } catch (error: unknown) {
    console.error('Error updating metrics:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update metrics', 
      status: 'error' 
    }, { status: 500 });
  }
}