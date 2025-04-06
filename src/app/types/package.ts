// types/package.ts

export enum PackageTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD'
  }
  
  export enum MetricType {
    SIGNUPS = 'SIGNUPS',
    BANNERS = 'BANNERS',
    SURVEYS = 'SURVEYS',
    CLICKS = 'CLICKS'
  }
  
  export enum FeatureType {
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    STANDEES = 'STANDEES',
    BACKDROP = 'BACKDROP',
    TITLE_SPONSOR = 'TITLE_SPONSOR'
  }
  
  export type MetricLimit = {
    enabled: boolean;
    defaultMin?: number;
    defaultMax?: number;
    minAllowed: number;
    maxAllowed: number;
  };
  
  export type PackageConfig = {
    metrics: {
      [key in MetricType]: MetricLimit;
    };
    features: {
      [key in FeatureType]: boolean;
    };
  };