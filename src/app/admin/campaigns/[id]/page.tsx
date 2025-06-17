"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  plan: string;
  regions: string[];
  eventTypes: string[];
  bundleSize: number;
  budgetLimit: number | null;
  status: string;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    personName: string;
    email: string;
    phone: string;
    position: string;
  };
  metrics: Array<{
    id: string;
    type: string;
    minValue: number | null;
    maxValue: number | null;
    rangeOption: string | null;
  }>;
  features: Array<{
    id: string;
    type: string;
    enabled: boolean;
    valueOption: string | null;
  }>;
  bundles: Array<{
    id: string;
    name: string;
    status: string;
    collegeIds: string[];
    totalValue: number | null;
  }>;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/auth/admin/login");
    }
  }, [router]);

  const fetchCampaign = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch('/api/admin/campaigns/' + params.id, {      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load campaign");
    }

    return res.json();
  };

  const { data: campaign, isLoading, error } = useQuery<Campaign>({
    queryKey: ["campaign", params.id],
    queryFn: fetchCampaign,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/admin/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Campaign</h2>
                <p className="text-gray-600">{error instanceof Error ? error.message : "Campaign not found"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Badge 
            variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
            className="text-sm"
          >
            {campaign.status}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              <CardDescription className="flex items-center text-base">
                <Building className="mr-2 h-4 w-4" />
                {campaign.company.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">{campaign.plan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Bundle Size</p>
                  <p className="font-medium">{campaign.bundleSize} colleges</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Budget Limit</p>
                  <p className="font-medium">₹{campaign.budgetLimit?.toLocaleString() || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">{campaign.company.personName}</p>
                  <p className="text-sm text-gray-500">{campaign.company.position}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Contact Details</p>
                  <p className="font-medium">{campaign.company.email}</p>
                  <p className="text-sm">{campaign.company.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Requirements */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.metrics.map((metric) => (
                    <div key={metric.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{metric.type.replace(/_/g, " ")}</p>
                        <p className="text-sm text-gray-500">
                          {metric.rangeOption || (metric.minValue === null ? "Not specified" : metric.minValue + (metric.maxValue ? ` - ${metric.maxValue}` : "+"))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.features.map((feature) => (
                    <div key={feature.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{feature.type.replace(/_/g, " ")}</p>
                        {feature.valueOption && (
                          <p className="text-sm text-gray-500">{feature.valueOption}</p>
                        )}
                      </div>
                      <Badge variant={feature.enabled ? "default" : "secondary"}>
                        {feature.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Bundles */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Bundles</CardTitle>
              <CardDescription>Active bundles in this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              {campaign.bundles.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No bundles created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.bundles.map((bundle) => (
                    <div key={bundle.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bundle.name}</p>
                        <p className="text-sm text-gray-500">{bundle.collegeIds.length} colleges</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">₹{bundle.totalValue?.toLocaleString() || "TBD"}</p>
                        <Badge variant={
                          bundle.status === "ACCEPTED" ? "default" :
                          bundle.status === "PENDING" ? "secondary" : "outline"
                        }>
                          {bundle.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
