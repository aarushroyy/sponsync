// src/app/api/admin/bundles/route.ts
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
    // Verify the user is an admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // Get bundles that are in ACCEPTED status (need SPOC assignment)
    const bundles = await prisma.campaignBundle.findMany({
      where: {
        status: 'ACCEPTED'
      },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                companyName: true
              }
            }
          }
        }
      }
    });

    // For each bundle, check if a SPOC is already assigned
    const bundlesWithSpocStatus = await Promise.all(
      bundles.map(async (bundle) => {
        // Check if there's a SPOC assignment for this bundle
        const assignment = await prisma.spocAssignment.findFirst({
          where: {
            sponsorshipId: bundle.id
          }
        });

        return {
          id: bundle.id,
          name: bundle.name,
          status: bundle.status,
          campaign: {
            name: bundle.campaign.name,
            company: bundle.campaign.company.companyName
          },
          hasSpoc: !!assignment // Boolean indicating if a SPOC is assigned
        };
      })
    );

    return NextResponse.json({
      bundles: bundlesWithSpocStatus
    });
  } catch (error: unknown) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch bundles', 
      status: 'error' 
    }, { status: 500 });
  }
}