// src/app/api/admin/spocs/[spocId]/approve/route.ts
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

// Helper function to send approval email
const sendApprovalEmail = async (email: string, firstName: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your SponSync SPOC Account Has Been Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>SponSync SPOC Account Approved</h2>
          <p>Hello ${firstName},</p>
          <p>Congratulations! Your SponSync SPOC account has been approved by our administrators.</p>
          <p>You can now log in to your account and you'll be assigned to verify college events soon.</p>
          <p>Thank you for being part of our verification team!</p>
          <p>Best regards,<br>The SponSync Team</p>
        </div>
      `,
    });
    
    console.log(`Approval email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
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

  // Approve the SPOC
  try {
    // First check if SPOC exists
    const spoc = await prisma.spocUser.findUnique({
      where: { id: spocId },
      select: {
        email: true,
        firstName: true,
        isApproved: true,
      },
    });

    if (!spoc) {
      return NextResponse.json({ message: 'SPOC not found' }, { status: 404 });
    }

    if (spoc.isApproved) {
      return NextResponse.json({ message: 'SPOC is already approved' }, { status: 400 });
    }

    // Update SPOC to approved
    await prisma.spocUser.update({
      where: { id: spocId },
      data: { isApproved: true },
    });

    // Send email notification
    await sendApprovalEmail(spoc.email, spoc.firstName);

    return NextResponse.json({ 
      message: 'SPOC approved successfully',
      spocId 
    });
  } catch (error) {
    console.error('Error approving SPOC:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to approve SPOC', 
      status: 'error' 
    }, { status: 500 });
  }
}