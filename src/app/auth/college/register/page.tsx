// // "use client";

// // import { useState } from "react";
// // import { useMutation } from "@tanstack/react-query";
// // import { useRouter } from "next/navigation";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import Link from "next/link";
// // import { Loader2 } from "lucide-react";
// // import { CollegeRegisterData } from "@/app/types/collegeAuth";
// // import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";

// // export default function CollegeRegisterPage() {
// //   const router = useRouter();
// //   const [formData, setFormData] = useState<CollegeRegisterData>({
// //     email: "",
// //     password: "",
// //     name: "",
// //     collegeName: "",
// //     eventName: "",
// //     phone: "",
// //   });
// //   const [errors, setErrors] = useState<Partial<CollegeRegisterData>>({});

// //   const mutation = useMutation({
// //     mutationFn: async (data: CollegeRegisterData) => {
// //       const res = await fetch("/api/auth/college/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data),
// //       });
// //       if (!res.ok) {
// //         const err = await res.json();
// //         throw new Error(err.message || "Registration failed");
// //       }
// //       return res.json();
// //     },
// //     onSuccess: () => {
// //       router.push("/auth/college/login");
// //     },
// //   });

// //   const validateForm = (): boolean => {
// //     const newErrors: Partial<CollegeRegisterData> = {};
// //     const emailError = validateEmail(formData.email);
// //     const passwordError = validatePassword(formData.password);
    
// //     if (emailError) newErrors.email = emailError;
// //     if (passwordError) newErrors.password = passwordError;
    
// //     Object.keys(formData).forEach((key) => {
// //       if (key !== 'email' && key !== 'password') {
// //         const error = validateRequired(formData[key as keyof CollegeRegisterData], key);
// //         if (error) newErrors[key as keyof CollegeRegisterData] = error;
// //       }
// //     });
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (validateForm()) {
// //       mutation.mutate(formData);
// //     }
// //   };

// //   const formFields = [
// //     { name: 'email', label: 'Email', type: 'email' },
// //     { name: 'password', label: 'Password', type: 'password' },
// //     { name: 'name', label: 'Full Name', type: 'text' },
// //     { name: 'collegeName', label: 'College Name', type: 'text' },
// //     { name: 'eventName', label: 'Event Name', type: 'text' },
// //     { name: 'phone', label: 'Phone', type: 'tel' },
// //   ];

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <Card className="w-full max-w-md">
// //         <CardHeader>
// //           <CardTitle className="text-2xl font-bold text-center">College Registration</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {formFields.map((field) => (
// //               <div key={field.name} className="space-y-2">
// //                 <Label htmlFor={field.name}>{field.label}</Label>
// //                 <Input
// //                   id={field.name}
// //                   type={field.type}
// //                   value={formData[field.name as keyof CollegeRegisterData]}
// //                   onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
// //                   className={errors[field.name as keyof CollegeRegisterData] ? "border-red-500" : ""}
// //                 />
// //                 {errors[field.name as keyof CollegeRegisterData] && (
// //                   <p className="text-sm text-red-500">{errors[field.name as keyof CollegeRegisterData]}</p>
// //                 )}
// //               </div>
// //             ))}

// //             <Button
// //               type="submit"
// //               className="w-full"
// //               disabled={mutation.status === "pending"}
// //             >
// //               {mutation.status === "pending" ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Registering...
// //                 </>
// //               ) : (
// //                 "Register"
// //               )}
// //             </Button>
// //           </form>

// //           {mutation.status === "error" && (
// //             <Alert variant="destructive" className="mt-4">
// //               <AlertDescription>
// //                 {mutation.error?.message || "An error occurred"}
// //               </AlertDescription>
// //             </Alert>
// //           )}
// //         </CardContent>
// //         <CardFooter className="justify-center">
// //           <p className="text-sm text-gray-600">
// //             Already have an account?{" "}
// //             <Link href="/auth/college/login" className="text-blue-600 hover:underline">
// //               Login here
// //             </Link>
// //           </p>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { Loader2, Building, ArrowRight, CheckCircle } from "lucide-react";
// import { CollegeRegisterData } from "@/app/types/collegeAuth";
// // import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";
// import { validateName, validateEmail, validatePassword, validatePhone, validateRequired } from "@/app/lib/authValidation";
// // import { ValidatedInput } from "@/components/validated-inputs";
// import { PasswordStrength } from "@/components/password-strength";

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
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 2;

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

//   const validateForm = (step?: number): boolean => {
//     const newErrors: Partial<CollegeRegisterData> = {};
    
//     if (!step || step === 1) {
//       const emailError = validateEmail(formData.email);
//       const passwordError = validatePassword(formData.password);
      
//       if (emailError) newErrors.email = emailError;
//       if (passwordError) newErrors.password = passwordError;
//     }
    
//     // if (!step || step === 2) {
//     //   ['name', 'collegeName', 'eventName', 'phone'].forEach((key) => {
//     //     const error = validateRequired(formData[key as keyof CollegeRegisterData], key);
//     //     if (error) newErrors[key as keyof CollegeRegisterData] = error;
//     //   });
//     // }

//     if (!step || step === 2) {
//       const nameError = validateName(formData.name);
//       const phoneError = validatePhone(formData.phone);
//       const collegeNameError = validateRequired(formData.collegeName, "College Name");
//       const eventNameError = validateRequired(formData.eventName, "Event Name");
      
//       if (nameError) newErrors.name = nameError;
//       if (phoneError) newErrors.phone = phoneError;
//       if (collegeNameError) newErrors.collegeName = collegeNameError;
//       if (eventNameError) newErrors.eventName = eventNameError;
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNextStep = () => {
//     if (validateForm(1)) {
//       setCurrentStep(2);
//     }
//   };

//   const handlePrevStep = () => {
//     setCurrentStep(1);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (currentStep === 1) {
//       handleNextStep();
//     } else {
//       if (validateForm(2)) {
//         mutation.mutate(formData);
//       }
//     }
//   };

//   const renderStepIndicator = () => (
//     <div className="flex items-center justify-center mb-6">
//       {Array.from({ length: totalSteps }).map((_, index) => (
//         <div key={index} className="flex items-center">
//           <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
//             index + 1 <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
//           }`}>
//             {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
//           </div>
//           {index < totalSteps - 1 && (
//             <div className={`w-12 h-1 ${index + 1 < currentStep ? "bg-orange-500" : "bg-gray-200"}`}></div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-1">
//           <div className="w-full flex justify-center">
//             <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
//               <Building className="h-6 w-6 text-orange-500" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">College Registration</CardTitle>
//           <CardDescription className="text-center text-gray-500">
//             Create an account to showcase your events to sponsors
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {renderStepIndicator()}
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {currentStep === 1 ? (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                     className={errors.email ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                     placeholder="your.email@college.edu"
//                   />
//                   {errors.email && (
//                     <p className="text-sm text-red-500">{errors.email}</p>
//                   )}
//                 </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="password">Create Password</Label>
//                     <Input
//                       id="password"
//                       type="password"
//                       value={formData.password}
//                       onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                       className={errors.password ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                       placeholder="••••••••"
//                     />
//                     <PasswordStrength password={formData.password} />
//                     {errors.password && (
//                       <p className="text-sm text-red-500">{errors.password}</p>
//                     )}
//                     <p className="text-xs text-gray-500">Password must include uppercase, lowercase, number, and special character</p>
//                   </div>

//                 <Button
//                   type="button"
//                   onClick={handleNextStep}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white"
//                 >
//                   Continue <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                     className={errors.name ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                   />
//                   {errors.name && (
//                     <p className="text-sm text-red-500">{errors.name}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="collegeName">College Name</Label>
//                   <Input
//                     id="collegeName"
//                     type="text"
//                     value={formData.collegeName}
//                     onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
//                     className={errors.collegeName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                   />
//                   {errors.collegeName && (
//                     <p className="text-sm text-red-500">{errors.collegeName}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="eventName">Event Name</Label>
//                   <Input
//                     id="eventName"
//                     type="text"
//                     value={formData.eventName}
//                     onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
//                     className={errors.eventName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                   />
//                   {errors.eventName && (
//                     <p className="text-sm text-red-500">{errors.eventName}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                     className={errors.phone ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
//                   />
//                   {errors.phone && (
//                     <p className="text-sm text-red-500">{errors.phone}</p>
//                   )}
//                 </div>

//                 <div className="flex space-x-4 pt-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handlePrevStep}
//                     className="flex-1"
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
//                     disabled={mutation.status === "pending"}
//                   >
//                     {mutation.status === "pending" ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Registering...
//                       </>
//                     ) : (
//                       "Register"
//                     )}
//                   </Button>
//                 </div>
//               </>
//             )}
//           </form>

//           {mutation.status === "error" && (
//             <Alert variant="destructive" className="mt-4">
//               <AlertDescription>
//                 {mutation.error?.message || "An error occurred"}
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//         <CardFooter className="justify-center border-t pt-4">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link href="/auth/college/login" className="text-orange-500 font-medium hover:text-orange-600 hover:underline">
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
import { Loader2, ArrowRight, CheckCircle, Eye, EyeOff, GraduationCap } from "lucide-react";
import { CollegeRegisterData } from "@/app/types/collegeAuth";
import { validateEmail, validatePassword, validateName, validatePhone, validateRequired } from "@/app/lib/authValidation";
import { PasswordStrength } from "@/components/password-strength";

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
  const [showPassword, setShowPassword] = useState(false);

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
      const nameError = validateName(formData.name);
      const collegeNameError = validateRequired(formData.collegeName, "College Name");
      const eventNameError = validateRequired(formData.eventName, "Event Name");
      const phoneError = validatePhone(formData.phone);
      
      if (nameError) newErrors.name = nameError;
      if (collegeNameError) newErrors.collegeName = collegeNameError;
      if (eventNameError) newErrors.eventName = eventNameError;
      if (phoneError) newErrors.phone = phoneError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
    } else if (validateForm(currentStep)) {
      mutation.mutate(formData);
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            index + 1 < currentStep 
              ? "bg-orange-500 text-white" 
              : index + 1 === currentStep 
                ? "bg-orange-500 text-white" 
                : "bg-gray-200 text-gray-600"
          }`}>
            {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-12 ${index + 1 < currentStep ? "bg-orange-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Box - Left side */}
        <div className="hidden md:flex flex-col bg-white p-8 rounded-lg shadow-lg border border-orange-100">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <GraduationCap className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">College Registration</h2>
          </div>
          
          <div className="prose prose-orange">
            <p className="text-gray-600">
              Register your college events to connect with corporate sponsors and streamline your sponsorship management process.
            </p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Benefits for Colleges:</h3>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">1</span>
                  <span>Create standardized sponsorship packages</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">2</span>
                  <span>Gain visibility to corporate sponsors across the country</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">3</span>
                  <span>Receive verified implementation reports</span>
                </li>
                {/* <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">4</span>
                  <span>Track sponsorship metrics and fulfillment</span>
                </li> */}
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-700">How It Works</h3>
              <ol className="mt-2 space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <span>Register and complete your college profile</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <span>Define sponsorship packages with clear deliverables</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <span>Get matched with interested corporate sponsors</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <span>Use SPOCs to verify sponsorship implementation</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">5.</span>
                  <span>Receive payment and build long-term partnerships</span>
                </li>
              </ol>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Our platform simplifies sponsorship management from start to finish, helping you focus on creating exceptional events.
            </div>
          </div>
        </div>
        
        {/* Registration Form - Right side */}
        <Card className="w-full shadow-lg border-none">
          <CardHeader className="space-y-1">
            <div className="w-full flex justify-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <GraduationCap className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">College Registration</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Create an account to showcase your events to sponsors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                // Step 1: Account Information
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
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
                    <Label htmlFor="password">Create Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={errors.password ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
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
                    <PasswordStrength password={formData.password} />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">Password must include uppercase, lowercase, number, and special character.</p>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                // Step 2: College & Event Information
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collegeName">College Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="collegeName"
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                      className={errors.collegeName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                      placeholder="Your institution name"
                    />
                    {errors.collegeName && (
                      <p className="text-sm text-red-500">{errors.collegeName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="eventName"
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                      className={errors.eventName ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                      placeholder="Primary event name"
                    />
                    {errors.eventName && (
                      <p className="text-sm text-red-500">{errors.eventName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={errors.phone ? "border-red-500 focus-visible:ring-orange-500" : "focus-visible:ring-orange-500"}
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={mutation.status === "pending"}
                    >
                      {mutation.status === "pending" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                      onClick={prevStep}
                    >
                      Back to Previous Step
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
    </div>
  );
}