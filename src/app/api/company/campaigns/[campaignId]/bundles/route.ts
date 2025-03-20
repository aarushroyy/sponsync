// app/api/company/campaigns/[campaignId]/bundles/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    campaignId: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { campaignId } = params;

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

    // Get all bundles for this campaign
    const bundles = await prisma.campaignBundle.findMany({
      where: {
        campaignId: campaignId,
      },
    });

    // Get college details for each bundle
    const bundlesWithDetails = await Promise.all(
      bundles.map(async (bundle) => {
        const collegeDetails = await prisma.collegeOnboarding.findMany({
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

        return {
          ...bundle,
          collegeDetails,
        };
      })
    );

    return NextResponse.json({ bundles: bundlesWithDetails });
  } catch (error: unknown) {
    console.error('Bundle retrieval error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to retrieve bundles', 
      status: 'error' 
    }, { status: 500 });
  }
}

// Select a bundle
export async function POST(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { campaignId } = params;

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
    const { bundleId } = await request.json();
    
    if (!bundleId) {
      return NextResponse.json({ message: 'Bundle ID is required' }, { status: 400 });
    }

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

    // Verify that the bundle belongs to this campaign
    const bundle = await prisma.campaignBundle.findFirst({
      where: {
        id: bundleId,
        campaignId: campaignId,
      },
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    // Update campaign status to ACTIVE
    await prisma.companyCampaign.update({
      where: {
        id: campaignId,
      },
      data: {
        status: 'ACTIVE',
      },
    });

    // Update selected bundle status
    await prisma.campaignBundle.update({
      where: {
        id: bundleId,
      },
      data: {
        status: 'ACCEPTED',
      },
    });

    // Set other bundles to REJECTED
    await prisma.campaignBundle.updateMany({
      where: {
        campaignId: campaignId,
        id: {
          not: bundleId,
        },
      },
      data: {
        status: 'REJECTED',
      },
    });

    return NextResponse.json({ 
      message: 'Bundle selected successfully',
      campaignId,
      bundleId,
    });
  } catch (error: unknown) {
    console.error('Bundle selection error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to select bundle', 
      status: 'error' 
    }, { status: 500 });
  }
}