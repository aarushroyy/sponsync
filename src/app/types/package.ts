// // types/package.ts

// export enum PackageTier {
//     BRONZE = 'BRONZE',
//     SILVER = 'SILVER',
//     GOLD = 'GOLD'
//   }
  
//   export enum MetricType {
//     SIGNUPS = 'SIGNUPS',
//     BANNERS = 'BANNERS',
//     SURVEYS = 'SURVEYS',
//     CLICKS = 'CLICKS'
//   }
  
//   export enum FeatureType {
//     ANNOUNCEMENT = 'ANNOUNCEMENT',
//     STANDEES = 'STANDEES',
//     BACKDROP = 'BACKDROP',
//     TITLE_SPONSOR = 'TITLE_SPONSOR'
//   }
  
//   export type MetricLimit = {
//     enabled: boolean;
//     defaultMin?: number;
//     defaultMax?: number;
//     minAllowed: number;
//     maxAllowed: number;
//   };
  
//   export type PackageConfig = {
//     metrics: {
//       [key in MetricType]: MetricLimit;
//     };
//     features: {
//       [key in FeatureType]: boolean;
//     };
//   };

// src/app/types/package.ts

export enum PackageTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

// Updated MetricType to match the new requirements
export enum MetricType {
  SIGNUPS = 'SIGNUPS',
  MARKETING_BANNERS = 'MARKETING_BANNERS',
  DIGITAL_MARKETING_VIEWS = 'DIGITAL_MARKETING_VIEWS',
  CUSTOMER_SURVEYS = 'CUSTOMER_SURVEYS',
  KEYNOTE_SPEAKING = 'KEYNOTE_SPEAKING',
  ENGAGEMENT_ACTIVITY = 'ENGAGEMENT_ACTIVITY',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  LOGO_ON_POSTERS = 'LOGO_ON_POSTERS'
}

// Updated FeatureType to match the new requirements
export enum FeatureType {
  STALLS = 'STALLS',
  TITLE_RIGHTS = 'TITLE_RIGHTS',
  MAIN_STAGE_BACKDROP = 'MAIN_STAGE_BACKDROP',
  STANDEES = 'STANDEES',
  OTHER = 'OTHER'
}

// Metric range options by type
export const MetricRangeOptions: Record<MetricType, string[]> = {
  [MetricType.SIGNUPS]: ['0-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200-1400', '1400-1600', '1600-1800', '1800-2000', '2000+'],
  [MetricType.MARKETING_BANNERS]: ['0-5', '5-10', '10-15', '15-20', '20+'],
  [MetricType.DIGITAL_MARKETING_VIEWS]: ['0-20K', '20K-50K', '50K-100K', '100K-150K', '150K-200K', '200K-250K', '250K-300K', '300K-350K', '350K-400K', '400K-450K', '450K-500K', '500K+'],
  [MetricType.CUSTOMER_SURVEYS]: ['0-50', '50-100', '100-150', '150-200', '200-250', '250-300', '300-350', '350-400', '400-450', '450-500', '500+'],
  [MetricType.KEYNOTE_SPEAKING]: ['30min', '1hour', '1.5hours', '2hours', '2hours+'],
  [MetricType.ENGAGEMENT_ACTIVITY]: ['30min', '1hour', '1.5hours', '2hours', '2hours+'],
  [MetricType.ANNOUNCEMENTS]: ['0-5', '5-10'],
  [MetricType.LOGO_ON_POSTERS]: ['0-5', '5-10', '10-15', '15-20', '20+']
};

// Feature value options by type
export const FeatureValueOptions: Record<FeatureType, string[]> = {
  [FeatureType.STALLS]: ['Yes', 'No'],
  [FeatureType.TITLE_RIGHTS]: ['Yes', 'No'],
  [FeatureType.MAIN_STAGE_BACKDROP]: ['0-1hour', '1-2hour', '2-3hour', '3hour+'],
  [FeatureType.STANDEES]: ['0-5', '5-10', '10-15', '15-20', '20+'],
  [FeatureType.OTHER]: ['Yes', 'No']
};

// Range to numeric value conversion helpers
export function rangeOptionToValues(option: string): { min: number; max: number } {
  if (option.endsWith('+')) {
    const min = parseInt(option.slice(0, -1));
    return { min, max: Number.MAX_SAFE_INTEGER };
  }
  
  if (option.endsWith('K')) {
    if (option.includes('-')) {
      const [minStr, maxStr] = option.split('-');
      const min = parseInt(minStr.replace('K', '')) * 1000;
      const max = parseInt(maxStr.replace('K', '')) * 1000;
      return { min, max };
    } else {
      const min = parseInt(option.replace('K', '')) * 1000;
      return { min, max: min };
    }
  }
  
  if (option.includes('hour')) {
    // Convert hours to minutes for consistent numerical comparison
    if (option.includes('-')) {
      const [minStr, maxStr] = option.split('-');
      const min = parseTimeToMinutes(minStr);
      const max = parseTimeToMinutes(maxStr);
      return { min, max };
    } else {
      const min = parseTimeToMinutes(option);
      return { min, max: min };
    }
  }
  
  if (option.includes('-')) {
    const [min, max] = option.split('-').map(Number);
    return { min, max };
  }
  
  // Default for binary options like "Yes"/"No"
  return option === 'Yes' ? { min: 1, max: 1 } : { min: 0, max: 0 };
}

// Helper to convert time expressions to minutes
function parseTimeToMinutes(timeString: string): number {
  if (timeString.includes('min')) {
    return parseInt(timeString.replace('min', ''));
  }
  
  if (timeString.includes('hour')) {
    const hoursMatch = timeString.match(/(\d+(\.\d+)?)hour/);
    if (hoursMatch) {
      return parseFloat(hoursMatch[1]) * 60;
    }
  }
  
  return 0;
}

export interface MetricLimit {
  enabled: boolean;
  defaultMin?: number;
  defaultMax?: number;
  minAllowed: number;
  maxAllowed: number;
  defaultRangeOption?: string;
}

export type PackageConfig = {
  metrics: {
    [key in MetricType]: MetricLimit;
  };
  features: {
    [key in FeatureType]: {
      enabled: boolean;
      defaultValueOption?: string;
    };
  };
};

export interface MetricRange {
  enabled: boolean;
  min: string;
  max: string;
  rangeOption?: string;
}

export interface OnboardingFormData {
  region: string;
  eventType: string;
  poster: File | null;
  totalBudgetGoal: string;
  packageConfigs: {
    [key in PackageTier]: {
      metrics: {
        [key in MetricType]: MetricRange;
      };
      features: {
        [key in FeatureType]: {
          enabled: boolean;
          valueOption?: string;
        };
      };
      estimatedAmount: string;
    };
  };
}