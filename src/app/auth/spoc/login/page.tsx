// // "use client";

// // import { useState, useEffect } from "react";
// // import { useMutation } from "@tanstack/react-query";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import Link from "next/link";
// // import { Loader2 } from "lucide-react";
// // import { validateEmail, validatePassword } from "@/app/lib/authValidation";
// // import { toast } from "sonner";

// // interface SpocLoginData {
// //   email: string;
// //   password: string;
// // }

// // export default function SpocLoginPage() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const [loginData, setLoginData] = useState<SpocLoginData>({ email: "", password: "" });
// //   const [errors, setErrors] = useState<Partial<SpocLoginData>>({});

// //   useEffect(() => {
// //     // Check for registration success message
// //     const registrationSuccess = searchParams.get('registrationSuccess');
// //     if (registrationSuccess === 'true') {
// //       toast.success(
// //         "Registration successful! Please check your email to verify your account and wait for admin approval.",
// //         { duration: 6000 }
// //       );
// //     }
// //   }, [searchParams]);

// //   const mutation = useMutation({
// //     mutationFn: async (data: SpocLoginData) => {
// //       const res = await fetch("/api/auth/spoc/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data),
// //       });
// //       if (!res.ok) {
// //         const err = await res.json();
// //         throw new Error(err.message || "Login failed");
// //       }
// //       return res.json();
// //     },
// //     onSuccess: (data) => {
// //       localStorage.setItem("token", data.token);
// //       localStorage.setItem("role", "spoc");
// //       router.push("/spoc/dashboard");
// //     },
// //   });

// //   const validateForm = (): boolean => {
// //     const newErrors: Partial<SpocLoginData> = {};
// //     const emailError = validateEmail(loginData.email);
// //     const passwordError = validatePassword(loginData.password);
    
// //     if (emailError) newErrors.email = emailError;
// //     if (passwordError) newErrors.password = passwordError;
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (validateForm()) {
// //       mutation.mutate(loginData);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <Card className="w-full max-w-md">
// //         <CardHeader>
// //           <CardTitle className="text-2xl font-bold text-center">SPOC Login</CardTitle>
// //           <CardDescription className="text-center">
// //             Log in as a Single Point of Contact (SPOC)
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={loginData.email}
// //                 onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
// //                 className={errors.email ? "border-red-500" : ""}
// //               />
// //               {errors.email && (
// //                 <p className="text-sm text-red-500">{errors.email}</p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label htmlFor="password">Password</Label>
// //               <Input
// //                 id="password"
// //                 type="password"
// //                 value={loginData.password}
// //                 onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
// //                 className={errors.password ? "border-red-500" : ""}
// //               />
// //               {errors.password && (
// //                 <p className="text-sm text-red-500">{errors.password}</p>
// //               )}
// //             </div>

// //             <Button
// //               type="submit"
// //               className="w-full"
// //               disabled={mutation.status === "pending"}
// //             >
// //               {mutation.status === "pending" ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Logging in...
// //                 </>
// //               ) : (
// //                 "Login"
// //               )}
// //             </Button>
// //           </form>

// //           {mutation.status === "error" && (
// //             <Alert variant="destructive" className="mt-4">
// //               <AlertDescription>
// //                 {mutation.error?.message || "An error occurred during login"}
// //               </AlertDescription>
// //             </Alert>
// //           )}
// //         </CardContent>
// //         <CardFooter className="justify-center">
// //           <p className="text-sm text-gray-600">
// //             Dont have an account?{" "}
// //             <Link href="/auth/spoc/register" className="text-blue-600 hover:underline">
// //               Register here
// //             </Link>
// //           </p>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

// // src/app/auth/spoc/login/page.tsx
// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { Loader2 } from "lucide-react";
// import { validateEmail, validatePassword } from "@/app/lib/authValidation";
// import { toast } from "sonner";

// interface SpocLoginData {
//   email: string;
//   password: string;
// }

// // Client Component that uses useSearchParams
// function RegistrationSuccessCheck() {
//   const searchParams = useSearchParams();
  
//   useEffect(() => {
//     // Check for registration success message
//     const registrationSuccess = searchParams.get('registrationSuccess');
//     if (registrationSuccess === 'true') {
//       toast.success(
//         "Registration successful! Please check your email to verify your account and wait for admin approval.",
//         { duration: 6000 }
//       );
//     }
//   }, [searchParams]);
  
//   return null; // This component doesn't render anything, just handles the effect
// }

// export default function SpocLoginPage() {
//   const router = useRouter();
//   const [loginData, setLoginData] = useState<SpocLoginData>({ email: "", password: "" });
//   const [errors, setErrors] = useState<Partial<SpocLoginData>>({});

//   const mutation = useMutation({
//     mutationFn: async (data: SpocLoginData) => {
//       const res = await fetch("/api/auth/spoc/login", {
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
//       localStorage.setItem("role", "spoc");
//       router.push("/spoc/dashboard");
//     },
//   });

//   const validateForm = (): boolean => {
//     const newErrors: Partial<SpocLoginData> = {};
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
//       {/* Wrap the component using useSearchParams in Suspense */}
//       <Suspense fallback={null}>
//         <RegistrationSuccessCheck />
//       </Suspense>
      
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">SPOC Login</CardTitle>
//           <CardDescription className="text-center">
//             Log in as a Single Point of Contact (SPOC)
//           </CardDescription>
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
//                 {mutation.error?.message || "An error occurred during login"}
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-gray-600">
//             Dont have an account?{" "}
//             <Link href="/auth/spoc/register" className="text-blue-600 hover:underline">
//               Register here
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, LogIn, Eye, EyeOff, UserCheck } from "lucide-react";
import { validateEmail, validatePassword } from "@/app/lib/authValidation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface SpocLoginData {
  email: string;
  password: string;
}

// Client Component that uses useSearchParams
function RegistrationSuccessCheck() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check for registration success message
    const registrationSuccess = searchParams.get('registrationSuccess');
    if (registrationSuccess === 'true') {
      toast.success(
        "Registration successful! Please check your email to verify your account and wait for admin approval.",
        { duration: 6000 }
      );
    }
  }, [searchParams]);
  
  return null;
}

export default function SpocLoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<SpocLoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<SpocLoginData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: SpocLoginData) => {
      const res = await fetch("/api/auth/spoc/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rememberMe }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "spoc");
      router.push("/spoc/dashboard");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<SpocLoginData> = {};
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
      <Suspense fallback={null}>
        <RegistrationSuccessCheck />
      </Suspense>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Box - Left side */}
        <div className="hidden md:flex flex-col bg-white p-8 rounded-lg shadow-lg border border-orange-100">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <UserCheck className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What is a SPOC?</h2>
          </div>
          
          <div className="prose prose-orange">
            <p className="text-gray-600">
              A <strong>Single Point of Contact (SPOC)</strong> is a crucial role in our sponsorship verification process. 
              As a SPOC, you will:
            </p>
            
            <ul className="space-y-3 mt-4">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">1</span>
                <span>Verify sponsorship implementation at college events</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">2</span>
                <span>Document and report on sponsor visibility and activations</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">3</span>
                <span>Track metrics for sponsorship packages</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">4</span>
                <span>Provide objective third-party confirmation of deliverables</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-700">Requirements for SPOCs:</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Current college student with valid ID</li>
                <li>• Good standing with the institution</li>
                <li>• Reliable and detail-oriented</li>
                <li>• Ability to document event activities</li>
                <li>• Smartphone with camera for reporting</li>
              </ul>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              SPOCs are approved by both college administrators and SponSync to ensure impartiality and accuracy in reporting.
            </div>
          </div>
        </div>
        
        {/* Login Form - Right side */}
        <Card className="w-full shadow-lg border-none">
          <CardHeader className="space-y-1">
            <div className="w-full flex justify-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <LogIn className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">SPOC Login</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Access your verification dashboard
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
                  className={`${errors.email ? "border-red-500" : ""} focus-visible:ring-orange-500`}
                  placeholder="your.email@college.edu"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className={`${errors.password ? "border-red-500" : ""} pr-10 focus-visible:ring-orange-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>

            {mutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {mutation.error.message || "An error occurred during login"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/spoc/register" className="text-orange-500 font-medium hover:text-orange-600 hover:underline">
                Register as SPOC
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}