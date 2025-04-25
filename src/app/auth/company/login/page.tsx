"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Loader2, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LoginData } from "@/app/types/companyAuth";
import { validateEmail, validatePassword } from "@/app/lib/authValidation";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetch("/api/auth/company/login", {
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
      router.push("/company/dashboard");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};
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

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Company Login</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
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
//                 name="password"
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
//             <Link href="/auth/company/register" className="text-blue-600 hover:underline">
//               Register here
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1">
        <div className="w-full flex justify-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Company Portal Login
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          Access your corporate sponsorship dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Work Email</Label>
            <Input
              id="email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              className={`focus-visible:ring-indigo-500 ${errors.email ? "border-red-500" : ""}`}
              placeholder="name@company.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              className={`focus-visible:ring-indigo-500 ${errors.password ? "border-red-500" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Securing Access...
              </>
            ) : "Enter Dashboard"}
          </Button>
        </form>

        {mutation.isError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-gray-600">
          New to the platform?{" "}
          <Link 
            href="/auth/company/register" 
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Create corporate account
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
);
}