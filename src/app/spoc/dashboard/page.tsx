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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
}

interface AssignedCollege {
  id: string;
  name: string;
  collegeName: string;
  eventName: string;
}

interface SpocAssignment {
  id: string;
  sponsorshipId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  companyName: string;
  collegeName: string;
  eventName: string;
  verificationPhotos: string[];
  report: string | null;
  metrics: {
    type: string;
    target: number;
    current: number;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">SPOC Dashboard</h1>
          <p className="text-gray-600">Welcome, {dashboardData.user.firstName} {dashboardData.user.lastName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.pendingCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Assignments</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.activeCount}</h3>
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
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.completedCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <h3 className="text-2xl font-bold">₹{dashboardData.stats.totalEarnings.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {dashboardData.assignedCollege && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assigned College</CardTitle>
              <CardDescription>You are currently assigned to verify events at:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{dashboardData.assignedCollege.collegeName}</h3>
                  <p className="text-gray-600">{dashboardData.assignedCollege.eventName}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 md:mt-0"
                  onClick={() => router.push(`/spoc/colleges/${dashboardData.assignedCollege?.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">All Assignments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {dashboardData.assignments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No assignments yet</p>
              </div>
            ) : (
              dashboardData.assignments.map((assignment) => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onUploadPhotos={() => {
                    setSelectedAssignment(assignment);
                    setPhotoUploadOpen(true);
                  }}
                  onSubmitReport={() => {
                    setSelectedAssignment(assignment);
                    setReportText(assignment.report || "");
                  }}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'PENDING').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No pending assignments</p>
              </div>
            ) : (
              dashboardData.assignments
                .filter(a => a.status === 'PENDING')
                .map((assignment) => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    onUploadPhotos={() => {
                      setSelectedAssignment(assignment);
                      setPhotoUploadOpen(true);
                    }}
                    onSubmitReport={() => {
                      setSelectedAssignment(assignment);
                      setReportText(assignment.report || "");
                    }}
                  />
                ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'ACTIVE').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active assignments</p>
              </div>
            ) : (
              dashboardData.assignments
                .filter(a => a.status === 'ACTIVE')
                .map((assignment) => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    onUploadPhotos={() => {
                      setSelectedAssignment(assignment);
                      setPhotoUploadOpen(true);
                    }}
                    onSubmitReport={() => {
                      setSelectedAssignment(assignment);
                      setReportText(assignment.report || "");
                    }}
                  />
                ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {dashboardData.assignments.filter(a => a.status === 'COMPLETED').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No completed assignments</p>
              </div>
            ) : (
              dashboardData.assignments
                .filter(a => a.status === 'COMPLETED')
                .map((assignment) => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    onUploadPhotos={() => {
                      setSelectedAssignment(assignment);
                      setPhotoUploadOpen(true);
                    }}
                    onSubmitReport={() => {
                      setSelectedAssignment(assignment);
                      setReportText(assignment.report || "");
                    }}
                  />
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Photo Upload Dialog */}
      <Dialog open={photoUploadOpen} onOpenChange={setPhotoUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Verification Photos</DialogTitle>
            <DialogDescription>
              Upload photos as proof of event metrics and sponsorship fulfillment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img 
                    src={url} 
                    alt={`Preview ${index}`} 
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <label 
                htmlFor="photo-upload" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload photos</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPhotoUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadVerificationPhotos}
              disabled={uploadedPhotos.length === 0 || submitting}
            >
              {submitting ? (
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

      {/* Report Submission Dialog */}
      <Dialog open={!!selectedAssignment && !photoUploadOpen} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Verification Report</DialogTitle>
            <DialogDescription>
              Provide details about the event and how the sponsorship requirements were fulfilled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe how the sponsorship metrics were achieved, any challenges faced, and overall event success..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAssignment(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!reportText.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AssignmentCardProps {
  assignment: SpocAssignment;
  onUploadPhotos: () => void;
  onSubmitReport: () => void;
}

function AssignmentCard({ assignment, onUploadPhotos, onSubmitReport }: AssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assignment.collegeName}</CardTitle>
            <CardDescription>{assignment.eventName}</CardDescription>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Company: {assignment.companyName}</p>
          <p className="text-sm text-gray-500">
            Assigned on {new Date(assignment.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Metrics to Verify</h4>
          <div className="space-y-2">
            {assignment.metrics.map((metric, idx) => (
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
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Verification Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${assignment.verificationPhotos.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm">{assignment.verificationPhotos.length} Photos</span>
            </div>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${assignment.report ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Report {assignment.report ? 'Submitted' : 'Required'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="space-x-1"
          onClick={onUploadPhotos}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Photos</span>
        </Button>
        <Button
          variant={assignment.report ? "outline" : "default"}
          size="sm"
          className="space-x-1"
          onClick={onSubmitReport}
        >
          <FileText className="h-4 w-4" />
          <span>{assignment.report ? 'Edit Report' : 'Submit Report'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}[];
  createdAt: string;
}

interface SpocDashboardData {
  user: SpocUser;
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
  const [selectedAssignment, setSelectedAssignment] = useState<SpocAssignment | null>(null);
  const [reportText, setReportText] = useState("");
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/spoc/dashboard", {
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
    queryKey: ["spocDashboard"],
    queryFn: fetchDashboardData,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/spoc/login");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedPhotos([...uploadedPhotos, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);
    
    const newPreviewUrls = [...photoPreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up URL
    newPreviewUrls.splice(index, 1);
    setPhotoPreviewUrls(newPreviewUrls);
  };

  const handleUploadVerificationPhotos = async () => {
    if (!selectedAssignment || uploadedPhotos.length === 0) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const formData = new FormData();
      formData.append("assignmentId", selectedAssignment.id);
      uploadedPhotos.forEach(photo => {
        formData.append("photos", photo);
      });
      
      const res = await fetch("/api/spoc/assignments/upload-photos", {
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
      
      toast.success("Verification photos uploaded successfully");
      
      // Clean up
      setPhotoUploadOpen(false);
      setUploadedPhotos([]);
      photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreviewUrls([]);
      
      // Refresh data
      refetch();
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload photos");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedAssignment || !reportText.trim()) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const res = await fetch("/api/spoc/assignments/submit-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          report: reportText,
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit report");
      }
      
      toast.success("Report submitted successfully");
      setReportText("");
      refetch();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
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

  const dashboardData: SpocDashboardData = data;

  // Show message if not approved yet
  if (!dashboardData.user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Account Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your SPOC account is pending admin approval. You'll be notified via email once your account is approved.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Please ensure your email is verified. If you haven't received a verification email, check your spam folder.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                router.push("/auth/spoc/login");
              }}
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show message if approved but not assigned to any college yet
  if (dashboardData.user.isApproved && !dashboardData.assignedCollege) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Awaiting Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your SPOC account has been approved, but you haven't been assigned to any college events yet.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              You'll be notified via email when you're assigned to verify events.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                router.push("/auth/spoc/login");
              }}
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }