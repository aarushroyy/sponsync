// src/app/api/spoc/assignments/[assignmentId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    assignmentId: string;
  };
}

export async function GET(
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

    // Get bundle details
    const bundle = await prisma.campaignBundle.findUnique({
      where: { id: assignment.sponsorshipId },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                companyName: true,
              }
            },
            metrics: true,
            features: true,
          }
        }
      }
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Sponsorship details not found' }, { status: 404 });
    }

    // Get college details
    const collegeId = bundle.collegeIds[0]; // Using first college for simplicity
    const college = collegeId 
      ? await prisma.collegeUser.findUnique({
          where: { id: collegeId },
          select: {
            collegeName: true,
            eventName: true,
            CollegeOnboarding: {
              select: {
                region: true,
                eventType: true,
              }
            }
          }
        })
      : null;

    // Process metrics with target and current values
    const metricsWithProgress = bundle.campaign.metrics.map(metric => {
      // Find current value from assignment progress data if available
      let currentValue = 0;
      if (assignment.metricsProgress) {
        const progressEntry = assignment.metricsProgress.find(
          (p: any) => p.type === metric.type
        );
        if (progressEntry) {
          currentValue = progressEntry.currentValue;
        }
      }

      return {
        type: metric.type,
        target: metric.maxValue || 0,
        current: currentValue,
      };
    });

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        sponsorshipId: assignment.sponsorshipId,
        status: assignment.status,
        verificationPhotos: assignment.verificationPhotos || [],
        report: assignment.report,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        companyName: bundle.campaign.company.companyName,
        campaignName: bundle.campaign.name,
        collegeName: college?.collegeName || 'Unknown College',
        eventName: college?.eventName || 'Unknown Event',
        eventType: college?.CollegeOnboarding?.eventType || 'Unknown',
        region: college?.CollegeOnboarding?.region || 'NORTH',
        metrics: metricsWithProgress,
        features: bundle.campaign.features
          .filter(f => f.enabled)
          .map(f => ({
            type: f.type,
            valueOption: f.valueOption,
          }))
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching assignment details:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch assignment details', 
      status: 'error' 
    }, { status: 500 });
  }
}