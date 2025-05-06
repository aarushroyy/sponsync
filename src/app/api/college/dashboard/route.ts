// src/app/api/college/dashboard/route.ts
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
    // Get college user details
    const college = await prisma.collegeUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        collegeName: true,
        eventName: true,
        onboardingComplete: true,
      },
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    // Check if onboarding is complete
    if (!college.onboardingComplete) {
      return NextResponse.json({ 
        message: 'Please complete onboarding first',
        redirectTo: '/auth/college/onboard'
      }, { status: 403 });
    }

    // Get college onboarding details
    const onboarding = await prisma.collegeOnboarding.findUnique({
      where: { collegeId: college.id },
      include: {
        packageConfigs: {
          include: {
            metrics: true,
            features: true,
          },
        },
      },
    });

    if (!onboarding) {
      return NextResponse.json({ message: 'College onboarding not found' }, { status: 404 });
    }

    // Transform package configs for the frontend
    const packages = onboarding.packageConfigs.map(config => ({
      tier: config.tier,
      metrics: config.metrics.map(metric => ({
        type: metric.type,
        enabled: metric.enabled,
        minValue: metric.minValue,
        maxValue: metric.maxValue,
      })),
      features: config.features.map(feature => ({
        type: feature.type,
        enabled: feature.enabled,
      })),
      estimatedAmount: config.estimatedAmount,
    }));

    // Find active sponsorships (campaign bundles that include this college)
    const campaignBundles = await prisma.campaignBundle.findMany({
      where: {
        collegeIds: {
          has: college.id,
        },
        status: 'ACCEPTED',
      },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                companyName: true,
              }
            },
            metrics: true,
          }
        },
      },
    });

    // Transform sponsorships for the frontend
    const sponsorships = campaignBundles.map(bundle => {
      // Find metrics for this company
      const metrics = bundle.campaign.metrics.map(metric => ({
        type: metric.type,
  status: 'In Progress',
  description: metric.rangeOption || `${metric.minValue || 0} - ${metric.maxValue || 'max'}`
      }));

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

      return {
        id: bundle.id,
        companyName: bundle.campaign.company.companyName,
        companyLogo: null, // Could add company logo if added to the schema
        packageTier: 'GOLD', // This would ideally be determined based on the package selected
        status: bundle.campaign.status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        metrics,
      };
    });

    // Calculate statistics
    const activeSponsors = sponsorships.filter(s => s.status === 'ACTIVE').length;
    const pendingSponsors = sponsorships.filter(s => s.status === 'DRAFT').length;
    const completedSponsors = sponsorships.filter(s => s.status === 'COMPLETED').length;
    
    // Calculate total raised (sum of bundle values for this college)
    let totalRaised = 0;
    for (const bundle of campaignBundles) {
      // Get the number of colleges in the bundle
      const collegeCount = bundle.collegeIds.length;
      
      // Distribute the total value equally among colleges
      if (bundle.totalValue && collegeCount > 0) {
        totalRaised += Math.floor(bundle.totalValue / collegeCount);
      }
    }

    return NextResponse.json({
      college: {
        id: college.id,
        name: college.name,
        collegeName: college.collegeName,
        eventName: college.eventName,
        region: onboarding.region,
        eventType: onboarding.eventType,
        posterUrl: onboarding.posterUrl,
      },
      packages,
      sponsorships,
      stats: {
        totalRaised,
        activeSponsors,
        pendingSponsors,
        completedSponsors,
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching college dashboard data:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch dashboard data', 
      status: 'error' 
    }, { status: 500 });
  }
}