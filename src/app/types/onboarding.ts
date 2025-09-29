export type Region = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

export interface OnboardingFormData {
  region: Region | '';
  eventType: string;
  eventStartDate: string;
  eventEndDate: string;
  signups: MetricRange;
  banners: MetricRange;
  surveys: MetricRange;
  clicks: MetricRange;
  announcement: boolean;
  standees: boolean;
  backdrop: boolean;
  titleSponsor: boolean;
}

export interface MetricRange {
  enabled: boolean;
  min: string;
  max: string;
}
