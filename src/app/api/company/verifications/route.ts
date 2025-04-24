// src/app/api/company/verifications/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

export async function GET(request: Request): Promise<NextResponse> {
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
    // Verify the user is a company
    const company = await prisma.companyUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!company) {
      return NextResponse.json({ message: 'Unauthorized: Company access required' }, { status: 403 });
    }

    // Get all active campaigns for this company
    const campaigns = await prisma.companyCampaign.findMany({
      where: {
        companyId: decoded.userId,
        status: 'ACTIVE',
      },
      include: {
        bundles: {
          where: {
            status: 'ACCEPTED',
          },
        },
      },
    });

    // Get all bundle IDs
    const bundleIds = campaigns.flatMap(campaign => 
      campaign.bundles.map(bundle => bundle.id)
    );

    if (bundleIds.length === 0) {
      return NextResponse.json({ verifications: [] });
    }

    // Find all SPOC assignments for these bundles
    const spocAssignments = await prisma.spocAssignment.findMany({
      where: {
        sponsorshipId: {
          in: bundleIds,
        },
      },
      include: {
        spoc: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // For each assignment, get the bundle and college details
    const verifications = await Promise.all(
      spocAssignments.map(async (assignment) => {
        // Find the bundle
        const bundle = campaigns
          .flatMap(campaign => campaign.bundles)
          .find(bundle => bundle.id === assignment.sponsorshipId);
        
        if (!bundle) return null;

        // Find the campaign
        const campaign = campaigns.find(
          campaign => campaign.bundles.some(b => b.id === bundle.id)
        );

        if (!campaign) return null;

        // Get the first college in the bundle
        const collegeId = bundle.collegeIds[0];
        
        if (!collegeId) return null;

        const college = await prisma.collegeUser.findUnique({
          where: { id: collegeId },
          select: {
            collegeName: true,
            eventName: true,
          },
        });

        if (!college) return null;

        // Calculate overall progress
        let overallProgress = 0;
        if (assignment.status === 'COMPLETED') {
          overallProgress = 100;
        } else {
          // 30% for having photos
          const photosProgress = assignment.verificationPhotos?.length > 0 ? 30 : 0;
          
          // 30% for having a report
          const reportProgress = assignment.report ? 30 : 0;
          
          // 40% for metrics progress
          let metricsProgress = 0;
          if (assignment.metricsProgress && Array.isArray(assignment.metricsProgress)) {
            // Just use the fact that metrics are being tracked as an indicator
            metricsProgress = assignment.metricsProgress.length > 0 ? 40 : 0;
          }
          
          overallProgress = photosProgress + reportProgress + metricsProgress;
        }

        return {
          id: assignment.id,
          status: assignment.status,
          college: {
            name: college.collegeName,
            event: college.eventName,
          },
          campaign: {
            id: campaign.id,
            name: campaign.name,
          },
          bundle: {
            id: bundle.id,
            name: bundle.name,
          },
          spoc: {
            name: `${assignment.spoc.firstName} ${assignment.spoc.lastName}`,
          },
          hasReport: !!assignment.report,
          hasPhotos: assignment.verificationPhotos?.length > 0,
          updatedAt: assignment.updatedAt,
          overallProgress,
        };
      })
    );

    // Filter out null values and sort by updated date (newest first)
    const filteredVerifications = verifications
      .filter(v => v !== null)
      .sort((a, b) => new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime());

    return NextResponse.json({ verifications: filteredVerifications });
  } catch (error: unknown) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch verifications', 
      status: 'error' 
    }, { status: 500 });
  }
}