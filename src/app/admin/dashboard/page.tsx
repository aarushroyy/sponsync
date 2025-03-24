"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, X, UserCheck, BuildingIcon, Users, DollarSign, BarChart4 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
//import Image from "next/image";

interface SpocUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  collegeRollNumber: string;
  idCardUrl: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
}

interface CollegeUser {
  id: string;
  name: string;
  collegeName: string;
  eventName: string;
  email: string;
  phone: string;
  region: string;
  eventType: string;
  isVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

interface CompanyUser {
  id: string;
  personName: string;
  companyName: string;
  position: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
}

interface Campaign {
  id: string;
  companyName: string;
  name: string;
  plan: string;
  region: string;
  bundleSize: number;
  status: string;
  totalValue: number;
  createdAt: string;
}

interface AdminDashboardData {
  pendingSpocs: SpocUser[];
  colleges: CollegeUser[];
  companies: CompanyUser[];
  campaigns: Campaign[];
  stats: {
    totalColleges: number;
    totalCompanies: number;
    totalSpocs: number;
    activeCampaigns: number;
    totalRevenue: number;
    pendingApprovals: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSpoc, setSelectedSpoc] = useState<SpocUser | null>(null);
  const [idCardPreviewOpen, setIdCardPreviewOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/admin/dashboard", {
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchDashboardData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/auth/admin/login");
    }
  }, [router]);

  const handleApproveSpoc = async (spocId: string) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const res = await fetch(`/api/admin/spocs/${spocId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to approve SPOC");
      }
      
      toast.success("SPOC approved successfully");
      refetch();
    } catch (error) {
      console.error("Error approving SPOC:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve SPOC");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectSpoc = async (spocId: string) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const res = await fetch(`/api/admin/spocs/${spocId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to reject SPOC");
      }
      
      toast.success("SPOC rejected successfully");
      refetch();
    } catch (error) {
      console.error("Error rejecting SPOC:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject SPOC");
    } finally {
      setProcessing(false);
    }
  };

  const handleAssignSpoc = async () => {
    if (!selectedSpoc || !selectedCollege) return;
    
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const res = await fetch(`/api/admin/spocs/${selectedSpoc.id}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId: selectedCollege,
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign SPOC");
      }
      
      toast.success("SPOC assigned to college successfully");
      setAssignDialogOpen(false);
      setSelectedCollege(null);
      refetch();
    } catch (error) {
      console.error("Error assigning SPOC:", error);
      toast.error(error instanceof Error ? error.message : "Failed to assign SPOC");
    } finally {
      setProcessing(false);
    }
  };

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

  const dashboardData: AdminDashboardData = data;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage colleges, companies, and SPOCs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BuildingIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Colleges</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalColleges}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Companies</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalCompanies}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.pendingApprovals}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart4 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.activeCampaigns}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold">₹{dashboardData.stats.totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">SPOCs</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalSpocs}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spocs">SPOCs Approval</TabsTrigger>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pending Approvals Section */}
            <Card>
              <CardHeader>
                <CardTitle>Pending SPOC Approvals</CardTitle>
                <CardDescription>
                  SPOCs waiting for review and approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.pendingSpocs.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No pending SPOC approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.pendingSpocs.slice(0, 3).map((spoc) => (
                      <div key={spoc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{spoc.firstName} {spoc.lastName}</p>
                          <p className="text-sm text-gray-500">{spoc.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedSpoc(spoc);
                              setIdCardPreviewOpen(true);
                            }}
                          >
                            View ID
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApproveSpoc(spoc.id)}
                            disabled={processing}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dashboardData.pendingSpocs.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("spocs")}>
                      View All ({dashboardData.pendingSpocs.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Campaigns Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  Latest sponsorship campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.campaigns.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No campaigns available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-500">{campaign.companyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge>{campaign.plan}</Badge>
                            <Badge variant="outline">{campaign.region}</Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-bold">₹{campaign.totalValue.toLocaleString()}</p>
                          <Badge 
                            className={
                              campaign.status === 'ACTIVE' ? "bg-green-100 text-green-800" :
                              campaign.status === 'COMPLETED' ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dashboardData.campaigns.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("campaigns")}>
                      View All ({dashboardData.campaigns.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spocs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SPOC Approval Management</CardTitle>
                <CardDescription>
                  Review and approve SPOCs (Single Point of Contact) for colleges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.pendingSpocs.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No pending SPOC approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.pendingSpocs.map((spoc) => (
                      <div key={spoc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{spoc.firstName} {spoc.lastName}</p>
                          <p className="text-sm">{spoc.email}</p>
                          <div className="mt-1">
                            <p className="text-sm text-gray-500">Phone: {spoc.phone}</p>
                            <p className="text-sm text-gray-500">Roll Number: {spoc.collegeRollNumber}</p>
                            <p className="text-sm text-gray-500">Applied: {new Date(spoc.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedSpoc(spoc);
                              setIdCardPreviewOpen(true);
                            }}
                          >
                            View ID
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectSpoc(spoc.id)}
                            disabled={processing}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApproveSpoc(spoc.id)}
                            disabled={processing}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved SPOCs</CardTitle>
                <CardDescription>
                  Assign approved SPOCs to colleges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* This would be a list of already approved SPOCs that need to be assigned */}
                <div className="text-center py-4">
                  <p className="text-gray-500">Approved SPOCs would be listed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colleges" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Colleges</CardTitle>
                  <CardDescription>
                    Manage college registrations and events
                  </CardDescription>
                </div>
                <Button onClick={() => router.push("/admin/colleges/new")}>
                  Add College
                </Button>
              </CardHeader>
              <CardContent>
                {dashboardData.colleges.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No colleges registered</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.colleges.map((college) => (
                      <div key={college.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{college.collegeName}</p>
                          <p className="text-sm">{college.eventName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge>{college.region}</Badge>
                            <Badge variant="outline">{college.eventType}</Badge>
                            {college.onboardingComplete ? (
                              <Badge className="bg-green-100 text-green-800">Onboarded</Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-800">Incomplete</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/admin/colleges/${college.id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCollege(college.id);
                              setAssignDialogOpen(true);
                            }}
                          >
                            Assign SPOC
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Companies</CardTitle>
                  <CardDescription>
                    Manage company registrations and campaigns
                  </CardDescription>
                </div>
                <Button onClick={() => router.push("/admin/companies/new")}>
                  Add Company
                </Button>
              </CardHeader>
              <CardContent>
                {dashboardData.companies.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No companies registered</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.companies.map((company) => (
                      <div key={company.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{company.companyName}</p>
                          <p className="text-sm">{company.personName} - {company.position}</p>
                          <div className="mt-1">
                            <p className="text-sm text-gray-500">Email: {company.email}</p>
                            <p className="text-sm text-gray-500">Phone: {company.phone}</p>
                            <p className="text-sm text-gray-500">Joined: {new Date(company.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/admin/companies/${company.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>
                  Monitor ongoing sponsorship campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.campaigns.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No active campaigns</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm">{campaign.companyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge>{campaign.plan}</Badge>
                            <Badge variant="outline">{campaign.region}</Badge>
                            <Badge 
                              className={
                                campaign.status === 'ACTIVE' ? "bg-green-100 text-green-800" :
                                campaign.status === 'COMPLETED' ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-bold">₹{campaign.totalValue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Bundle Size: {campaign.bundleSize}</p>
                          <p className="text-sm text-gray-500">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ID Card Preview Dialog */}
      <Dialog open={idCardPreviewOpen} onOpenChange={setIdCardPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>SPOC ID Card</DialogTitle>
            <DialogDescription>
              {selectedSpoc && `${selectedSpoc.firstName} ${selectedSpoc.lastName} - ${selectedSpoc.collegeRollNumber}`}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video relative rounded overflow-hidden bg-gray-100">
            {selectedSpoc?.idCardUrl ? (
              <img 
                src={selectedSpoc.idCardUrl} 
                alt="ID Card" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No ID card image available</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIdCardPreviewOpen(false)}
            >
              Close
            </Button>
            <div className="space-x-2">
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedSpoc) {
                    handleRejectSpoc(selectedSpoc.id);
                    setIdCardPreviewOpen(false);
                  }
                }}
                disabled={processing}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  if (selectedSpoc) {
                    handleApproveSpoc(selectedSpoc.id);
                    setIdCardPreviewOpen(false);
                  }
                }}
                disabled={processing}
              >
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign SPOC Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign SPOC to College</DialogTitle>
            <DialogDescription>
              Select a SPOC to assign to this college
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* This would include a dropdown of available SPOCs to assign */}
            <p className="text-center text-gray-500">
              SPOC assignment functionality would be implemented here
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSpoc}
              disabled={!selectedSpoc || !selectedCollege || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign SPOC"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}