"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
//import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define types
interface College {
  id: string;
  collegeName: string;
  eventName: string;
  eventType: string;
  region: string;
  packageTier?: string;
  estimatedAmount?: number;
  score?: number;
  posterUrl?: string; // Add posterUrl property
  // Add these fields for internal use
  selected?: boolean;
  packageConfigs?: Array<{
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

interface Metric {
  type: string;
  minValue: number | null;
  maxValue: number | null;
}

interface Bundle {
  id: string;
  name: string;
  campaignId: string;
  collegeIds: string[];
  status: string;
  totalValue: number;
  collegeDetails?: College[];
  totalMetrics?: Record<string, number>;
  fulfillmentPercentages?: Record<string, number>;
}

interface Campaign {
  id: string;
  name: string;
  plan: string;
  region: string;
  eventTypes: string[];
  bundleSize: number;
  budgetLimit: number;
  status: string;
  metrics: Metric[];
}



export default function EditBundlePage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;
  const bundleId = params.bundleId as string;
  const [eventTypeFilter, setEventTypeFilter] = useState("");
const [locationFilter, setLocationFilter] = useState("");
const [eventsCountFilter, setEventsCountFilter] = useState("");
  
  // States for editing
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [availableColleges, setAvailableColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [metricsTotal, setMetricsTotal] = useState<Record<string, number>>({});
  const [metricsPercentages, setMetricsPercentages] = useState<Record<string, number>>({});
  
  // Fetch campaign and bundle data
  const { data, isLoading, error } = useQuery({
    queryKey: ["editBundle", campaignId, bundleId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Fetch campaign details
      const campaignRes = await fetch(`/api/company/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch bundle details
      const bundleRes = await fetch(`/api/company/campaigns/${campaignId}/bundles/${bundleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch available colleges
      const collegesRes = await fetch(`/api/company/available-colleges?region=${campaign?.region || ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!campaignRes.ok || !bundleRes.ok) {
        throw new Error("Failed to load necessary data");
      }

      const campaignData = await campaignRes.json();
      const bundleData = await bundleRes.json();
      let collegesData = { colleges: [] };
      
      if (collegesRes.ok) {
        collegesData = await collegesRes.json();
      }

      return {
        campaign: campaignData.campaign,
        bundle: bundleData.bundle,
        availableColleges: collegesData.colleges,
      };
    },
    enabled: !!campaignId && !!bundleId,
  });

  // Mutation for updating bundle
  const updateBundleMutation = useMutation({
    mutationFn: async (updatedBundle: Bundle) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/company/campaigns/${campaignId}/bundles/${bundleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBundle),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update bundle");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Bundle updated successfully!");
      router.push(`/company/campaigns/${campaignId}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update bundle");
    },
  });

  // Initialize data once loaded
  useEffect(() => {
    if (data) {
      setCampaign(data.campaign);
      setCurrentBundle(data.bundle);
      
      if (data.bundle.collegeDetails) {
        setSelectedColleges(data.bundle.collegeDetails.map((college: College) => ({
          ...college,
          selected: true
        })));
      }

      // Filter out colleges that are already in the bundle
      const selectedIds = new Set(data.bundle.collegeIds || []);
      const filteredColleges = data.availableColleges.filter(
        (college: College) => !selectedIds.has(college.id)
      );
      
      setAvailableColleges(filteredColleges);
      
      // Calculate initial metrics and budget
      updateMetricsAndBudget(data.bundle.collegeDetails || []);
      setRemainingSlots(data.campaign.bundleSize - selectedColleges.length);

    }
  }, [data]);

  const [remainingSlots, setRemainingSlots] = useState(0);


  // Update metrics and budget when selected colleges change
  useEffect(() => {
    updateMetricsAndBudget(selectedColleges);
  }, [selectedColleges]);

  // Function to update metrics and budget
  const updateMetricsAndBudget = (colleges: College[]) => {
    let budget = 0;
    const metrics: Record<string, number> = {};
    const percentages: Record<string, number> = {};

    // Calculate total budget and metrics
    colleges.forEach(college => {
      // Add to budget
      if (college.estimatedAmount) {
        budget += college.estimatedAmount;
      }

      // Calculate metrics from college's best package
      const bestPackage = college.packageConfigs?.[0]; // Assuming they're already sorted
      if (bestPackage) {
        bestPackage.metrics.forEach(metric => {
          if (metric.enabled && metric.minValue) {
            metrics[metric.type] = (metrics[metric.type] || 0) + metric.minValue;
          }
        });
      }
    });

    // Calculate percentages based on campaign requirements
    if (campaign?.metrics) {
      campaign.metrics.forEach(metric => {
        if (metric.maxValue && metric.maxValue > 0) {
          const currentValue = metrics[metric.type] || 0;
          percentages[metric.type] = Math.min(100, (currentValue / metric.maxValue) * 100);
        }
      });
    }

    setTotalBudget(budget);
    setMetricsTotal(metrics);
    setMetricsPercentages(percentages);
  };

  // Handle adding a college to the bundle
  const handleAddCollege = (college: College) => {
    // Add college to selected list

    if (campaign?.bundleSize && selectedColleges.length >= campaign.bundleSize) {
      toast.error(`You cannot add more than ${campaign.bundleSize} colleges to this bundle.`);
      return;
    }
    setSelectedColleges(prev => [...prev, { ...college, selected: true }]);
    
    // Remove college from available list
    setAvailableColleges(prev => prev.filter(c => c.id !== college.id));
    
    setIsAddCollegeOpen(false);
    setRemainingSlots(prev => prev - 1);
  };

  // Handle removing a college from the bundle
  const handleRemoveCollege = (collegeId: string) => {
    // Find the college to remove
    const collegeToRemove = selectedColleges.find(c => c.id === collegeId);
    
    if (collegeToRemove) {
      // Remove from selected colleges
      setSelectedColleges(prev => prev.filter(c => c.id !== collegeId));
      
      // Add back to available colleges
      setAvailableColleges(prev => [...prev, { ...collegeToRemove, selected: false }]);
    }
  };

  // Handle saving bundle changes
  const handleSaveChanges = () => {
    if (!currentBundle) return;
    
    const updatedBundle = {
      ...currentBundle,
      collegeIds: selectedColleges.map(college => college.id),
      totalValue: totalBudget
    };

    updateBundleMutation.mutate(updatedBundle);
  };

  // Filter colleges based on search term
  const filteredColleges = availableColleges.filter(college =>
    college.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorForPercentage = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 70) return "bg-blue-100 text-blue-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading bundle data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load bundle data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => router.push(`/company/campaigns/${campaignId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Edit Bundle</h1>
            <p className="text-gray-600">
              {campaign?.name} - Customize your college selection
            </p>
          </div>
          
          <div className="mb-6 flex justify-end space-x-4 items-center">
  <p className="text-sm text-gray-600">
    Remaining slots: {remainingSlots} of {campaign?.bundleSize}
  </p>
  <Button 
    variant="outline" 
    onClick={() => setIsAddCollegeOpen(true)}
    disabled={availableColleges.length === 0 || remainingSlots <= 0}
  >
    <Plus className="mr-2 h-4 w-4" />
    Add College
  </Button>
</div>
        </div>

        {/* Metrics and Budget Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bundle Summary</CardTitle>
            <CardDescription>
              Current metrics fulfillment and budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Metrics Fulfillment</h3>
                <div className="space-y-3">
                  {campaign?.metrics.map((metric, index) => {
                    const current = metricsTotal[metric.type] || 0;
                    const target = metric.maxValue || 0;
                    const percentage = metricsPercentages[metric.type] || 0;
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {metric.type.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">
                              {current}/{target}
                            </span>
                            <Badge className={getColorForPercentage(percentage)}>
                              {percentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Budget</h3>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Budget:</span>
                    <span className="text-xl font-bold">₹{totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Budget Limit:</span>
                    <span className="font-medium">₹{campaign?.budgetLimit.toLocaleString()}</span>
                  </div>
                  
                  {/* Budget progress bar */}
                  <div className="mt-3">
                    <Progress 
                      value={(totalBudget / (campaign?.budgetLimit || 1)) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">₹0</span>
                      <span className="text-xs text-gray-500">₹{campaign?.budgetLimit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Colleges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected Colleges</CardTitle>
            <CardDescription>
              These colleges will be included in your bundle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedColleges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No colleges selected yet.</p>
                <Button 
                  variant="outline"
                  className="mt-3"
                  onClick={() => setIsAddCollegeOpen(true)}
                >
                  Add Colleges
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedColleges.map((college) => (
                  <div key={college.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{college.collegeName}</p>
                      <p className="text-sm text-gray-600">{college.eventName} ({college.eventType})</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">₹{college.estimatedAmount?.toLocaleString() || 'N/A'}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCollege(college.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(`/company/campaigns/${campaignId}`)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSaveChanges}
              disabled={selectedColleges.length === 0 || updateBundleMutation.isPending}
            >
              {updateBundleMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

<Card className="mb-6">
  <CardHeader>
    <CardTitle>Available Colleges</CardTitle>
    <CardDescription>
      Filter and select colleges to add to your bundle
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Filter controls */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Label htmlFor="eventType">Event Type</Label>
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger id="eventType">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {campaign?.eventTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger id="location">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Locations</SelectItem>
            <SelectItem value="NORTH">North</SelectItem>
            <SelectItem value="SOUTH">South</SelectItem>
            <SelectItem value="EAST">East</SelectItem>
            <SelectItem value="WEST">West</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="eventsCount">Number of Events</Label>
        <Input
          id="eventsCount"
          type="number"
          min="1"
          value={eventsCountFilter}
          onChange={(e) => setEventsCountFilter(e.target.value)}
          placeholder="Any number"
        />
      </div>
    </div>
    
    {/* Search input */}
    <div className="flex items-center border rounded-md px-3 py-2 mb-4">
      <Search className="h-4 w-4 text-gray-500 mr-2" />
      <Input
        placeholder="Search colleges..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    
    {/* Filter and display available colleges */}
    {(() => {
      // Apply filters
      const filtered = availableColleges.filter(college => {
        if (eventTypeFilter && eventTypeFilter !== "ALL" && college.eventType !== eventTypeFilter) return false;
        if (locationFilter && locationFilter !== "ALL" && college.region !== locationFilter) return false;
        if (searchTerm && !college.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !college.eventName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
      
      // Maximum number of colleges to show based on filter
      if (eventsCountFilter && filtered.length > parseInt(eventsCountFilter)) {
        filtered.length = parseInt(eventsCountFilter);
      }
      
      return filtered.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No matching colleges found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((college) => (
            <Card key={college.id} className="overflow-hidden">
              {college.posterUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={college.posterUrl} 
                    alt={college.collegeName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-medium">{college.collegeName}</h3>
                <p className="text-sm text-gray-600">{college.eventName}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{college.region}</Badge>
                  <Badge variant="outline">{college.eventType}</Badge>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    {college.packageConfigs && college.packageConfigs.length > 0 && (
                      <Select 
                        defaultValue={college.packageConfigs[0].tier}
                        onValueChange={(value) => {
                          const selectedPackage = college.packageConfigs?.find(p => p.tier === value);
                          if (selectedPackage) {
                            college.packageTier = value;
                            college.estimatedAmount = selectedPackage.estimatedAmount;
                          }
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Package" />
                        </SelectTrigger>
                        <SelectContent>
                          {college.packageConfigs.map((pkg) => (
                            <SelectItem key={pkg.tier} value={pkg.tier}>
                              {pkg.tier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddCollege(college)}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    })()}
  </CardContent>
</Card>

      {/* Add College Dialog */}
      <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Colleges to Bundle</DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            <div className="flex items-center border rounded-md px-3 py-2 mb-4">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <Input
                placeholder="Search colleges..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-[350px] overflow-y-auto pr-1">
              {filteredColleges.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No matching colleges found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredColleges.map((college) => (
                    <div key={college.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{college.collegeName}</p>
                        <p className="text-sm text-gray-600 truncate">{college.eventName}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-1">{college.region}</Badge>
                          <Badge variant="outline">{college.eventType}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-2">
                        {college.packageConfigs && college.packageConfigs.length > 0 && (
                          <Select 
                            defaultValue={college.packageConfigs[0].tier}
                            onValueChange={(value) => {
                              // Find the selected package and update college's estimatedAmount
                              const selectedPackage = college.packageConfigs?.find(p => p.tier === value);
                              if (selectedPackage) {
                                college.packageTier = value;
                                college.estimatedAmount = selectedPackage.estimatedAmount;
                              }
                            }}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Package" />
                            </SelectTrigger>
                            <SelectContent>
                              {college.packageConfigs.map((pkg) => (
                                <SelectItem key={pkg.tier} value={pkg.tier}>
                                  {pkg.tier}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddCollege(college)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCollegeOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}