"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, ArrowLeft, Upload, Camera, FileText, CheckCircle, BarChart, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";

interface MetricUpdate {
  type: string;
  currentValue: number;
}

interface AssignmentDetails {
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

export default function SpocAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId as string;
  
  // State for different tabs
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for metrics updates
  const [metricsUpdates, setMetricsUpdates] = useState<Record<string, number>>({});
  
  // State for report
  const [reportText, setReportText] = useState("");
  
  // State for photo upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Fetch assignment details
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["assignmentDetails", assignmentId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/spoc/assignments/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load assignment details");
      }

      return res.json();
    },
  });

  // Initialize state when data loads
  useEffect(() => {
    if (data?.assignment) {
      // Initialize metrics updates
      const updates: Record<string, number> = {};
      data.assignment.metrics.forEach((metric: any) => {
        updates[metric.type] = metric.current;
      });
      setMetricsUpdates(updates);
      
      // Initialize report text
      if (data.assignment.report) {
        setReportText(data.assignment.report);
      }
    }
  }, [data]);

  // Handle file selection for photo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  // Mutation for updating metrics
  const updateMetricsMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const metrics = Object.entries(metricsUpdates).map(([type, currentValue]) => ({
        type,
        currentValue,
      }));

      const res = await fetch(`/api/spoc/assignments/${assignmentId}/update-metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ metrics }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update metrics");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Metrics updated successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update metrics");
    },
  });

  // Mutation for submitting report
  const submitReportMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/spoc/assignments/${assignmentId}/submit-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ report: reportText }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit report");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Report submitted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to submit report");
    },
  });

  // Mutation for uploading photos
  const uploadPhotosMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append("photos", file);
      });

      const res = await fetch(`/api/spoc/assignments/${assignmentId}/upload-photos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload photos");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Photos uploaded successfully!");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to upload photos");
    },
  });

  const handleMetricChange = (type: string, value: number) => {
    setMetricsUpdates(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleUpdateMetrics = () => {
    updateMetricsMutation.mutate();
  };

  const handleSubmitReport = () => {
    if (!reportText.trim()) {
      toast.error("Please enter a report");
      return;
    }
    submitReportMutation.mutate();
  };

  const handleUploadPhotos = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }
    uploadPhotosMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading assignment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load assignment details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const assignment: AssignmentDetails = data.assignment;
  const isCompleted = assignment.status === 'COMPLETED';

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push("/spoc/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{assignment.collegeName}</h1>
            <p className="text-gray-600">{assignment.eventName} - Sponsored by {assignment.companyName}</p>
          </div>
          <Badge
            className={
              assignment.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
              assignment.status === 'ACTIVE' ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }
          >
            {assignment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Campaign</p>
                  <p className="font-medium">{assignment.campaignName}</p>
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
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="font-medium">{assignment.companyName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion</p>
                  <p className="font-medium">
                    {isCompleted ? "Completed" : 
                     !assignment.verificationPhotos?.length && !assignment.report ? "Not Started" :
                     !assignment.verificationPhotos?.length ? "Photos Required" :
                     !assignment.report ? "Report Required" : "In Progress"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">
              Metrics {isCompleted ? "✓" : ""}
            </TabsTrigger>
            <TabsTrigger value="photos">
              Photos {(assignment.verificationPhotos?.length ?? 0) > 0 ? "✓" : ""}
            </TabsTrigger>
            <TabsTrigger value="report">
              Report {assignment.report ? "✓" : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Overview</CardTitle>
                <CardDescription>
                  Track your progress on this sponsorship verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Assignment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge
                        className={
                          assignment.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
                          assignment.status === 'ACTIVE' ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">College:</span>
                      <span className="font-medium">{assignment.collegeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Event:</span>
                      <span className="font-medium">{assignment.eventName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Region:</span>
                      <span className="font-medium">{assignment.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Event Type:</span>
                      <span className="font-medium">{assignment.eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Date:</span>
                      <span className="font-medium">{new Date(assignment.createdAt).toLocaleDateString()}</span>
                    </div>
                    {assignment.status === 'COMPLETED' && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Completed Date:</span>
                        <span className="font-medium">{new Date(assignment.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Progress Checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        Object.values(metricsUpdates).some(value => value > 0) 
                          ? "bg-green-500" : "bg-gray-300"
                      }`}>
                        {Object.values(metricsUpdates).some(value => value > 0) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>Update metrics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        (assignment.verificationPhotos?.length ?? 0) > 0 
                          ? "bg-green-500" : "bg-gray-300"
                      }`}>
                        {(assignment.verificationPhotos?.length ?? 0) > 0 && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>Upload verification photos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        assignment.report ? "bg-green-500" : "bg-gray-300"
                      }`}>
                        {assignment.report && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>Submit verification report</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Features to Verify</h3>
                  <div className="space-y-2">
                    {assignment.features.map((feature, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{feature.type.replace(/_/g, ' ')}</span>
                          <span>{feature.valueOption || 'Yes'}</span>
                        </div>
                      </div>
                    ))}
                    {assignment.features.length === 0 && (
                      <p className="text-gray-500 text-center py-2">No specific features to verify</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between space-x-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveTab("metrics")}
                >
                  Update Metrics
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Upload Photos
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveTab("report")}
                >
                  {assignment.report ? "Edit Report" : "Submit Report"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Tracking</CardTitle>
                <CardDescription>
                  Update the verification metrics for this sponsorship
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assignment.metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={`metric-${metric.type}`} className="font-medium">
                        {metric.type.replace(/_/g, ' ')}
                      </Label>
                      <div className="text-sm">
                        <span className="font-medium">{metricsUpdates[metric.type] || 0}</span>
                        <span className="text-gray-500"> / {metric.target}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 items-center">
                      <div className="flex-grow">
                        <Progress 
                          value={((metricsUpdates[metric.type] || 0) / metric.target) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <Input
                        id={`metric-${metric.type}`}
                        type="number"
                        className="w-20"
                        min="0"
                        max={metric.target}
                        value={metricsUpdates[metric.type] || 0}
                        onChange={(e) => handleMetricChange(metric.type, parseInt(e.target.value) || 0)}
                        disabled={isCompleted}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleUpdateMetrics}
                  disabled={updateMetricsMutation.isPending || isCompleted}
                  className="w-full"
                >
                  {updateMetricsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Metrics...
                    </>
                  ) : (
                    "Update Metrics"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Photos</CardTitle>
                <CardDescription>
                  Upload photos as evidence of sponsorship implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Display existing photos */}
                  {assignment.verificationPhotos && assignment.verificationPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {assignment.verificationPhotos.map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
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
                      <p className="text-sm text-gray-500">
                        Upload photos to verify the implementation of sponsorship features
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setUploadDialogOpen(true)}
                  disabled={isCompleted}
                  className="w-full"
                >
                  {assignment.verificationPhotos && assignment.verificationPhotos.length > 0
                    ? "Upload More Photos"
                    : "Upload Photos"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Report</CardTitle>
                <CardDescription>
                  Submit a report detailing how the sponsorship was implemented
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="report" className="text-base font-medium">Report Content</Label>
                  <Textarea
                    id="report"
                    placeholder="Provide details about how the sponsorship metrics were achieved, including specific activities, challenges, and outcomes..."
                    className="min-h-[200px]"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSubmitReport}
                  disabled={submitReportMutation.isPending || !reportText.trim() || isCompleted}
                  className="w-full"
                >
                  {submitReportMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    assignment.report ? "Update Report" : "Submit Report"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Photo Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Verification Photos</DialogTitle>
            <DialogDescription>
              Upload photos as evidence of sponsorship implementation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Display preview of selected photos */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* File input */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Camera className="h-8 w-8 mx-auto text-gray-400" />
              <div className="mt-2">
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                >
                  <span>Click to upload</span>
                  <Input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF up to 10MB. Include photos of banners, standees, booth, and other sponsorship elements.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedFiles([]);
                setPreviewUrls([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadPhotos}
              disabled={uploadPhotosMutation.isPending || selectedFiles.length === 0}
            >
              {uploadPhotosMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Photos"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}