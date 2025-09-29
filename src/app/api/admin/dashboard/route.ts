// src/app/api/admin/dashboard/route.ts
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
    // Get pending SPOCs
    const pendingSpocs = await prisma.spocUser.findMany({
      where: {
        isVerified: true,
        isApproved: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get contact queries
    const contactQueries = await prisma.contactQuery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all colleges
    const colleges = await prisma.collegeUser.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        CollegeOnboarding: {
          select: {
            region: true,
            eventType: true,
            eventStartDate: true,
            eventEndDate: true,
            posterUrl: true,
          },
        },
      },
    });

    // Transform college data for the frontend
    const transformedColleges = colleges.map((college) => ({
      id: college.id,
      name: college.name,
      collegeName: college.collegeName,
      eventName: college.eventName,
      email: college.email,
      phone: college.phone,
      region: college.CollegeOnboarding?.region || 'Not specified',
      eventType: college.CollegeOnboarding?.eventType || 'Not specified',
      eventStartDate: college.CollegeOnboarding?.eventStartDate || null,
      eventEndDate: college.CollegeOnboarding?.eventEndDate || null,
      posterUrl: college.CollegeOnboarding?.posterUrl || null,
      isVerified: college.isVerified,
      onboardingComplete: college.onboardingComplete,
      createdAt: college.createdAt,
    }));

    // Get all companies
    const companies = await prisma.companyUser.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all campaigns with company info
    const campaigns = await prisma.companyCampaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: {
          select: {
            companyName: true,
          },
        },
        bundles: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Transform campaign data for the frontend
    const transformedCampaigns = campaigns.map(campaign => {
      // Calculate the total value based on campaign parameters
      // This is a placeholder calculation - you'd replace with your actual business logic
      const basePrice = 
        campaign.plan === 'YEARLY' ? 100000 :
        campaign.plan === 'HALF_YEARLY' ? 50000 : 25000;
      
      const bundleMultiplier = campaign.bundleSize * 0.9; // 10% discount per additional college
      
      const totalValue = Math.round(basePrice * bundleMultiplier);
      
      return {
        id: campaign.id,
        companyName: campaign.company.companyName,
        name: campaign.name,
        plan: campaign.plan,
        region: campaign.regions,
        bundleSize: campaign.bundleSize,
        status: campaign.status,
        totalValue: totalValue,
        createdAt: campaign.createdAt,
      };
    });

    // Calculate dashboard stats
    const totalColleges = await prisma.collegeUser.count();
    const totalCompanies = await prisma.companyUser.count();
    const totalSpocs = await prisma.spocUser.count({ where: { isApproved: true } });
    const activeCampaigns = await prisma.companyCampaign.count({ where: { status: 'ACTIVE' } });
    const pendingApprovals = pendingSpocs.length;

    // Get total revenue (sum of all campaign values)
    const totalRevenue = transformedCampaigns.reduce((sum, campaign) => sum + campaign.totalValue, 0);

    return NextResponse.json({
      pendingSpocs,
      colleges: transformedColleges,
      companies,
      campaigns: transformedCampaigns,
      contactQueries,
      stats: {
        totalColleges,
        totalCompanies,
        totalSpocs,
        activeCampaigns,
        totalRevenue,
        pendingApprovals,
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch dashboard data', 
      status: 'error' 
    }, { status: 500 });
  }
}