// import { PackageTier, MetricType, FeatureType, PackageConfig } from '@/app/types/package';

// export const PACKAGE_CONFIGS: Record<PackageTier, PackageConfig> = {
//     BRONZE: {
//       metrics: {
//         [MetricType.SIGNUPS]: {
//           enabled: true,
//           defaultMin: 50,
//           defaultMax: 100,
//           minAllowed: 0,
//           maxAllowed: 200
//         },
//         [MetricType.BANNERS]: {
//           enabled: true,
//           defaultMin: 1,
//           defaultMax: 2,
//           minAllowed: 0,
//           maxAllowed: 3
//         },
//         [MetricType.SURVEYS]: {
//           enabled: false,
//           minAllowed: 0,
//           maxAllowed: 0
//         },
//         [MetricType.CLICKS]: {
//           enabled: false,
//           minAllowed: 0,
//           maxAllowed: 0
//         }
//       },
//       features: {
//         [FeatureType.ANNOUNCEMENT]: true,
//         [FeatureType.STANDEES]: false,
//         [FeatureType.BACKDROP]: false,
//         [FeatureType.TITLE_SPONSOR]: false
//       }
//     },
//     SILVER: {
//       metrics: {
//         [MetricType.SIGNUPS]: {
//           enabled: true,
//           defaultMin: 100,
//           defaultMax: 300,
//           minAllowed: 0,
//           maxAllowed: 500
//         },
//         [MetricType.BANNERS]: {
//           enabled: true,
//           defaultMin: 2,
//           defaultMax: 4,
//           minAllowed: 0,
//           maxAllowed: 6
//         },
//         [MetricType.SURVEYS]: {
//           enabled: true,
//           defaultMin: 1,
//           defaultMax: 2,
//           minAllowed: 0,
//           maxAllowed: 3
//         },
//         [MetricType.CLICKS]: {
//           enabled: false,
//           minAllowed: 0,
//           maxAllowed: 0
//         }
//       },
//       features: {
//         [FeatureType.ANNOUNCEMENT]: true,
//         [FeatureType.STANDEES]: true,
//         [FeatureType.BACKDROP]: true,
//         [FeatureType.TITLE_SPONSOR]: false
//       }
//     },
//     GOLD: {
//         metrics: {
//           [MetricType.SIGNUPS]: {
//             enabled: true,
//             defaultMin: 300,
//             defaultMax: 500,
//             minAllowed: 0,
//             maxAllowed: 1000
//           },
//           [MetricType.BANNERS]: {
//             enabled: true,
//             defaultMin: 4,
//             defaultMax: 6,
//             minAllowed: 0,
//             maxAllowed: 10
//           },
//           [MetricType.SURVEYS]: {
//             enabled: true,
//             defaultMin: 2,
//             defaultMax: 5,
//             minAllowed: 0,
//             maxAllowed: 7
//           },
//           [MetricType.CLICKS]: {
//             enabled: true,
//             defaultMin: 100,
//             defaultMax: 200,
//             minAllowed: 0,
//             maxAllowed: 500
//           }
//         },
//         features: {
//           [FeatureType.ANNOUNCEMENT]: true,
//           [FeatureType.STANDEES]: true,
//           [FeatureType.BACKDROP]: true,
//           [FeatureType.TITLE_SPONSOR]: true
//         }
//       }
//     };  

import { PackageTier, MetricType, FeatureType, PackageConfig } from '@/app/types/package';

export const PACKAGE_CONFIGS: Record<PackageTier, PackageConfig> = {
  BRONZE: {
    metrics: {
      // Sign Ups with ranges from 0-200, 200-400, etc. till 2000
      [MetricType.SIGNUPS]: {
        enabled: true,
        defaultMin: 50,
        defaultMax: 200,
        minAllowed: 0,
        maxAllowed: 400,
        defaultRangeOption: '0-200'
      },
      // Marketing Banners with ranges from 0-5, 5-10, etc.
      [MetricType.MARKETING_BANNERS]: {
        enabled: true,
        defaultMin: 1,
        defaultMax: 5,
        minAllowed: 0,
        maxAllowed: 10,
        defaultRangeOption: '0-5'
      },
      // Digital Marketing Views
      [MetricType.DIGITAL_MARKETING_VIEWS]: {
        enabled: true,
        defaultMin: 100000,
        defaultMax: 200000,
        minAllowed: 0,
        maxAllowed: 500000,
        defaultRangeOption: '100K-150K'
      },
      // Customer Survey/Product testing
      [MetricType.CUSTOMER_SURVEYS]: {
        enabled: true,
        defaultMin: 50,
        defaultMax: 100,
        minAllowed: 0,
        maxAllowed: 200,
        defaultRangeOption: '50-100'
      },
      // Keynote Speaking
      [MetricType.KEYNOTE_SPEAKING]: {
        enabled: true,
        defaultMin: 60,
        defaultMax: 90,
        minAllowed: 0,
        maxAllowed: 150,
        defaultRangeOption: '1.5hours'
      },
      // Engagement Activity
      [MetricType.ENGAGEMENT_ACTIVITY]: {
        enabled: true,
        defaultMin: 30,
        defaultMax: 60,
        minAllowed: 0,
        maxAllowed: 90,
        defaultRangeOption: '1hour'
      },
      // Announcements during event
      [MetricType.ANNOUNCEMENTS]: {
        enabled: true,
        defaultMin: 0,
        defaultMax: 5,
        minAllowed: 0,
        maxAllowed: 5,
        defaultRangeOption: '0-5'
      },
      // Logo on Posters/Accessories
      [MetricType.LOGO_ON_POSTERS]: {
        enabled: true,
        defaultMin: 0,
        defaultMax: 5,
        minAllowed: 0,
        maxAllowed: 5,
        defaultRangeOption: '0-5'
      }
    },
    features: {
      // Stalls (Yes/No)
      [FeatureType.STALLS]: {
        enabled: true,
        defaultValueOption: 'Yes'
      },
      // Title Rights (Yes/No)
      [FeatureType.TITLE_RIGHTS]: {
        enabled: false,
        defaultValueOption: 'No'
      },
      // Main stage backdrop (time-based)
      [FeatureType.MAIN_STAGE_BACKDROP]: {
        enabled: true,
        defaultValueOption: '0-1hour'
      },
      // Standees (number-based)
      [FeatureType.STANDEES]: {
        enabled: true,
        defaultValueOption: '0-5'
      },
      // Other customizable features
      [FeatureType.OTHER]: {
        enabled: true,
        defaultValueOption: 'Yes'
      }
    }
  },
  SILVER: {
    metrics: {
      // Sign Ups
      [MetricType.SIGNUPS]: {
        enabled: true,
        defaultMin: 200,
        defaultMax: 600,
        minAllowed: 0,
        maxAllowed: 1000,
        defaultRangeOption: '200-400'
      },
      // Marketing Banners
      [MetricType.MARKETING_BANNERS]: {
        enabled: true,
        defaultMin: 5,
        defaultMax: 10,
        minAllowed: 0,
        maxAllowed: 15,
        defaultRangeOption: '5-10'
      },
      // Digital Marketing Views
      [MetricType.DIGITAL_MARKETING_VIEWS]: {
        enabled: true,
        defaultMin: 20000,
        defaultMax: 50000,
        minAllowed: 0,
        maxAllowed: 100000,
        defaultRangeOption: '20K-50K'
      },
      // Customer Survey/Product testing
      [MetricType.CUSTOMER_SURVEYS]: {
        enabled: true,
        defaultMin: 50,
        defaultMax: 100,
        minAllowed: 0,
        maxAllowed: 200,
        defaultRangeOption: '50-100'
      },
      // Keynote Speaking
      [MetricType.KEYNOTE_SPEAKING]: {
        enabled: true,
        defaultMin: 60,
        defaultMax: 90,
        minAllowed: 0,
        maxAllowed: 150,
        defaultRangeOption: '1.5hours'
      },
      // Engagement Activity
      [MetricType.ENGAGEMENT_ACTIVITY]: {
        enabled: true,
        defaultMin: 30,
        defaultMax: 60,
        minAllowed: 0,
        maxAllowed: 90,
        defaultRangeOption: '1hour'
      },
      // Announcements during event
      [MetricType.ANNOUNCEMENTS]: {
        enabled: true,
        defaultMin: 0,
        defaultMax: 10,
        minAllowed: 0,
        maxAllowed: 10,
        defaultRangeOption: '5-10'
      },
      // Logo on Posters/Accessories
      [MetricType.LOGO_ON_POSTERS]: {
        enabled: true,
        defaultMin: 5,
        defaultMax: 15,
        minAllowed: 0,
        maxAllowed: 15,
        defaultRangeOption: '5-10'
      }
    },
    features: {
      // Stalls (Yes/No)
      [FeatureType.STALLS]: {
        enabled: true,
        defaultValueOption: 'Yes'
      },
      // Title Rights (Yes/No)
      [FeatureType.TITLE_RIGHTS]: {
        enabled: false,
        defaultValueOption: 'No'
      },
      // Main stage backdrop (time-based)
      [FeatureType.MAIN_STAGE_BACKDROP]: {
        enabled: true,
        defaultValueOption: '1-2hour'
      },
      // Standees (number-based)
      [FeatureType.STANDEES]: {
        enabled: true,
        defaultValueOption: '5-10'
      },
      // Other customizable features
      [FeatureType.OTHER]: {
        enabled: true,
        defaultValueOption: 'Yes'
      }
    }
  },
  GOLD: {
    metrics: {
      // Sign Ups
      [MetricType.SIGNUPS]: {
        enabled: true,
        defaultMin: 600,
        defaultMax: 1200,
        minAllowed: 0,
        maxAllowed: 2000,
        defaultRangeOption: '600-800'
      },
      // Marketing Banners
      [MetricType.MARKETING_BANNERS]: {
        enabled: true,
        defaultMin: 10,
        defaultMax: 20,
        minAllowed: 0,
        maxAllowed: 30,
        defaultRangeOption: '10-15'
      },
      // Digital Marketing Views
      [MetricType.DIGITAL_MARKETING_VIEWS]: {
        enabled: true,
        defaultMin: 100000,
        defaultMax: 200000,
        minAllowed: 0,
        maxAllowed: 500000,
        defaultRangeOption: '100K-150K'
      },
      // Customer Survey/Product testing
      [MetricType.CUSTOMER_SURVEYS]: {
        enabled: true,
        defaultMin: 200,
        defaultMax: 300,
        minAllowed: 0,
        maxAllowed: 500,
        defaultRangeOption: '200-250'
      },
      // Keynote Speaking
      [MetricType.KEYNOTE_SPEAKING]: {
        enabled: true,
        defaultMin: 60,
        defaultMax: 90,
        minAllowed: 0,
        maxAllowed: 150,
        defaultRangeOption: '1.5hours'
      },
      // Engagement Activity
      [MetricType.ENGAGEMENT_ACTIVITY]: {
        enabled: true,
        defaultMin: 60,
        defaultMax: 120,
        minAllowed: 0,
        maxAllowed: 180,
        defaultRangeOption: '2hours'
      },
      // Announcements during event
      [MetricType.ANNOUNCEMENTS]: {
        enabled: true,
        defaultMin: 5,
        defaultMax: 10,
        minAllowed: 0,
        maxAllowed: 10,
        defaultRangeOption: '5-10'
      },
      // Logo on Posters/Accessories
      [MetricType.LOGO_ON_POSTERS]: {
        enabled: true,
        defaultMin: 15,
        defaultMax: 25,
        minAllowed: 5,
        maxAllowed: 30,
        defaultRangeOption: '15-20'
      }
    },
    features: {
      // Stalls (Yes/No)
      [FeatureType.STALLS]: {
        enabled: true,
        defaultValueOption: 'Yes'
      },
      // Title Rights (Yes/No)
      [FeatureType.TITLE_RIGHTS]: {
        enabled: true,
        defaultValueOption: 'Yes'
      },
      // Main stage backdrop (time-based)
      [FeatureType.MAIN_STAGE_BACKDROP]: {
        enabled: true,
        defaultValueOption: '2-3hour'
      },
      // Standees (number-based)
      [FeatureType.STANDEES]: {
        enabled: true,
        defaultValueOption: '10-15'
      },
      // Other customizable features
      [FeatureType.OTHER]: {
        enabled: true,
        defaultValueOption: 'Yes'
      }
    }
  }
};