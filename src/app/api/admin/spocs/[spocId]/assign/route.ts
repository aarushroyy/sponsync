// src/app/api/admin/spocs/[spocId]/assign/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';
import nodemailer from 'nodemailer';

// Set up nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Helper function to send assignment email
const sendAssignmentEmail = async (
  email: string, 
  firstName: string, 
  collegeName: string, 
  eventName: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'You Have Been Assigned to a College Event',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>SponSync SPOC Assignment</h2>
          <p>Hello ${firstName},</p>
          <p>You have been assigned as a SPOC for the following event:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>College:</strong> ${collegeName}</p>
            <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
          </div>
          <p>Please log in to your SPOC dashboard to see more details about this assignment.</p>
          <p>Your responsibilities include:</p>
          <ul>
            <li>Verifying event metrics are fulfilled</li>
            <li>Taking photos as proof of event activities</li>
            <li>Submitting reports on event performance</li>
            <li>Ensuring sponsors get proper visibility</li>
          </ul>
          <p>Thank you for being a valuable part of our verification team!</p>
          <p>Best regards,<br>The SponSync Team</p>
        </div>
      `,
    });
    
    console.log(`Assignment email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending assignment email:', error);
    return false;
  }
};

export async function POST(
  request: Request,
  { params }: { params: { spocId: string } }
) {
  const { spocId } = params;

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

  // Check if user is an admin
  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error verifying admin:', error);
    return NextResponse.json({ message: 'Error verifying admin status' }, { status: 500 });
  }

  // Parse request body
  const body = await request.json();
  const { collegeId } = body;

  if (!collegeId) {
    return NextResponse.json({ message: 'College ID is required' }, { status: 400 });
  }

  // Assign SPOC to college
  try {
    // First check if SPOC exists and is approved
    const spoc = await prisma.spocUser.findUnique({
      where: { id: spocId },
      select: {
        email: true,
        firstName: true,
        isApproved: true,
        assignedCollegeId: true,
      },
    });

    if (!spoc) {
      return NextResponse.json({ message: 'SPOC not found' }, { status: 404 });
    }

    if (!spoc.isApproved) {
      return NextResponse.json({ message: 'SPOC must be approved before assignment' }, { status: 400 });
    }

    if (spoc.assignedCollegeId) {
      return NextResponse.json({ message: 'SPOC is already assigned to a college' }, { status: 400 });
    }

    // Check if college exists
    const college = await prisma.collegeUser.findUnique({
      where: { id: collegeId },
      select: {
        collegeName: true,
        eventName: true,
        onboardingComplete: true,
      },
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    if (!college.onboardingComplete) {
      return NextResponse.json({ message: 'College must complete onboarding before assigning a SPOC' }, { status: 400 });
    }

    // Update SPOC with college assignment
    await prisma.spocUser.update({
      where: { id: spocId },
      data: { assignedCollegeId: collegeId },
    });

    // Send email notification
    await sendAssignmentEmail(
      spoc.email, 
      spoc.firstName, 
      college.collegeName, 
      college.eventName
    );

    return NextResponse.json({ 
      message: 'SPOC assigned to college successfully',
      spocId,
      collegeId 
    });
  } catch (error) {
    console.error('Error assigning SPOC to college:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to assign SPOC', 
      status: 'error' 
    }, { status: 500 });
  }
}