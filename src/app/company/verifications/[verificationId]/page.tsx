"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, ArrowLeft, Mail, Phone, Building, UserCheck, Camera, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerificationDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  spoc: {
    name: string;
    email: string;
    phone: string;
  };
  college: {
    name: string;
    event: string;
    region: string;
    eventType: string;
  };
  campaign: {
    id: string;
    name: string;
  };
  bundle: {
    id: string;
    name: string;
  };
  verificationPhotos: string[];
  report: string | null;
  metricsProgress: {
    type: string;
    currentValue: number;
    target: number;
    percentage: number;
  }[];
}

export default function VerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const verificationId = params.verificationId as string;
  
  // Fetch verification details
  const { data, isLoading, error } = useQuery({
    queryKey: ["verification", verificationId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/company/verifications/${verificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load verification details");
      }

      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading verification details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load verification details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const verification: VerificationDetails = data.verification;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push(`/company/campaigns/${verification.campaign.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Verification Report</h1>
            <p className="text-gray-600">
              {verification.bundle.name} - {verification.college.name}
            </p>
          </div>
          <Badge
            className={
              verification.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
              verification.status === 'ACTIVE' ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }
          >
            {verification.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">College</p>
                  <p className="font-medium">{verification.college.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">SPOC</p>
                  <p className="font-medium">{verification.spoc.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="font-medium">
                    {verification.status === 'COMPLETED' ? 'Completed' :
                     verification.status === 'ACTIVE' ? 'In Progress' : 
                     'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Verification</CardTitle>
                <CardDescription>Tracking progress of your campaign metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {verification.metricsProgress.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{metric.type.replace(/_/g, ' ')}</span>
                      <div className="text-sm">
                        <span className="font-medium">{metric.currentValue}</span>
                        <span className="text-gray-500"> / {metric.target}</span>
                      </div>
                    </div>
                    
                    <div className="space-x-4">
                      <div className="w-full">
                        <Progress value={metric.percentage} className="h-2" />
                      </div>
                      
                      <div className="flex justify-end mt-1">
                        <Badge className={
                          metric.percentage >= 90 ? "bg-green-100 text-green-800" :
                          metric.percentage >= 70 ? "bg-blue-100 text-blue-800" :
                          metric.percentage >= 50 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {metric.percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {verification.metricsProgress.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No metrics data available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Photos</CardTitle>
                <CardDescription>Visual evidence of sponsorship implementation</CardDescription>
              </CardHeader>
              <CardContent>
                {verification.verificationPhotos && verification.verificationPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {verification.verificationPhotos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border">
                        <img 
                          src={photo} 
                          alt={`Verification photo ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-md">
                    <Camera className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No photos uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Report</CardTitle>
                <CardDescription>Detailed report from the SPOC</CardDescription>
              </CardHeader>
              <CardContent>
                {verification.report ? (
                  <div className="prose max-w-none">
                    <div className="bg-white p-6 rounded-md border">
                      {verification.report.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-md">
                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No report submitted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>SPOC and College contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">SPOC Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <UserCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{verification.spoc.name}</p>
                          <p className="text-sm text-gray-500">SPOC</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{verification.spoc.email}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{verification.spoc.phone}</p>
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">College Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">College Name:</span>
                        <span className="font-medium">{verification.college.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event:</span>
                        <span className="font-medium">{verification.college.event}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Region:</span>
                        <span className="font-medium">{verification.college.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Event Type:</span>
                        <span className="font-medium">{verification.college.eventType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}