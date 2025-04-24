// src/app/spoc/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, CheckCircle, Upload, Camera, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SpocUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isApproved: boolean;
}

interface AssignedCollege {
  id: string;
  collegeName: string;
  eventName: string;
  region: string;
  eventType: string;
  posterUrl?: string;
}

interface SpocAssignment {
  id: string;
  sponsorshipId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  verificationPhotos: string[];
  report: string | null;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  campaignName: string;
  collegeName: string;
  eventName: string;
  eventType: string;
  region: string;
  metrics: {
    type: string;
    target: number;
    current: number;
  }[];
  features: {
    type: string;
    valueOption?: string | null;
  }[];
}

interface SpocDashboardData {
  spoc: SpocUser;
  assignedCollege: AssignedCollege | null;
  assignments: SpocAssignment[];
  stats: {
    pendingCount: number;
    activeCount: number;
    completedCount: number;
    totalEarnings: number;
  };
}

export default function SpocDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/spoc/assignments", {
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
    queryKey: ["spocDashboard"],
    queryFn: fetchDashboardData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "spoc") {
      router.push("/auth/spoc/login");
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

  const dashboardData: SpocDashboardData = data;
  
  // If SPOC is not approved yet, show a message
  if (!dashboardData.spoc.isApproved) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Account Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
                <p>Your SPOC account is still pending approval from administrators.</p>
                <p className="text-sm text-gray-500">
                  Were reviewing your application and will notify you once its approved.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/auth/spoc/login")}
              >
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // If SPOC is not assigned to a college yet
  if (!dashboardData.assignedCollege) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Awaiting Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <AlertCircle className="h-16 w-16 text-blue-500 mx-auto" />
                <p>You havent been assigned to any college events yet.</p>
                <p className="text-sm text-gray-500">
                  An administrator will assign you to verify sponsorships soon.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">SPOC Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {dashboardData.spoc.firstName} {dashboardData.spoc.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.completedCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.activeCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.pendingCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Earnings</p>
                  <h3 className="text-2xl font-bold">₹{dashboardData.stats.totalEarnings}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned College</CardTitle>
              <CardDescription>You are assigned to verify sponsorships for this college</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">College Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">College Name:</span>
                        <span className="font-medium">{dashboardData.assignedCollege.collegeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event Name:</span>
                        <span className="font-medium">{dashboardData.assignedCollege.eventName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Region:</span>
                        <span className="font-medium">{dashboardData.assignedCollege.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event Type:</span>
                        <span className="font-medium">{dashboardData.assignedCollege.eventType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {dashboardData.assignedCollege.posterUrl && (
                  <div className="flex-1">
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img 
                        src={dashboardData.assignedCollege.posterUrl} 
                        alt={dashboardData.assignedCollege.eventName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">All Assignments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {dashboardData.assignments.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">No assignments yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.assignments.map((assignment) => (
                  <Card key={assignment.id} className={
                    assignment.status === 'COMPLETED' ? 'border-green-500/20' :
                    assignment.status === 'ACTIVE' ? 'border-blue-500/20' :
                    'border-yellow-500/20'
                  }>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{assignment.companyName}</CardTitle>
                        <Badge className={
                          assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {assignment.status}
                        </Badge>
                      </div>
                      <CardDescription>{assignment.campaignName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Campaign Progress:</p>
                          {assignment.metrics.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {assignment.metrics.slice(0, 2).map((metric, index) => {
                                const percentage = metric.target > 0 
                                  ? Math.min(100, (metric.current / metric.target) * 100) 
                                  : 0;
                                
                                return (
                                  <div key={index}>
                                    <div className="flex justify-between text-xs">
                                      <span>{metric.type.replace(/_/g, ' ')}</span>
                                      <span>{metric.current} / {metric.target}</span>
                                    </div>
                                    <Progress value={percentage} className="h-1 mt-1" />
                                  </div>
                                );
                              })}
                              {assignment.metrics.length > 2 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  +{assignment.metrics.length - 2} more metrics
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">No metrics defined</p>
                          )}
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created:</span>
                          <span>{new Date(assignment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Photos:</span>
                            <span>{(assignment.verificationPhotos?.length || 0) > 0 ? `${assignment.verificationPhotos.length} uploaded` : 'None'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Report:</span>
                            <span>{assignment.report ? 'Submitted' : 'Not submitted'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push(`/spoc/assignments/${assignment.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'PENDING').length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">No pending assignments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.assignments
                  .filter(a => a.status === 'PENDING')
                  .map((assignment) => (
                    <Card key={assignment.id} className="border-yellow-500/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{assignment.companyName}</CardTitle>
                          <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                        </div>
                        <CardDescription>{assignment.campaignName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm">Verification needed for this sponsorship</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Created:</span>
                            <span>{new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => router.push(`/spoc/assignments/${assignment.id}`)}
                        >
                          Start Verification
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'ACTIVE').length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">No active assignments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.assignments
                  .filter(a => a.status === 'ACTIVE')
                  .map((assignment) => (
                    <Card key={assignment.id} className="border-blue-500/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{assignment.companyName}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">ACTIVE</Badge>
                        </div>
                        <CardDescription>{assignment.campaignName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Campaign Progress:</p>
                            {assignment.metrics.length > 0 ? (
                              <div className="space-y-2 mt-2">
                                {assignment.metrics.slice(0, 2).map((metric, index) => {
                                  const percentage = metric.target > 0 
                                    ? Math.min(100, (metric.current / metric.target) * 100) 
                                    : 0;
                                  
                                  return (
                                    <div key={index}>
                                      <div className="flex justify-between text-xs">
                                        <span>{metric.type.replace(/_/g, ' ')}</span>
                                        <span>{metric.current} / {metric.target}</span>
                                      </div>
                                      <Progress value={percentage} className="h-1 mt-1" />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">No metrics defined</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => router.push(`/spoc/assignments/${assignment.id}`)}
                        >
                          Continue Verification
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'COMPLETED').length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">No completed assignments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.assignments
                  .filter(a => a.status === 'COMPLETED')
                  .map((assignment) => (
                    <Card key={assignment.id} className="border-green-500/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{assignment.companyName}</CardTitle>
                          <Badge className="bg-green-100 text-green-800">COMPLETED</Badge>
                        </div>
                        <CardDescription>{assignment.campaignName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Completed:</span>
                            <span>{new Date(assignment.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Photos:</span>
                            <span>{assignment.verificationPhotos.length} uploaded</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push(`/spoc/assignments/${assignment.id}`)}
                        >
                          View Report
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}