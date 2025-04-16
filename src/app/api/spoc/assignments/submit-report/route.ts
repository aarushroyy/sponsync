// // src/app/api/spoc/assignments/submit-report/route.ts
// import { NextResponse } from 'next/server';
// import { verifyToken } from '@/app/lib/jwt';
// import prisma from '@/app/lib/prisma';

// export async function POST(request: Request) {
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
//     // Parse request body
//     const body = await request.json();
//     const { assignmentId, report } = body;

//     if (!assignmentId) {
//       return NextResponse.json({ message: 'Assignment ID is required' }, { status: 400 });
//     }

//     if (!report || report.trim() === '') {
//       return NextResponse.json({ message: 'Report content is required' }, { status: 400 });
//     }

//     // Verify that the assignment belongs to this SPOC
//     const assignment = await prisma.spocAssignment.findFirst({
//       where: {
//         id: assignmentId,
//         spocId: decoded.userId,
//       },
//     });

//     if (!assignment) {
//       return NextResponse.json({ message: 'Assignment not found or you do not have permission' }, { status: 404 });
//     }

//     // Update the assignment with the report
//     const updatedAssignment = await prisma.spocAssignment.update({
//       where: { id: assignmentId },
//       data: {
//         report,
//         // If there are photos and now a report, mark as COMPLETED
//         status: assignment.verificationPhotos.length > 0 ? 'COMPLETED' : assignment.status,
//       },
//     });

//     return NextResponse.json({ 
//       message: 'Report submitted successfully',
//       assignmentId,
//       status: updatedAssignment.status,
//     });
//   } catch (error) {
//     console.error('Error submitting report:', error);
//     return NextResponse.json({ 
//       message: error instanceof Error ? error.message : 'Failed to submit report', 
//       status: 'error' 
//     }, { status: 500 });
//   }
// }

// src/app/api/spoc/assignments/[assignmentId]/submit-report/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import nodemailer from 'nodemailer';

interface RouteContext {
  params: {
    assignmentId: string;
  };
}

// Set up nodemailer for notifications
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send notification to company
const sendReportNotification = async (companyEmail: string, companyName: string, collegeName: string, eventName: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: companyEmail,
      subject: `Verification Report Available - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Verification Report Available</h2>
          <p>Hello ${companyName},</p>
          <p>A verification report has been submitted for your sponsored event:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>College:</strong> ${collegeName}</p>
            <p><strong>Event:</strong> ${eventName}</p>
          </div>
          <p>Please log in to your dashboard to view the full report and verification photos.</p>
          <p>Best regards,<br>The SponSync Team</p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending report notification:', error);
    return false;
  }
};

export async function POST(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { assignmentId } = params;

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
    // Verify the SPOC is assigned to this assignment
    const assignment = await prisma.spocAssignment.findFirst({
      where: {
        id: assignmentId,
        spocId: decoded.userId,
      },
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found or unauthorized' }, { status: 404 });
    }

    // Get report content from request body
    const { report } = await request.json();
    
    if (!report || typeof report !== 'string' || report.trim() === '') {
      return NextResponse.json({ message: 'Report content is required' }, { status: 400 });
    }

    // Update assignment with report
    const updatedAssignment = await prisma.spocAssignment.update({
      where: { id: assignmentId },
      data: {
        report,
        updatedAt: new Date(),
        status: assignment.status === 'PENDING' ? 'ACTIVE' : assignment.status,
      },
    });

    // Check if assignment is complete
    let isCompleted = false;
    if (
      updatedAssignment.report && 
      updatedAssignment.verificationPhotos && 
      updatedAssignment.verificationPhotos.length > 0
    ) {
      await prisma.spocAssignment.update({
        where: { id: assignmentId },
        data: {
          status: 'COMPLETED',
        },
      });
      isCompleted = true;

      // Get bundle details to notify company
      const bundle = await prisma.campaignBundle.findUnique({
        where: { id: assignment.sponsorshipId },
        include: {
          campaign: {
            include: {
              company: true,
            },
          },
        },
      });

      if (bundle && bundle.collegeIds.length > 0) {
        const collegeId = bundle.collegeIds[0];
        const college = await prisma.collegeUser.findUnique({
          where: { id: collegeId },
        });

        if (bundle.campaign.company && college) {
          // Send notification to company
          await sendReportNotification(
            bundle.campaign.company.email,
            bundle.campaign.company.companyName,
            college.collegeName,
            college.eventName
          );
        }
      }
    }

    return NextResponse.json({
      message: 'Report submitted successfully',
      status: isCompleted ? 'COMPLETED' : updatedAssignment.status,
    });
  } catch (error: unknown) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to submit report', 
      status: 'error' 
    }, { status: 500 });
  }
}