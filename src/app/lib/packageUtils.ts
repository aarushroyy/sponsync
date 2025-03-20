import prisma from '@/app/lib/prisma';
import { PackageTier } from '@/app/types/package';

export async function getCollegePackageConfigs(collegeId: string) {
  try {
    const onboarding = await prisma.collegeOnboarding.findUnique({
      where: { collegeId },
      include: {
        packageConfigs: {
          include: {
            metrics: true,
            features: true,
          },
        },
      },
    });

    if (!onboarding) return null;

    // Transform the data to a more frontend-friendly structure
    const packageConfigs = onboarding.packageConfigs.reduce((acc, config) => {
      const metricsMap = config.metrics.reduce((metricAcc, metric) => ({
        ...metricAcc,
        [metric.type]: {
          enabled: metric.enabled,
          min: metric.minValue?.toString() ?? '',
          max: metric.maxValue?.toString() ?? '',
        },
      }), {} as Record<string, { enabled: boolean; min: string; max: string }>);

      const featuresMap = config.features.reduce((featureAcc, feature) => ({
        ...featureAcc,
        [feature.type]: feature.enabled,
      }), {} as Record<string, boolean>);

      acc[config.tier] = {
        metrics: metricsMap,
        features: featuresMap,
      };
      return acc;
    }, {} as Record<string, { metrics: Record<string, { enabled: boolean; min: string; max: string }>; features: Record<string, boolean> }>);

    return {
      id: onboarding.id,
      collegeId: onboarding.collegeId,
      region: onboarding.region,
      eventType: onboarding.eventType,
      posterUrl: onboarding.posterUrl,
      packageConfigs,
      createdAt: onboarding.createdAt,
      updatedAt: onboarding.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching college package configs:', error);
    return null;
  }
}

// This function is no longer needed since we don't have a selected package
// You can either remove it or modify it to get a specific tier's config
export async function getPackageConfigByTier(collegeId: string, tier: PackageTier) {
  try {
    const onboarding = await prisma.collegeOnboarding.findUnique({
      where: { collegeId },
      include: {
        packageConfigs: {
          where: { tier },
          include: {
            metrics: true,
            features: true,
          },
        },
      },
    });

    if (!onboarding || onboarding.packageConfigs.length === 0) return null;

    const config = onboarding.packageConfigs[0];
    
    const metricsMap = config.metrics.reduce((metricAcc, metric) => ({
      ...metricAcc,
      [metric.type]: {
        enabled: metric.enabled,
        min: metric.minValue?.toString() ?? '',
        max: metric.maxValue?.toString() ?? '',
      },
    }), {} as Record<string, { enabled: boolean; min: string; max: string }>);

    const featuresMap = config.features.reduce((featureAcc, feature) => ({
      ...featureAcc,
      [feature.type]: feature.enabled,
    }), {} as Record<string, boolean>);

    return {
      tier: config.tier,
      metrics: metricsMap,
      features: featuresMap,
    };
  } catch (error) {
    console.error('Error fetching package config:', error);
    return null;
  }
}