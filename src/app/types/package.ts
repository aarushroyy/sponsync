// app/types/package.ts
export enum PackageTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD"
}

export enum MetricType {
  SIGNUPS = "SIGNUPS",
  BANNERS = "BANNERS",
  SURVEYS = "SURVEYS",
  CLICKS = "CLICKS"
}

export enum FeatureType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  STANDEES = "STANDEES",
  BACKDROP = "BACKDROP",
  TITLE_SPONSOR = "TITLE_SPONSOR"
}

export interface MetricConfigDefinition {
  enabled: boolean;
  defaultMin?: number;
  defaultMax?: number;
  minAllowed: number;
  maxAllowed: number;
}

export interface PackageConfig {
  metrics: Record<MetricType, MetricConfigDefinition>;
  features: Record<FeatureType, boolean>;
}

export interface PackageMetricData {
  type: MetricType;
  enabled: boolean;
  minValue: number | null;
  maxValue: number | null;
}

export interface PackageFeatureData {
  type: FeatureType;
  enabled: boolean;
}