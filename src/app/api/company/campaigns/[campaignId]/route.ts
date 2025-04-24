// app/api/company/campaigns/[campaignId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

// interface RouteContext {
//   params: {
//     campaignId: string;
//   };
// }

// export async function GET(
//   request: Request,
//   { params }: RouteContext
// ): Promise<NextResponse> {
//   const { campaignId } = params;

export async function GET(
  request: Request,
  context: { params: { campaignId: string } }
): Promise<NextResponse> {
  const { campaignId } = context.params;
  
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
    // Check if the campaign belongs to this company
    const campaign = await prisma.companyCampaign.findFirst({
      where: {
        id: campaignId,
        companyId: decoded.userId,
      },
      include: {
        metrics: true,
        features: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      campaign
    });
  } catch (error: unknown) {
    console.error('Campaign retrieval error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to retrieve campaign', 
      status: 'error' 
    }, { status: 500 });
  }
}