// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Loader2, Upload } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Label } from "@/components/ui/label";
// import { PACKAGE_CONFIGS } from "@/app/lib/packageConfig";
// import { PackageTier, MetricType, FeatureType, MetricRangeOptions, FeatureValueOptions } from '@/app/types/package';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function CollegeOnboarding() {
//   const router = useRouter();
  
//   // Initialize package data for each tier
//   // const initializePackageData = (tier: PackageTier) => {
//   //   const config = PACKAGE_CONFIGS[tier];
//   //   return {
//   //     metrics: Object.entries(config.metrics).reduce((acc, [type, value]) => ({
//   //       ...acc,
//   //       [type]: {
//   //         enabled: value.enabled,
//   //         min: value.enabled && value.defaultMin ? value.defaultMin.toString() : "",
//   //         max: value.enabled && value.defaultMax ? value.defaultMax.toString() : "",
//   //         rangeOption: value.defaultRangeOption || ""
//   //       },
//   //     }), {} as Record<string, { enabled: boolean; min: string; max: string; rangeOption: string }>),
//   //     features: Object.entries(config.features).reduce((acc, [type, value]) => ({
//   //       ...acc,
//   //       [type]: {
//   //         enabled: value.enabled,
//   //         valueOption: value.defaultValueOption || ""
//   //       },
//   //     }), {} as Record<string, { enabled: boolean; valueOption: string }>),
//   //     estimatedAmount: tier === PackageTier.GOLD 
//   //       ? "30000" 
//   //       : tier === PackageTier.SILVER 
//   //         ? "15000" 
//   //         : "7500",
//   //   };
//   // };

//   // Update the initializePackageData function
// const initializePackageData = (tier: PackageTier) => {
//   const config = PACKAGE_CONFIGS[tier];
//   return {
//     metrics: Object.fromEntries(
//       Object.entries(config.metrics).map(([type, value]) => [
//         type,
//         {
//           enabled: value.enabled || false,
//           min: value.defaultMin?.toString() || "",
//           max: value.defaultMax?.toString() || "",
//           rangeOption: value.defaultRangeOption || ""
//         }
//       ])
//     ),
//     features: Object.fromEntries(
//       Object.entries(config.features).map(([type, value]) => [
//         type,
//         {
//           enabled: value.enabled || false,
//           valueOption: value.defaultValueOption || ""
//         }
//       ])
//     ),
//     estimatedAmount: tier === PackageTier.GOLD 
//       ? "30000" 
//       : tier === PackageTier.SILVER 
//         ? "15000" 
//         : "7500",
//   };
// };

//   const [formData, setFormData] = useState({
//     region: "",
//     eventType: "",
//     poster: null as File | null,
//     packageTier: PackageTier.SILVER,
//     totalBudgetGoal: "50000", // Default total budget goal
//     packageConfigs: {
//       [PackageTier.BRONZE]: initializePackageData(PackageTier.BRONZE),
//       [PackageTier.SILVER]: initializePackageData(PackageTier.SILVER),
//       [PackageTier.GOLD]: initializePackageData(PackageTier.GOLD),
//     }
//   });

//   const handleMetricChange = (tier: PackageTier, metric: MetricType, enabled: boolean, rangeOption?: string) => {
//     setFormData(prev => {
//       // Get the min-max values from the range option if provided
//       let min = prev.packageConfigs[tier].metrics[metric].min;
//       let max = prev.packageConfigs[tier].metrics[metric].max;
      
//       if (rangeOption) {
//         // Parse the range option to get numeric values
//         if (rangeOption.includes('-')) {
//           const [minStr, maxStr] = rangeOption.split('-');
//           min = minStr.replace(/[^\d]/g, ''); // Remove non-numeric characters
//           max = maxStr.replace(/[^\d]/g, ''); // Remove non-numeric characters
          
//           // Handle K (thousands) in the values
//           if (minStr.includes('K')) min = (parseInt(min) * 1000).toString();
//           if (maxStr.includes('K')) max = (parseInt(max) * 1000).toString();
//         } else if (rangeOption.endsWith('+')) {
//           min = rangeOption.slice(0, -1).replace(/[^\d]/g, '');
//           max = ""; // Max is unlimited for "+" ranges
          
//           if (rangeOption.includes('K')) min = (parseInt(min) * 1000).toString();
//         } else if (rangeOption.endsWith('K+')) {
//           min = rangeOption.slice(0, -2).replace(/[^\d]/g, '');
//           min = (parseInt(min) * 1000).toString();
//           max = ""; // Max is unlimited
//         } else if (rangeOption.includes('hour')) {
//           // Convert hours to minutes for time-based metrics
//           if (rangeOption === '30min') {
//             min = "30";
//             max = "30";
//           } else if (rangeOption === '1hour') {
//             min = "60";
//             max = "60";
//           } else if (rangeOption === '1.5hours') {
//             min = "90";
//             max = "90";
//           } else if (rangeOption === '2hours') {
//             min = "120";
//             max = "120";
//           } else if (rangeOption === '2hours+') {
//             min = "120";
//             max = "";
//           }
//         }
//       }
      
//       return {
//         ...prev,
//         packageConfigs: {
//           ...prev.packageConfigs,
//           [tier]: {
//             ...prev.packageConfigs[tier],
//             metrics: {
//               ...prev.packageConfigs[tier].metrics,
//               [metric]: {
//                 enabled,
//                 min,
//                 max,
//                 rangeOption: rangeOption || prev.packageConfigs[tier].metrics[metric].rangeOption
//               }
//             }
//           }
//         }
//       };
//     });
//   };

//   const handleFeatureChange = (tier: PackageTier, feature: FeatureType, enabled: boolean, valueOption?: string) => {
//     setFormData(prev => ({
//       ...prev,
//       packageConfigs: {
//         ...prev.packageConfigs,
//         [tier]: {
//           ...prev.packageConfigs[tier],
//           features: {
//             ...prev.packageConfigs[tier].features,
//             [feature]: {
//               enabled,
//               valueOption: valueOption || prev.packageConfigs[tier].features[feature].valueOption
//             }
//           }
//         }
//       }
//     }));
//   };

//   const handleEstimatedAmountChange = (tier: PackageTier, amount: string) => {
//     setFormData(prev => ({
//       ...prev,
//       packageConfigs: {
//         ...prev.packageConfigs,
//         [tier]: {
//           ...prev.packageConfigs[tier],
//           estimatedAmount: amount
//         }
//       }
//     }));
//   };

//   const handleTotalBudgetChange = (amount: string) => {
//     setFormData(prev => ({
//       ...prev,
//       totalBudgetGoal: amount
//     }));
//   };

//   const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFormData(prev => ({
//         ...prev,
//         poster: e.target.files![0]
//       }));
//     }
//   };

//   const mutation = useMutation({
//     mutationFn: async (data: typeof formData) => {
//       // Create form data for file upload
//       const formDataToSend = new FormData();
//       formDataToSend.append("region", data.region);
//       formDataToSend.append("eventType", data.eventType);
//       formDataToSend.append("totalBudgetGoal", data.totalBudgetGoal);
      
//       if (data.poster) {
//         formDataToSend.append("poster", data.poster);
//       }

//       // Add all package configurations
//       formDataToSend.append("packageConfigs", JSON.stringify(data.packageConfigs));

//       const response = await fetch("/api/auth/college/onboard", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message);
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       router.push("/college/dashboard");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   // Calculate total estimated amount from all selected packages
//   const calculateTotalEstimated = () => {
//     const activePackages = Object.values(PackageTier);
//     return activePackages.reduce((total, tier) => {
//       const packageData = formData.packageConfigs[tier];
//       return total + (parseInt(packageData.estimatedAmount) || 0);
//     }, 0);
//   };

//   // Component for metric selection with range options
//   const MetricOptionSelect = ({ 
//     label,
//     metric,
//     config,
//     tier,
//     onChange 
//   }: { 
//     label: string;
//     metric: MetricType;
//     config: {
//       enabled?: boolean;
//       defaultMin?: number;
//       defaultMax?: number;
//       minAllowed?: number;
//       maxAllowed?: number;
//       defaultRangeOption?: string;
//     }
//     tier: PackageTier;
//     onChange: (enabled: boolean, rangeOption?: string) => void;
//   }) => (
//     <div className="space-y-4 p-4 border rounded-lg bg-white/50">
//       <div className="flex items-center justify-between">
//         <Label htmlFor={`${tier}-${metric}-switch`} className="font-medium">{label}</Label>
//         <Switch
//           id={`${tier}-${metric}-switch`}
//           checked={formData.packageConfigs[tier]?.metrics?.[metric]?.enabled || false}
//           disabled={!config?.enabled}
//           onCheckedChange={(checked) => onChange(checked)}
//         />
//       </div>
      
//       {formData.packageConfigs[tier]?.metrics?.[metric]?.enabled && (
//         <div className="space-y-2">
//           <Label htmlFor={`${tier}-${metric}-range`} className="text-sm text-muted-foreground">
//             Range
//           </Label>
//           <Select
//             value={formData.packageConfigs[tier].metrics[metric].rangeOption || ''}
//             onValueChange={(value) => onChange(true, value)}
//           >
//             <SelectTrigger id={`${tier}-${metric}-range`}>
//               <SelectValue placeholder="Select Range" />
//             </SelectTrigger>
//             <SelectContent>
//               {MetricRangeOptions[metric]?.map((option) => (
//                 <SelectItem key={option} value={option}>
//                   {option}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       )}</div>
//   );

//   // Component for feature selection with value options
//   const FeatureOptionSelect = ({ 
//     label, 
//     feature, 
//     tier,
//     config,
//     onChange 
//   }: { 
//     label: string; 
//     feature: FeatureType;
//     tier: PackageTier;
//     config: {
//       enabled: boolean;
//       defaultValueOption?: string;
//     }
//     onChange: (enabled: boolean, valueOption?: string) => void; 
//   }) => (
//     <div className="space-y-4 p-4 border rounded-lg bg-white/50">
//       <div className="flex items-center justify-between">
//         <Label htmlFor={`${tier}-${feature}-switch`} className="font-medium">{label}</Label>
//         <Switch
//           id={`${tier}-${feature}-switch`}
//           checked={formData.packageConfigs[tier]?.features?.[feature]?.enabled || false}
//           disabled={!config?.enabled}
//           onCheckedChange={(checked) => onChange(checked)}
//         />
//       </div>
      
//       {formData.packageConfigs[tier]?.features?.[feature]?.enabled && (
//         <div className="space-y-2">
//           <Label htmlFor={`${tier}-${feature}-value`} className="text-sm text-muted-foreground">
//             Value
//           </Label>
//           <Select
//             value={formData.packageConfigs[tier].features[feature].valueOption}
//             onValueChange={(value) => onChange(true, value)}
//           >
//             <SelectTrigger id={`${tier}-${feature}-value`}>
//               <SelectValue placeholder="Select Value" />
//             </SelectTrigger>
//             <SelectContent>
//               {FeatureValueOptions[feature].map((option) => (
//                 <SelectItem key={option} value={option}>
//                   {option}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-gray-900">College Onboarding</CardTitle>
//           <CardDescription className="text-center">
//             Configure your event packages and sponsorship goals
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Event Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="region">Region</Label>
//                   <Select 
//                     value={formData.region} 
//                     onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
//                   >
//                     <SelectTrigger id="region">
//                       <SelectValue placeholder="Select Region" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="NORTH">North</SelectItem>
//                       <SelectItem value="SOUTH">South</SelectItem>
//                       <SelectItem value="EAST">East</SelectItem>
//                       <SelectItem value="WEST">West</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="eventType">Event Type</Label>
//                   <Select 
//                     value={formData.eventType} 
//                     onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
//                   >
//                     <SelectTrigger id="eventType">
//                       <SelectValue placeholder="Select Event Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Workshop">Workshop</SelectItem>
//                       <SelectItem value="Seminar">Seminar</SelectItem>
//                       <SelectItem value="Hackathon">Hackathon</SelectItem>
//                       <SelectItem value="Tech Fest">Tech Fest</SelectItem>
//                       <SelectItem value="Cultural Fest">Cultural Fest</SelectItem>
//                       <SelectItem value="Sports Event">Sports Event</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               {/* Total Budget Goal */}
//               <div className="mt-4">
//                 <Label htmlFor="totalBudgetGoal">Total Sponsorship Goal (₹)</Label>
//                 <div className="mt-1">
//                   <Input
//                     id="totalBudgetGoal"
//                     type="number"
//                     min="0"
//                     value={formData.totalBudgetGoal}
//                     onChange={(e) => handleTotalBudgetChange(e.target.value)}
//                     className="w-full"
//                   />
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Your total estimated amount from all packages: ₹{calculateTotalEstimated().toLocaleString()}
//                 </p>
//               </div>
              
//               {/* Poster Upload */}
//               <div className="mt-4">
//                 <Label htmlFor="poster">Event Poster (Required)</Label>
//                 <div className="mt-1 flex items-center">
//                   <Label 
//                     htmlFor="poster-upload" 
//                     className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md py-6 px-4 bg-white hover:bg-gray-50"
//                   >
//                     <div className="space-y-1 text-center">
//                       <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                       <div className="flex text-sm text-gray-600">
//                         <span>Upload poster image</span>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                     </div>
//                     <input
//                       id="poster-upload"
//                       name="poster-upload"
//                       type="file"
//                       className="sr-only"
//                       accept="image/*"
//                       onChange={handlePosterUpload}
//                     />
//                   </Label>
//                 </div>
//                 {formData.poster && (
//                   <p className="mt-2 text-sm text-green-600">
//                     Selected: {formData.poster.name}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Package Selection and Configuration */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Package Configuration</h3>
              
//               <div className="mb-4">
//                 <Label className="block mb-2">Preferred Package</Label>
//                 <Select 
//                   value={formData.packageTier} 
//                   onValueChange={(value: PackageTier) => setFormData(prev => ({ ...prev, packageTier: value }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Package" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value={PackageTier.BRONZE}>Bronze Package</SelectItem>
//                     <SelectItem value={PackageTier.SILVER}>Silver Package</SelectItem>
//                     <SelectItem value={PackageTier.GOLD}>Gold Package</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <Tabs defaultValue={PackageTier.SILVER} value={formData.packageTier} onValueChange={(value) => setFormData(prev => ({ ...prev, packageTier: value as PackageTier }))} className="w-full">
//                 <TabsList className="grid grid-cols-3 mb-4">
//                   <TabsTrigger value={PackageTier.BRONZE}>Bronze Package</TabsTrigger>
//                   <TabsTrigger value={PackageTier.SILVER}>Silver Package</TabsTrigger>
//                   <TabsTrigger value={PackageTier.GOLD}>Gold Package</TabsTrigger>
//                 </TabsList>
                
//                 {Object.values(PackageTier).map((tier) => (
//                   <TabsContent key={tier} value={tier} className="space-y-6">
//                     <div className="grid grid-cols-1 gap-6">
//                       {/* Estimated Amount */}
//                       <div className="space-y-2">
//                         <Label htmlFor={`${tier}-amount`}>Estimated Amount (₹)</Label>
//                         <Input
//                           id={`${tier}-amount`}
//                           type="number"
//                           min="0"
//                           value={formData.packageConfigs[tier].estimatedAmount}
//                           onChange={(e) => handleEstimatedAmountChange(tier, e.target.value)}
//                           className="w-full"
//                         />
//                       </div>
                      
//                       <div className="space-y-4">
//                         <h4 className="font-medium">Metrics Configuration</h4>
//                         <div className="grid gap-4">
//                           {Object.values(MetricType).map((metric) => (
//                             <MetricOptionSelect
//                               key={`${tier}-${metric}`}
//                               label={metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                               metric={metric}
//                               tier={tier}
//                               config={PACKAGE_CONFIGS[tier].metrics[metric]}
//                               onChange={(enabled, rangeOption) => handleMetricChange(tier, metric, enabled, rangeOption)}
//                             />
//                           ))}
//                         </div>
//                       </div>
                      
//                       <div className="space-y-4">
//                         <h4 className="font-medium">Additional Features</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {Object.values(FeatureType).map((feature) => (
//                             <FeatureOptionSelect
//                               key={`${tier}-${feature}`}
//                               label={feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                               feature={feature}
//                               tier={tier}
//                               config={PACKAGE_CONFIGS[tier].features[feature]}
//                               onChange={(enabled, valueOption) => handleFeatureChange(tier, feature, enabled, valueOption)}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 ))}
//               </Tabs>
//             </div>

//             {/* Error Display */}
//             {mutation.error && (
//               <Alert variant="destructive">
//                 <AlertDescription>
//                   {mutation.error.message}
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Submit Button */}
//             <Button 
//               type="submit" 
//               className="w-full"
//               disabled={
//                 mutation.isPending || 
//                 !formData.region || 
//                 !formData.eventType || 
//                 !formData.poster ||
//                 !formData.totalBudgetGoal
//               }
//             >
//               {mutation.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 "Complete Onboarding"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { PACKAGE_CONFIGS } from "@/app/lib/packageConfig";
import { PackageTier, MetricType, FeatureType, MetricRangeOptions, FeatureValueOptions } from '@/app/types/package';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PackageAmountOptions } from "@/app/types/package";
import { toast } from "sonner";
import { EVENT_TYPES } from "@/app/lib/eventTypes";

export default function CollegeOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Initialize package data for each tier
  const initializePackageData = (tier: PackageTier) => {
    const config = PACKAGE_CONFIGS[tier];

    const defaultAmount = tier === PackageTier.GOLD 
    ? PackageAmountOptions.GOLD[0]
    : tier === PackageTier.SILVER 
      ? PackageAmountOptions.SILVER[0]
      : PackageAmountOptions.BRONZE[0];

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
    estimatedAmount: defaultAmount,
  };
};

  const [formData, setFormData] = useState({
    region: "",
    eventType: "",
    poster: null as File | null,
    packageTier: PackageTier.BRONZE,
    // totalBudgetGoal: "50000", // Default total budget goal
    packageConfigs: {
      [PackageTier.BRONZE]: initializePackageData(PackageTier.BRONZE),
      [PackageTier.SILVER]: initializePackageData(PackageTier.SILVER),
      [PackageTier.GOLD]: initializePackageData(PackageTier.GOLD),
    }
  });

  const [posterError, setPosterError] = useState<string | null>(null);

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

  // const handleTotalBudgetChange = (amount: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     totalBudgetGoal: amount
  //   }));
  // };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type - only JPG/JPEG allowed
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        setPosterError("Only JPG/JPEG files are allowed. Please select a different image.");
        setFormData(prev => ({
          ...prev,
          poster: null
        }));
        // Clear the input
        e.target.value = '';
        return;
      }
      
      // Clear any previous error and set the file
      setPosterError(null);
      setFormData(prev => ({
        ...prev,
        poster: file
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return !!formData.region && !!formData.eventType;
    } else if (currentStep === 2) {
      return !!formData.poster && !posterError;
    }
    return true;
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("region", data.region);
      formDataToSend.append("eventType", data.eventType);
      
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

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
    
  //   if (currentStep < totalSteps) {
  //     if (validateCurrentStep()) {
  //       nextStep();
  //     }
  //   } else {
  //     mutation.mutate(formData);
  //   }
  // };

  // const handleNextButtonClick = () => {
  //   if (validateCurrentStep()) {
  //     nextStep();
  //   }
  // };

  const [validationError, setValidationError] = useState<string | null>(null);


  // const validatePackageAmounts = (): boolean => {
  //   const bronzeAmount = parseInt(formData.packageConfigs[PackageTier.BRONZE].estimatedAmount) || 0;
  //   const silverAmount = parseInt(formData.packageConfigs[PackageTier.SILVER].estimatedAmount) || 0;
  //   const goldAmount = parseInt(formData.packageConfigs[PackageTier.GOLD].estimatedAmount) || 0;
    
  //   setValidationError(null);
    
  //   // Check Bronze < Silver < Gold
  //   if (bronzeAmount >= silverAmount) {
  //     toast.error("Bronze package amount must be less than Silver package amount");
  //     setValidationError("Bronze package amount must be less than Silver package amount");
  //     return false;
  //   }
    
  //   if (silverAmount >= goldAmount) {
  //     toast.error("Silver package amount must be less than Gold package amount");
  //     setValidationError("Silver package amount must be less than Gold package amount");
  //     return false;
  //   }
    
  //   return true;
  // };
  
  // // Form submission should only happen when explicitly clicking the final step's submit button
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
    
  //   if (currentStep === totalSteps) {
  //     setValidationError(null);
  //     if (validateCurrentStep() && validatePackageAmounts()) {
  //       mutation.mutate(formData);
  //     }
  //     else {
  //     setValidationError("Please fill in all required fields");
  //   }
  //   }
  // };

  //tying to fxi error showng below

  const validatePackageAmounts = (): boolean => {
  const bronzeAmount = parseInt(formData.packageConfigs[PackageTier.BRONZE].estimatedAmount) || 0;
  const silverAmount = parseInt(formData.packageConfigs[PackageTier.SILVER].estimatedAmount) || 0;
  const goldAmount = parseInt(formData.packageConfigs[PackageTier.GOLD].estimatedAmount) || 0;
  
    setValidationError(null); // Clear previous errors

  console.log('Validating amounts:', { bronzeAmount, silverAmount, goldAmount }); // Debug log
  
  if (bronzeAmount >= silverAmount) {
        setValidationError("Silver package amount must be greater than Bronze package amount");

    toast.error("Silver package amount must be greater than Bronze package amount");
    return false;
  }
  
  if (silverAmount >= goldAmount) {
        setValidationError("Gold package amount must be greater than Siver package amount");

    toast.error("Gold package amount must be less than Silver package amount");
    return false;
  }
  
  return true;
};

// Update the handleSubmit function
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (currentStep === totalSteps) {
    console.log('Current form data:', formData); // Debug log
    
    // First check if amounts are valid
    if (!validatePackageAmounts()) {
      console.log('Package amount validation failed'); // Debug log
      return;
    }

    // Then check other validations
    if (!validateCurrentStep()) {
      toast.error("Please fill in all required fields");
      console.log('Current step validation failed'); // Debug log
      return;
    }

    // If both validations pass, proceed with submission
    mutation.mutate(formData);
  } else {
    // Handle next step
    if (validateCurrentStep()) {
      nextStep();
    } else {
      toast.error("Please complete all fields before proceeding");
    }
  }
};

  // Calculate total estimated amount from all selected packages
  // const calculateTotalEstimated = () => {
  //   const activePackages = Object.values(PackageTier);
  //   return activePackages.reduce((total, tier) => {
  //     const packageData = formData.packageConfigs[tier];
  //     return total + (parseInt(packageData.estimatedAmount) || 0);
  //   }, 0);
  // };

  

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
    <div className="space-y-4 p-4 border rounded-lg bg-white/50 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${tier}-${metric}-switch`} className="font-medium">{label}</Label>
        <Switch
          id={`${tier}-${metric}-switch`}
          checked={formData.packageConfigs[tier]?.metrics?.[metric]?.enabled || false}
          disabled={!config?.enabled}
          onCheckedChange={(checked) => onChange(checked)}
          className="data-[state=checked]:bg-orange-500"
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
            <SelectTrigger id={`${tier}-${metric}-range`} className="focus:ring-orange-500">
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
    <div className="space-y-4 p-4 border rounded-lg bg-white/50 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${tier}-${feature}-switch`} className="font-medium">{label}</Label>
        <Switch
          id={`${tier}-${feature}-switch`}
          checked={formData.packageConfigs[tier]?.features?.[feature]?.enabled || false}
          disabled={!config?.enabled}
          onCheckedChange={(checked) => onChange(checked)}
          className="data-[state=checked]:bg-orange-500"
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
            <SelectTrigger id={`${tier}-${feature}-value`} className="focus:ring-orange-500">
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

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            index + 1 < currentStep 
              ? "bg-orange-500 text-white" 
              : index + 1 === currentStep 
                ? "bg-orange-500 text-white" 
                : "bg-gray-200 text-gray-600"
          }`}>
            {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-10 ${index + 1 < currentStep ? "bg-orange-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  const getTierColor = (tier: PackageTier) => {
    switch (tier) {
      case PackageTier.GOLD:
        return "border-yellow-400 bg-yellow-50";
      case PackageTier.SILVER:
        return "border-gray-400 bg-gray-50";
      case PackageTier.BRONZE:
        return "border-amber-700 bg-amber-50";
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <span className="relative inline-block px-2">
              College Onboarding
              <span className="absolute inset-x-0 bottom-2 bg-orange-100 -z-10 h-3 rounded"></span>
            </span>
          </CardTitle>
          <CardDescription className="text-center">
            Configure your event packages and sponsorship goals
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <StepIndicator />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    <span className="relative inline-block">
                      Event Information
                      <span className="absolute inset-x-0 bottom-0 bg-orange-100 -z-10 h-2 rounded"></span>
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select 
                        value={formData.region} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                      >
                        <SelectTrigger id="region" className="focus:ring-orange-500">
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

                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select 
                        value={formData.eventType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
                      >
                        <SelectTrigger id="eventType" className="focus:ring-orange-500">
                          <SelectValue placeholder="Select Event Type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {EVENT_TYPES.map((eventType) => (
                            <SelectItem key={eventType} value={eventType}>
                              {eventType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            )}

            {/* Step 2: Poster Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    <span className="relative inline-block">
                      Event Poster Upload
                      <span className="absolute inset-x-0 bottom-0 bg-orange-100 -z-10 h-2 rounded"></span>
                    </span>
                  </h3>
                  <Label htmlFor="poster">Event Poster (Required)</Label>
                  <div className="mt-2">
                    <Label 
                      htmlFor="poster-upload" 
                      className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-orange-200 rounded-lg py-8 px-4 bg-white hover:bg-orange-50 transition-colors"
                    >
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-16 w-16 text-orange-300" />
                        <div className="flex flex-col items-center text-sm text-gray-600">
                          <span className="font-medium text-orange-500">Click to upload poster image</span>
                          <p className="text-gray-500">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">JPG/JPEG only, up to 10MB</p>
                      </div>
                      <input
                        id="poster-upload"
                        name="poster-upload"
                        type="file"
                        className="sr-only"
                        accept=".jpg,.jpeg,image/jpeg"
                        onChange={handlePosterUpload}
                      />
                    </Label>
                  </div>
                  {formData.poster && !posterError && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm text-green-700">
                        Selected: {formData.poster.name}
                      </p>
                    </div>
                  )}
                  {posterError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-red-700">
                        {posterError}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Package Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    <span className="relative inline-block">
                      Package Configuration
                      <span className="absolute inset-x-0 bottom-0 bg-orange-100 -z-10 h-2 rounded"></span>
                    </span>
                  </h3>
                  
                  <div className="mb-6">
                    <Label className="block mb-2">Preferred Package</Label>
                    <Select 
                      value={formData.packageTier} 
                      onValueChange={(value: PackageTier) => setFormData(prev => ({ ...prev, packageTier: value }))}
                    >
                      <SelectTrigger className="focus:ring-orange-500">
                        <SelectValue placeholder="Select Package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PackageTier.BRONZE}>Bronze Package</SelectItem>
                        <SelectItem value={PackageTier.SILVER}>Silver Package</SelectItem>
                        <SelectItem value={PackageTier.GOLD}>Gold Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Tabs 
                    defaultValue={PackageTier.BRONZE} 
                    value={formData.packageTier} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, packageTier: value as PackageTier }))} 
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger 
                        value={PackageTier.BRONZE} 
                        className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
                      >
                        Bronze Package
                      </TabsTrigger>
                      <TabsTrigger 
                        value={PackageTier.SILVER} 
                        className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900"
                      >
                        Silver Package
                      </TabsTrigger>
                      <TabsTrigger 
                        value={PackageTier.GOLD} 
                        className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
                      >
                        Gold Package
                      </TabsTrigger>
                    </TabsList>
                    
                    {Object.values(PackageTier).map((tier) => (
                      <TabsContent key={tier} value={tier} className="space-y-6">
                        <Card className={`transition-all border-2 ${getTierColor(tier)}`}>
                          <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                              <span>
                                {tier.charAt(0) + tier.slice(1).toLowerCase()} Package
                              </span>
                              <Badge className={
                                tier === PackageTier.GOLD ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                                tier === PackageTier.SILVER ? 'bg-gray-200 text-gray-800 border-gray-300' : 
                                'bg-amber-100 text-amber-800 border-amber-300'
                              }>
                                {tier}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 gap-6">
                            {/* Estimated Amount */}
                                        <div className="space-y-2">
                                          <Label htmlFor={`${tier}-amount`}>Estimated Amount (₹)</Label>
                                          <Select
                                            value={formData.packageConfigs[tier].estimatedAmount}
                                            onValueChange={(value) => handleEstimatedAmountChange(tier, value)}
                                          >
                                            <SelectTrigger id={`${tier}-amount`} className="focus:ring-orange-500">
                                              <SelectValue placeholder="Select Amount" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {PackageAmountOptions[tier].map((amount) => (
                                                <SelectItem key={amount} value={amount}>
                                                  ₹{parseInt(amount).toLocaleString()}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
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
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            )}

            {/* Error Display */}
            {mutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {mutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Package Amount Validation Error */}
            {validationError && currentStep === totalSteps && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationError}
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            {/* <div className="flex gap-4 justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
                className="w-1/3"
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              
              
              <Button 
  type={currentStep === totalSteps ? "submit" : "button"}
  className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white"
  disabled={
    mutation.isPending || 
    (!validateCurrentStep() && currentStep !== totalSteps)
  }
  onClick={currentStep !== totalSteps ? handleNextButtonClick : undefined}
>
  {mutation.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Submitting...
    </>
  ) : currentStep === totalSteps ? (
    "Complete Onboarding"
  ) : (
    <>
      Continue <ArrowRight className="ml-2 h-4 w-4" />
    </>
  )}
</Button>
            </div> */}

<div className="flex gap-4 justify-between">
  <Button 
    type="button" 
    variant="outline"
    onClick={prevStep}
    className="w-1/3"
    disabled={currentStep === 1}
  >
    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
  </Button>
  
  {/* {currentStep === totalSteps ? (
    <Button 
      type="submit"
      className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white"
      disabled={mutation.isPending || !validateCurrentStep()}
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
  ) : (
    <Button 
      type="button"
      className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white"
      onClick={() => validateCurrentStep() && nextStep()}
    >
      Continue <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )}
</div> */}
{currentStep === totalSteps ? (
    <Button 
      type="submit"
      className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white"
      onClick={(e) => {
        e.preventDefault();
        const isValid = validatePackageAmounts();
        if (isValid) {
          // Submit the form programmatically instead of passing the event
          mutation.mutate(formData);
        }
      }}
      disabled={mutation.isPending}
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
  ) : (
    <Button 
      type="button"
      className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white"
      onClick={() => validateCurrentStep() && nextStep()}
    >
      Continue <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )}
</div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}