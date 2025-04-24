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

// // src/app/api/company/campaigns/[campaignId]/bundles/route.ts - enhanced to include SPOC verifications
// import { NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';
// import { verifyToken } from '@/app/lib/jwt';

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

//   // Verify JWT from Authorization header
//   const authHeader = request.headers.get('Authorization');
//   if (!authHeader) {
//     return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
//   }
  
//   const token = authHeader.split(' ')[1];
//   let decoded: { userId: string; role: string };
  
//   try {
//     decoded = verifyToken(token) as { userId: string; role: string };
//   } catch (jwtError: unknown) {
//     console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
//     return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//   }

//   try {
//     // Verify that the campaign belongs to the company
//     const campaign = await prisma.companyCampaign.findFirst({
//       where: {
//         id: campaignId,
//         companyId: decoded.userId,
//       },
//     });

//     if (!campaign) {
//       return NextResponse.json({ message: 'Campaign not found or unauthorized' }, { status: 404 });
//     }

//     // Get all bundles for this campaign
//     const bundles = await prisma.campaignBundle.findMany({
//       where: {
//         campaignId: campaignId,
//       },
//     });

//     // Get college details for each bundle
//     const bundlesWithDetails = await Promise.all(
//       bundles.map(async (bundle) => {
//         const collegeDetails = await prisma.collegeOnboarding.findMany({
//           where: {
//             collegeId: {
//               in: bundle.collegeIds,
//             },
//           },
//           include: {
//             college: {
//               select: {
//                 collegeName: true,
//                 eventName: true,
//               },
//             },
//             packageConfigs: {
//               include: {
//                 metrics: true,
//                 features: true,
//               },
//             },
//           },
//         });

//         // Get SPOC assignments for this bundle
//         const spocAssignments = await prisma.spocAssignment.findMany({
//           where: {
//             sponsorshipId: bundle.id,
//           },
//           include: {
//             spoc: {
//               select: {
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         });

//         // Transform SPOC assignments data for the frontend
//         const verifications = spocAssignments.map(assignment => ({
//           id: assignment.id,
//           status: assignment.status,
//           updatedAt: assignment.updatedAt,
//           spocName: `${assignment.spoc.firstName} ${assignment.spoc.lastName}`,
//           spocEmail: assignment.spoc.email,
//           verificationPhotos: assignment.verificationPhotos || [],
//           report: assignment.report,
//           metricsProgress: assignment.metricsProgress || [],
//         }));

//         return {
//           ...bundle,
//           collegeDetails,
//           verifications,
//         };
//       })
//     );

//     return NextResponse.json({ bundles: bundlesWithDetails });
//   } catch (error: unknown) {
//     console.error('Bundle retrieval error:', error instanceof Error ? error.message : 'Unknown error');
//     return NextResponse.json({ 
//       message: error instanceof Error ? error.message : 'Failed to retrieve bundles', 
//       status: 'error' 
//     }, { status: 500 });
//   }
// }