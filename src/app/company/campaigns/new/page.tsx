// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// //import { MultiSelect } from "@/components/ui/multi-select";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Loader2, Plus, X } from "lucide-react";
// import { toast } from "sonner";
// // import { toast } from "@/components/ui/sonner";
// import { Region, MetricType, FeatureType, CampaignPlan } from "@/lib/types";
// import { Badge } from "@/components/ui/badge";
// import { SimpleMultiSelect } from "@/components/ui/simple-multi-select";


// interface Bundle {
//   id: string;
//   name: string;
//   status: string;
//   campaignId: string;
//   colleges: College[];
//   totalMetrics: Record<string, number>;
//   fulfillmentPercentages?: Record<string, number>;
// }

// interface MetricInput {
//   type: MetricType;
//   minValue?: number;
//   maxValue?: number;
// }

// interface FeatureInput {
//   type: FeatureType;
//   enabled: boolean;
// }

// interface College {
//   id: string;
//   collegeName: string;
//   eventType: string;
//   score?: number; // Add this property, making it optional with the ? symbol
// }

// interface Bundle {
//   id: string;
//   name: string;
//   status: string;
//   campaignId: string;
//   colleges: College[];
//   totalMetrics: Record<string, number>;
//   fulfillmentPercentages?: Record<string, number>; // Add this new property
// }

// const BundleDisplay = ({ bundle, metrics, onSelect }: {
//   bundle: Bundle;
//   metrics: MetricInput[];
//   onSelect: (bundleId: string) => void;
// }) => {
//   // Calculate fulfillment percentages
//   const fulfillmentPercentages = bundle.fulfillmentPercentages || 
//     Object.entries(bundle.totalMetrics).reduce((acc, [metricType, value]) => {
//       const metric = metrics.find(m => m.type === metricType);
//       if (metric?.maxValue && metric.maxValue > 0) {
//         acc[metricType] = Math.min(100, (value / metric.maxValue) * 100);
//       }
//       return acc;
//     }, {} as Record<string, number>);

//   const getColorForPercentage = (percentage: number) => {
//     if (percentage >= 90) return "bg-green-100 text-green-800";
//     if (percentage >= 70) return "bg-blue-100 text-blue-800";
//     if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
//     return "bg-red-100 text-red-800";
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex justify-between items-center">
//           {bundle.name}
//           <Badge>{bundle.status}</Badge>
//         </CardTitle>
//         <div className="text-sm text-gray-600">
//           {bundle.colleges.length} events in {bundle.status.toLowerCase()} state
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         <div>
//           <h3 className="font-medium mb-2">Metrics Fulfillment:</h3>
//           <div className="space-y-2">
//             {Object.entries(bundle.totalMetrics).map(([type, value]) => {
//               const percentage = fulfillmentPercentages[type] || 0;
//               return (
//                 <div key={type} className="grid grid-cols-7 gap-2 items-center">
//                   <span className="col-span-2 text-sm font-medium">{type}:</span>
//                   <span className="col-span-1 text-sm text-right">{value}</span>
//                   <div className="col-span-3 w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full" 
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>
//                   <Badge className={`col-span-1 ${getColorForPercentage(percentage)}`}>
//                     {percentage.toFixed(0)}%
//                   </Badge>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
        
//         <div>
//           <h3 className="font-medium mb-2">Colleges:</h3>
//           <div className="space-y-2">
//             {bundle.colleges.map((college) => (
//               <div key={college.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
//                 <div>
//                   <div className="font-medium">{college.collegeName}</div>
//                   <div className="text-sm text-gray-600">{college.eventType}</div>
//                 </div>
//                 <Badge variant="outline">Score: {college.score}</Badge>
//               </div>
//             ))}
//           </div>
//         </div>
//       </CardContent>
      
//       <CardFooter>
//         <Button
//           className="w-full"
//           onClick={() => onSelect(bundle.id)}
//           disabled={bundle.status !== "PENDING"}
//         >
//           Select This Bundle
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default function StartCampaignPage() {
//   const router = useRouter();
//   // const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [bundles, setBundles] = useState<Bundle[]>([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     plan: "QUARTERLY" as CampaignPlan,
//     region: "NORTH" as Region,
//     eventTypes: [] as string[],
//     bundleSize: 1,
//   });
//   const [metrics, setMetrics] = useState<MetricInput[]>([]);
//   const [features, setFeatures] = useState<FeatureInput[]>([]);

//   const eventTypeOptions = [
//     { value: "Tech Fest", label: "Tech Fest" },
//     { value: "Cultural Fest", label: "Cultural Fest" },
//     { value: "Sports Meet", label: "Sports Meet" },
//     { value: "Conference", label: "Conference" },
//     { value: "Workshop", label: "Workshop" },
//     { value: "Seminar", label: "Seminar" },
//     { value: "Hackathon", label: "Hackathon" }
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
  
//     console.log("[DEBUG Frontend] Starting campaign submission");
//     console.log("[DEBUG Frontend] Form data:", formData);
//     console.log("[DEBUG Frontend] Metrics:", metrics);
//     console.log("[DEBUG Frontend] Features:", features);
  
//     if (!formData.name || formData.eventTypes.length === 0) {
//       console.log("[DEBUG Frontend] Validation failed - missing required fields");
//       toast.error("Please fill all required fields");
//       setLoading(false);
//       return;
//     }
  
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("[DEBUG Frontend] No token found in localStorage");
//         toast.error("Authentication token not found. Please log in again.");
//         setLoading(false);
//         return;
//       }
  
//       console.log("[DEBUG Frontend] Preparing request body");
//       const requestBody = {
//         ...formData,
//         metrics: metrics.filter(m => m.type),
//         features: features.filter(f => f.type),
//       };
//       console.log("[DEBUG Frontend] Request body:", requestBody);
  
//       console.log("[DEBUG Frontend] Sending POST request to /api/company/campaigns");
//       const response = await fetch("/api/company/campaigns", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       console.log("[DEBUG Frontend] Response status:", response.status);
//       const data = await response.json();
//       console.log("[DEBUG Frontend] Response data:", data);
  
//       if (!response.ok) {
//         console.log("[DEBUG Frontend] Request failed:", data.message);
//         throw new Error(data.message || "Failed to create campaign");
//       }
  
//       console.log("[DEBUG Frontend] Campaign created successfully");
//       console.log("[DEBUG Frontend] Suggested bundles count:", data.campaign.suggestedBundles?.length || 0);
      
//       if (data.campaign.suggestedBundles?.length > 0) {
//         console.log("[DEBUG Frontend] Suggested bundles:", data.campaign.suggestedBundles);
//         setBundles(data.campaign.suggestedBundles);
//         toast.success("Bundle suggestions generated successfully!");
//       } else {
//         console.log("[DEBUG Frontend] No bundles were generated");
//         toast.warning("No matching bundles could be generated. Please adjust your criteria and try again.");
//       }
//     } catch (error: unknown) {
//       console.error("[DEBUG Frontend] Error:", error);
//       toast.error("Error: " + (error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   const addMetric = () => {
//     setMetrics([...metrics, { type: MetricType.SIGNUPS, minValue: 0, maxValue: 0 }]);
//   };

//   const updateMetric = (index: number, field: keyof MetricInput, value: number | MetricType) => {
//     const newMetrics = [...metrics];
//     newMetrics[index][field as keyof MetricInput] = value as never;
//     setMetrics(newMetrics);
//   };

//   const removeMetric = (index: number) => {
//     setMetrics(metrics.filter((_, i) => i !== index));
//   };

//   const addFeature = () => {
//     setFeatures([...features, { type: FeatureType.ANNOUNCEMENT, enabled: false }]);
//   };

//   const updateFeature = (index: number, field: keyof FeatureInput, value: boolean | FeatureType) => {
//     const newFeatures = [...features];
//     newFeatures[index][field] = value as never;
//     setFeatures(newFeatures);
//   };

//   const removeFeature = (index: number) => {
//     setFeatures(features.filter((_, i) => i !== index));
//   };

//   // Also add debugging to the selectBundle function

  
  
//   const selectBundle = async (bundleId: string) => {
//     console.log("[DEBUG Frontend] Selecting bundle:", bundleId);
    
//     if (bundles.length === 0) {
//       console.log("[DEBUG Frontend] No bundles available to select");
//       return;
//     }
    
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("[DEBUG Frontend] No token found in localStorage");
//         toast.error("Authentication token not found. Please log in again.");
//         return;
//       }
      
//       const campaignId = bundles[0].campaignId;
//       console.log("[DEBUG Frontend] Campaign ID:", campaignId);
      
//       console.log("[DEBUG Frontend] Sending POST request to select bundle");
//       const response = await fetch(
//         `/api/company/campaigns/${campaignId}/bundles`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ bundleId }),
//         }
//       );
  
//       console.log("[DEBUG Frontend] Response status:", response.status);
//       const data = await response.json();
//       console.log("[DEBUG Frontend] Response data:", data);
  
//       if (!response.ok) {
//         console.log("[DEBUG Frontend] Request failed:", data.message);
//         throw new Error(data.message || "Failed to select bundle");
//       }
  
//       console.log("[DEBUG Frontend] Bundle selected successfully, redirecting to campaign page");
//       router.push(`/company/campaigns/${campaignId}`);
//     } catch (error: unknown) {
//       console.error("[DEBUG Frontend] Error selecting bundle:", error);
//       toast.error("Error: " + (error as Error).message);
//     }
//   };

//   const renderCampaignForm = () => (
//     <Card>
//       <CardHeader>
//         <CardTitle>Start New Campaign</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid gap-4">
//             {/* Campaign Name */}
//             <div className="space-y-2">
//               <Label htmlFor="campaign-name">Campaign Name *</Label>
//               <Input
//                 id="campaign-name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Summer 2024 Outreach"
//               />
//             </div>

//             {/* Plan and Region */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="plan">Plan *</Label>
//                 <Select
//                   value={formData.plan}
//                   onValueChange={(v) => setFormData({ ...formData, plan: v as CampaignPlan })}
//                 >
//                   <SelectTrigger id="plan">
//                     <SelectValue placeholder="Select plan" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="QUARTERLY">Quarterly</SelectItem>
//                     <SelectItem value="HALF_YEARLY">Half-Yearly</SelectItem>
//                     <SelectItem value="YEARLY">Yearly</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="region">Region *</Label>
//                 <Select
//                   value={formData.region}
//                   onValueChange={(v) => setFormData({ ...formData, region: v as Region })}
//                 >
//                   <SelectTrigger id="region">
//                     <SelectValue placeholder="Select region" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="NORTH">North</SelectItem>
//                     <SelectItem value="SOUTH">South</SelectItem>
//                     <SelectItem value="EAST">East</SelectItem>
//                     <SelectItem value="WEST">West</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Event Types */}
//             <div className="space-y-2">
//   <Label htmlFor="event-types" className="flex items-center">
//     Event Types 
//     <span className="text-red-500 ml-1 font-bold">*</span>
//   </Label>
//               {/* Use SimpleMultiSelect instead of MultiSelect */}
//   <SimpleMultiSelect
//     options={eventTypeOptions}
//     selected={formData.eventTypes}
//     onChange={(selected) => {
//       console.log("[DEBUG] Event types selected:", selected);
//       setFormData({ ...formData, eventTypes: selected });
//     }}
//     placeholder="Select event types..."
//   />
//   {/* Show error if no event types selected */}
//   {formData.eventTypes.length === 0 && (
//     <p className="text-sm text-red-500">
//       Please select at least one event type
//     </p>
//   )}
//             </div>

//             {/* Bundle Size */}
//             <div className="space-y-2">
//               <Label htmlFor="bundle-size">Bundle Size (Number of Events) *</Label>
//               <Input
//                 id="bundle-size"
//                 type="number"
//                 min="1"
//                 value={formData.bundleSize}
//                 onChange={(e) => setFormData({ ...formData, bundleSize: Number(e.target.value) })}
//               />
//             </div>

//             {/* Metrics Section */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Metrics Requirements</Label>
//                 <Button type="button" variant="outline" size="sm" onClick={addMetric}>
//                   <Plus className="h-4 w-4 mr-2" /> Add Metric
//                 </Button>
//               </div>

//               {metrics.map((metric, index) => (
//                 <div key={index} className="grid grid-cols-4 gap-4 items-center">
//                   <Select
//                     value={metric.type}
//                     onValueChange={(v) => updateMetric(index, "type", v as MetricType)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Metric Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.values(MetricType).map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Input
//                     type="number"
//                     placeholder="Min Value"
//                     value={metric.minValue ?? ""}
//                     onChange={(e) => updateMetric(index, "minValue", Number(e.target.value))}
//                   />

//                   <Input
//                     type="number"
//                     placeholder="Max Value"
//                     value={metric.maxValue ?? ""}
//                     onChange={(e) => updateMetric(index, "maxValue", Number(e.target.value))}
//                   />

//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeMetric(index)}
//                     aria-label="Remove metric"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>

//             {/* Features Section */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label>Required Features</Label>
//                 <Button type="button" variant="outline" size="sm" onClick={addFeature}>
//                   <Plus className="h-4 w-4 mr-2" /> Add Feature
//                 </Button>
//               </div>

//               {features.map((feature, index) => (
//                 <div key={index} className="grid grid-cols-3 gap-4 items-center">
//                   <Select
//                     value={feature.type}
//                     onValueChange={(v) => updateFeature(index, "type", v as FeatureType)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Feature Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.values(FeatureType).map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id={`feature-enabled-${index}`}
//                       checked={feature.enabled}
//                       onChange={(e) => updateFeature(index, "enabled", e.target.checked)}
//                       className="h-4 w-4"
//                     />
//                     <Label htmlFor={`feature-enabled-${index}`}>Enabled</Label>
//                   </div>

//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeFeature(index)}
//                     aria-label="Remove feature"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//             Generate Campaign Bundles
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );

//   // const renderBundles = () => (
//   //   <div className="space-y-6">
//   //     <h2 className="text-2xl font-bold">Suggested Bundles</h2>
      
//   //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   //       {bundles.map((bundle) => (
//   //         <Card key={bundle.id}>
//   //           <CardHeader>
//   //             <CardTitle>{bundle.name}</CardTitle>
//   //             <div className="flex items-center space-x-2">
//   //               <Badge>{bundle.status}</Badge>
//   //               <span className="text-sm text-gray-600">
//   //                 {bundle.colleges.length} events
//   //               </span>
//   //             </div>
//   //           </CardHeader>
//   //           <CardContent>
//   //             <div className="space-y-4">
//   //               <div>
//   //                 <h3 className="font-medium mb-2">Included Colleges:</h3>
//   //                 <ul className="space-y-2">
//   //                   {bundle.colleges.map((college) => (
//   //                     <li key={college.id} className="flex items-center space-x-2">
//   //                       <span className="text-sm">{college.collegeName}</span>
//   //                       <Badge variant="outline">{college.eventType}</Badge>
//   //                     </li>
//   //                   ))}
//   //                 </ul>
//   //               </div>

//   //               <div>
//   //                 <h3 className="font-medium mb-2">Total Metrics:</h3>
//   //                 <ul className="space-y-1">
//   //                   {Object.entries(bundle.totalMetrics).map(([type, value]) => (
//   //                     <li key={type} className="flex justify-between">
//   //                       <span className="text-sm">{type}:</span>
//   //                       <span className="text-sm font-medium">{value}</span>
//   //                     </li>
//   //                   ))}
//   //                 </ul>
//   //               </div>
//   //             </div>
//   //           </CardContent>
//   //           <CardFooter>
//   //             <Button
//   //               className="w-full"
//   //               onClick={() => selectBundle(bundle.id)}
//   //               disabled={bundle.status !== "PENDING"}
//   //             >
//   //               Select This Bundle
//   //             </Button>
//   //           </CardFooter>
//   //         </Card>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );

//   const renderBundles = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Suggested Bundles</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {bundles.map((bundle) => (
//           <BundleDisplay
//             key={bundle.id}
//             bundle={bundle}
//             metrics={metrics}
//             onSelect={selectBundle}
//           />
//         ))}
//       </div>
//     </div>
//   );
  
//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-4xl mx-auto">
//         <Button
//           variant="ghost"
//           className="mb-6"
//           onClick={() => router.back()}
//         >
//           ← Back to Dashboard
//         </Button>

//         {bundles.length === 0 ? renderCampaignForm() : renderBundles()}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SimpleMultiSelect } from "@/components/ui/simple-multi-select";
//import { Progress } from "@/components/ui/progress";

// Import types from lib/types to maintain compatibility
import { Region, MetricType, FeatureType, CampaignPlan } from "@/lib/types";

// Define metric range options
const MetricRangeOptions: Record<string, string[]> = {
  SIGNUPS: ['0-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200-1400', '1400-1600', '1600-1800', '1800-2000', '2000+'],
  MARKETING_BANNERS: ['0-5', '5-10', '10-15', '15-20', '20+'],
  DIGITAL_MARKETING_VIEWS: ['0-20K', '20K-50K', '50K-100K', '100K-150K', '150K-200K', '200K-250K', '250K-300K', '300K-350K', '350K-400K', '400K-450K', '450K-500K', '500K+'],
  CUSTOMER_SURVEYS: ['0-50', '50-100', '100-150', '150-200', '200-250', '250-300', '300-350', '350-400', '400-450', '450-500', '500+'],
  KEYNOTE_SPEAKING: ['30min', '1hour', '1.5hours', '2hours', '2hours+'],
  ENGAGEMENT_ACTIVITY: ['30min', '1hour', '1.5hours', '2hours', '2hours+'],
  ANNOUNCEMENTS: ['0-5', '5-10'],
  LOGO_ON_POSTERS: ['0-5', '5-10', '10-15', '15-20', '20+']
};

// Define feature value options
const FeatureValueOptions: Record<string, string[]> = {
  STALLS: ['Yes', 'No'],
  TITLE_RIGHTS: ['Yes', 'No'],
  MAIN_STAGE_BACKDROP: ['0-1hour', '1-2hour', '2-3hour', '3hour+'],
  STANDEES: ['0-5', '5-10', '10-15', '15-20', '20+'],
  OTHER: ['Yes', 'No']
};

interface Bundle {
  id: string;
  name: string;
  status: string;
  campaignId: string;
  colleges: College[];
  totalMetrics: Record<string, number>;
  fulfillmentPercentages?: Record<string, number>;
  roi?: number;
}

interface MetricInput {
  type: MetricType;
  minValue?: number;
  maxValue?: number;
  rangeOption?: string;
}

interface FeatureInput {
  type: FeatureType;
  enabled: boolean;
  valueOption?: string;
}

interface College {
  id: string;
  collegeName: string;
  eventType: string;
  packageTier?: string;
  estimatedAmount?: number;
  score?: number;
}

const BundleDisplay = ({ bundle, metrics, onSelect }: {
  bundle: Bundle;
  metrics: MetricInput[];
  onSelect: (bundleId: string) => void;
}) => {
  // Calculate fulfillment percentages
  const fulfillmentPercentages = bundle.fulfillmentPercentages || 
    Object.entries(bundle.totalMetrics).reduce((acc, [metricType, value]) => {
      const metric = metrics.find(m => m.type === metricType);
      if (metric?.maxValue && metric.maxValue > 0) {
        acc[metricType] = Math.min(100, (value / metric.maxValue) * 100);
      }
      return acc;
    }, {} as Record<string, number>);

  const getColorForPercentage = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 70) return "bg-blue-100 text-blue-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Calculate total budget
  const totalBudget = bundle.colleges.reduce((sum, college) => 
    sum + (college.estimatedAmount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {bundle.name}
          <Badge>{bundle.status}</Badge>
        </CardTitle>
        <div className="text-sm text-gray-600">
          {bundle.colleges.length} events in {bundle.status.toLowerCase()} state
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Metrics Fulfillment:</h3>
          <div className="space-y-2">
            {Object.entries(bundle.totalMetrics).map(([type, value]) => {
              const percentage = fulfillmentPercentages[type] || 0;
              return (
                <div key={type} className="grid grid-cols-7 gap-2 items-center">
                  <span className="col-span-2 text-sm font-medium">{type.replace(/_/g, ' ')}</span>
                  <span className="col-span-1 text-sm text-right">{value}</span>
                  <div className="col-span-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <Badge className={`col-span-1 ${getColorForPercentage(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Colleges:</h3>
          <div className="space-y-2">
            {bundle.colleges.map((college) => (
              <div key={college.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div>
                  <div className="font-medium">{college.collegeName}</div>
                  <div className="text-sm text-gray-600">{college.eventType}</div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline">Score: {college.score?.toFixed(1) || 'N/A'}</Badge>
                  {college.packageTier && (
                    <span className="text-xs text-gray-500 mt-1">{college.packageTier} Package</span>
                  )}
                  {college.estimatedAmount && (
                    <span className="text-xs font-semibold mt-1">₹{college.estimatedAmount.toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Show budget info if available */}
        {totalBudget > 0 && (
          <div className="pt-2 border-t mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Budget:</span>
              <span className="font-bold text-lg">₹{totalBudget.toLocaleString()}</span>
            </div>
            
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect(bundle.id)}
          disabled={bundle.status !== "PENDING"}
        >
          Select This Bundle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function StartCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    plan: "QUARTERLY" as CampaignPlan,
    region: "NORTH" as Region,
    eventTypes: [] as string[],
    bundleSize: 1,
    budgetLimit: 50000,
  });
  const [metrics, setMetrics] = useState<MetricInput[]>([]);
  const [features, setFeatures] = useState<FeatureInput[]>([]);
  const [preSelectedCollegeId, setPreSelectedCollegeId] = useState<string | null>(null);

  const eventTypeOptions = [
    { value: "Tech Fest", label: "Tech Fest" },
    { value: "Cultural Fest", label: "Cultural Fest" },
    { value: "Sports Meet", label: "Sports Meet" },
    { value: "Conference", label: "Conference" },
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" },
    { value: "Hackathon", label: "Hackathon" }
  ];

  // Define the budget ranges
const budgetRanges = [
  // 0-50K in 5K increments
  { value: 5000, label: "₹5,000" },
  { value: 10000, label: "₹10,000" },
  { value: 15000, label: "₹15,000" },
  { value: 20000, label: "₹20,000" },
  { value: 25000, label: "₹25,000" },
  { value: 30000, label: "₹30,000" },
  { value: 35000, label: "₹35,000" },
  { value: 40000, label: "₹40,000" },
  { value: 45000, label: "₹45,000" },
  { value: 50000, label: "₹50,000" },
  
  // 50K-1L in 10K increments
  { value: 60000, label: "₹60,000" },
  { value: 70000, label: "₹70,000" },
  { value: 80000, label: "₹80,000" },
  { value: 90000, label: "₹90,000" },
  { value: 100000, label: "₹1,00,000" },
  
  // 1L+ in 50K increments
  { value: 150000, label: "₹1,50,000" },
  { value: 200000, label: "₹2,00,000" },
  { value: 250000, label: "₹2,50,000" },
  { value: 300000, label: "₹3,00,000" },
  { value: 350000, label: "₹3,50,000" },
  { value: 400000, label: "₹4,00,000" },
  { value: 450000, label: "₹4,50,000" },
  { value: 500000, label: "₹5,00,000" },
  { value: 1000000, label: "₹10,00,000" },
];

  // const optimizationOptions = [
  //   { value: "balanced", label: "Balanced (Metrics & Cost)" },
  //   { value: "metrics", label: "Maximize Metrics" },
  //   { value: "cost", label: "Minimize Cost" },
  //   { value: "roi", label: "Best Value (ROI)" }
  // ];

  // Check for pre-selected college from localStorage
  useEffect(() => {
    const storedCollegeId = localStorage.getItem('preSelectedCollegeId');
    if (storedCollegeId) {
      setPreSelectedCollegeId(storedCollegeId);
      // Clear it after using
      localStorage.removeItem('preSelectedCollegeId');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("[DEBUG Frontend] Starting campaign submission");
    console.log("[DEBUG Frontend] Form data:", formData);
    console.log("[DEBUG Frontend] Metrics:", metrics);
    console.log("[DEBUG Frontend] Features:", features);
  
    if (!formData.name || formData.eventTypes.length === 0) {
      console.log("[DEBUG Frontend] Validation failed - missing required fields");
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[DEBUG Frontend] No token found in localStorage");
        toast.error("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
  
      console.log("[DEBUG Frontend] Preparing request body");
      const requestBody = {
        ...formData,
        metrics: metrics.filter(m => m.type),
        features: features.filter(f => f.type),
        preSelectedCollegeId: preSelectedCollegeId
      };
      console.log("[DEBUG Frontend] Request body:", requestBody);
  
      console.log("[DEBUG Frontend] Sending POST request to /api/company/campaigns");
      const response = await fetch("/api/company/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("[DEBUG Frontend] Response status:", response.status);
      const data = await response.json();
      console.log("[DEBUG Frontend] Response data:", data);
  
      if (!response.ok) {
        console.log("[DEBUG Frontend] Request failed:", data.message);
        throw new Error(data.message || "Failed to create campaign");
      }
  
      console.log("[DEBUG Frontend] Campaign created successfully");
      console.log("[DEBUG Frontend] Suggested bundles count:", data.campaign.suggestedBundles?.length || 0);
      
      if (data.campaign.suggestedBundles?.length > 0) {
        console.log("[DEBUG Frontend] Suggested bundles:", data.campaign.suggestedBundles);
        setBundles(data.campaign.suggestedBundles);
        toast.success("Bundle suggestions generated successfully!");
      } else {
        console.log("[DEBUG Frontend] No bundles were generated");
        toast.warning("No matching bundles could be generated. Please adjust your criteria and try again.");
      }
    } catch (error: unknown) {
      console.error("[DEBUG Frontend] Error:", error);
      toast.error("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  
  const addMetric = () => {
    // Select a default metric type
    if (metrics.length >= Object.values(MetricType).length) {
      toast.error("You've added all possible metric types.");
      return;
    }

    const usedTypes = new Set(metrics.map(m => m.type));
  const availableTypes = Object.values(MetricType).filter(type => !usedTypes.has(type));
  
  if (availableTypes.length === 0) {
    toast.error("You've added all possible metric types.");
    return;
  }
  
  // Use the first available type
  const defaultType = availableTypes[0];
  
  // Get default range option
  const defaultRangeOption = MetricRangeOptions[defaultType][0];

    // const defaultType = MetricType.SIGNUPS;
    // Get default range option
    // const defaultRangeOption = MetricRangeOptions[defaultType][0];
    
    // Parse min/max from range option
    const [minStr, maxStr] = defaultRangeOption.split('-');
    const min = parseInt(minStr || '0');
    const max = parseInt(maxStr || '0');
    
    setMetrics([...metrics, { 
      type: defaultType, 
      minValue: min, 
      maxValue: max,
      rangeOption: defaultRangeOption
    }]);
  };

  const updateMetric = (index: number, field: keyof MetricInput, value: string | number | MetricType) => {
    const newMetrics = [...metrics];
    
    if (field === 'type') {
      // Update type

      const typeExists = metrics.some((m, i) => i !== index && m.type === value);
    
    if (typeExists) {
      toast.error(`Metric type "${value}" is already added.`);
      return;
    }

      newMetrics[index].type = value as MetricType;
      
      // Reset range option to first option for this type
      const rangeOption = MetricRangeOptions[value as string][0];
      newMetrics[index].rangeOption = rangeOption;
      
      // Update min/max based on range option
      if (rangeOption.includes('-')) {
        const [minStr, maxStr] = rangeOption.split('-');
        let min = parseInt(minStr.replace(/\D/g, ''));
        let max = parseInt(maxStr.replace(/\D/g, ''));
        
        // Handle K (thousands) multiplier
        if (minStr.includes('K')) min *= 1000;
        if (maxStr.includes('K')) max *= 1000;
        
        newMetrics[index].minValue = min;
        newMetrics[index].maxValue = max;
      }
    } 
    else if (field === 'rangeOption') {
      // Update range option
      newMetrics[index].rangeOption = value as string;
      
      // Update min/max based on range option
      const rangeOption = value as string;
      
      if (rangeOption.includes('-')) {
        const [minStr, maxStr] = rangeOption.split('-');
        let min = parseInt(minStr.replace(/\D/g, ''));
        let max = parseInt(maxStr.replace(/\D/g, ''));
        
        // Handle K (thousands) multiplier
        if (minStr.includes('K')) min *= 1000;
        if (maxStr.includes('K')) max *= 1000;
        
        newMetrics[index].minValue = min;
        newMetrics[index].maxValue = max;
      } 
      else if (rangeOption.endsWith('+')) {
        // Handle ranges like "500+" or "500K+"
        let min = parseInt(rangeOption.slice(0, -1).replace(/\D/g, ''));
        if (rangeOption.includes('K')) min *= 1000;
        
        newMetrics[index].minValue = min;
        newMetrics[index].maxValue = min * 2; // Use a reasonable upper bound
      }
      else if (rangeOption.includes('hour') || rangeOption.includes('min')) {
        // Handle time-based metrics
        let minutes = 0;
        if (rangeOption === '30min') minutes = 30;
        else if (rangeOption === '1hour') minutes = 60;
        else if (rangeOption === '1.5hours') minutes = 90;
        else if (rangeOption === '2hours') minutes = 120;
        else if (rangeOption === '2hours+') minutes = 150;
        
        newMetrics[index].minValue = minutes;
        newMetrics[index].maxValue = minutes;
        if (rangeOption.endsWith('+')) {
          newMetrics[index].maxValue = minutes * 1.5;
        }
      }
    }
    else if (field === 'minValue' || field === 'maxValue') {
      // Handle direct min/max value changes
      newMetrics[index][field] = value as number;
    }
    
    setMetrics(newMetrics);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    const defaultType = FeatureType.STALLS;
    const defaultValueOption = FeatureValueOptions[defaultType][0];
    
    setFeatures([...features, { 
      type: defaultType, 
      enabled: true,
      valueOption: defaultValueOption
    }]);
  };

  const updateFeature = (index: number, field: keyof FeatureInput, value: string | boolean | FeatureType) => {
    const newFeatures = [...features];
    
    if (field === 'type') {
      // Update type and reset valueOption
      newFeatures[index].type = value as FeatureType;
      newFeatures[index].valueOption = FeatureValueOptions[value as string][0];
    } 
    else if (field === 'enabled') {
      // Update enabled status
      newFeatures[index].enabled = value as boolean;
    }
    else if (field === 'valueOption') {
      // Update valueOption
      newFeatures[index].valueOption = value as string;
    }
    
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  const selectBundle = async (bundleId: string) => {
    console.log("[DEBUG Frontend] Selecting bundle:", bundleId);
    
    if (bundles.length === 0) {
      console.log("[DEBUG Frontend] No bundles available to select");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[DEBUG Frontend] No token found in localStorage");
        toast.error("Authentication token not found. Please log in again.");
        return;
      }
      
      const campaignId = bundles[0].campaignId;
      console.log("[DEBUG Frontend] Campaign ID:", campaignId);
      
      console.log("[DEBUG Frontend] Sending POST request to select bundle");
      const response = await fetch(
        `/api/company/campaigns/${campaignId}/bundles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bundleId }),
        }
      );
  
      console.log("[DEBUG Frontend] Response status:", response.status);
      const data = await response.json();
      console.log("[DEBUG Frontend] Response data:", data);
  
      if (!response.ok) {
        console.log("[DEBUG Frontend] Request failed:", data.message);
        throw new Error(data.message || "Failed to select bundle");
      }
  
      console.log("[DEBUG Frontend] Bundle selected successfully, redirecting to campaign page");
      router.push(`/company/campaigns/${campaignId}`);
    } catch (error: unknown) {
      console.error("[DEBUG Frontend] Error selecting bundle:", error);
      toast.error("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  // Component for metric selection with range options
  const MetricRangeSelector = ({ 
    index, 
    metric
  }: { 
    index: number; 
    metric: MetricInput;
  }) => (
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-4">
        <Select
          value={metric.type}
          onValueChange={(v) => updateMetric(index, "type", v as MetricType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Metric Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MetricType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-6">
        <Select
          value={metric.rangeOption || ''}
          onValueChange={(v) => updateMetric(index, "rangeOption", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {MetricRangeOptions[metric.type]?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeMetric(index)}
          aria-label="Remove metric"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Component for feature selection with value options
  const FeatureSelector = ({ 
    index, 
    feature
  }: { 
    index: number; 
    feature: FeatureInput;
  }) => (
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-4">
        <Select
          value={feature.type}
          onValueChange={(v) => updateFeature(index, "type", v as FeatureType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Feature Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FeatureType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-6">
        <Select
          value={feature.valueOption || ''}
          onValueChange={(v) => updateFeature(index, "valueOption", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Value" />
          </SelectTrigger>
          <SelectContent>
            {FeatureValueOptions[feature.type]?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFeature(index)}
          aria-label="Remove feature"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCampaignForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Start New Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Summer 2024 Outreach"
              />
            </div>

            {/* Plan and Region */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan *</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(v) => setFormData({ ...formData, plan: v as CampaignPlan })}
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="HALF_YEARLY">Half-Yearly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(v) => setFormData({ ...formData, region: v as Region })}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORTH">North</SelectItem>
                    <SelectItem value="SOUTH">South</SelectItem>
                    <SelectItem value="EAST">East</SelectItem>
                    <SelectItem value="WEST">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget and Optimization */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Budget Limit (₹) *</Label>
                <Select
                    value={formData.budgetLimit.toString()}
                    onValueChange={(value) => setFormData({ ...formData, budgetLimit: parseInt(value) })}
                  >
                    <SelectTrigger id="budgetLimit" className="w-full">
                      <SelectValue placeholder="Select budget limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value.toString()}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Select your campaign budget limit</p>
                </div>

              
            </div>

            {/* Event Types */}
            <div className="space-y-2">
              <Label htmlFor="event-types" className="flex items-center">
                Event Types 
                <span className="text-red-500 ml-1 font-bold">*</span>
              </Label>
              <SimpleMultiSelect
                options={eventTypeOptions}
                selected={formData.eventTypes}
                onChange={(selected) => {
                  console.log("[DEBUG] Event types selected:", selected);
                  setFormData({ ...formData, eventTypes: selected });
                }}
                placeholder="Select event types..."
              />
              {formData.eventTypes.length === 0 && (
                <p className="text-sm text-red-500">
                  Please select at least one event type
                </p>
              )}
            </div>

            {/* Bundle Size */}
            <div className="space-y-2">
              <Label htmlFor="bundle-size">Bundle Size (Number of Events you want to sponsor) *</Label>
              <Input
                id="bundle-size"
                type="number"
                min="1"
                max="10"
                value={formData.bundleSize}
                onChange={(e) => {
                  // Add validation to limit the value to 10
                  const value = parseInt(e.target.value);
                  if (value > 10) {
                    toast.error("Maximum bundle size is 10 events");
                    setFormData({ ...formData, bundleSize: 10 });
                  } else {
                    setFormData({ ...formData, bundleSize: value });
                  }
                }}
              />
              <p className="text-xs text-gray-500">Maximum of 10 events per bundle</p>
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Metrics Requirements</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="h-4 w-4 mr-2" /> Add Metric
                </Button>
              </div>

              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <MetricRangeSelector
                    key={index}
                    index={index}
                    metric={metric}
                  />
                ))}
              </div>

              {metrics.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  Add metrics to define what you need from colleges
                </p>
              )}
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Required Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <FeatureSelector
                    key={index}
                    index={index}
                    feature={feature}
                  />
                ))}
              </div>

              {features.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  Add features to specify additional requirements
                </p>
              )}
            </div>
          </div>

          {preSelectedCollegeId && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Youve selected a specific college for this campaign. Well prioritize this college
                when creating bundle suggestions.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate Campaign Bundles
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderBundles = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Suggested Bundles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle) => (
          <BundleDisplay
            key={bundle.id}
            bundle={bundle}
            metrics={metrics}
            onSelect={selectBundle}
          />
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          ← Back to Dashboard
        </Button>

        {bundles.length === 0 ? renderCampaignForm() : renderBundles()}
      </div>
    </div>
  );
}