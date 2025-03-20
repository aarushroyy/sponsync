"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { PACKAGE_CONFIGS } from "@/app/lib/packageConfig";
import { PackageTier, MetricType, FeatureType } from '@/app/types/package';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricData {
  enabled: boolean;
  min: string;
  max: string;
}

interface PackageData {
  metrics: {
    [key in MetricType]: MetricData;
  };
  features: {
    [key in FeatureType]: boolean;
  };
}

interface OnboardingFormData {
  region: string;
  eventType: string;
  poster: File | null;
  packageTier: PackageTier;
  packageConfigs: {
    [key in PackageTier]: PackageData;
  };
}

const MetricInput = ({ 
  label,
  metric,
  config,
  onChange 
}: { 
  label: string;
  metric: MetricData;
  config: {
    enabled: boolean;
    minAllowed: number;
    maxAllowed: number;
  };
  onChange: (enabled: boolean, min?: string, max?: string) => void;
}) => (
  <div className="space-y-4 p-4 border rounded-lg bg-white/50">
    <div className="flex items-center justify-between">
      <Label htmlFor={`${label}-switch`} className="font-medium">{label}</Label>
      <Switch
        id={`${label}-switch`}
        checked={metric.enabled}
        disabled={!config.enabled}
        onCheckedChange={(checked) => onChange(checked)}
      />
    </div>
    
    {metric.enabled && (
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor={`${label}-min`} className="text-sm text-muted-foreground">
            Min ({config.minAllowed}-{config.maxAllowed})
          </Label>
          <Input
            id={`${label}-min`}
            type="number"
            value={metric.min}
            min={config.minAllowed}
            max={config.maxAllowed}
            onChange={(e) => onChange(true, e.target.value, metric.max)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={`${label}-max`} className="text-sm text-muted-foreground">
            Max ({config.minAllowed}-{config.maxAllowed})
          </Label>
          <Input
            id={`${label}-max`}
            type="number"
            value={metric.max}
            min={config.minAllowed}
            max={config.maxAllowed}
            onChange={(e) => onChange(true, metric.min, e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    )}
  </div>
);

const FeatureSwitch = ({ 
  label, 
  checked, 
  disabled, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  disabled: boolean; 
  onChange: (checked: boolean) => void; 
}) => (
  <div className="flex items-center space-x-2">
    <Switch
      id={label}
      checked={checked}
      disabled={disabled}
      onCheckedChange={onChange}
    />
    <Label htmlFor={label} className="capitalize">
      {label.toLowerCase().replace(/_/g, ' ')}
    </Label>
  </div>
);

export default function CollegeOnboarding() {
  const router = useRouter();
  
  // Initialize package data for each tier
  const initializePackageData = (tier: PackageTier): PackageData => {
    const config = PACKAGE_CONFIGS[tier];
    return {
      metrics: Object.entries(config.metrics).reduce((acc, [type, value]) => ({
        ...acc,
        [type]: {
          enabled: value.enabled,
          min: value.enabled && value.defaultMin ? value.defaultMin.toString() : "",
          max: value.enabled && value.defaultMax ? value.defaultMax.toString() : "",
        },
      }), {} as { [key in MetricType]: MetricData }),
      features: config.features,
    };
  };

  const [formData, setFormData] = useState<OnboardingFormData>({
    region: "",
    eventType: "",
    poster: null,
    packageTier: PackageTier.SILVER,
    packageConfigs: {
      [PackageTier.BRONZE]: initializePackageData(PackageTier.BRONZE),
      [PackageTier.SILVER]: initializePackageData(PackageTier.SILVER),
      [PackageTier.GOLD]: initializePackageData(PackageTier.GOLD),
    }
  });

  const handleMetricChange = (tier: PackageTier, metric: MetricType, enabled: boolean, min?: string, max?: string) => {
    setFormData(prev => ({
      ...prev,
      packageConfigs: {
        ...prev.packageConfigs,
        [tier]: {
          ...prev.packageConfigs[tier],
          metrics: {
            ...prev.packageConfigs[tier].metrics,
            [metric]: {
              enabled,
              min: min ?? prev.packageConfigs[tier].metrics[metric].min,
              max: max ?? prev.packageConfigs[tier].metrics[metric].max,
            }
          }
        }
      }
    }));
  };

  const handleFeatureChange = (tier: PackageTier, feature: FeatureType, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      packageConfigs: {
        ...prev.packageConfigs,
        [tier]: {
          ...prev.packageConfigs[tier],
          features: {
            ...prev.packageConfigs[tier].features,
            [feature]: enabled
          }
        }
      }
    }));
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        poster: e.target.files![0]
      }));
    }
  };

  const mutation = useMutation({
   // In the mutation function of your component:
mutationFn: async (data: OnboardingFormData) => {
  // Create form data for file upload
  const formDataToSend = new FormData();
  formDataToSend.append("region", data.region);
  formDataToSend.append("eventType", data.eventType);
  formDataToSend.append("packageTier", data.packageTier);
  
  if (data.poster) {
    formDataToSend.append("poster", data.poster);
  }

  // Add all package configurations (important change here)
  formDataToSend.append("packageConfigs", JSON.stringify(data.packageConfigs));

  const response = await fetch("/api/auth/college/onboard", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">College Onboarding</CardTitle>
          <CardDescription>Configure your event and select package options</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORTH">North</SelectItem>
                      <SelectItem value="SOUTH">South</SelectItem>
                      <SelectItem value="EAST">East</SelectItem>
                      <SelectItem value="WEST">West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
                  >
                    <SelectTrigger id="eventType">
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Poster Upload */}
              <div className="mt-4">
                <Label htmlFor="poster">Event Poster (Required)</Label>
                <div className="mt-1 flex items-center">
                  <Label 
                    htmlFor="poster-upload" 
                    className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md py-6 px-4 bg-white hover:bg-gray-50"
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span>Upload poster image</span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      id="poster-upload"
                      name="poster-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handlePosterUpload}
                    />
                  </Label>
                </div>
                {formData.poster && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {formData.poster.name}
                  </p>
                )}
              </div>
            </div>

            {/* Package Selection and Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package Configuration</h3>
              
              <div className="mb-4">
                <Label className="block mb-2">Select Your Package</Label>
                <Select 
                  value={formData.packageTier} 
                  onValueChange={(value: PackageTier) => setFormData(prev => ({ ...prev, packageTier: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PackageTier.BRONZE}>Bronze Package</SelectItem>
                    <SelectItem value={PackageTier.SILVER}>Silver Package</SelectItem>
                    <SelectItem value={PackageTier.GOLD}>Gold Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs defaultValue={PackageTier.SILVER} value={formData.packageTier} onValueChange={(value) => setFormData(prev => ({ ...prev, packageTier: value as PackageTier }))} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value={PackageTier.BRONZE}>Bronze Package</TabsTrigger>
                  <TabsTrigger value={PackageTier.SILVER}>Silver Package</TabsTrigger>
                  <TabsTrigger value={PackageTier.GOLD}>Gold Package</TabsTrigger>
                </TabsList>
                
                {Object.values(PackageTier).map((tier) => (
                  <TabsContent key={tier} value={tier} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Metrics Configuration</h4>
                        <div className="grid gap-4">
                          {Object.values(MetricType).map((metric) => (
                            <MetricInput
                              key={`${tier}-${metric}`}
                              label={metric.charAt(0) + metric.slice(1).toLowerCase()}
                              metric={formData.packageConfigs[tier].metrics[metric]}
                              config={PACKAGE_CONFIGS[tier].metrics[metric]}
                              onChange={(enabled, min, max) => handleMetricChange(tier, metric, enabled, min, max)}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Additional Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.values(FeatureType).map((feature) => (
                            <FeatureSwitch
                              key={`${tier}-${feature}`}
                              label={feature.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                              checked={formData.packageConfigs[tier].features[feature]}
                              disabled={!PACKAGE_CONFIGS[tier].features[feature]}
                              onChange={(checked) => handleFeatureChange(tier, feature, checked)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Error Display */}
            {mutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {mutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={
                mutation.isPending || 
                !formData.region || 
                !formData.eventType || 
                !formData.poster
              }
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}