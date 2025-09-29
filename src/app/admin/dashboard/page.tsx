"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, X, UserCheck, BuildingIcon, Users, DollarSign, ArrowRightCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  posterUrl: string | null;
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

interface Bundle {
  id: string;
  name: string;
  status: string;
  campaign: {
    name: string;
    company: string;
  };
  hasSpoc: boolean;
}

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

interface AdminDashboardData {
  pendingSpocs: SpocUser[];
  colleges: CollegeUser[];
  companies: CompanyUser[];
  campaigns: Campaign[];
  contactQueries: ContactQuery[];
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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSpoc, setSelectedSpoc] = useState<SpocUser | null>(null);
  const [idCardPreviewOpen, setIdCardPreviewOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(false);

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

  // Fetch bundles that need SPOC assignment
  const fetchBundles = async () => {
    setBundlesLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("/api/admin/bundles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load bundles");
      }

      const bundleData = await res.json();
      setBundles(bundleData.bundles || []);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast.error("Failed to load pending bundles");
    } finally {
      setBundlesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bundles") {
      fetchBundles();
    }
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/auth/admin/login");
    }
    
    // Handle tab parameter from URL
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [router, searchParams]);

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
      if (idCardPreviewOpen) {
        setIdCardPreviewOpen(false);
      }
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
      if (idCardPreviewOpen) {
        setIdCardPreviewOpen(false);
      }
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

  const handleUpdateQueryStatus = async (queryId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const res = await fetch(`/api/admin/contacts/${queryId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update query status");
      }
      
      toast.success("Query status updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating query status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update query status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  const dashboardData: AdminDashboardData = data;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to SponSync Admin</h1>
        <p className="text-gray-500 mt-2">Manage your platform's operations and monitor key metrics</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none p-0">
            <div className="flex overflow-x-auto">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Overview</TabsTrigger>
              <TabsTrigger value="spocs" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Pending SPOCs</TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Contact Queries</TabsTrigger>
              <TabsTrigger value="bundles" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Bundles</TabsTrigger>
              <TabsTrigger value="colleges" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Colleges</TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Companies</TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none px-4">Campaigns</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* College Stats */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <BuildingIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Colleges</p>
                        <h3 className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalColleges}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Stats */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Companies</p>
                        <h3 className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalCompanies}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Stats */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900">₹{(dashboardData.stats.totalRevenue / 100000).toFixed(2)}L</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Campaigns */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <ArrowRightCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                        <h3 className="text-3xl font-bold text-gray-900">{dashboardData.stats.activeCampaigns}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Overview Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pending Approvals */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">Pending Approvals</CardTitle>
                    <CardDescription>SPOC verifications requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                          <UserCheck className="h-8 w-8 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-4xl font-bold text-gray-900">{dashboardData.stats.pendingApprovals}</h4>
                          <p className="text-sm text-gray-500">Pending verifications</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab("spocs")}
                        className="ml-auto"
                      >
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Contact Queries</CardTitle>
                    <CardDescription>Latest inquiries from users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <BuildingIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-4xl font-bold text-gray-900">{dashboardData.contactQueries?.length || 0}</h4>
                          <p className="text-sm text-gray-500">New messages</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab("contacts")}
                        className="ml-auto"
                      >
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                  <p className="text-gray-500">Manage SPOC assignments from the Bundles tab</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setActiveTab("bundles")}
                  >
                    Go to Bundles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Contact Queries</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Email</th>
                        <th className="py-3 px-4 text-left font-medium">Message</th>
                        <th className="py-3 px-4 text-left font-medium">Status / Action</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.contactQueries.map((query) => (
                        <tr key={query.id} className="border-b">
                          <td className="py-3 px-4">{query.name}</td>
                          <td className="py-3 px-4">{query.email}</td>
                          <td className="py-3 px-4 max-w-md">
                            <div className="break-words whitespace-pre-wrap">{query.message}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Badge variant={query.status === "PENDING" ? "secondary" : "default"}>
                                {query.status}
                              </Badge>
                              {query.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQueryStatus(query.id, "RESOLVED")}
                                  className="h-6 px-2 text-xs"
                                >
                                  ✓
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(query.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {dashboardData.contactQueries.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No contact queries found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bundles Requiring SPOC Assignment</CardTitle>
                  <CardDescription>
                    Assign SPOCs to verify sponsorship bundles
                  </CardDescription>
                </div>
                <Button onClick={() => fetchBundles()}>
                  Refresh Bundles
                </Button>
              </CardHeader>
              <CardContent>
                {bundlesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    {!bundles || bundles.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No bundles pending SPOC assignment</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bundles.map((bundle) => (
                          <Card key={bundle.id} className={bundle.hasSpoc ? "border-green-500/20" : "border-yellow-500/20"}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                              <div>
                                <CardTitle>{bundle.name}</CardTitle>
                                <p className="text-sm text-gray-500">{bundle.campaign.name} - {bundle.campaign.company}</p>
                              </div>
                              <Badge
                                className={
                                  bundle.hasSpoc ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {bundle.hasSpoc ? "SPOC Assigned" : "Needs Assignment"}
                              </Badge>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-end">
                                <Button
                                  variant={bundle.hasSpoc ? "outline" : "default"}
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => router.push(`/admin/bundles/${bundle.id}/assign-spoc`)}
                                  disabled={bundle.hasSpoc}
                                >
                                  {bundle.hasSpoc ? (
                                    "Already Assigned"
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Assign SPOC
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
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
                            {college.posterUrl && (
                              <Badge variant="outline" className="text-blue-600 border-blue-300">Poster Available</Badge>
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
                            className="flex items-center"
                            onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                          >
                            <ArrowRightCircle className="mr-2 h-4 w-4" />
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