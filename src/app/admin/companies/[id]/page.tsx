"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Mail, Phone, User, Briefcase, Calendar, ArrowRightCircle } from "lucide-react";

interface CampaignMetric {
  id: string;
  type: string;
  minValue: number | null;
  maxValue: number | null;
  rangeOption: string | null;
}

interface CampaignFeature {
  id: string;
  type: string;
  enabled: boolean;
  valueOption: string | null;
}

interface Bundle {
  id: string;
  name: string;
  status: string;
  collegeIds: string[];
  totalValue: number | null;
}

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
  metrics: CampaignMetric[];
  features: CampaignFeature[];
  bundles: Bundle[];
}

interface Company {
  id: string;
  personName: string;
  companyName: string;
  position: string;
  email: string;
  phone: string;
  workEmail: string | null;
  linkedin: string | null;
  isVerified: boolean;
  createdAt: string;
  campaigns: Campaign[];
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/auth/admin/login");
    }
  }, [router]);

  const fetchCompany = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch('/api/admin/companies/' + params.id, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load company");
    }

    return res.json();
  };

  const { data: company, isLoading, error } = useQuery<Company>({
    queryKey: ["company", params.id],
    queryFn: fetchCompany,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !company) {
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
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Company</h2>
                <p className="text-gray-600">{error instanceof Error ? error.message : "Company not found"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activeCampaigns = company.campaigns.filter(c => c.status === "ACTIVE").length;
  const totalRevenue = company.campaigns.reduce((sum, campaign) => {
    return sum + campaign.bundles.reduce((bundleSum, bundle) => bundleSum + (bundle.totalValue || 0), 0);
  }, 0);

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
          <Badge variant={company.isVerified ? "default" : "secondary"}>
            {company.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{company.companyName}</CardTitle>
              <CardDescription className="flex items-center text-base">
                <Briefcase className="mr-2 h-4 w-4" />
                Corporate Partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Contact Person Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{company.personName}</span>
                    <span className="text-sm text-gray-500">({company.position})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{company.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-4">
                  {company.workEmail && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Work Email: {company.workEmail}</span>
                    </div>
                  )}
                  {company.linkedin && (
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      <a 
                        href={company.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Joined: {new Date(company.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArrowRightCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                    <h3 className="text-3xl font-bold text-gray-900">{activeCampaigns}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                    <h3 className="text-3xl font-bold text-gray-900">{company.campaigns.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-900">₹{(totalRevenue / 100000).toFixed(2)}L</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Company Campaigns</CardTitle>
              <CardDescription>All sponsorship campaigns by {company.companyName}</CardDescription>
            </CardHeader>
            <CardContent>
              {company.campaigns.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No campaigns created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {company.campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">{campaign.plan}</Badge>
                          <Badge 
                            variant={
                              campaign.status === "ACTIVE" ? "default" :
                              campaign.status === "COMPLETED" ? "secondary" : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 md:mt-0 space-y-2">
                        <p className="text-sm">Bundle Size: {campaign.bundleSize} colleges</p>
                        <p className="text-sm">Active Bundles: {campaign.bundles.filter(b => b.status === "ACCEPTED").length}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-4 md:mt-0"
                        onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                      >
                        View Campaign
                      </Button>
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
