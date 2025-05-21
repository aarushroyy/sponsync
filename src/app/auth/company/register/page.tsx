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
// import { Loader2, Building2 } from "lucide-react";
// import { RegisterData } from "@/app/types/companyAuth";
// import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";

// export default function CompanyRegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<RegisterData>({
//     email: "",
//     password: "",
//     personName: "",
//     position: "",
//     companyName: "",
//     phone: "",
//   });
//   const [errors, setErrors] = useState<Partial<RegisterData>>({});

//   const mutation = useMutation({
//     mutationFn: async (data: RegisterData) => {
//       const res = await fetch("/api/auth/company/register", {
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
//       router.push("/auth/company/login");
//     },
//   });

//   const validateForm = (): boolean => {
//     const newErrors: Partial<RegisterData> = {};
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
    
//     if (emailError) newErrors.email = emailError;
//     if (passwordError) newErrors.password = passwordError;
    
//     Object.keys(formData).forEach((key) => {
//       if (key !== 'email' && key !== 'password') {
//         const error = validateRequired(formData[key as keyof RegisterData], key);
//         if (error) newErrors[key as keyof RegisterData] = error;
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

//   // const formFields = [
//   //   { name: 'email', label: 'Email', type: 'email' },
//   //   { name: 'password', label: 'Password', type: 'password' },
//   //   { name: 'personName', label: 'Person Name', type: 'text' },
//   //   { name: 'position', label: 'Position', type: 'text' },
//   //   { name: 'companyName', label: 'Company Name', type: 'text' },
//   //   { name: 'phone', label: 'Phone', type: 'tel' },
//   // ];

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <Card className="w-full max-w-md">
// //         <CardHeader>
// //           <CardTitle className="text-2xl font-bold text-center">Company Registration</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {formFields.map((field) => (
// //               <div key={field.name} className="space-y-2">
// //                 <Label htmlFor={field.name}>{field.label}</Label>
// //                 <Input
// //                   id={field.name}
// //                   name={field.name}
// //                   type={field.type}
// //                   value={formData[field.name as keyof RegisterData]}
// //                   onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
// //                   className={errors[field.name as keyof RegisterData] ? "border-red-500" : ""}
// //                 />
// //                 {errors[field.name as keyof RegisterData] && (
// //                   <p className="text-sm text-red-500">{errors[field.name as keyof RegisterData]}</p>
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
// //             <Link href="/auth/company/login" className="text-blue-600 hover:underline">
// //               Login here
// //             </Link>
// //           </p>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

// return (
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//     <Card className="w-full max-w-md shadow-lg border-0">
//       <CardHeader className="space-y-1">
//         <div className="w-full flex justify-center">
//           <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
//             <Building2 className="h-6 w-6 text-indigo-600" />
//           </div>
//         </div>
//         <CardTitle className="text-2xl font-bold text-center text-gray-900">
//           Corporate Registration
//         </CardTitle>
//         <CardDescription className="text-center text-gray-500">
//           Join our network of premium sponsors
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {[
//             { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com' },
//             { id: 'password', label: 'Password', type: 'password' },
//             { id: 'personName', label: 'Representative Name', type: 'text' },
//             { id: 'position', label: 'Your Position', type: 'text' },
//             { id: 'companyName', label: 'Legal Company Name', type: 'text' },
//             { id: 'phone', label: 'Business Phone', type: 'tel' },
//           ].map((field) => (
//             <div key={field.id} className="space-y-2">
//               <Label htmlFor={field.id} className="text-gray-700">{field.label}</Label>
//               <Input
//                 id={field.id}
//                 type={field.type}
//                 value={formData[field.id as keyof RegisterData]}
//                 onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
//                 className={`focus-visible:ring-indigo-500 ${errors[field.id as keyof RegisterData] ? "border-red-500" : ""}`}
//                 placeholder={field.placeholder}
//               />
//               {errors[field.id as keyof RegisterData] && (
//                 <p className="text-sm text-red-500 mt-1">{errors[field.id as keyof RegisterData]}</p>
//               )}
//             </div>
//           ))}

//           <Button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
//             disabled={mutation.isPending}
//           >
//             {mutation.isPending ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Establishing Partnership...
//               </>
//             ) : "Complete Registration"}
//           </Button>
//         </form>

//         {mutation.isError && (
//           <Alert variant="destructive" className="mt-4">
//             <AlertDescription>{mutation.error.message}</AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//       <CardFooter className="justify-center border-t pt-4">
//         <p className="text-sm text-gray-600">
//           Existing partner?{" "}
//           <Link
//             href="/auth/company/login"
//             className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
//           >
//             Access your account
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   </div>
// );
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
// import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Loader2, Building2, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { RegisterData } from "@/app/types/companyAuth";
import { validateEmail, validatePassword, validateName, validatePhone, validateRequired,validateLinkedIn, validateWorkEmail } from "@/app/lib/authValidation";
import { PasswordStrength } from "@/components/password-strength";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    personName: "",
    position: "",
    companyName: "",
    phone: "",
    workEmail: "",    // NEW
    linkedIn: "",     // NEW
  });
  
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (step: number): boolean => {
    const newErrors: Partial<RegisterData> = {};
    
    if (step === 1) {
      // First step validation - account credentials
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      
      if (emailError) newErrors.email = emailError;
      if (passwordError) newErrors.password = passwordError;
    }
    
    if (step === 2) {
      // Second step validation - personal and company details
      const nameError = validateName(formData.personName);
      const positionError = validateRequired(formData.position, "Position");
      const companyNameError = validateRequired(formData.companyName, "Company Name");
      const phoneError = validatePhone(formData.phone);
      const workEmailError = validateWorkEmail(formData.workEmail || "");
    const linkedInError = validateLinkedIn(formData.linkedIn || "");
  
      
      if (nameError) newErrors.personName = nameError;
      if (positionError) newErrors.position = positionError;
      if (companyNameError) newErrors.companyName = companyNameError;
      if (phoneError) newErrors.phone = phoneError;
      if (workEmailError) newErrors.workEmail = workEmailError;
    if (linkedInError) newErrors.linkedIn = linkedInError;
      
      // Validate terms agreement
      // if (!formData.agreeToTerms) {
      //   newErrors.agreeToTerms = "You must agree to the terms and conditions";
      // }
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

  const mutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await fetch("/api/auth/company/register", {
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
      router.push("/auth/company/login?registration=success");
    },
  });

  // Fix for the handleSubmit function in src/app/auth/company/register/page.tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (currentStep < totalSteps) {
    nextStep();
  } else if (validateForm(currentStep)) {
    // Fix: Instead of destructuring and not using the variable,
    // create a new object with only the properties we need
    const dataToSend = {
      email: formData.email,
      password: formData.password,
      personName: formData.personName,
      position: formData.position,
      companyName: formData.companyName,
      phone: formData.phone,
      workEmail: formData.workEmail,    // NEW
      linkedIn: formData.linkedIn,     // NEW
    };
    
    mutation.mutate(dataToSend);
  }
};
  
  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            index + 1 < currentStep 
              ? "bg-indigo-600 text-white" 
              : index + 1 === currentStep 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 text-gray-600"
          }`}>
            {index + 1 < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-12 ${index + 1 < currentStep ? "bg-indigo-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Box - Left side */}
        <div className="hidden md:flex flex-col bg-white p-8 rounded-lg shadow-lg border border-indigo-100">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Become a Corporate Partner</h2>
          </div>
          
          <div className="prose prose-indigo">
            <p className="text-gray-600">
              Join our network of premier sponsors and connect with college events that align with your brand values and marketing objectives.
            </p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Why Partner With Us?</h3>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 flex-shrink-0">1</span>
                  <span>Access to curated college events based on your target demographics</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 flex-shrink-0">2</span>
                  <span>Standardized sponsorship packages with clear deliverables</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 flex-shrink-0">3</span>
                  <span>Verified implementation reports from independent SPOCs</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 flex-shrink-0">4</span>
                  <span>Comprehensive analytics dashboard to track ROI</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-medium text-indigo-700">How It Works</h3>
              <ol className="mt-2 space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <span>Create your company account and set up your profile</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <span>Browse available events by region, type, or demographics</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <span>Select sponsorship packages that meet your objectives</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <span>Receive verified reports and analytics after the event</span>
                </li>
              </ol>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Our platform ensures transparency and accountability, so you can be confident your sponsorship investment delivers real results.
            </div>
          </div>
        </div>
        
        {/* Registration Form - Right side */}
        <Card className="w-full shadow-lg border-none">
          <CardHeader className="space-y-1">
            <div className="w-full flex justify-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Corporate Registration
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Join our network of premium sponsors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                // Step 1: Account Information
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Work Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`focus-visible:ring-indigo-500 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Create Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`focus-visible:ring-indigo-500 pr-10 ${errors.password ? "border-red-500" : ""}`}
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
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </p>
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-6"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                // Step 2: Company & Personal Information
                <>
                  <div className="space-y-2">
                    <Label htmlFor="personName" className="text-gray-700">Representative Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="personName"
                      type="text"
                      value={formData.personName}
                      onChange={(e) => setFormData(prev => ({ ...prev, personName: e.target.value }))}
                      className={`focus-visible:ring-indigo-500 ${errors.personName ? "border-red-500" : ""}`}
                      placeholder="Your full name"
                    />
                    {errors.personName && <p className="text-sm text-red-500 mt-1">{errors.personName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-gray-700">Your Position <span className="text-red-500">*</span></Label>
                    <Input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className={`focus-visible:ring-indigo-500 ${errors.position ? "border-red-500" : ""}`}
                      placeholder="e.g. Marketing Manager"
                    />
                    {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-700">Legal Company Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className={`focus-visible:ring-indigo-500 ${errors.companyName ? "border-red-500" : ""}`}
                      placeholder="Your company's legal name"
                    />
                    {errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Business Phone <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`focus-visible:ring-indigo-500 ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="workEmail" className="text-gray-700">
                        Work Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="workEmail"
                        type="email"
                        value={formData.workEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, workEmail: e.target.value }))}
                        className={`focus-visible:ring-indigo-500 ${errors.workEmail ? "border-red-500" : ""}`}
                        placeholder="your.name@company.com"
                      />
                      {errors.workEmail && <p className="text-sm text-red-500 mt-1">{errors.workEmail}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedIn" className="text-gray-700">
                        LinkedIn Profile <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="linkedIn"
                        type="text"
                        value={formData.linkedIn}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                        className={`focus-visible:ring-indigo-500 ${errors.linkedIn ? "border-red-500" : ""}`}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                      {errors.linkedIn && <p className="text-sm text-red-500 mt-1">{errors.linkedIn}</p>}
                    </div>
                  
                  
                  {/* <div className="space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                        className={`${errors.agreeToTerms ? "border-red-500" : ""} data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600`}
                      />
                      <Label 
                        htmlFor="terms" 
                        className={`text-sm ${errors.agreeToTerms ? "text-red-500" : "text-gray-600"}`}
                      >
                        I agree to the <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                    )}
                  </div> */}

                  <div className="flex flex-col space-y-3 mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Establishing Partnership...
                        </>
                      ) : "Complete Registration"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      onClick={prevStep}
                    >
                      Back to Previous Step
                    </Button>
                  </div>
                </>
              )}
            </form>

            {mutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Existing partner?{" "}
              <Link
                href="/auth/company/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Access your account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}