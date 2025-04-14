// app/api/company/campaigns/[campaignId]/bundles/[bundleId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    campaignId: string;
    bundleId: string;
  };
}

// GET handler to fetch a specific bundle
export async function GET(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { campaignId, bundleId } = params;

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
    // Verify that the campaign belongs to the company
    const campaign = await prisma.companyCampaign.findFirst({
      where: {
        id: campaignId,
        companyId: decoded.userId,
      },
    });

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found or unauthorized' }, { status: 404 });
    }

    // Get the bundle details
    const bundle = await prisma.campaignBundle.findUnique({
      where: {
        id: bundleId,
        campaignId: campaignId,
      },
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    // Get college details for the bundle
    const collegeOnboardings = await prisma.collegeOnboarding.findMany({
      where: {
        collegeId: {
          in: bundle.collegeIds,
        },
      },
      include: {
        college: {
          select: {
            collegeName: true,
            eventName: true,
          },
        },
        packageConfigs: {
          include: {
            metrics: true,
            features: true,
          },
        },
      },
    });

    // Transform the data for the frontend
    const collegeDetails = collegeOnboardings.map(onboarding => {
      // Default to the best package (GOLD > SILVER > BRONZE)
      const packages = onboarding.packageConfigs.sort((a, b) => {
        const tierOrder = { GOLD: 3, SILVER: 2, BRONZE: 1 };
        return (tierOrder[b.tier as keyof typeof tierOrder] || 0) - 
               (tierOrder[a.tier as keyof typeof tierOrder] || 0);
      });

      const bestPackage = packages[0] || null;

      return {
        id: onboarding.collegeId,
        collegeName: onboarding.college.collegeName,
        eventName: onboarding.college.eventName,
        eventType: onboarding.eventType,
        region: onboarding.region,
        packageTier: bestPackage?.tier,
        estimatedAmount: bestPackage?.estimatedAmount,
        packageConfigs: packages.map(pkg => ({
          tier: pkg.tier,
          estimatedAmount: pkg.estimatedAmount,
          metrics: pkg.metrics,
          features: pkg.features,
        })),
      };
    });

    // Calculate total metrics
    const totalMetrics: Record<string, number> = {};
    collegeDetails.forEach(college => {
      const bestPackage = college.packageConfigs?.[0];
      if (bestPackage) {
        bestPackage.metrics.forEach(metric => {
          if (metric.enabled && metric.minValue) {
            totalMetrics[metric.type] = (totalMetrics[metric.type] || 0) + metric.minValue;
          }
        });
      }
    });

    return NextResponse.json({
      bundle: {
        ...bundle,
        collegeDetails,
        totalMetrics,
      }
    });
  } catch (error: unknown) {
    console.error('Bundle retrieval error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to retrieve bundle', 
      status: 'error' 
    }, { status: 500 });
  }
}

// PUT handler to update a bundle
export async function PUT(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { campaignId, bundleId } = params;

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
    // Verify that the campaign belongs to the company
    const campaign = await prisma.companyCampaign.findFirst({
      where: {
        id: campaignId,
        companyId: decoded.userId,
      },
    });

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found or unauthorized' }, { status: 404 });
    }

    // Verify that the bundle belongs to the campaign
    const existingBundle = await prisma.campaignBundle.findFirst({
      where: {
        id: bundleId,
        campaignId: campaignId,
      },
    });

    if (!existingBundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    // Get the updated bundle data from the request
    const updatedBundleData = await request.json();
    
    // Extract relevant fields to update
    const { collegeIds, totalValue } = updatedBundleData;
    
    // Validate input
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json({ message: 'Invalid college IDs in request' }, { status: 400 });
    }

    // Update the bundle
    const updatedBundle = await prisma.campaignBundle.update({
      where: {
        id: bundleId,
      },
      data: {
        collegeIds,
        totalValue,
        status: 'PENDING', // Reset to pending since it was modified
      },
    });

    return NextResponse.json({
      message: 'Bundle updated successfully',
      bundle: updatedBundle,
    });
  } catch (error: unknown) {
    console.error('Bundle update error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update bundle', 
      status: 'error' 
    }, { status: 500 });
  }
}