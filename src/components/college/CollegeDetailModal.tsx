// src/components/college/CollegeDetailModal.tsx
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageTier, MetricType, FeatureType } from "@/app/types/package";
import { useRouter } from "next/navigation";

interface CollegeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  college?: {
    id: string;
    eventType: string;
    region: string;
    posterUrl: string | null;
    college: {
      collegeName: string;
      eventName: string;
    };
    packageConfigs?: Array<{
      tier: PackageTier;
      metrics: Array<{
        type: MetricType;
        enabled: boolean;
        minValue: number | null;
        maxValue: number | null;
      }>;
      features: Array<{
        type: FeatureType;
        enabled: boolean;
      }>;
      estimatedAmount?: number;
    }>;
  };
}

export default function CollegeDetailModal({ 
  isOpen, 
  onClose, 
  college 
}: CollegeDetailModalProps) {
  const router = useRouter();
  const [activePackage, setActivePackage] = useState<PackageTier>(PackageTier.GOLD);

  if (!college) return null;

  const handleCreateBundle = () => {
    // Store college ID in localStorage to pre-select it in campaign creation
    localStorage.setItem('preSelectedCollegeId', college.id);
    router.push('/company/campaigns/new');
    onClose();
  };

  const currentPackage = college.packageConfigs?.find(
    config => config.tier === activePackage
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {college.college.eventName}
          </DialogTitle>
          <DialogDescription>
            {college.college.collegeName} - {college.region} Region
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            {college.posterUrl ? (
              <div className="aspect-video rounded-md overflow-hidden">
                <img
                  src={college.posterUrl}
                  alt={college.college.eventName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-md">
                <p className="text-gray-500">No poster available</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <Badge>{college.region}</Badge>
                <Badge variant="outline">{college.eventType}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Event Type: <span className="font-medium">{college.eventType}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Available Packages</h3>
              <div className="flex gap-2 mb-4">
                {college.packageConfigs?.map((pkg) => (
                  <Button
                    key={pkg.tier}
                    variant={activePackage === pkg.tier ? "default" : "outline"}
                    onClick={() => setActivePackage(pkg.tier)}
                    className={pkg.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200' : 
                             pkg.tier === 'SILVER' ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 
                             'bg-amber-100 text-amber-900 hover:bg-amber-200'}
                  >
                    {pkg.tier}
                  </Button>
                ))}
              </div>
            </div>

            {currentPackage && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">{activePackage} Package Details</h4>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Estimated Cost:</p>
                    <p className="text-xl font-bold">
                      ₹{currentPackage.estimatedAmount?.toLocaleString() || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Metrics:</p>
                      <div className="space-y-1">
                        {currentPackage.metrics.map((metric) => (
                          <div key={metric.type} className="flex justify-between items-center">
                            <span className="text-sm">{metric.type}</span>
                            {metric.enabled ? (
                              <span className="text-sm font-medium">
                                {metric.minValue === metric.maxValue ? 
                                  metric.minValue : 
                                  `${metric.minValue} - ${metric.maxValue}`}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">Not offered</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Features:</p>
                      <div className="space-y-1">
                        {currentPackage.features.map((feature) => (
                          <div key={feature.type} className="flex items-center space-x-2">
                            <span className={`h-2 w-2 rounded-full ${feature.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm">
                              {feature.type.replace(/_/g, ' ').toLowerCase()
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCreateBundle}>
            Create Bundle with This College
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}