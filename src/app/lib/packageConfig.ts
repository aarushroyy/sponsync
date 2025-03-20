import { PackageTier, MetricType, FeatureType, PackageConfig } from '@/app/types/package';

export const PACKAGE_CONFIGS: Record<PackageTier, PackageConfig> = {
    BRONZE: {
      metrics: {
        [MetricType.SIGNUPS]: {
          enabled: true,
          defaultMin: 50,
          defaultMax: 100,
          minAllowed: 0,
          maxAllowed: 200
        },
        [MetricType.BANNERS]: {
          enabled: true,
          defaultMin: 1,
          defaultMax: 2,
          minAllowed: 0,
          maxAllowed: 3
        },
        [MetricType.SURVEYS]: {
          enabled: false,
          minAllowed: 0,
          maxAllowed: 0
        },
        [MetricType.CLICKS]: {
          enabled: false,
          minAllowed: 0,
          maxAllowed: 0
        }
      },
      features: {
        [FeatureType.ANNOUNCEMENT]: true,
        [FeatureType.STANDEES]: false,
        [FeatureType.BACKDROP]: false,
        [FeatureType.TITLE_SPONSOR]: false
      }
    },
    SILVER: {
      metrics: {
        [MetricType.SIGNUPS]: {
          enabled: true,
          defaultMin: 100,
          defaultMax: 300,
          minAllowed: 0,
          maxAllowed: 500
        },
        [MetricType.BANNERS]: {
          enabled: true,
          defaultMin: 2,
          defaultMax: 4,
          minAllowed: 0,
          maxAllowed: 6
        },
        [MetricType.SURVEYS]: {
          enabled: true,
          defaultMin: 1,
          defaultMax: 2,
          minAllowed: 0,
          maxAllowed: 3
        },
        [MetricType.CLICKS]: {
          enabled: false,
          minAllowed: 0,
          maxAllowed: 0
        }
      },
      features: {
        [FeatureType.ANNOUNCEMENT]: true,
        [FeatureType.STANDEES]: true,
        [FeatureType.BACKDROP]: true,
        [FeatureType.TITLE_SPONSOR]: false
      }
    },
    GOLD: {
        metrics: {
          [MetricType.SIGNUPS]: {
            enabled: true,
            defaultMin: 300,
            defaultMax: 500,
            minAllowed: 0,
            maxAllowed: 1000
          },
          [MetricType.BANNERS]: {
            enabled: true,
            defaultMin: 4,
            defaultMax: 6,
            minAllowed: 0,
            maxAllowed: 10
          },
          [MetricType.SURVEYS]: {
            enabled: true,
            defaultMin: 2,
            defaultMax: 5,
            minAllowed: 0,
            maxAllowed: 7
          },
          [MetricType.CLICKS]: {
            enabled: true,
            defaultMin: 100,
            defaultMax: 200,
            minAllowed: 0,
            maxAllowed: 500
          }
        },
        features: {
          [FeatureType.ANNOUNCEMENT]: true,
          [FeatureType.STANDEES]: true,
          [FeatureType.BACKDROP]: true,
          [FeatureType.TITLE_SPONSOR]: true
        }
      }
    };  