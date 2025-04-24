// src/app/api/spoc/assignments/route.ts - updated version
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
    // Get SPOC details
    const spoc = await prisma.spocUser.findUnique({
      where: { id: decoded.userId },
      include: {
        assignedCollege: {
          select: {
            id: true,
            collegeName: true,
            eventName: true,
            CollegeOnboarding: {
              select: {
                region: true,
                eventType: true,
                posterUrl: true,
              }
            }
          }
        }
      }
    });

    if (!spoc) {
      return NextResponse.json({ message: 'SPOC not found' }, { status: 404 });
    }

    // If SPOC is not approved, only return basic details
    if (!spoc.isApproved) {
      return NextResponse.json({ 
        spoc: {
          id: spoc.id,
          firstName: spoc.firstName,
          lastName: spoc.lastName,
          email: spoc.email,
          isApproved: spoc.isApproved,
        },
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

    // If SPOC is not assigned to a college yet
    if (!spoc.assignedCollegeId) {
      return NextResponse.json({
        spoc: {
          id: spoc.id,
          firstName: spoc.firstName,
          lastName: spoc.lastName,
          email: spoc.email,
          isApproved: spoc.isApproved,
        },
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

    // Get all assignments for this SPOC
    const assignments = await prisma.spocAssignment.findMany({
      where: { spocId: spoc.id },
      orderBy: { createdAt: 'desc' }
    });

    // Get bundle details for each assignment
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const bundle = await prisma.campaignBundle.findUnique({
          where: { id: assignment.sponsorshipId },
          include: {
            campaign: {
              include: {
                company: {
                  select: {
                    companyName: true,
                  }
                },
                metrics: true,
                features: true,
              }
            }
          }
        });

        if (!bundle) {
          return null;
        }

        // Get college details
        const collegeId = bundle.collegeIds[0]; // Assume first college for simplicity
        const college = collegeId 
          ? await prisma.collegeUser.findUnique({
              where: { id: collegeId },
              select: {
                collegeName: true,
                eventName: true,
                CollegeOnboarding: {
                  select: {
                    region: true,
                    eventType: true,
                  }
                }
              }
            })
          : null;

        // Process metrics with target and current values
        const metricsWithProgress = bundle.campaign.metrics.map(metric => {
          // Default current value
          let currentValue = 0;
          
          // Check if we have metrics progress data
          const progressEntry = assignment.metricsProgress.find(
            (p) => typeof p === 'object' && p !== null && 'type' in p && p.type === metric.type
          );
          
          if (progressEntry && 
              typeof progressEntry === 'object' && 
              'currentValue' in progressEntry && 
              typeof progressEntry.currentValue === 'number') {
            currentValue = progressEntry.currentValue;
          }

          return {
            type: metric.type,
            target: metric.maxValue || 0,
            current: currentValue,
          };
        });

        return {
          id: assignment.id,
          sponsorshipId: assignment.sponsorshipId,
          status: assignment.status,
          verificationPhotos: assignment.verificationPhotos || [],
          report: assignment.report,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
          companyName: bundle.campaign.company.companyName,
          campaignName: bundle.campaign.name,
          collegeName: college?.collegeName || 'Unknown College',
          eventName: college?.eventName || 'Unknown Event',
          eventType: college?.CollegeOnboarding?.eventType || 'Unknown',
          region: college?.CollegeOnboarding?.region || 'NORTH',
          metrics: metricsWithProgress,
          features: bundle.campaign.features
            .filter(f => f.enabled)
            .map(f => ({
              type: f.type,
              valueOption: f.valueOption,
            }))
        };
      })
    );

    // Filter out any null assignments (in case a bundle was deleted)
    const validAssignments = assignmentsWithDetails.filter(a => a !== null);

    // Calculate statistics
    const pendingCount = validAssignments.filter(a => a?.status === 'PENDING').length;
    const activeCount = validAssignments.filter(a => a?.status === 'ACTIVE').length;
    const completedCount = validAssignments.filter(a => a?.status === 'COMPLETED').length;
    
    // Calculate earnings based on assignment status
    const pendingRate = 200; // ₹200 per pending assignment
    const activeRate = 300; // ₹300 per active assignment
    const completedRate = 500; // ₹500 per completed assignment
    
    const totalEarnings = 
      (pendingCount * pendingRate) +
      (activeCount * activeRate) +
      (completedCount * completedRate);

    return NextResponse.json({
      spoc: {
        id: spoc.id,
        firstName: spoc.firstName,
        lastName: spoc.lastName,
        email: spoc.email,
        isApproved: spoc.isApproved,
      },
      assignedCollege: spoc.assignedCollege 
        ? {
            id: spoc.assignedCollege.id,
            collegeName: spoc.assignedCollege.collegeName,
            eventName: spoc.assignedCollege.eventName,
            region: spoc.assignedCollege.CollegeOnboarding?.region || 'NORTH',
            eventType: spoc.assignedCollege.CollegeOnboarding?.eventType || 'Unknown',
            posterUrl: spoc.assignedCollege.CollegeOnboarding?.posterUrl,
          }
        : null,
      assignments: validAssignments,
      stats: {
        pendingCount,
        activeCount,
        completedCount,
        totalEarnings,
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching SPOC assignments:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch assignments', 
      status: 'error' 
    }, { status: 500 });
  }
}