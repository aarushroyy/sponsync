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
// import { CollegeRegisterData } from "@/app/types/collegeAuth";
// import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";

// export default function CollegeRegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<CollegeRegisterData>({
//     email: "",
//     password: "",
//     name: "",
//     collegeName: "",
//     eventName: "",
//     phone: "",
//   });
//   const [errors, setErrors] = useState<Partial<CollegeRegisterData>>({});

//   const mutation = useMutation({
//     mutationFn: async (data: CollegeRegisterData) => {
//       const res = await fetch("/api/auth/college/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Registration failed");
//       }
//       return res.json();
//     },
//     onSuccess: () => {
//       router.push("/auth/college/login");
//     },
//   });

//   const validateForm = (): boolean => {
//     const newErrors: Partial<CollegeRegisterData> = {};
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
    
//     if (emailError) newErrors.email = emailError;
//     if (passwordError) newErrors.password = passwordError;
    
//     Object.keys(formData).forEach((key) => {
//       if (key !== 'email' && key !== 'password') {
//         const error = validateRequired(formData[key as keyof CollegeRegisterData], key);
//         if (error) newErrors[key as keyof CollegeRegisterData] = error;
//       }
//     });
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (validateForm()) {
//       mutation.mutate(formData);
//     }
//   };

//   const formFields = [
//     { name: 'email', label: 'Email', type: 'email' },
//     { name: 'password', label: 'Password', type: 'password' },
//     { name: 'name', label: 'Full Name', type: 'text' },
//     { name: 'collegeName', label: 'College Name', type: 'text' },
//     { name: 'eventName', label: 'Event Name', type: 'text' },
//     { name: 'phone', label: 'Phone', type: 'tel' },
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">College Registration</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {formFields.map((field) => (
//               <div key={field.name} className="space-y-2">
//                 <Label htmlFor={field.name}>{field.label}</Label>
//                 <Input
//                   id={field.name}
//                   type={field.type}
//                   value={formData[field.name as keyof CollegeRegisterData]}
//                   onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
//                   className={errors[field.name as keyof CollegeRegisterData] ? "border-red-500" : ""}
//                 />
//                 {errors[field.name as keyof CollegeRegisterData] && (
//                   <p className="text-sm text-red-500">{errors[field.name as keyof CollegeRegisterData]}</p>
//                 )}
//               </div>
//             ))}

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={mutation.status === "pending"}
//             >
//               {mutation.status === "pending" ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Registering...
//                 </>
//               ) : (
//                 "Register"
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
//             Already have an account?{" "}
//             <Link href="/auth/college/login" className="text-blue-600 hover:underline">
//               Login here
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
import { Loader2, Building, ArrowRight, CheckCircle } from "lucide-react";
import { CollegeRegisterData } from "@/app/types/collegeAuth";
import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";

export default function CollegeRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CollegeRegisterData>({
    email: "",
    password: "",
    name: "",
    collegeName: "",
    eventName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<CollegeRegisterData>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const mutation = useMutation({
    mutationFn: async (data: CollegeRegisterData) => {
      const res = await fetch("/api/auth/college/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: () => {
      router.push("/auth/college/login");
    },
  });

  const validateForm = (step?: number): boolean => {
    const newErrors: Partial<CollegeRegisterData> = {};
    
    if (!step || step === 1) {
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      
      if (emailError) newErrors.email = emailError;
      if (passwordError) newErrors.password = passwordError;
    }
    
    if (!step || step === 2) {
      ['name', 'collegeName', 'eventName', 'phone'].forEach((key) => {
        const error = validateRequired(formData[key as keyof CollegeRegisterData], key);
        if (error) newErrors[key as keyof CollegeRegisterData] = error;
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm(1)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === 1) {
      handleNextStep();
    } else {
      if (validateForm(2)) {
        mutation.mutate(formData);
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            index + 1 <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
          }`}>
            {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-12 h-1 ${index + 1 < currentStep ? "bg-orange-500" : "bg-gray-200"}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="w-full flex justify-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <Building className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">College Registration</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Create an account to showcase your events to sponsors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                    placeholder="your.email@college.edu"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                    className={errors.collegeName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                  />
                  {errors.collegeName && (
                    <p className="text-sm text-red-500">{errors.collegeName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    className={errors.eventName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                  />
                  {errors.eventName && (
                    <p className="text-sm text-red-500">{errors.eventName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={errors.phone ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="flex space-x-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={mutation.status === "pending"}
                  >
                    {mutation.status === "pending" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </>
            )}
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
            Already have an account?{" "}
            <Link href="/auth/college/login" className="text-orange-500 font-medium hover:text-orange-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
