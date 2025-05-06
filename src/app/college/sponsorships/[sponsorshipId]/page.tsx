"use client";

// import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, ArrowLeft, Mail, Phone, Building, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
//import { Separator } from "@/components/ui/separator";
//import { toast } from "sonner";
//import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Sponsorship {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  name: string;
  plan: string;
  region: string;
  value: number;
  company: {
    id: string;
    name: string;
    contactPerson: string;
    position: string;
    email: string;
    phone: string;
  };
  metrics: {
    type: string;
    status: string;
    description?: string;
    target?: string | number;
  }[];
  features: {
    type: string;
    enabled: boolean;
    valueOption?: string | null;
  }[];
}

export default function SponsorshipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const sponsorshipId = params.sponsorshipId as string;
  
  // State for metric updates
//   const [metricUpdates, setMetricUpdates] = useState<Record<string, number>>({});
  
  // Fetch sponsorship details
  const { data, isLoading, error } = useQuery({
    queryKey: ["sponsorship", sponsorshipId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/college/sponsorships/${sponsorshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load sponsorship details");
      }

      return res.json();
    },
  });

  // Initialize metric updates when data is loaded
//   useEffect(() => {
//     if (data?.sponsorship) {
//       const initialUpdates: Record<string, number> = {};
//       data.sponsorship.metrics.forEach((metric: Sponsorship["metrics"][number]) => {
//         initialUpdates[metric.type] = metric.current;
//       });
//       setMetricUpdates(initialUpdates);
//     }
//   }, [data]);

  // Mutation for updating metrics
//   const updateMetricsMutation = useMutation({
//     mutationFn: async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       const metricsArray = Object.entries(metricUpdates).map(([type, value]) => ({
//         type,
//         value,
//       }));

//       const res = await fetch(`/api/college/sponsorships/${sponsorshipId}/update-metrics`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ metrics: metricsArray }),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to update metrics");
//       }

//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Metrics updated successfully!");
//       refetch();
//     },
//     onError: (error) => {
//       toast.error(error instanceof Error ? error.message : "Failed to update metrics");
//     },
//   });

//   const handleMetricChange = (type: string, value: number) => {
//     setMetricUpdates(prev => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   const handleUpdateMetrics = () => {
//     updateMetricsMutation.mutate();
//   };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading sponsorship details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load sponsorship details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sponsorship: Sponsorship = data.sponsorship;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push("/college/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{sponsorship.company.name} Sponsorship</h1>
            <p className="text-gray-600">{sponsorship.name} - {sponsorship.plan}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="text-sm">{sponsorship.region}</Badge>
            <Badge variant={
              sponsorship.status === 'ACTIVE' ? 'default' :
              sponsorship.status === 'COMPLETED' ? 'secondary' :
              'outline'
            } className="text-sm">
              {sponsorship.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(sponsorship.startDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{new Date(sponsorship.endDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Sponsorship Value</p>
                <p className="font-medium">₹{sponsorship.value.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{sponsorship.company.name}</p>
                    <p className="text-sm text-gray-500">Company</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{sponsorship.company.contactPerson}</p>
                    <p className="text-sm text-gray-500">{sponsorship.company.position}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{sponsorship.company.email}</p>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{sponsorship.company.phone}</p>
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Tracking</CardTitle>
                <CardDescription>Update the progress for each metric</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
  {sponsorship.metrics.map((metric) => (
    <div key={metric.type}>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={`metric-${metric.type}`} className="font-medium">
          {metric.type.replace(/_/g, ' ')}
        </Label>
        <Badge variant={
          metric.status === 'Completed' ? 'secondary' : 
          metric.status === 'In Progress' ? 'default' : 
          'outline'
        }>
          {metric.status || 'Pending'}
        </Badge>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="text-sm text-gray-600">
          {metric.description || `Requirement: ${metric.target || 'Not specified'}`}
        </div>
      </div>
    </div>
  ))}
</CardContent>
              {/* <CardFooter>
                <Button 
                  onClick={handleUpdateMetrics}
                  disabled={updateMetricsMutation.isPending}
                  className="w-full"
                >
                  {updateMetricsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Metrics"
                  )}
                </Button>
              </CardFooter> */}
            </Card>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Required Features</CardTitle>
            <CardDescription>Features requested by the sponsor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsorship.features
                .filter(feature => feature.enabled)
                .map((feature) => (
                  <div key={feature.type} className="flex justify-between p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">{feature.type.replace(/_/g, ' ')}</span>
                    <span>{feature.valueOption || 'Yes'}</span>
                  </div>
                ))}
            </div>
            
            {sponsorship.features.filter(feature => feature.enabled).length === 0 && (
              <p className="text-center text-gray-500 py-4">No specific features requested</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}