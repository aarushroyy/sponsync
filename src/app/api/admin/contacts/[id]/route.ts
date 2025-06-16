import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify JWT from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  let decoded: { userId: string; role: string };
  
  try {
    decoded = verifyToken(token) as { userId: string; role: string };
  } catch (error) {
    console.error('JWT verification error:', error);
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

  try {
    const { status } = await request.json();

    const updatedQuery = await prisma.contactQuery.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedQuery);
  } catch (error) {
    console.error('Error updating contact query:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update contact query' 
    }, { status: 500 });
  }
}
