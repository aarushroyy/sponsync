// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// //import Link from "next/link";

// interface CollegeEvent {
//   id: string;
//   eventType: string;
//   region: string;
//   posterUrl: string | null;
//   college: {
//     collegeName: string;
//     eventName: string;
//   };
// }

// interface Campaign {
//   id: string;
//   name: string;
//   plan: string;
//   region: string;
//   eventTypes: string[];
//   bundleSize: number;
//   status: string;
//   createdAt: string;
//   metrics: { key: string; value: number }[];
//   features: { name: string; value: string }[];
//   bundles: { id: string; name: string; size: number }[];
// }

// export default function CompanyDashboardPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("colleges");

//   const fetchDashboardData = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("Not authenticated");
//     }

//     const res = await fetch("/api/company/dashboard", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || "Failed to load dashboard");
//     }

//     return res.json();
//   };

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["companyDashboard"],
//     queryFn: fetchDashboardData,
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/company/login");
//     }
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <p className="ml-2">Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Alert variant="destructive" className="max-w-md">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             {error instanceof Error ? error.message : "Failed to load dashboard"}
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   const collegeEvents: CollegeEvent[] = data?.collegeEvents || [];
//   const activeCampaigns: Campaign[] = data?.activeCampaigns || [];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Company Dashboard</h1>
//           <p className="text-gray-600">Manage your campaigns and discover college events</p>
//         </div>

//         <div className="mb-6 flex justify-end space-x-4">
//           <Button onClick={() => router.push("/company/campaigns/new")}>
//             Start Campaign
//           </Button>
//           <Button variant="outline" onClick={() => router.push("/company/campaigns")}>
//             Your Progress
//           </Button>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="mb-6">
//             <TabsTrigger value="colleges">College Events</TabsTrigger>
//             <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
//           </TabsList>

//           <TabsContent value="colleges" className="space-y-6">
//             <h2 className="text-xl font-semibold mb-4">Available College Events</h2>
            
//             {collegeEvents.length === 0 ? (
//               <div className="text-center p-12 border rounded-lg bg-white">
//                 <p className="text-gray-500">No college events available at the moment.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {collegeEvents.map((event) => (
//                   <Card key={event.id} className="overflow-hidden">
//                     <div className="h-48 bg-gray-200 relative">
//                       {event.posterUrl ? (
//                         <img 
//                           src={event.posterUrl} 
//                           alt={event.college.eventName} 
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                           <p className="text-gray-500">No poster available</p>
//                         </div>
//                       )}
//                       <Badge className="absolute top-2 right-2">{event.region}</Badge>
//                     </div>
//                     <CardHeader>
//                       <CardTitle>{event.college.eventName}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-2">
//                         <span className="font-medium">College:</span> {event.college.collegeName}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium">Event Type:</span> {event.eventType}
//                       </p>
//                     </CardContent>
//                     <CardFooter>
//                       <Button 
//                         variant="outline" 
//                         className="w-full"
//                         onClick={() => router.push(`/company/colleges/${event.id}`)}
//                       >
//                         View Details
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="campaigns" className="space-y-6">
//             <h2 className="text-xl font-semibold mb-4">Your Active Campaigns</h2>
            
//             {activeCampaigns.length === 0 ? (
//               <div className="text-center p-12 border rounded-lg bg-white">
//                 <p className="text-gray-500">You dont have any active campaigns.</p>
//                 <Button 
//                   variant="default" 
//                   className="mt-4"
//                   onClick={() => router.push("/company/campaigns/new")}
//                 >
//                   Start a New Campaign
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {activeCampaigns.map((campaign) => (
//                   <Card key={campaign.id}>
//                     <CardHeader>
//                       <div className="flex justify-between items-center">
//                         <CardTitle>{campaign.name}</CardTitle>
//                         <Badge>{campaign.status}</Badge>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <p className="text-sm">
//                           <span className="font-medium">Plan:</span> {campaign.plan}
//                         </p>
//                         <p className="text-sm">
//                           <span className="font-medium">Region:</span> {campaign.region}
//                         </p>
//                         <p className="text-sm">
//                           <span className="font-medium">Event Types:</span> {campaign.eventTypes.join(", ")}
//                         </p>
//                         <p className="text-sm">
//                           <span className="font-medium">Bundle Size:</span> {campaign.bundleSize}
//                         </p>
//                         <p className="text-sm">
//                           <span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button 
//                         className="w-full"
//                         onClick={() => router.push(`/company/campaigns/${campaign.id}`)}
//                       >
//                         View Campaign
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, PlusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CollegeDetailModal from "@/components/college/CollegeDetailModal";

interface CollegeEvent {
  id: string;
  eventType: string;
  region: string;
  posterUrl: string | null;
  college: {
    collegeName: string;
    eventName: string;
  };
  packageConfigs: Array<{
    tier: string;
    metrics: Array<{
      type: string;
      enabled: boolean;
      minValue: number | null;
      maxValue: number | null;
    }>;
    features: Array<{
      type: string;
      enabled: boolean;
    }>;
    estimatedAmount?: number;
  }>;
}

interface Campaign {
  id: string;
  name: string;
  plan: string;
  region: string;
  eventTypes: string[];
  bundleSize: number;
  status: string;
  createdAt: string;
  metrics: { type: string; minValue: number | null; maxValue: number | null }[];
  features: { type: string; enabled: boolean }[];
  bundles: { id: string; name: string; collegeIds: string[] }[];
  totalValue?: number;
}

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("colleges");
  const [selectedCollege, setSelectedCollege] = useState<CollegeEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/company/dashboard", {
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
    queryKey: ["companyDashboard"],
    queryFn: fetchDashboardData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/company/login");
    }
  }, [router]);

  const handleViewCollege = (college: CollegeEvent) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
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

  const collegeEvents: CollegeEvent[] = data?.collegeEvents || [];
  const activeCampaigns: Campaign[] = data?.activeCampaigns || [];

  // Calculate total investment across all campaigns
  const totalInvestment = activeCampaigns.reduce((sum, campaign) => sum + (campaign.totalValue || 0), 0);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-600">Manage your campaigns and discover college events</p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                  <h3 className="text-2xl font-bold">{activeCampaigns.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Events</p>
                  <h3 className="text-2xl font-bold">{collegeEvents.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Investment</p>
                  <h3 className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex justify-end space-x-4">
          <Button onClick={() => router.push("/company/campaigns/new")}>
            Start Campaign
          </Button>
          <Button variant="outline" onClick={() => router.push("/company/campaigns")}>
            View Progress
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="colleges">College Events</TabsTrigger>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="colleges" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Available College Events</h2>
            
            {collegeEvents.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">No college events available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collegeEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="h-48 bg-gray-200 relative">
                      {event.posterUrl ? (
                        <img 
                          src={event.posterUrl} 
                          alt={event.college.eventName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <p className="text-gray-500">No poster available</p>
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">{event.region}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{event.college.eventName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">College:</span> {event.college.collegeName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Event Type:</span> {event.eventType}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Packages:</span>
                        <span className="ml-2 text-sm">
                          {event.packageConfigs
                            ?.map(pkg => pkg.tier)
                            .sort((a, b) => {
                              const order = { GOLD: 1, SILVER: 2, BRONZE: 3 };
                              return order[a as keyof typeof order] - order[b as keyof typeof order];
                            })
                            .join(', ')}
                        </span>
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewCollege(event)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Active Campaigns</h2>
            
            {activeCampaigns.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <p className="text-gray-500">You dont have any active campaigns.</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => router.push("/company/campaigns/new")}
                >
                  Start a New Campaign
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge>{campaign.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Plan:</span> {campaign.plan}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Region:</span> {campaign.region}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Event Types:</span> {campaign.eventTypes.join(", ")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Bundle Size:</span> {campaign.bundleSize}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-bold mt-2">
                          Investment: ₹{campaign.totalValue?.toLocaleString() || 'Not specified'}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/company/campaigns/${campaign.id}`)}
                      >
                        View Campaign
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* College Detail Modal */}
      {selectedCollege && (
        <CollegeDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          college={selectedCollege as any}
        />
      )}
    </div>
  );
}