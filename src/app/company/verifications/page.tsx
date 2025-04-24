// src/app/company/verifications/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Building, UserCheck, FileText, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Verification {
  id: string;
  status: string;
  college: {
    name: string;
    event: string;
  };
  campaign: {
    id: string;
    name: string;
  };
  bundle: {
    id: string;
    name: string;
  };
  spoc: {
    name: string;
  };
  hasReport: boolean;
  hasPhotos: boolean;
  updatedAt: string;
  overallProgress: number;
}

interface VerificationGroup {
    bundleId: string;
    bundleName: string;
    campaignId: string;
    campaignName: string;
    verifications: Verification[];
  }

export default function CompanyVerificationsPage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["verifications"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("/api/company/verifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load verifications");
      }

      return res.json();
    },
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
        <p className="ml-2">Loading verifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load verifications"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const verifications: Verification[] = data?.verifications || [];
  
  // Group verifications by campaign
//   const verificationsByBundle = verifications.reduce((acc, verification) => {
//     const bundleId = verification.bundle.id;
//     if (!acc[bundleId]) {
//       acc[bundleId] = {
//         bundleId,
//         bundleName: verification.bundle.name,
//         campaignId: verification.campaign.id,
//         campaignName: verification.campaign.name,
//         verifications: [],
//       };
//     }
//     acc[bundleId].verifications.push(verification);
//     return acc;
//   }, {} as Record<string, any>);

const verificationsByBundle = verifications.reduce((acc, verification) => {
    const bundleId = verification.bundle.id;
    if (!acc[bundleId]) {
      acc[bundleId] = {
        bundleId,
        bundleName: verification.bundle.name,
        campaignId: verification.campaign.id,
        campaignName: verification.campaign.name,
        verifications: [],
      };
    }
    acc[bundleId].verifications.push(verification);
    return acc;
  }, {} as Record<string, VerificationGroup>);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Verifications</h1>
          <p className="text-gray-600">Monitor the progress of your campaign verifications</p>
        </div>

        {Object.values(verificationsByBundle).length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-white">
            <p className="text-gray-500">No verifications available.</p>
            <p className="text-sm text-gray-400 mt-2">Verifications will appear here once SPOCs have been assigned to your bundles.</p>
          </div>
        ) : (
          <div className="space-y-8">
{Object.values(verificationsByBundle).map((bundleGroup: VerificationGroup) => (
              <div key={bundleGroup.bundleId} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{bundleGroup.campaignName} - {bundleGroup.bundleName}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/company/campaigns/${bundleGroup.campaignId}`)}
                  >
                    View Campaign
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundleGroup.verifications.map((verification: Verification) => (
                    <Card key={verification.id} className="overflow-hidden">
                      <div className="h-1 bg-gray-200">
                        <div 
                          className={`h-full ${
                            verification.overallProgress >= 100 ? "bg-green-500" :
                            verification.overallProgress >= 50 ? "bg-blue-500" :
                            "bg-yellow-500"
                          }`}
                          style={{ width: `${verification.overallProgress}%` }}
                        ></div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{verification.college.name}</CardTitle>
                          <Badge className={
                            verification.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
                            verification.status === 'ACTIVE' ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {verification.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{verification.college.event}</p>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="grid grid-cols-2 gap-y-2">
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">SPOC: {verification.spoc.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">{verification.college.name}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className={`h-4 w-4 mr-2 ${verification.hasReport ? "text-green-500" : "text-gray-400"}`} />
                            <span className="text-sm">{verification.hasReport ? "Report Submitted" : "No Report Yet"}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-4 w-4 rounded-full mr-2 ${verification.hasPhotos ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-sm">{verification.hasPhotos ? "Photos Uploaded" : "No Photos Yet"}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-medium">{verification.overallProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={verification.overallProgress} className="h-2" />
                        </div>
                      </CardContent>
                      <div className="px-6 py-2 bg-gray-50 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full flex items-center justify-center text-blue-600"
                          onClick={() => router.push(`/company/verifications/${verification.id}`)}
                        >
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}