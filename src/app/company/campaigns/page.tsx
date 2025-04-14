"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowLeft, Plus, Calendar, ArrowRightCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Campaign {
  id: string;
  name: string;
  plan: string;
  region: string;
  eventTypes: string[];
  bundleSize: number;
  status: string;
  createdAt: string;
  metrics: { name: string; value: number }[];
  features: { name: string; description: string }[];
  bundles: { id: string; name: string; collegeIds: string[]; status: string; totalValue?: number }[];
  totalValue?: number;
}

export default function CompanyCampaignsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  const fetchCampaignsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/company/campaigns", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load campaigns");
    }

    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["companyCampaigns"],
    queryFn: fetchCampaignsData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/company/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load campaigns"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const campaigns: Campaign[] = data?.campaigns || [];
  
  // Filter campaigns based on status
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');
  const draftCampaigns = campaigns.filter(c => c.status === 'DRAFT');
  const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED');

  // Calculate total investment
  const totalInvestment = campaigns
    .filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED')
    .reduce((sum, campaign) => {
      // Get the accepted bundle value if available
      const acceptedBundle = campaign.bundles?.find(b => b.status === 'ACCEPTED');
      return sum + (acceptedBundle?.totalValue || 0);
    }, 0);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/company/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Campaigns</h1>
            <p className="text-gray-600">Manage and monitor all your sponsorship campaigns</p>
          </div>
          <Button onClick={() => router.push("/company/campaigns/new")}>
            <Plus className="h-4 w-4 mr-2" /> Start New Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                  <h3 className="text-2xl font-bold">{activeCampaigns.length}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Draft Campaigns</p>
                  <h3 className="text-2xl font-bold">{draftCampaigns.length}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Investment</p>
                  <h3 className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeCampaigns.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">You have no active campaigns.</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => router.push("/company/campaigns/new")}
                >
                  Start a New Campaign
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeCampaigns.map((campaign) => {
                  // Find the accepted bundle
                  const acceptedBundle = campaign.bundles?.find(b => b.status === 'ACCEPTED');
                  const numColleges = acceptedBundle?.collegeIds?.length || 0;
                  
                  return (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{campaign.name}</CardTitle>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Plan:</span>
                            <span className="font-medium">{campaign.plan}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Region:</span>
                            <span className="font-medium">{campaign.region}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">College Count:</span>
                            <span className="font-medium">{numColleges}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Investment:</span>
                            <span className="font-bold">₹{acceptedBundle?.totalValue?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Created:</span>
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full flex items-center justify-center" 
                          onClick={() => router.push(`/company/campaigns/${campaign.id}`)}
                        >
                          View Campaign <ArrowRightCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-6">
            {draftCampaigns.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">You have no draft campaigns.</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => router.push("/company/campaigns/new")}
                >
                  Start a New Campaign
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {draftCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Plan:</span>
                          <span className="font-medium">{campaign.plan}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Region:</span>
                          <span className="font-medium">{campaign.region}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Event Types:</span>
                          <span className="font-medium">{campaign.eventTypes.join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Created:</span>
                          <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => router.push(`/company/campaigns/${campaign.id}`)}
                      >
                        Continue Setup
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCampaigns.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">You have no completed campaigns.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedCampaigns.map((campaign) => {
                  const acceptedBundle = campaign.bundles?.find(b => b.status === 'ACCEPTED');
                  const numColleges = acceptedBundle?.collegeIds?.length || 0;
                  
                  return (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{campaign.name}</CardTitle>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Plan:</span>
                            <span className="font-medium">{campaign.plan}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Region:</span>
                            <span className="font-medium">{campaign.region}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">College Count:</span>
                            <span className="font-medium">{numColleges}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Investment:</span>
                            <span className="font-bold">₹{acceptedBundle?.totalValue?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Created:</span>
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline"
                          className="w-full" 
                          onClick={() => router.push(`/company/campaigns/${campaign.id}`)}
                        >
                          View Results
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}