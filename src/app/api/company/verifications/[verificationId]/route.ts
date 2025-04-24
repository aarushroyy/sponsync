// src/app/api/company/verifications/[verificationId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    verificationId: string;
  };
}


export async function GET(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { verificationId } = params;

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
    // Get SPOC assignment
    const spocAssignment = await prisma.spocAssignment.findUnique({
      where: { id: verificationId },
      include: {
        spoc: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!spocAssignment) {
      return NextResponse.json({ message: 'Verification not found' }, { status: 404 });
    }

    // Get bundle to verify that it belongs to this company
    const bundle = await prisma.campaignBundle.findUnique({
      where: { id: spocAssignment.sponsorshipId },
      include: {
        campaign: true,
      },
    });

    if (!bundle || bundle.campaign.companyId !== decoded.userId) {
      return NextResponse.json({ message: 'Unauthorized: This verification does not belong to your company' }, { status: 403 });
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

    // Get campaign metrics to calculate progress
    const campaignMetrics = await prisma.campaignMetric.findMany({
      where: { campaignId: bundle.campaignId },
    });

    // Calculate progress percentages
    // const metricsProgress = Array.isArray(spocAssignment.metricsProgress) 
    //   ? spocAssignment.metricsProgress.map((progress: any) => {
    //       const campaignMetric = campaignMetrics.find(m => m.type === progress.type);
    //       const target = campaignMetric?.maxValue || 0;
    //       const percentage = target > 0 ? Math.min(100, (progress.currentValue / target) * 100) : 0;
          
    //       return {
    //         ...progress,
    //         target,
    //         percentage,
    //       };
    //     })
    //   : [];

    // Calculate progress percentages
const metricsProgress = Array.isArray(spocAssignment.metricsProgress) 
? spocAssignment.metricsProgress.map((progress) => {
    const type = typeof progress === 'object' && progress !== null && 'type' in progress 
      ? progress.type as string 
      : '';
    const currentValue = typeof progress === 'object' && progress !== null && 'currentValue' in progress 
      ? Number(progress.currentValue) 
      : 0;
    
    const campaignMetric = campaignMetrics.find(m => m.type === type);
    const target = campaignMetric?.maxValue || 0;
    const percentage = target > 0 ? Math.min(100, (currentValue / target) * 100) : 0;
    
    return {
      type,
      currentValue,
      target,
      percentage,
    };
  })
: [];

    return NextResponse.json({
      verification: {
        id: spocAssignment.id,
        status: spocAssignment.status,
        createdAt: spocAssignment.createdAt,
        updatedAt: spocAssignment.updatedAt,
        spoc: {
          name: `${spocAssignment.spoc.firstName} ${spocAssignment.spoc.lastName}`,
          email: spocAssignment.spoc.email,
          phone: spocAssignment.spoc.phone,
        },
        college: college ? {
          name: college.collegeName,
          event: college.eventName,
          region: college.CollegeOnboarding?.region || 'Unknown',
          eventType: college.CollegeOnboarding?.eventType || 'Unknown',
        } : null,
        campaign: {
          id: bundle.campaign.id,
          name: bundle.campaign.name,
        },
        bundle: {
          id: bundle.id,
          name: bundle.name,
        },
        verificationPhotos: spocAssignment.verificationPhotos || [],
        report: spocAssignment.report,
        metricsProgress,
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching verification details:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch verification details', 
      status: 'error' 
    }, { status: 500 });
  }
}