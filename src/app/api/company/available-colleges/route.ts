// app/api/company/available-colleges/route.ts
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
  try {
    verifyToken(token);
  } catch (jwtError: unknown) {
    console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const eventType = searchParams.get('eventType');
    
    // Build the query
    const whereClause: Record<string, string | undefined> = {};
    
    if (region) {
      whereClause.region = region;
    }
    
    if (eventType) {
      whereClause.eventType = eventType;
    }

    // Get available colleges with their packages
    const colleges = await prisma.collegeOnboarding.findMany({
      where: whereClause,
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
    const transformedColleges = colleges.map(onboarding => {
      // Sort packages by tier (GOLD > SILVER > BRONZE)
      const sortedPackages = onboarding.packageConfigs.sort((a, b) => {
        const tierOrder = { GOLD: 3, SILVER: 2, BRONZE: 1 };
        return (tierOrder[b.tier as keyof typeof tierOrder] || 0) - 
               (tierOrder[a.tier as keyof typeof tierOrder] || 0);
      });

      const bestPackage = sortedPackages[0] || null;

      return {
        id: onboarding.collegeId,
        collegeName: onboarding.college.collegeName,
        eventName: onboarding.college.eventName,
        eventType: onboarding.eventType,
        region: onboarding.region,
        posterUrl: onboarding.posterUrl,
        packageTier: bestPackage?.tier,
        estimatedAmount: bestPackage?.estimatedAmount,
        packageConfigs: sortedPackages.map(pkg => ({
          tier: pkg.tier,
          estimatedAmount: pkg.estimatedAmount,
          metrics: pkg.metrics,
          features: pkg.features,
        })),
      };
    });

    return NextResponse.json({ colleges: transformedColleges });
  } catch (error: unknown) {
    console.error('Available colleges retrieval error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to retrieve available colleges', 
      status: 'error' 
    }, { status: 500 });
  }
}