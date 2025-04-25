// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { Loader2 } from "lucide-react";
// import { CollegeLoginData } from "@/app/types/collegeAuth";
// import { validateEmail, validatePassword } from "@/app/lib/authValidation";

// export default function CollegeLoginPage() {
//   const router = useRouter();
//   const [loginData, setLoginData] = useState<CollegeLoginData>({ email: "", password: "" });
//   const [errors, setErrors] = useState<Partial<CollegeLoginData>>({});

//   const mutation = useMutation({
//     mutationFn: async (data: CollegeLoginData) => {
//       const res = await fetch("/api/auth/college/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Login failed");
//       }
//       return res.json();
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("token", data.token);
//       router.push("/auth/college/onboard");
//     },
//   });

//   const validateForm = (): boolean => {
//     const newErrors: Partial<CollegeLoginData> = {};
//     const emailError = validateEmail(loginData.email);
//     const passwordError = validatePassword(loginData.password);
    
//     if (emailError) newErrors.email = emailError;
//     if (passwordError) newErrors.password = passwordError;
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (validateForm()) {
//       mutation.mutate(loginData);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">College Login</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={loginData.email}
//                 onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
//                 className={errors.email ? "border-red-500" : ""}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={loginData.password}
//                 onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
//                 className={errors.password ? "border-red-500" : ""}
//               />
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={mutation.status === "pending"}
//             >
//               {mutation.status === "pending" ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>

//           {mutation.status === "error" && (
//             <Alert variant="destructive" className="mt-4">
//               <AlertDescription>
//                 {mutation.error?.message || "An error occurred"}
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-gray-600">
//             Dont have an account?{" "}
//             <Link href="/auth/college/register" className="text-blue-600 hover:underline">
//               Register here
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { CollegeLoginData } from "@/app/types/collegeAuth";
import { validateEmail, validatePassword } from "@/app/lib/authValidation";

export default function CollegeLoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<CollegeLoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<CollegeLoginData>>({});

  const mutation = useMutation({
    mutationFn: async (data: CollegeLoginData) => {
      const res = await fetch("/api/auth/college/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      
      // Check if onboarding is complete and redirect accordingly
      if (data.user && data.user.onboardingComplete) {
        router.push("/college/dashboard");
      } else {
        router.push("/auth/college/onboard");
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CollegeLoginData> = {};
    const emailError = validateEmail(loginData.email);
    const passwordError = validatePassword(loginData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(loginData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="w-full flex justify-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <LogIn className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">College Login</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                placeholder="your.email@college.edu"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-orange-500 hover:text-orange-600">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className={errors.password ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={mutation.status === "pending"}
            >
              {mutation.status === "pending" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {mutation.status === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                {mutation.error?.message || "An error occurred"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/college/register" className="text-orange-500 font-medium hover:text-orange-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
