// src/app/api/college/packages/[tier]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/jwt';
import { PackageTier } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { tier: string } }
) {
  const { tier } = params;

  // Validate tier
  if (!Object.values(PackageTier).includes(tier as PackageTier)) {
    return NextResponse.json({ message: 'Invalid package tier' }, { status: 400 });
  }

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
    // Get college onboarding
    const onboarding = await prisma.collegeOnboarding.findUnique({
      where: { collegeId: decoded.userId },
      include: {
        packageConfigs: {
          where: { tier: tier as PackageTier },
          include: {
            metrics: true,
            features: true,
          },
        },
      },
    });

    if (!onboarding) {
      return NextResponse.json({ message: 'College onboarding not found' }, { status: 404 });
    }

    if (onboarding.packageConfigs.length === 0) {
      return NextResponse.json({ message: 'Package configuration not found' }, { status: 404 });
    }

    const packageConfig = onboarding.packageConfigs[0];

    return NextResponse.json({
      packageConfig: {
        tier: packageConfig.tier,
        estimatedAmount: packageConfig.estimatedAmount,
        metrics: packageConfig.metrics.map(metric => ({
          type: metric.type,
          enabled: metric.enabled,
          minValue: metric.minValue,
          maxValue: metric.maxValue,
          rangeOption: metric.rangeOption,
        })),
        features: packageConfig.features.map(feature => ({
          type: feature.type,
          enabled: feature.enabled,
          valueOption: feature.valueOption,
        })),
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch package', 
      status: 'error' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { tier: string } }
) {
  const { tier } = params;

  // Validate tier
  if (!Object.values(PackageTier).includes(tier as PackageTier)) {
    return NextResponse.json({ message: 'Invalid package tier' }, { status: 400 });
  }

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
    // Get update data
    const { estimatedAmount, metrics, features } = await request.json();

    if (!metrics || !features) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Get college onboarding
    const onboarding = await prisma.collegeOnboarding.findUnique({
      where: { collegeId: decoded.userId },
      include: {
        packageConfigs: {
          where: { tier: tier as PackageTier },
        },
      },
    });

    if (!onboarding) {
      return NextResponse.json({ message: 'College onboarding not found' }, { status: 404 });
    }

    if (onboarding.packageConfigs.length === 0) {
      return NextResponse.json({ message: 'Package configuration not found' }, { status: 404 });
    }

    const packageConfigId = onboarding.packageConfigs[0].id;

    // Update package config
    await prisma.packageConfig.update({
      where: { id: packageConfigId },
      data: {
        estimatedAmount: estimatedAmount ? parseInt(estimatedAmount) : undefined,
      },
    });

    // Update metrics
    for (const metric of metrics) {
      await prisma.packageMetric.updateMany({
        where: { 
          packageConfigId,
          type: metric.type,
        },
        data: {
          enabled: metric.enabled,
          minValue: metric.minValue ? parseInt(metric.minValue) : null,
          maxValue: metric.maxValue ? parseInt(metric.maxValue) : null,
          rangeOption: metric.rangeOption,
        },
      });
    }

    // Update features
    for (const feature of features) {
      await prisma.packageFeature.updateMany({
        where: { 
          packageConfigId,
          type: feature.type,
        },
        data: {
          enabled: feature.enabled,
          valueOption: feature.valueOption,
        },
      });
    }

    return NextResponse.json({
      message: 'Package updated successfully',
      tier,
    });
  } catch (error: unknown) {
    console.error('Error updating package:', error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update package', 
      status: 'error' 
    }, { status: 500 });
  }
}