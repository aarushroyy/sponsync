// // // src/app/api/admin/bundles/[bundleId]/assign-spoc/route.ts
// // import { NextResponse } from 'next/server';
// // import prisma from '@/app/lib/prisma';
// // import { verifyToken } from '@/app/lib/jwt';
// // // import nodemailer from 'nodemailer';

// // // interface RouteContext {
// // //   params: {
// // //     bundleId: string;
// // //   };
// // // }

// // // Set up nodemailer (configure with your actual SMTP settings in production)
// // // const transporter = nodemailer.createTransport({
// // //   host: 'smtp.gmail.com',
// // //   port: 587,
// // //   secure: false,
// // //   auth: {
// // //     user: process.env.EMAIL_USER,
// // //     pass: process.env.EMAIL_PASS,
// // //   },
// // // });

// // // Helper function to send assignment notification email
// // // const sendAssignmentEmail = async (spoc: any, bundle: any, college: any, company: any) => {
// // //   try {
// // //     await transporter.sendMail({
// // //       from: process.env.EMAIL_USER,
// // //       to: spoc.email,
// // //       subject: 'New Event Assignment - SponSync',
// // //       html: `
// // //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// // //           <h2>New Event Assignment</h2>
// // //           <p>Hello ${spoc.firstName},</p>
// // //           <p>You have been assigned to verify the following sponsorship:</p>
// // //           <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
// // //             <p><strong>Event:</strong> ${college.eventName} at ${college.collegeName}</p>
// // //             <p><strong>Company:</strong> ${company.companyName}</p>
// // //             <p><strong>Campaign:</strong> ${bundle.campaign.name}</p>
// // //           </div>
// // //           <p>Please log in to your SPOC dashboard to see all assignment details and start tracking metrics.</p>
// // //           <p>Best regards,<br>The SponSync Team</p>
// // //         </div>
// // //       `,
// // //     });
    
// // //     return true;
// // //   } catch (error) {
// // //     console.error('Error sending assignment email:', error);
// // //     return false;
// // //   }
// // // };

// // export async function POST(
// //   request: Request,
// //   { params }: { params: { bundleId: string } }  // Change here: inline the type
// // ): Promise<NextResponse> {
// //   const { bundleId } = params;

// //   // Verify JWT from Authorization header
// //   const authHeader = request.headers.get('Authorization');
// //   if (!authHeader) {
// //     return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
// //   }
  
// //   const token = authHeader.split(' ')[1];
// //   let decoded: { userId: string; role: string };
  
// //   try {
// //     decoded = verifyToken(token) as { userId: string; role: string };
// //   } catch (jwtError: unknown) {
// //     console.error('JWT verification error:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
// //     return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
// //   }

// //   try {
// //     // Verify the user is an admin
// //     const adminUser = await prisma.adminUser.findUnique({
// //       where: { id: decoded.userId },
// //     });

// //     if (!adminUser) {
// //       return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
// //     }

// //     // Get request body
// //     const { spocId } = await request.json();
    
// //     if (!spocId) {
// //       return NextResponse.json({ message: 'SPOC ID is required' }, { status: 400 });
// //     }

// //     // Verify the SPOC exists and is approved
// //     const spoc = await prisma.spocUser.findUnique({
// //       where: { 
// //         id: spocId,
// //         isApproved: true 
// //       },
// //     });

// //     if (!spoc) {
// //       return NextResponse.json({ message: 'SPOC not found or not approved' }, { status: 404 });
// //     }

// //     // Verify the bundle exists and is in ACCEPTED status
// //     const bundle = await prisma.campaignBundle.findUnique({
// //       where: { 
// //         id: bundleId,
// //         status: 'ACCEPTED'
// //       },
// //       include: {
// //         campaign: {
// //           include: {
// //             company: true
// //           }
// //         }
// //       }
// //     });

// //     if (!bundle) {
// //       return NextResponse.json({ message: 'Bundle not found or not in ACCEPTED status' }, { status: 404 });
// //     }

// //     // Get first college from the bundle (in this example, we'll assign the SPOC to the first college)
// //     // In a more complex scenario, you might want to assign SPOCs to specific colleges within the bundle
// //     const collegeId = bundle.collegeIds[0];
    
// //     if (!collegeId) {
// //       return NextResponse.json({ message: 'No colleges found in this bundle' }, { status: 404 });
// //     }

// //     // Get college details
// //     const college = await prisma.collegeUser.findUnique({
// //       where: { id: collegeId },
// //     });

// //     if (!college) {
// //       return NextResponse.json({ message: 'College not found' }, { status: 404 });
// //     }

// //     // Create a SPOC assignment
// //     const assignment = await prisma.spocAssignment.create({
// //       data: {
// //         spocId: spocId,
// //         sponsorshipId: bundleId,
// //         status: 'PENDING',
// //         verificationPhotos: [],
// //       },
// //     });

// //     // Update SPOC with assigned college
// //     await prisma.spocUser.update({
// //       where: { id: spocId },
// //       data: {
// //         assignedCollegeId: collegeId,
// //       },
// //     });

// //     // Send notification email
// //     // await sendAssignmentEmail(spoc, bundle, college, bundle.campaign.company);

// //     return NextResponse.json({
// //       message: 'SPOC assigned successfully',
// //       assignment,
// //     });
// //   } catch (error: unknown) {
// //     console.error('Error assigning SPOC:', error);
// //     return NextResponse.json({ 
// //       message: error instanceof Error ? error.message : 'Failed to assign SPOC', 
// //       status: 'error' 
// //     }, { status: 500 });
// //   }
// // }

// // src/app/api/admin/bundles/[bundleId]/assign-spoc/route.ts
// import { NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';
// import { verifyToken } from '@/app/lib/jwt';
// import { type NextRequest } from 'next/server';

// export async function POST(
//   request: NextRequest,
//   context: { params: { bundleId: string } }
// ): Promise<NextResponse> {
//   const { bundleId } = context.params;

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
//     // Verify the user is an admin
//     const adminUser = await prisma.adminUser.findUnique({
//       where: { id: decoded.userId },
//     });

//     if (!adminUser) {
//       return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
//     }

//     // Get request body
//     const { spocId } = await request.json();
    
//     if (!spocId) {
//       return NextResponse.json({ message: 'SPOC ID is required' }, { status: 400 });
//     }

//     // Verify the SPOC exists and is approved
//     const spoc = await prisma.spocUser.findUnique({
//       where: { 
//         id: spocId,
//         isApproved: true 
//       },
//     });

//     if (!spoc) {
//       return NextResponse.json({ message: 'SPOC not found or not approved' }, { status: 404 });
//     }

//     // Verify the bundle exists and is in ACCEPTED status
//     const bundle = await prisma.campaignBundle.findUnique({
//       where: { 
//         id: bundleId,
//         status: 'ACCEPTED'
//       },
//       include: {
//         campaign: {
//           include: {
//             company: true
//           }
//         }
//       }
//     });

//     if (!bundle) {
//       return NextResponse.json({ message: 'Bundle not found or not in ACCEPTED status' }, { status: 404 });
//     }

//     // Get first college from the bundle
//     const collegeId = bundle.collegeIds[0];
    
//     if (!collegeId) {
//       return NextResponse.json({ message: 'No colleges found in this bundle' }, { status: 404 });
//     }

//     // Get college details
//     const college = await prisma.collegeUser.findUnique({
//       where: { id: collegeId },
//     });

//     if (!college) {
//       return NextResponse.json({ message: 'College not found' }, { status: 404 });
//     }

//     // Create a SPOC assignment
//     const assignment = await prisma.spocAssignment.create({
//       data: {
//         spocId: spocId,
//         sponsorshipId: bundleId,
//         status: 'PENDING',
//         verificationPhotos: [],
//       },
//     });

//     // Update SPOC with assigned college
//     await prisma.spocUser.update({
//       where: { id: spocId },
//       data: {
//         assignedCollegeId: collegeId,
//       },
//     });

//     return NextResponse.json({
//       message: 'SPOC assigned successfully',
//       assignment,
//     });
//   } catch (error: unknown) {
//     console.error('Error assigning SPOC:', error);
//     return NextResponse.json({ 
//       message: error instanceof Error ? error.message : 'Failed to assign SPOC', 
//       status: 'error' 
//     }, { status: 500 });
//   }
// }