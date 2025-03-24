// src/app/api/admin/spocs/[spocId]/reject/route.ts
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

// Helper function to send rejection email
const sendRejectionEmail = async (email: string, firstName: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your SponSync SPOC Application Status',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>SponSync SPOC Application Update</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for your interest in becoming a SPOC for SponSync.</p>
          <p>After reviewing your application, we regret to inform you that we cannot approve your SPOC account at this time.</p>
          <p>This could be due to one of the following reasons:</p>
          <ul>
            <li>The ID card provided was not clearly visible or verifiable</li>
            <li>The information provided could not be validated</li>
            <li>We currently don't have events in your college or area</li>
          </ul>
          <p>You're welcome to apply again with updated information or contact our support team if you have any questions.</p>
          <p>Best regards,<br>The SponSync Team</p>
        </div>
      `,
    });
    
    console.log(`Rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
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

  // Reject the SPOC and delete the account
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
      return NextResponse.json({ message: 'Cannot reject an already approved SPOC' }, { status: 400 });
    }

    // Send rejection email before deleting
    await sendRejectionEmail(spoc.email, spoc.firstName);

    // Delete the SPOC account
    await prisma.spocUser.delete({
      where: { id: spocId },
    });

    return NextResponse.json({ 
      message: 'SPOC rejected and account deleted successfully',
      spocId 
    });
  } catch (error) {
    console.error('Error rejecting SPOC:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to reject SPOC', 
      status: 'error' 
    }, { status: 500 });
  }
}