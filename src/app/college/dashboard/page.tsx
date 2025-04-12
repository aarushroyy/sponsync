"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, CheckCircle, FileBarChart, Users, Award, Layers } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types for our data
interface PackageMetric {
  type: string;
  enabled: boolean;
  minValue: number | null;
  maxValue: number | null;
  currentValue?: number; // For tracking progress
}

interface PackageFeature {
  type: string;
  enabled: boolean;
}

interface Package {
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  metrics: PackageMetric[];
  features: PackageFeature[];
}

interface Sponsorship {
  id: string;
  companyName: string;
  companyLogo?: string;
  packageTier: 'BRONZE' | 'SILVER' | 'GOLD';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  startDate: string;
  endDate: string;
  metrics: {
    type: string;
    target: number;
    current: number;
  }[];
}

interface CollegeDashboardData {
  college: {
    id: string;
    name: string;
    collegeName: string;
    eventName: string;
    region: string;
    eventType: string;
    posterUrl: string | null;
  };
  packages: Package[];
  sponsorships: Sponsorship[];
  stats: {
    totalRaised: number;
    activeSponsors: number;
    pendingSponsors: number;
    completedSponsors: number;
  };
}

export default function CollegeDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/college/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load dashboard");
    }

    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["collegeDashboard"],
    queryFn: fetchDashboardData,
    refetchInterval: 60000, // Refetch every minute to keep metrics updated
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/college/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load dashboard"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const dashboardData: CollegeDashboardData = data;
  console.log("dash data",dashboardData);
  console.log("college:",dashboardData.college);


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{dashboardData.college.eventName} Dashboard</h1>
          <p className="text-gray-600">{dashboardData.college.collegeName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileBarChart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Raised</p>
                  <h3 className="text-2xl font-bold">₹{dashboardData.stats.totalRaised.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Sponsors</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.activeSponsors}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Sponsors</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.pendingSponsors}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Sponsors</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.completedSponsors}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sponsorships">Active Sponsorships</TabsTrigger>
            <TabsTrigger value="packages">Package Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Event Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event Name:</span>
                        <span className="font-medium">{dashboardData.college.eventName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">College:</span>
                        <span className="font-medium">{dashboardData.college.collegeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Region:</span>
                        <span className="font-medium">{dashboardData.college.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event Type:</span>
                        <span className="font-medium">{dashboardData.college.eventType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {dashboardData.college.posterUrl ? (
                      <div className="aspect-video rounded-md overflow-hidden">
                        <img 
                          src={dashboardData.college.posterUrl} 
                          alt={dashboardData.college.eventName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-md bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No poster uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sponsorship Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.sponsorships.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No active sponsorships yet.</p>
                      <p className="text-sm text-gray-400 mt-2">Companies will be able to select your event based on your package details.</p>
                    </div>
                  ) : (
                    dashboardData.sponsorships.slice(0, 3).map((sponsorship) => (
                      <div key={sponsorship.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-medium">{sponsorship.companyName}</h3>
                            <div className="flex space-x-2 mt-1">
                              <Badge>{sponsorship.packageTier}</Badge>
                              <Badge variant={
                                sponsorship.status === 'ACTIVE' ? 'default' :
                                sponsorship.status === 'COMPLETED' ? 'secondary' : 'outline'
                              }>
                                {sponsorship.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(sponsorship.startDate).toLocaleDateString()} - {new Date(sponsorship.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {sponsorship.metrics.map((metric, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{metric.type}</span>
                                <span className="text-sm font-medium">{metric.current} / {metric.target}</span>
                              </div>
                              <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {dashboardData.sponsorships.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("sponsorships")}>
                      View All Sponsorships
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsorships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Sponsorships</CardTitle>
                <CardDescription>Track and manage your sponsorship commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.sponsorships.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No active sponsorships yet.</p>
                    </div>
                  ) : (
                    dashboardData.sponsorships.map((sponsorship) => (
                      <div key={sponsorship.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-medium">{sponsorship.companyName}</h3>
                            <div className="flex space-x-2 mt-1">
                              <Badge>{sponsorship.packageTier}</Badge>
                              <Badge variant={
                                sponsorship.status === 'ACTIVE' ? 'default' :
                                sponsorship.status === 'COMPLETED' ? 'secondary' : 'outline'
                              }>
                                {sponsorship.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/college/sponsorships/${sponsorship.id}`)}>
                            Manage
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Timeline</h4>
                            <div className="text-sm text-gray-500">
                              {new Date(sponsorship.startDate).toLocaleDateString()} - {new Date(sponsorship.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Metrics Progress</h4>
                            <div className="space-y-2">
                              {sponsorship.metrics.map((metric, idx) => (
                                <div key={idx}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm">{metric.type}</span>
                                    <span className="text-sm font-medium">{metric.current} / {metric.target}</span>
                                  </div>
                                  <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.packages.map((pkg) => (
                <Card key={pkg.tier} className={
                  pkg.tier === 'GOLD' ? 'border-yellow-400' :
                  pkg.tier === 'SILVER' ? 'border-gray-400' :
                  'border-amber-700'
                }>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {pkg.tier.charAt(0) + pkg.tier.slice(1).toLowerCase()} Package
                      <Badge className={
                        pkg.tier === 'GOLD' ? 'bg-yellow-400 text-yellow-900' :
                        pkg.tier === 'SILVER' ? 'bg-gray-400 text-gray-900' :
                        'bg-amber-700 text-white'
                      }>
                        {pkg.tier}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Metrics</h3>
                        <div className="space-y-2">
                          {pkg.metrics.map((metric, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm">{metric.type}</span>
                              {metric.enabled ? (
                                <span className="text-sm font-medium">
                                  {metric.minValue === metric.maxValue ? 
                                    metric.minValue : 
                                    `${metric.minValue} - ${metric.maxValue}`}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">Not offered</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Features</h3>
                        <div className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              {feature.enabled ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-gray-300" />
                              )}
                              <span className="text-sm">
                                {feature.type.replace(/_/g, ' ').toLowerCase()
                                  .split(' ')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => router.push(`/college/packages/edit/${pkg.tier}`)}>
                      Edit Package
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}