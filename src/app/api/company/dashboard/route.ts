// app/api/company/dashboard/route.ts
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
    // Get all college posters
    const collegeOnboardings = await prisma.collegeOnboarding.findMany({
      select: {
        id: true,
        eventType: true,
        region: true,
        posterUrl: true,
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

    // Get company's active campaigns
    const campaigns = await prisma.companyCampaign.findMany({
      where: {
        companyId: decoded.userId,
      },
      include: {
        metrics: true,
        features: true,
        bundles: true,
      },
    });

    return NextResponse.json({
      collegeEvents: collegeOnboardings,
      activeCampaigns: campaigns,
    });
  } catch (error: unknown) {
    console.error('Dashboard error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to load dashboard', 
      status: 'error' 
    }, { status: 500 });
  }
}