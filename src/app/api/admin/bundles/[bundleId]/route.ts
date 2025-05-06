// src/app/api/admin/bundles/[bundleId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

interface RouteContext {
  params: {
    bundleId: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { bundleId } = params;

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
    // Verify the user is an admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // Get bundle details
    const bundle = await prisma.campaignBundle.findUnique({
      where: { id: bundleId },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                companyName: true,
              }
            }
          }
        }
      }
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    // Get colleges in this bundle
    const collegeIds = bundle.collegeIds;
    const colleges = await prisma.collegeUser.findMany({
      where: {
        id: {
          in: collegeIds
        }
      },
      select: {
        id: true,
        collegeName: true,
        eventName: true
      }
    });

    return NextResponse.json({
      bundle: {
        id: bundle.id,
        name: bundle.name,
        status: bundle.status,
        campaign: {
          id: bundle.campaign.id,
          name: bundle.campaign.name,
          companyName: bundle.campaign.company.companyName
        },
        colleges
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching bundle details:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch bundle details', 
      status: 'error' 
    }, { status: 500 });
  }
}