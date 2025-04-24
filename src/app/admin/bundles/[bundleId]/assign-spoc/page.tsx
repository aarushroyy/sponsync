// // src/app/admin/bundles/[bundleId]/assign-spoc/page.tsx
// "use client";

// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";

// interface SpocUser {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   isApproved: boolean;
//   assignedCollegeId: string | null;
// }

// interface BundleDetails {
//   id: string;
//   name: string;
//   status: string;
//   campaign: {
//     id: string;
//     name: string;
//     companyName: string;
//   };
//   colleges: {
//     id: string;
//     collegeName: string;
//     eventName: string;
//   }[];
// }

// export default function AssignSpocPage() {
//   const params = useParams();
//   const router = useRouter();
//   const bundleId = params.bundleId as string;
  
//   const [selectedSpocId, setSelectedSpocId] = useState<string>("");
  
//   // Fetch bundle details and available SPOCs
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["bundleAssignment", bundleId],
//     queryFn: async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       // Fetch bundle details
//       const bundleRes = await fetch(`/api/admin/bundles/${bundleId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Fetch available SPOCs
//       const spocsRes = await fetch(`/api/admin/spocs/available`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!bundleRes.ok || !spocsRes.ok) {
//         throw new Error("Failed to load required data");
//       }

//       const bundleData = await bundleRes.json();
//       const spocsData = await spocsRes.json();

//       return {
//         bundle: bundleData.bundle,
//         spocs: spocsData.spocs,
//       };
//     },
//   });

//   // Mutation for assigning a SPOC
//   const assignSpocMutation = useMutation({
//     mutationFn: async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       const res = await fetch(`/api/admin/bundles/${bundleId}/assign-spoc`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ spocId: selectedSpocId }),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to assign SPOC");
//       }

//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("SPOC assigned successfully!");
//       router.push("/admin/bundles");
//     },
//     onError: (error) => {
//       toast.error(error instanceof Error ? error.message : "Failed to assign SPOC");
//     },
//   });

//   const handleAssignSpoc = () => {
//     if (!selectedSpocId) {
//       toast.error("Please select a SPOC to assign");
//       return;
//     }
    
//     assignSpocMutation.mutate();
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <p className="ml-2">Loading data...</p>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Alert variant="destructive" className="max-w-md">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             {error instanceof Error ? error.message : "Failed to load required data"}
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   const bundle: BundleDetails = data.bundle;
//   const availableSpocs: SpocUser[] = data.spocs;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-3xl mx-auto">
//         <Button
//           variant="ghost"
//           className="mb-6 flex items-center"
//           onClick={() => router.push("/admin/bundles")}
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bundles
//         </Button>
        
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Assign SPOC to Bundle</CardTitle>
//             <CardDescription>
//               Choose a SPOC to verify this sponsorship
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-3">Bundle Details</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Bundle Name:</span>
//                   <span className="font-medium">{bundle.name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Campaign:</span>
//                   <span className="font-medium">{bundle.campaign.name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Company:</span>
//                   <span className="font-medium">{bundle.campaign.companyName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Status:</span>
//                   <Badge>{bundle.status}</Badge>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-medium mb-3">Colleges in Bundle</h3>
//               <div className="space-y-2">
//                 {bundle.colleges.map((college) => (
//                   <div key={college.id} className="p-3 border rounded-lg">
//                     <p className="font-medium">{college.collegeName}</p>
//                     <p className="text-sm text-gray-500">{college.eventName}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-medium mb-3">Select SPOC</h3>
              
//               {availableSpocs.length === 0 ? (
//                 <Alert className="bg-yellow-50">
//                   <AlertDescription>
//                     No available SPOCs found. Please approve more SPOCs to continue.
//                   </AlertDescription>
//                 </Alert>
//               ) : (
//                 <Select value={selectedSpocId} onValueChange={setSelectedSpocId}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a SPOC" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableSpocs.map((spoc) => (
//                       <SelectItem key={spoc.id} value={spoc.id}>
//                         {spoc.firstName} {spoc.lastName} - {spoc.email}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button 
//               className="w-full"
//               onClick={handleAssignSpoc}
//               disabled={!selectedSpocId || assignSpocMutation.isPending}
//             >
//               {assignSpocMutation.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Assigning SPOC...
//                 </>
//               ) : (
//                 "Assign SPOC"
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }