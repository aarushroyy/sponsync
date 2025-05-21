// src/app/api/college/sponsorships/[sponsorshipId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    sponsorshipId: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { sponsorshipId } = params;

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
    // Get college user to verify existence
    const college = await prisma.collegeUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    // Get bundle details
    const bundle = await prisma.campaignBundle.findUnique({
      where: { id: sponsorshipId },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                id: true,
                companyName: true,
                personName: true,
                position: true,
                email: true,
                phone: true,
              }
            },
            metrics: true,
            features: true,
          }
        },
      },
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Sponsorship not found' }, { status: 404 });
    }

    // Verify college is part of this bundle
    if (!bundle.collegeIds.includes(decoded.userId)) {
      return NextResponse.json({ 
        message: 'Unauthorized: College is not part of this sponsorship' 
      }, { status: 403 });
    }

    // Calculate start and end dates based on campaign plan
    const startDate = new Date(bundle.campaign.createdAt);
    const endDate = new Date(startDate);
    
    switch (bundle.campaign.plan) {
      case 'QUARTERLY':
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case 'HALF_YEARLY':
        endDate.setMonth(startDate.getMonth() + 6);
        break;
      case 'YEARLY':
        endDate.setMonth(startDate.getMonth() + 12);
        break;
    }

    // Calculate progress for each metric (simulated for now)
    // const metricsWithProgress = bundle.campaign.metrics.map(metric => {
    //   // Current progress (simulated)
    //   const target = metric.maxValue || 0;
    //   const current = Math.floor(Math.random() * target);
      
    //   return {
    //     type: metric.type,
    //     target,
    //     current,
    //     percentage: target > 0 ? (current / target) * 100 : 0,
    //   };
    // });

    // Create metrics with appropriate status and description
const metricsWithProgress = bundle.campaign.metrics.map(metric => {
  return {
    type: metric.type,
    status: 'In Progress', // Could be 'Pending', 'In Progress', 'Completed'
    description: metric.rangeOption || `${metric.minValue || 0} - ${metric.maxValue || 'max'}`,
  };
});

    // Calculate college's portion of the total value
    const collegeCount = bundle.collegeIds.length;
    const collegePortion = collegeCount > 0 ? Math.floor((bundle.totalValue || 0) / collegeCount) : 0;

    return NextResponse.json({
      sponsorship: {
        id: bundle.id,
        status: bundle.campaign.status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        name: bundle.campaign.name,
        plan: bundle.campaign.plan,
        region: bundle.campaign.regions,
        value: collegePortion,
        company: {
          id: bundle.campaign.company.id,
          name: bundle.campaign.company.companyName,
          contactPerson: bundle.campaign.company.personName,
          position: bundle.campaign.company.position,
          email: bundle.campaign.company.email,
          phone: bundle.campaign.company.phone,
        },
        metrics: metricsWithProgress,
        features: bundle.campaign.features.map(feature => ({
          type: feature.type,
          enabled: feature.enabled,
          valueOption: feature.valueOption,
        })),
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching sponsorship details:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch sponsorship details', 
      status: 'error' 
    }, { status: 500 });
  }
}