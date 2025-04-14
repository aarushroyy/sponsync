// // src/app/company/campaigns/[campaignId]/page.tsx
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { Loader2, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";

// export default function CampaignDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const campaignId = params.campaignId as string;
  
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["campaign", campaignId],
//     queryFn: async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       const res = await fetch(`/api/company/campaigns/${campaignId}/bundles`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to load campaign");
//       }

//       return res.json();
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <p className="ml-2">Loading campaign details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Alert variant="destructive" className="max-w-md">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             {error instanceof Error ? error.message : "Failed to load campaign"}
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <Button
//           variant="ghost"
//           className="mb-6"
//           onClick={() => router.push("/company/dashboard")}
//         >
//           ← Back to Dashboard
//         </Button>
        
//         <h1 className="text-3xl font-bold mb-6">Campaign Details</h1>
        
//         {/* Render campaign details here from data */}
//         <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, AlertCircle, ArrowLeft, Calendar, Users, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Define types for the data
interface College {
  id: string;
  collegeName: string;
  eventName: string;
  eventType: string;
  packageTier?: string;
  estimatedAmount?: number;
  score?: number;
}

interface Bundle {
  id: string;
  name: string;
  campaignId: string;
  collegeIds: string[];
  status: string;
  totalValue: number;
  collegeDetails?: College[];
  totalMetrics?: Record<string, number>;
  fulfillmentPercentages?: Record<string, number>;
  roi?: number;
}

interface Metric {
  type: string;
  minValue: number | null;
  maxValue: number | null;
  rangeOption?: string | null;
}

interface Feature {
  type: string;
  enabled: boolean;
  valueOption?: string | null;
}

interface Campaign {
  id: string;
  name: string;
  plan: string;
  region: string;
  eventTypes: string[];
  bundleSize: number;
  status: string;
  budgetLimit: number;
  createdAt: string;
  updatedAt: string;
  metrics: Metric[];
  features: Feature[];
}

interface CampaignData {
  campaign: Campaign;
  bundles: Bundle[];
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;
  
  // Fetch campaign details including bundles
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const campaignRes = await fetch(`/api/company/campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bundlesRes = await fetch(`/api/company/campaigns/${campaignId}/bundles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!campaignRes.ok || !bundlesRes.ok) {
        const errorText = await campaignRes.text();
        throw new Error(errorText || "Failed to load campaign");
      }

      const campaignData = await campaignRes.json();
      const bundlesData = await bundlesRes.json();

      return {
        campaign: campaignData.campaign,
        bundles: bundlesData.bundles || [],
      } as CampaignData;
    },
  });

  const confirmBundleMutation = useMutation({
    mutationFn: async (bundleId: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
  
      const res = await fetch(`/api/company/campaigns/${campaignId}/bundles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bundleId, action: "confirm" }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to confirm bundle");
      }
  
      return res.json();
    },
    onSuccess: () => {
      toast.success("Bundle confirmed successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to confirm bundle");
    }
  });
  

  // Mutation for selecting a bundle
  // const selectBundleMutation = useMutation({
  //   mutationFn: async (bundleId: string) => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("Not authenticated");
  //     }

  //     const res = await fetch(`/api/company/campaigns/${campaignId}/bundles`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ bundleId, action: "select" }),
  //     });

  //     if (!res.ok) {
  //       const error = await res.json();
  //       throw new Error(error.message || "Failed to select bundle");
  //     }

  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     toast.success("Bundle selected successfully!");
  //     refetch();
  //   },
  //   onError: (error) => {
  //     toast.error(error instanceof Error ? error.message : "Failed to select bundle");
  //   },
  // });

  // const handleSelectBundle = (bundleId: string) => {
  //   if (window.confirm("Are you sure you want to select this bundle? This will finalize your campaign.")) {
  //     selectBundleMutation.mutate(bundleId);
  //   }
  // };

  const handleConfirmBundle = (bundleId: string) => {
    if (window.confirm("Are you sure you want to confirm this bundle? This will finalize your campaign and you won't be able to edit it anymore.")) {
      confirmBundleMutation.mutate(bundleId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading campaign details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load campaign"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { campaign, bundles } = data as CampaignData;
  
  const getColorForPercentage = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 70) return "text-blue-600 bg-blue-100";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push("/company/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-gray-600">{campaign.status} Campaign</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="text-sm">{campaign.plan}</Badge>
            <Badge variant="outline" className="text-sm">{campaign.region}</Badge>
            <Badge variant={
              campaign.status === 'ACTIVE' ? 'default' :
              campaign.status === 'COMPLETED' ? 'secondary' :
              'outline'
            } className="text-sm">
              {campaign.status}
            </Badge>
          </div>
        </div>

        {/* Campaign Details and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Created On</p>
                  <p className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Bundle Size</p>
                  <p className="font-medium">{campaign.bundleSize} Colleges</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget Limit</p>
                  <p className="font-medium">₹{campaign.budgetLimit?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="bundle" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bundle">Selected Bundle</TabsTrigger>
            <TabsTrigger value="requirements">Campaign Requirements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bundle" className="space-y-6">
            {bundles.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-gray-500">No bundle has been created for this campaign yet.</p>
                <Button className="mt-4" onClick={() => router.push("/company/campaigns/new")}>
                  Start a New Campaign
                </Button>
              </div>
            ) : (
              // Find the selected/accepted bundle or default to the first one if none is accepted
              (() => {
                const selectedBundle = bundles.find(b => b.status === 'ACCEPTED') || bundles[0];
                
                return (
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Selected Bundle</CardTitle>
                        <Badge className={
                              campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'
                            }>
                              {campaign.status === 'ACTIVE' ? 'Confirmed' : 'Draft'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {selectedBundle.collegeDetails?.length || 0} colleges • Total Value: ₹{selectedBundle.totalValue?.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Metrics Fulfillment */}
                      {selectedBundle.totalMetrics && (
                        <div>
                          <h3 className="font-medium mb-2">Metrics Fulfillment:</h3>
                          <div className="space-y-2">
                            {Object.entries(selectedBundle.totalMetrics).map(([type, value]) => {
                              const percentage = selectedBundle.fulfillmentPercentages?.[type] || 0;
                              return (
                                <div key={type} className="grid grid-cols-7 gap-2 items-center">
                                  <span className="col-span-2 text-sm font-medium">
                                    {type.replace(/_/g, ' ')}:
                                  </span>
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
                      )}
                      
                      {/* Colleges in this bundle */}
                      <div>
                        <h3 className="font-medium mb-2">Colleges:</h3>
                        <div className="space-y-2">
                          {selectedBundle.collegeDetails?.map((college) => (
                            <div key={college.id} className="flex justify-between items-center p-2 rounded bg-gray-50">
                              <div>
                                <div className="font-medium">{college.collegeName}</div>
                                <div className="text-sm text-gray-600">
                                  {college.eventName} ({college.eventType})
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                {college.packageTier && (
                                  <Badge variant="outline">{college.packageTier}</Badge>
                                )}
                                {college.estimatedAmount && (
                                  <span className="text-sm font-semibold mt-1">
                                    ₹{college.estimatedAmount.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* ROI Score */}
                      {selectedBundle.roi && (
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">ROI Score:</span>
                            <Badge variant="outline" className="bg-blue-50">
                              {selectedBundle.roi.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex gap-3">
          {campaign.status !== 'ACTIVE' ? (
            <>
              <Button 
                className="flex-1"
                onClick={() => handleConfirmBundle(selectedBundle.id)}
                disabled={confirmBundleMutation.isPending}
              >
                {confirmBundleMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  "Confirm Bundle"
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push(`/company/campaigns/${campaignId}/edit-bundle/${selectedBundle.id}`)}
              >
                Edit Bundle
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Campaign Active (No Edits Allowed)
            </Button>
          )}
        </CardFooter>
                  </Card>
                );
              })()
            )}
          </TabsContent>

          
          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Requirements</CardTitle>
                <CardDescription>
                  These are the requirements you specified for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Plan</p>
                      <p className="font-medium">{campaign.plan}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Region</p>
                      <p className="font-medium">{campaign.region}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Event Types</p>
                      <p className="font-medium">{campaign.eventTypes.join(", ")}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Bundle Size</p>
                      <p className="font-medium">{campaign.bundleSize} Colleges</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Budget Limit</p>
                      <p className="font-medium">₹{campaign.budgetLimit?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Metrics Requirements</h3>
                  {campaign.metrics.length === 0 ? (
                    <p className="text-gray-500">No specific metrics requirements.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {campaign.metrics.map((metric, index) => (
                        <div key={index} className="flex justify-between p-2 rounded bg-gray-50">
                          <span className="font-medium">{metric.type.replace(/_/g, ' ')}</span>
                          <span>
                            {metric.rangeOption || `${metric.minValue || 0} - ${metric.maxValue || 'unlimited'}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Required Features</h3>
                  {campaign.features.length === 0 ? (
                    <p className="text-gray-500">No specific feature requirements.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {campaign.features.filter(f => f.enabled).map((feature, index) => (
                        <div key={index} className="flex justify-between p-2 rounded bg-gray-50">
                          <span className="font-medium">{feature.type.replace(/_/g, ' ')}</span>
                          <span>{feature.valueOption || (feature.enabled ? 'Yes' : 'No')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}