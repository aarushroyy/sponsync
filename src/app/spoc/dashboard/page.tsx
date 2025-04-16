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
import { toast } from "sonner";

interface SpocUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isApproved: boolean;
}

interface AssignedCollege {
  id: string;
  collegeName: string;
  eventName: string;
  region: string;
  eventType: string;
  posterUrl?: string;
}

interface SpocAssignment {
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

interface SpocDashboardData {
  spoc: SpocUser;
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

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/spoc/assignments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to load dashboard");
    }

      return res.json();
    }