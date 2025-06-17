import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';

export async function GET(
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
    const company = await prisma.companyUser.findUnique({
      where: {
        id: params.id,
      },
      include: {
        campaigns: {
          include: {
            metrics: true,
            features: true,
            bundles: {
              select: {
                id: true,
                name: true,
                status: true,
                collegeIds: true,
                totalValue: true,
              }
            }
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch company' 
    }, { status: 500 });
  }
}
