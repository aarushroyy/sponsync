// src/app/api/spoc/dashboard/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import prisma from '@/app/lib/prisma';

export async function GET(request: Request) {
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
    // Get SPOC user details
    const spoc = await prisma.spocUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        collegeRollNumber: true,
        idCardUrl: true,
        isVerified: true,
        isApproved: true,
        assignedCollegeId: true,
      },
    });

    if (!spoc) {
      return NextResponse.json({ message: 'SPOC not found' }, { status: 404 });
    }

    // If SPOC is not approved yet, return early with minimal data
    if (!spoc.isApproved) {
      return NextResponse.json({
        user: spoc,
        assignedCollege: null,
        assignments: [],
        stats: {
          pendingCount: 0,
          activeCount: 0,
          completedCount: 0,
          totalEarnings: 0,
        }
      });
    }

    // Get assigned college details
    let assignedCollege = null;
    if (spoc.assignedCollegeId) {
      assignedCollege = await prisma.collegeUser.findUnique({
        where: { id: spoc.assignedCollegeId },
        select: {
          id: true,
          name: true,
          collegeName: true,
          eventName: true,
          CollegeOnboarding: {
            select: {
              region: true,
              eventType: true,
              posterUrl: true,
            },
          },
        },
      });
    }

    // Get all assignments for this SPOC
    const spocAssignments = await prisma.spocAssignment.findMany({
      where: { spocId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Transform assignment data with additional details
    const assignmentsWithDetails = await Promise.all(
      spocAssignments.map(async (assignment) => {
        // Fetch related campaign bundle info
        // Note: This requires adjusting the database schema to track which bundle/sponsorship
        // this assignment belongs to. For now, we'll use placeholder data.
        
        // In a real implementation, you would join with the campaign bundles and fetch real data
        return {
          id: assignment.id,
          sponsorshipId: assignment.sponsorshipId,
          status: assignment.status,
          companyName: "Example Company", // Placeholder - would come from real join
          collegeName: assignedCollege?.collegeName || "Unknown College",
          eventName: assignedCollege?.eventName || "Unknown Event",
          verificationPhotos: assignment.verificationPhotos,
          report: assignment.report,
          metrics: [
            // Placeholder metrics - these would come from the actual campaign requirements
            { type: "SIGNUPS", target: 100, current: 75 },
            { type: "BANNERS", target: 5, current: 3 },
            { type: "SURVEYS", target: 50, current: 30 },
          ],
          createdAt: assignment.createdAt.toISOString(),
        };
      })
    );

    // Calculate dashboard stats
    const pendingCount = assignmentsWithDetails.filter(a => a.status === 'PENDING').length;
    const activeCount = assignmentsWithDetails.filter(a => a.status === 'ACTIVE').length;
    const completedCount = assignmentsWithDetails.filter(a => a.status === 'COMPLETED').length;
    
    // Calculate earnings (this would be based on your business logic)
    // For example, a flat rate per completed assignment
    const completedAssignmentRate = 500; // ₹500 per completed assignment
    const pendingAssignmentRate = 200; // ₹200 per pending/active assignment
    
    const totalEarnings = (completedCount * completedAssignmentRate) + 
                          ((pendingCount + activeCount) * pendingAssignmentRate);

    return NextResponse.json({
      user: spoc,
      assignedCollege: assignedCollege && {
        id: assignedCollege.id,
        name: assignedCollege.name,
        collegeName: assignedCollege.collegeName,
        eventName: assignedCollege.eventName,
        region: assignedCollege.CollegeOnboarding?.region || 'Not specified',
        eventType: assignedCollege.CollegeOnboarding?.eventType || 'Not specified',
        posterUrl: assignedCollege.CollegeOnboarding?.posterUrl || null,
      },
      assignments: assignmentsWithDetails,
      stats: {
        pendingCount,
        activeCount,
        completedCount,
        totalEarnings,
      }
    });
  } catch (error) {
    console.error('Error fetching SPOC dashboard data:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch dashboard data', 
      status: 'error' 
    }, { status: 500 });
  }
}