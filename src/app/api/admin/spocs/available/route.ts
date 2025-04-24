// src/app/api/admin/spocs/available/route.ts
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

    // Find available (approved) SPOCs that are not yet assigned
    const spocs = await prisma.spocUser.findMany({
      where: {
        isApproved: true,
        assignedCollegeId: null // Only get unassigned SPOCs
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isApproved: true,
        assignedCollegeId: true
      }
    });

    return NextResponse.json({
      spocs
    });
  } catch (error: unknown) {
    console.error('Error fetching available SPOCs:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch available SPOCs', 
      status: 'error' 
    }, { status: 500 });
  }
}