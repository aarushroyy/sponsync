// // src/app/admin/bundles/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, AlertCircle, UserPlus } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface Bundle {
//   id: string;
//   name: string;
//   status: string;
//   campaign: {
//     name: string;
//     company: string;
//   };
//   hasSpoc: boolean;
// }

// export default function AdminBundlesPage() {
//   const router = useRouter();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["adminBundles"],
//     queryFn: async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Not authenticated");
//       }

//       const res = await fetch("/api/admin/bundles", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Failed to load bundles");
//       }

//       return res.json();
//     },
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (!token || role !== "admin") {
//       router.push("/auth/admin/login");
//     }
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <p className="ml-2">Loading bundles...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Alert variant="destructive" className="max-w-md">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             {error instanceof Error ? error.message : "Failed to load bundles"}
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   const bundles: Bundle[] = data.bundles;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Campaign Bundles</h1>
//           <p className="text-gray-600">Assign SPOCs to verify sponsorships</p>
//         </div>

//         <Button
//           variant="ghost"
//           className="mb-6"
//           onClick={() => router.push("/admin/dashboard")}
//         >
//           ← Back to Dashboard
//         </Button>

//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold">Bundles Requiring SPOC Assignment</h2>
          
//           {bundles.length === 0 ? (
//             <div className="text-center p-12 border rounded-lg bg-white">
//               <p className="text-gray-500">No bundles available for SPOC assignment.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {bundles.map((bundle) => (
//                 <Card key={bundle.id} className={bundle.hasSpoc ? "border-green-500/20" : "border-yellow-500/20"}>
//                   <CardHeader className="flex flex-row items-start justify-between space-y-0">
//                     <div>
//                       <CardTitle>{bundle.name}</CardTitle>
//                       <p className="text-sm text-gray-500">{bundle.campaign.name} - {bundle.campaign.company}</p>
//                     </div>
//                     <Badge
//                       className={
//                         bundle.hasSpoc ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                       }
//                     >
//                       {bundle.hasSpoc ? "SPOC Assigned" : "Needs Assignment"}
//                     </Badge>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex justify-end">
//                       <Button
//                         variant={bundle.hasSpoc ? "outline" : "default"}
//                         size="sm"
//                         className="mt-2"
//                         onClick={() => router.push(`/admin/bundles/${bundle.id}/assign-spoc`)}
//                         disabled={bundle.hasSpoc}
//                       >
//                         {bundle.hasSpoc ? (
//                           "Already Assigned"
//                         ) : (
//                           <>
//                             <UserPlus className="h-4 w-4 mr-2" />
//                             Assign SPOC
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }