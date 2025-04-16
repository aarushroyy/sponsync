"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { MetricRangeOptions, FeatureValueOptions } from '@/app/types/package';

interface PackageMetric {
  type: string;
  enabled: boolean;
  minValue: number | null;
  maxValue: number | null;
  rangeOption: string | null;
}

interface PackageFeature {
  type: string;
  enabled: boolean;
  valueOption: string | null;
}

interface PackageConfig {
  tier: string;
  estimatedAmount: number | null;
  metrics: PackageMetric[];
  features: PackageFeature[];
}

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const tier = params.tier as string;
  
  // State for package configuration
  const [packageConfig, setPackageConfig] = useState<PackageConfig | null>(null);
  
  // Fetch package details
  const { data, isLoading, error } = useQuery({
    queryKey: ["package", tier],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/college/packages/${tier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load package details");
      }

      return res.json();
    },
  });

  // Initialize package config when data is loaded
  useEffect(() => {
    if (data?.packageConfig) {
      setPackageConfig(data.packageConfig);
    }
  }, [data]);

  // Mutation for updating package
  const updatePackageMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token || !packageConfig) {
        throw new Error("Not authenticated or missing package data");
      }

      const res = await fetch(`/api/college/packages/${tier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageConfig),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update package");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Package updated successfully!");
      router.push("/college/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update package");
    },
  });

  const handleMetricChange = (type: string, field: 'enabled' | 'rangeOption' | 'minValue' | 'maxValue', value: boolean | string | number | null) => {
    if (!packageConfig) return;
    
    setPackageConfig(prev => {
      if (!prev) return prev;
      
      const updatedMetrics = prev.metrics.map(metric => {
        if (metric.type === type) {
          if (field === 'enabled') {
            return { ...metric, [field]: Boolean(value) };
          }
          if (field === 'rangeOption' && typeof value === 'string') {
            // Parse range option to get min/max values
            let minValue = metric.minValue;
            let maxValue = metric.maxValue;
            
            if (value.includes('-')) {
              const [minStr, maxStr] = value.split('-');
              minValue = parseInt(minStr.replace(/[^\d]/g, ''));
              maxValue = parseInt(maxStr.replace(/[^\d]/g, ''));
              
              // Handle K (thousands) in the values
              if (minStr.includes('K')) minValue = minValue * 1000;
              if (maxStr.includes('K')) maxValue = maxValue * 1000;
            } else if (value.endsWith('+')) {
              // For "X+" values set min but leave max as is or null
              minValue = parseInt(value.slice(0, -1).replace(/[^\d]/g, ''));
              if (value.includes('K')) minValue = minValue * 1000;
              maxValue = null;
            } else if (value.includes('hour') || value.includes('min')) {
              // For time-based metrics convert to minutes
              if (value === '30min') {
                minValue = 30;
                maxValue = 30;
              } else if (value === '1hour') {
                minValue = 60;
                maxValue = 60;
              } else if (value === '1.5hours') {
                minValue = 90;
                maxValue = 90;
              } else if (value === '2hours') {
                minValue = 120;
                maxValue = 120;
              } else if (value === '2hours+') {
                minValue = 120;
                maxValue = null;
              }
            }
            
            return { ...metric, [field]: value, minValue, maxValue };
          }
          
          // For direct minValue or maxValue changes
          if ((field === 'minValue' || field === 'maxValue') && typeof value === 'number') {
            return { ...metric, [field]: value };
          }
          
          return metric; // Return unchanged if conditions aren't met
        }
        return metric;
      });
      
      return { ...prev, metrics: updatedMetrics };
    });
  };

  const handleFeatureChange = (type: string, field: 'enabled' | 'valueOption', value: string | boolean) => {
    if (!packageConfig) return;
    
    setPackageConfig(prev => {
      if (!prev) return prev;
      
      const updatedFeatures = prev.features.map(feature => {
        if (feature.type === type) {
          if (field === 'enabled') {
            return { ...feature, [field]: Boolean(value) };
          }
          if (field === 'valueOption' && typeof value === 'string') {
            return { ...feature, [field]: value };
          }
          return feature; // Return unchanged if conditions aren't met
        }
        return feature;
      });
      
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleEstimatedAmountChange = (value: string) => {
    if (!packageConfig) return;
    
    setPackageConfig(prev => {
      if (!prev) return prev;
      return { ...prev, estimatedAmount: parseInt(value) || null };
    });
  };

  const handleSave = () => {
    updatePackageMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load package details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!packageConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load package configuration</AlertDescription>
        </Alert>
      </div>
    );
  }

  const tierColor = 
    tier === 'GOLD' ? 'border-yellow-400' :
    tier === 'SILVER' ? 'border-gray-400' : 
    'border-amber-700';

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push("/college/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Edit {tier.charAt(0) + tier.slice(1).toLowerCase()} Package</h1>
            <p className="text-gray-600">Customize what you offer to sponsors</p>
          </div>
        </div>

        <Card className={`mb-6 border-2 ${tierColor}`}>
          <CardHeader>
            <CardTitle>Package Information</CardTitle>
            <CardDescription>
              Adjust the value and features of your {tier.toLowerCase()} package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="estimatedAmount">Estimated Amount (₹)</Label>
              <Input
                id="estimatedAmount"
                type="number"
                min="0"
                value={packageConfig.estimatedAmount || ""}
                onChange={(e) => handleEstimatedAmountChange(e.target.value)}
                className="w-full mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is the approximate value of this package for sponsors
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Metrics Configuration</h3>
              
              {packageConfig.metrics.map((metric) => (
                <div key={metric.type} className="mb-6 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <Label htmlFor={`${metric.type}-enabled`} className="font-medium">
                      {metric.type.replace(/_/g, ' ')}
                    </Label>
                    <Switch
                      id={`${metric.type}-enabled`}
                      checked={metric.enabled}
                      onCheckedChange={(checked) => handleMetricChange(metric.type, 'enabled', checked)}
                    />
                  </div>
                  
                  {metric.enabled && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`${metric.type}-range`}>Range</Label>
                        <Select
                          value={metric.rangeOption || ''}
                          onValueChange={(value) => handleMetricChange(metric.type, 'rangeOption', value)}
                        >
                          <SelectTrigger id={`${metric.type}-range`}>
                            <SelectValue placeholder="Select Range" />
                          </SelectTrigger>
                          <SelectContent>
                          {MetricRangeOptions[metric.type as keyof typeof MetricRangeOptions]?.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Features Configuration</h3>
              
              {packageConfig.features.map((feature) => (
                <div key={feature.type} className="mb-6 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <Label htmlFor={`${feature.type}-enabled`} className="font-medium">
                      {feature.type.replace(/_/g, ' ')}
                    </Label>
                    <Switch
                      id={`${feature.type}-enabled`}
                      checked={feature.enabled}
                      onCheckedChange={(checked) => handleFeatureChange(feature.type, 'enabled', checked)}
                    />
                  </div>
                  
                  {feature.enabled && (
                    <div>
                      <Label htmlFor={`${feature.type}-value`}>Value</Label>
                      <Select
                        value={feature.valueOption || ''}
                        onValueChange={(value) => handleFeatureChange(feature.type, 'valueOption', value)}
                      >
                        <SelectTrigger id={`${feature.type}-value`}>
                          <SelectValue placeholder="Select Value" />
                        </SelectTrigger>
                        <SelectContent>
                        {FeatureValueOptions[feature.type as keyof typeof FeatureValueOptions]?.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/college/dashboard")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSave}
              disabled={updatePackageMutation.isPending}
            >
              {updatePackageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}