"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
// import { toast } from "@/components/ui/sonner";
import { Region, MetricType, FeatureType, CampaignPlan } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { SimpleMultiSelect } from "@/components/ui/simple-multi-select";


interface Bundle {
  id: string;
  name: string;
  status: string;
  campaignId: string;
  colleges: College[];
  totalMetrics: Record<string, number>;
  fulfillmentPercentages?: Record<string, number>;
}

interface MetricInput {
  type: MetricType;
  minValue?: number;
  maxValue?: number;
}

interface FeatureInput {
  type: FeatureType;
  enabled: boolean;
}

interface College {
  id: string;
  collegeName: string;
  eventType: string;
  score?: number; // Add this property, making it optional with the ? symbol
}

interface Bundle {
  id: string;
  name: string;
  status: string;
  campaignId: string;
  colleges: College[];
  totalMetrics: Record<string, number>;
  fulfillmentPercentages?: Record<string, number>; // Add this new property
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
                  <span className="col-span-2 text-sm font-medium">{type}:</span>
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
                <Badge variant="outline">Score: {college.score}</Badge>
              </div>
            ))}
          </div>
        </div>
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
  // const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    plan: "QUARTERLY" as CampaignPlan,
    region: "NORTH" as Region,
    eventTypes: [] as string[],
    bundleSize: 1,
  });
  const [metrics, setMetrics] = useState<MetricInput[]>([]);
  const [features, setFeatures] = useState<FeatureInput[]>([]);

  const eventTypeOptions = [
    { value: "Tech Fest", label: "Tech Fest" },
    { value: "Cultural Fest", label: "Cultural Fest" },
    { value: "Sports Meet", label: "Sports Meet" },
    { value: "Conference", label: "Conference" },
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" },
    { value: "Hackathon", label: "Hackathon" }
  ];

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
      toast.error("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const addMetric = () => {
    setMetrics([...metrics, { type: MetricType.SIGNUPS, minValue: 0, maxValue: 0 }]);
  };

  const updateMetric = (index: number, field: keyof MetricInput, value: number | MetricType) => {
    const newMetrics = [...metrics];
    newMetrics[index][field as keyof MetricInput] = value as never;
    setMetrics(newMetrics);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, { type: FeatureType.ANNOUNCEMENT, enabled: false }]);
  };

  const updateFeature = (index: number, field: keyof FeatureInput, value: boolean | FeatureType) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value as never;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Also add debugging to the selectBundle function

  
  
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
      toast.error("Error: " + (error as Error).message);
    }
  };

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

            {/* Event Types */}
            <div className="space-y-2">
  <Label htmlFor="event-types" className="flex items-center">
    Event Types 
    <span className="text-red-500 ml-1 font-bold">*</span>
  </Label>
              {/* Use SimpleMultiSelect instead of MultiSelect */}
  <SimpleMultiSelect
    options={eventTypeOptions}
    selected={formData.eventTypes}
    onChange={(selected) => {
      console.log("[DEBUG] Event types selected:", selected);
      setFormData({ ...formData, eventTypes: selected });
    }}
    placeholder="Select event types..."
  />
  {/* Show error if no event types selected */}
  {formData.eventTypes.length === 0 && (
    <p className="text-sm text-red-500">
      Please select at least one event type
    </p>
  )}
            </div>

            {/* Bundle Size */}
            <div className="space-y-2">
              <Label htmlFor="bundle-size">Bundle Size (Number of Events) *</Label>
              <Input
                id="bundle-size"
                type="number"
                min="1"
                value={formData.bundleSize}
                onChange={(e) => setFormData({ ...formData, bundleSize: Number(e.target.value) })}
              />
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Metrics Requirements</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="h-4 w-4 mr-2" /> Add Metric
                </Button>
              </div>

              {metrics.map((metric, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
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
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Min Value"
                    value={metric.minValue ?? ""}
                    onChange={(e) => updateMetric(index, "minValue", Number(e.target.value))}
                  />

                  <Input
                    type="number"
                    placeholder="Max Value"
                    value={metric.maxValue ?? ""}
                    onChange={(e) => updateMetric(index, "maxValue", Number(e.target.value))}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMetric(index)}
                    aria-label="Remove metric"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Required Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>

              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
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
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`feature-enabled-${index}`}
                      checked={feature.enabled}
                      onChange={(e) => updateFeature(index, "enabled", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`feature-enabled-${index}`}>Enabled</Label>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    aria-label="Remove feature"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate Campaign Bundles
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // const renderBundles = () => (
  //   <div className="space-y-6">
  //     <h2 className="text-2xl font-bold">Suggested Bundles</h2>
      
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       {bundles.map((bundle) => (
  //         <Card key={bundle.id}>
  //           <CardHeader>
  //             <CardTitle>{bundle.name}</CardTitle>
  //             <div className="flex items-center space-x-2">
  //               <Badge>{bundle.status}</Badge>
  //               <span className="text-sm text-gray-600">
  //                 {bundle.colleges.length} events
  //               </span>
  //             </div>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               <div>
  //                 <h3 className="font-medium mb-2">Included Colleges:</h3>
  //                 <ul className="space-y-2">
  //                   {bundle.colleges.map((college) => (
  //                     <li key={college.id} className="flex items-center space-x-2">
  //                       <span className="text-sm">{college.collegeName}</span>
  //                       <Badge variant="outline">{college.eventType}</Badge>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               </div>

  //               <div>
  //                 <h3 className="font-medium mb-2">Total Metrics:</h3>
  //                 <ul className="space-y-1">
  //                   {Object.entries(bundle.totalMetrics).map(([type, value]) => (
  //                     <li key={type} className="flex justify-between">
  //                       <span className="text-sm">{type}:</span>
  //                       <span className="text-sm font-medium">{value}</span>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               </div>
  //             </div>
  //           </CardContent>
  //           <CardFooter>
  //             <Button
  //               className="w-full"
  //               onClick={() => selectBundle(bundle.id)}
  //               disabled={bundle.status !== "PENDING"}
  //             >
  //               Select This Bundle
  //             </Button>
  //           </CardFooter>
  //         </Card>
  //       ))}
  //     </div>
  //   </div>
  // );

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