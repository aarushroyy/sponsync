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
import { PackageTier, MetricType, FeatureType, MetricRangeOptions, FeatureValueOptions } from '@/app/types/package';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CollegeOnboarding() {
  const router = useRouter();
  
  // Initialize package data for each tier
  // const initializePackageData = (tier: PackageTier) => {
  //   const config = PACKAGE_CONFIGS[tier];
  //   return {
  //     metrics: Object.entries(config.metrics).reduce((acc, [type, value]) => ({
  //       ...acc,
  //       [type]: {
  //         enabled: value.enabled,
  //         min: value.enabled && value.defaultMin ? value.defaultMin.toString() : "",
  //         max: value.enabled && value.defaultMax ? value.defaultMax.toString() : "",
  //         rangeOption: value.defaultRangeOption || ""
  //       },
  //     }), {} as Record<string, { enabled: boolean; min: string; max: string; rangeOption: string }>),
  //     features: Object.entries(config.features).reduce((acc, [type, value]) => ({
  //       ...acc,
  //       [type]: {
  //         enabled: value.enabled,
  //         valueOption: value.defaultValueOption || ""
  //       },
  //     }), {} as Record<string, { enabled: boolean; valueOption: string }>),
  //     estimatedAmount: tier === PackageTier.GOLD 
  //       ? "30000" 
  //       : tier === PackageTier.SILVER 
  //         ? "15000" 
  //         : "7500",
  //   };
  // };

  // Update the initializePackageData function
const initializePackageData = (tier: PackageTier) => {
  const config = PACKAGE_CONFIGS[tier];
  return {
    metrics: Object.fromEntries(
      Object.entries(config.metrics).map(([type, value]) => [
        type,
        {
          enabled: value.enabled || false,
          min: value.defaultMin?.toString() || "",
          max: value.defaultMax?.toString() || "",
          rangeOption: value.defaultRangeOption || ""
        }
      ])
    ),
    features: Object.fromEntries(
      Object.entries(config.features).map(([type, value]) => [
        type,
        {
          enabled: value.enabled || false,
          valueOption: value.defaultValueOption || ""
        }
      ])
    ),
    estimatedAmount: tier === PackageTier.GOLD 
      ? "30000" 
      : tier === PackageTier.SILVER 
        ? "15000" 
        : "7500",
  };
};

  const [formData, setFormData] = useState({
    region: "",
    eventType: "",
    poster: null as File | null,
    packageTier: PackageTier.SILVER,
    totalBudgetGoal: "50000", // Default total budget goal
    packageConfigs: {
      [PackageTier.BRONZE]: initializePackageData(PackageTier.BRONZE),
      [PackageTier.SILVER]: initializePackageData(PackageTier.SILVER),
      [PackageTier.GOLD]: initializePackageData(PackageTier.GOLD),
    }
  });

  const handleMetricChange = (tier: PackageTier, metric: MetricType, enabled: boolean, rangeOption?: string) => {
    setFormData(prev => {
      // Get the min-max values from the range option if provided
      let min = prev.packageConfigs[tier].metrics[metric].min;
      let max = prev.packageConfigs[tier].metrics[metric].max;
      
      if (rangeOption) {
        // Parse the range option to get numeric values
        if (rangeOption.includes('-')) {
          const [minStr, maxStr] = rangeOption.split('-');
          min = minStr.replace(/[^\d]/g, ''); // Remove non-numeric characters
          max = maxStr.replace(/[^\d]/g, ''); // Remove non-numeric characters
          
          // Handle K (thousands) in the values
          if (minStr.includes('K')) min = (parseInt(min) * 1000).toString();
          if (maxStr.includes('K')) max = (parseInt(max) * 1000).toString();
        } else if (rangeOption.endsWith('+')) {
          min = rangeOption.slice(0, -1).replace(/[^\d]/g, '');
          max = ""; // Max is unlimited for "+" ranges
          
          if (rangeOption.includes('K')) min = (parseInt(min) * 1000).toString();
        } else if (rangeOption.endsWith('K+')) {
          min = rangeOption.slice(0, -2).replace(/[^\d]/g, '');
          min = (parseInt(min) * 1000).toString();
          max = ""; // Max is unlimited
        } else if (rangeOption.includes('hour')) {
          // Convert hours to minutes for time-based metrics
          if (rangeOption === '30min') {
            min = "30";
            max = "30";
          } else if (rangeOption === '1hour') {
            min = "60";
            max = "60";
          } else if (rangeOption === '1.5hours') {
            min = "90";
            max = "90";
          } else if (rangeOption === '2hours') {
            min = "120";
            max = "120";
          } else if (rangeOption === '2hours+') {
            min = "120";
            max = "";
          }
        }
      }
      
      return {
        ...prev,
        packageConfigs: {
          ...prev.packageConfigs,
          [tier]: {
            ...prev.packageConfigs[tier],
            metrics: {
              ...prev.packageConfigs[tier].metrics,
              [metric]: {
                enabled,
                min,
                max,
                rangeOption: rangeOption || prev.packageConfigs[tier].metrics[metric].rangeOption
              }
            }
          }
        }
      };
    });
  };

  const handleFeatureChange = (tier: PackageTier, feature: FeatureType, enabled: boolean, valueOption?: string) => {
    setFormData(prev => ({
      ...prev,
      packageConfigs: {
        ...prev.packageConfigs,
        [tier]: {
          ...prev.packageConfigs[tier],
          features: {
            ...prev.packageConfigs[tier].features,
            [feature]: {
              enabled,
              valueOption: valueOption || prev.packageConfigs[tier].features[feature].valueOption
            }
          }
        }
      }
    }));
  };

  const handleEstimatedAmountChange = (tier: PackageTier, amount: string) => {
    setFormData(prev => ({
      ...prev,
      packageConfigs: {
        ...prev.packageConfigs,
        [tier]: {
          ...prev.packageConfigs[tier],
          estimatedAmount: amount
        }
      }
    }));
  };

  const handleTotalBudgetChange = (amount: string) => {
    setFormData(prev => ({
      ...prev,
      totalBudgetGoal: amount
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
    mutationFn: async (data: typeof formData) => {
      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("region", data.region);
      formDataToSend.append("eventType", data.eventType);
      formDataToSend.append("totalBudgetGoal", data.totalBudgetGoal);
      
      if (data.poster) {
        formDataToSend.append("poster", data.poster);
      }

      // Add all package configurations
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
      router.push("/college/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Calculate total estimated amount from all selected packages
  const calculateTotalEstimated = () => {
    const activePackages = Object.values(PackageTier);
    return activePackages.reduce((total, tier) => {
      const packageData = formData.packageConfigs[tier];
      return total + (parseInt(packageData.estimatedAmount) || 0);
    }, 0);
  };

  // Component for metric selection with range options
  const MetricOptionSelect = ({ 
    label,
    metric,
    config,
    tier,
    onChange 
  }: { 
    label: string;
    metric: MetricType;
    config: {
      enabled?: boolean;
      defaultMin?: number;
      defaultMax?: number;
      minAllowed?: number;
      maxAllowed?: number;
      defaultRangeOption?: string;
    }
    tier: PackageTier;
    onChange: (enabled: boolean, rangeOption?: string) => void;
  }) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white/50">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${tier}-${metric}-switch`} className="font-medium">{label}</Label>
        <Switch
          id={`${tier}-${metric}-switch`}
          checked={formData.packageConfigs[tier]?.metrics?.[metric]?.enabled || false}
          disabled={!config?.enabled}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
      
      {formData.packageConfigs[tier]?.metrics?.[metric]?.enabled && (
        <div className="space-y-2">
          <Label htmlFor={`${tier}-${metric}-range`} className="text-sm text-muted-foreground">
            Range
          </Label>
          <Select
            value={formData.packageConfigs[tier].metrics[metric].rangeOption || ''}
            onValueChange={(value) => onChange(true, value)}
          >
            <SelectTrigger id={`${tier}-${metric}-range`}>
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              {MetricRangeOptions[metric]?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}</div>
  );

  // Component for feature selection with value options
  const FeatureOptionSelect = ({ 
    label, 
    feature, 
    tier,
    config,
    onChange 
  }: { 
    label: string; 
    feature: FeatureType;
    tier: PackageTier;
    config: {
      enabled: boolean;
      defaultValueOption?: string;
    }
    onChange: (enabled: boolean, valueOption?: string) => void; 
  }) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white/50">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${tier}-${feature}-switch`} className="font-medium">{label}</Label>
        <Switch
          id={`${tier}-${feature}-switch`}
          checked={formData.packageConfigs[tier]?.features?.[feature]?.enabled || false}
          disabled={!config?.enabled}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
      
      {formData.packageConfigs[tier]?.features?.[feature]?.enabled && (
        <div className="space-y-2">
          <Label htmlFor={`${tier}-${feature}-value`} className="text-sm text-muted-foreground">
            Value
          </Label>
          <Select
            value={formData.packageConfigs[tier].features[feature].valueOption}
            onValueChange={(value) => onChange(true, value)}
          >
            <SelectTrigger id={`${tier}-${feature}-value`}>
              <SelectValue placeholder="Select Value" />
            </SelectTrigger>
            <SelectContent>
              {FeatureValueOptions[feature].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">College Onboarding</CardTitle>
          <CardDescription className="text-center">
            Configure your event packages and sponsorship goals
          </CardDescription>
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
                      <SelectItem value="Tech Fest">Tech Fest</SelectItem>
                      <SelectItem value="Cultural Fest">Cultural Fest</SelectItem>
                      <SelectItem value="Sports Event">Sports Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Total Budget Goal */}
              <div className="mt-4">
                <Label htmlFor="totalBudgetGoal">Total Sponsorship Goal (₹)</Label>
                <div className="mt-1">
                  <Input
                    id="totalBudgetGoal"
                    type="number"
                    min="0"
                    value={formData.totalBudgetGoal}
                    onChange={(e) => handleTotalBudgetChange(e.target.value)}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Your total estimated amount from all packages: ₹{calculateTotalEstimated().toLocaleString()}
                </p>
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
                <Label className="block mb-2">Preferred Package</Label>
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
                      {/* Estimated Amount */}
                      <div className="space-y-2">
                        <Label htmlFor={`${tier}-amount`}>Estimated Amount (₹)</Label>
                        <Input
                          id={`${tier}-amount`}
                          type="number"
                          min="0"
                          value={formData.packageConfigs[tier].estimatedAmount}
                          onChange={(e) => handleEstimatedAmountChange(tier, e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Metrics Configuration</h4>
                        <div className="grid gap-4">
                          {Object.values(MetricType).map((metric) => (
                            <MetricOptionSelect
                              key={`${tier}-${metric}`}
                              label={metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              metric={metric}
                              tier={tier}
                              config={PACKAGE_CONFIGS[tier].metrics[metric]}
                              onChange={(enabled, rangeOption) => handleMetricChange(tier, metric, enabled, rangeOption)}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Additional Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.values(FeatureType).map((feature) => (
                            <FeatureOptionSelect
                              key={`${tier}-${feature}`}
                              label={feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              feature={feature}
                              tier={tier}
                              config={PACKAGE_CONFIGS[tier].features[feature]}
                              onChange={(enabled, valueOption) => handleFeatureChange(tier, feature, enabled, valueOption)}
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
                !formData.poster ||
                !formData.totalBudgetGoal
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