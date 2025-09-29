"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Mail, Phone, User, MapPin, Calendar, Award, Clock } from "lucide-react";

interface PackageMetric {
  id: string;
  type: string;
  enabled: boolean;
  minValue: number | null;
  maxValue: number | null;
  rangeOption: string | null;
}

interface PackageFeature {
  id: string;
  type: string;
  enabled: boolean;
  valueOption: string | null;
}

interface PackageConfig {
  id: string;
  tier: string;
  estimatedAmount: number | null;
  metrics: PackageMetric[];
  features: PackageFeature[];
}

interface CollegeOnboarding {
  id: string;
  region: string;
  eventType: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  posterUrl: string | null;
  totalBudgetGoal: number | null;
  createdAt: string;
  packageConfigs: PackageConfig[];
}

interface SpocUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface College {
  id: string;
  name: string;
  collegeName: string;
  eventName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  CollegeOnboarding: CollegeOnboarding | null;
  assignedSpocs: SpocUser[];
}

export default function CollegeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/auth/admin/login");
    }
  }, [router]);

  const fetchCollege = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch('/api/admin/colleges/' + params.id, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load college");
    }

    return res.json();
  };

  const { data: college, isLoading, error } = useQuery<College>({
    queryKey: ["college", params.id],
    queryFn: fetchCollege,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/admin/dashboard?tab=colleges")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Button>
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading College</h2>
                <p className="text-gray-600">{error instanceof Error ? error.message : "College not found"}</p>
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
            onClick={() => router.push("/admin/dashboard?tab=colleges")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Button>
          <div className="flex gap-2">
            <Badge variant={college.isVerified ? "default" : "secondary"}>
              {college.isVerified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant={college.onboardingComplete ? "default" : "secondary"}>
              {college.onboardingComplete ? "Onboarding Complete" : "Onboarding Pending"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* College Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{college.name}</CardTitle>
              <CardDescription className="flex items-center text-base">
                <Building className="mr-2 h-4 w-4" />
                {college.collegeName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Event: {college.eventName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{college.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{college.phone}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">Registration Timeline</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className="text-xs text-gray-600">
                        Registered: {new Date(college.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {college.CollegeOnboarding && (
                        <p className="text-xs text-gray-600">
                          Onboarded: {new Date(college.CollegeOnboarding.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {college.CollegeOnboarding && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Region: {college.CollegeOnboarding.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Event Type: {college.CollegeOnboarding.eventType}</span>
                    </div>
                    {college.CollegeOnboarding.eventStartDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          <span className="font-medium text-green-700">Event Date:</span>{" "}
                          {new Date(college.CollegeOnboarding.eventStartDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {college.CollegeOnboarding.eventEndDate && (
                            <span>
                              {" "}-{" "}
                              {new Date(college.CollegeOnboarding.eventEndDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Poster */}
          {college.CollegeOnboarding?.posterUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Event Poster</CardTitle>
                <CardDescription>College event poster</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="max-w-md w-full">
                    <img 
                      src={college.CollegeOnboarding.posterUrl} 
                      alt="Event Poster" 
                      className="w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.error-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="error-fallback hidden text-center py-4 text-gray-500">
                      Unable to load poster image
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned SPOCs */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned SPOCs</CardTitle>
              <CardDescription>Single points of contact for this college</CardDescription>
            </CardHeader>
            <CardContent>
              {college.assignedSpocs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No SPOCs assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {college.assignedSpocs.map((spoc) => (
                    <div key={spoc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{spoc.firstName} {spoc.lastName}</p>
                          <p className="text-sm text-gray-500">{spoc.email}</p>
                          <p className="text-sm text-gray-500">{spoc.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Configurations */}
          {college.CollegeOnboarding?.packageConfigs && college.CollegeOnboarding.packageConfigs.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Package Configurations</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {college.CollegeOnboarding.packageConfigs.map((config) => (
                  <Card key={config.id}>
                    <CardHeader>
                      <CardTitle>{config.tier} Package</CardTitle>
                      {config.estimatedAmount && (
                        <CardDescription>
                          Estimated Value: ₹{config.estimatedAmount.toLocaleString()}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Metrics</h4>
                          <div className="space-y-2">
                            {config.metrics.filter(m => m.enabled).map((metric) => (
                              <div key={metric.id} className="text-sm">
                                <span className="font-medium">{metric.type.replace(/_/g, " ")}: </span>
                                <span className="text-gray-600">
                                  {metric.rangeOption || (metric.minValue === null ? "Not specified" : metric.minValue + (metric.maxValue ? ` - ${metric.maxValue}` : "+"))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="space-y-2">
                            {config.features.filter(f => f.enabled).map((feature) => (
                              <div key={feature.id} className="text-sm">
                                <span className="font-medium">{feature.type.replace(/_/g, " ")}</span>
                                {feature.valueOption && (
                                  <span className="text-gray-600"> - {feature.valueOption}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
