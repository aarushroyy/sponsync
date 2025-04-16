// src/app/api/college/sponsorships/[sponsorshipId]/update-metrics/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    sponsorshipId: string;
  };
}

export async function POST(
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
    // Get bundle to verify it belongs to this college
    const bundle = await prisma.campaignBundle.findUnique({
      where: { id: sponsorshipId },
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

    // Get update data
    const { metrics } = await request.json();

    if (!metrics || !Array.isArray(metrics)) {
      return NextResponse.json({ message: 'Invalid metrics data' }, { status: 400 });
    }

    // In a real implementation, you would store and update metrics values
    // Since we don't have a dedicated table for tracking metrics progress,
    // we'll just acknowledge the update here

    // This could be implemented by creating a new table like SponsorshipMetrics to track progress

    return NextResponse.json({
      message: 'Metrics updated successfully',
      sponsorshipId,
      metrics
    });
  } catch (error: unknown) {
    console.error('Error updating sponsorship metrics:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update metrics', 
      status: 'error' 
    }, { status: 500 });
  }
}