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
// import { Loader2, Upload } from "lucide-react";
// import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";
// import { toast } from "sonner";

// interface SpocRegisterData {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   collegeRollNumber: string;
//   idCard: File | null;
// }

// interface FormErrors {
//   email?: string;
//   password?: string;
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   collegeRollNumber?: string;
//   idCardError?: string;
// }

// export default function SpocRegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<SpocRegisterData>({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     phone: "",
//     collegeRollNumber: "",
//     idCard: null,
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData(prev => ({ ...prev, idCard: file }));
      
//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
    
//     // Validate email and password
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);
    
//     if (emailError) newErrors.email = emailError;
//     if (passwordError) newErrors.password = passwordError;
    
//     // Validate required fields
//     const requiredFields: (keyof SpocRegisterData)[] = ["firstName", "lastName", "phone", "collegeRollNumber"];
//     requiredFields.forEach(field => {
//       const error = validateRequired(formData[field] as string, field.toString());
//       if (error) newErrors[field as keyof FormErrors] = error;
//     });
    
//     // Validate ID card
//     if (!formData.idCard) {
//       newErrors.idCardError = "College ID card is required";
//     } else {
//       // Validate file type (only images)
//       const fileType = formData.idCard.type;
//       if (!fileType.startsWith('image/')) {
//         newErrors.idCardError = "Please upload an image file (JPG, PNG, etc.)";
//       }
      
//       // Validate file size (max 5MB)
//       const fileSize = formData.idCard.size / 1024 / 1024; // size in MB
//       if (fileSize > 5) {
//         newErrors.idCardError = "File size should not exceed 5MB";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (validateForm()) {
//       mutation.mutate(formData);
//     }
//   };

//   const mutation = useMutation({
//     mutationFn: async (data: SpocRegisterData) => {
//       const formDataToSend = new FormData();
      
//       // Append text data
//       formDataToSend.append("email", data.email);
//       formDataToSend.append("password", data.password);
//       formDataToSend.append("firstName", data.firstName);
//       formDataToSend.append("lastName", data.lastName);
//       formDataToSend.append("phone", data.phone);
//       formDataToSend.append("collegeRollNumber", data.collegeRollNumber);
      
//       // Append file
//       if (data.idCard) {
//         formDataToSend.append("idCard", data.idCard);
//       }
      
//       try {
//         const res = await fetch("/api/auth/spoc/register", {
//           method: "POST",
//           body: formDataToSend,
//         });
        
//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.message || "Registration failed");
//         }
        
//         return res.json();
//       } catch (error) {
//         console.error("Registration error:", error);
//         throw error;
//       }
//     },
//     onSuccess: () => {
//       toast.success("Registration successful! Please check your email to verify your account.");
//       router.push("/auth/spoc/login?registrationSuccess=true");
//     },
//   });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">SPOC Registration</CardTitle>
//           <CardDescription className="text-center">
//             Register as a Single Point of Contact (SPOC) for college events
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
//                   className={errors.firstName ? "border-red-500" : ""}
//                 />
//                 {errors.firstName && (
//                   <p className="text-sm text-red-500">{errors.firstName}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
//                   className={errors.lastName ? "border-red-500" : ""}
//                 />
//                 {errors.lastName && (
//                   <p className="text-sm text-red-500">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
//                 value={formData.password}
//                 onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                 className={errors.password ? "border-red-500" : ""}
//               />
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                 className={errors.phone ? "border-red-500" : ""}
//               />
//               {errors.phone && (
//                 <p className="text-sm text-red-500">{errors.phone}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="collegeRollNumber">College Roll Number</Label>
//               <Input
//                 id="collegeRollNumber"
//                 value={formData.collegeRollNumber}
//                 onChange={(e) => setFormData(prev => ({ ...prev, collegeRollNumber: e.target.value }))}
//                 className={errors.collegeRollNumber ? "border-red-500" : ""}
//               />
//               {errors.collegeRollNumber && (
//                 <p className="text-sm text-red-500">{errors.collegeRollNumber}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="idCard">College ID Card (Image)</Label>
//               <div 
//                 className={`border-2 border-dashed rounded-md p-4 ${
//                   errors.idCardError ? "border-red-500" : "border-gray-300"
//                 } ${previewUrl ? "bg-gray-50" : ""}`}
//               >
//                 <input
//                   id="idCard"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
                
//                 {previewUrl ? (
//                   <div className="space-y-2">
//                     <div className="relative aspect-video rounded overflow-hidden">
//                       <img 
//                         src={previewUrl} 
//                         alt="ID Card Preview" 
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div className="flex justify-center">
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         size="sm"
//                         onClick={() => {
//                           setFormData(prev => ({ ...prev, idCard: null }));
//                           setPreviewUrl(null);
//                         }}
//                       >
//                         Change Image
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <label 
//                     htmlFor="idCard" 
//                     className="flex flex-col items-center justify-center h-32 cursor-pointer"
//                   >
//                     <Upload className="h-8 w-8 text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-500">Click to upload your college ID card</p>
//                     <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
//                   </label>
//                 )}
//               </div>
//               {errors.idCardError && (
//                 <p className="text-sm text-red-500">{errors.idCardError}</p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Registering...
//                 </>
//               ) : (
//                 "Register as SPOC"
//               )}
//             </Button>
//           </form>

//           {mutation.isError && (
//             <Alert variant="destructive" className="mt-4">
//               <AlertDescription>
//                 {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link href="/auth/spoc/login" className="text-blue-600 hover:underline">
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
// import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Loader2, Upload, UserCheck, Eye, EyeOff, Info, CheckCircle, ArrowRight } from "lucide-react";
import { validateEmail, validatePassword, validateName, validatePhone, validateRequired } from "@/app/lib/authValidation";
import { toast } from "sonner";
import { PasswordStrength } from "@/components/password-strength";

interface SpocRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  collegeRollNumber: string;
  idCard: File | null;
}

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  collegeRollNumber?: string;
  idCardError?: string;
}

export default function SpocRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const [formData, setFormData] = useState<SpocRegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    collegeRollNumber: "",
    idCard: null,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ 
          ...prev, 
          idCardError: "Please upload JPG file" 
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      const fileSize = file.size / 1024 / 1024; // size in MB
      if (fileSize > 5) {
        setErrors(prev => ({ 
          ...prev, 
          idCardError: "File size should not exceed 5MB" 
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, idCard: file }));
      setErrors(prev => ({ ...prev, idCardError: undefined }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      // First step validation (account credentials)
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      
      if (emailError) newErrors.email = emailError;
      if (passwordError) newErrors.password = passwordError;
    }
    
    if (step === 2) {
      // Second step validation (personal details & ID)
      const firstNameError = validateName(formData.firstName);
      const lastNameError = validateName(formData.lastName);
      const phoneError = validatePhone(formData.phone);
      const rollNumberError = validateRequired(formData.collegeRollNumber, "College Roll Number");
      
      if (firstNameError) newErrors.firstName = firstNameError;
      if (lastNameError) newErrors.lastName = lastNameError;
      if (phoneError) newErrors.phone = phoneError;
      if (rollNumberError) newErrors.collegeRollNumber = rollNumberError;
      
      // Validate ID card
      if (!formData.idCard) {
        newErrors.idCardError = "College ID card is required";
      }
      
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
    } else if (validateForm(currentStep)) {
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: SpocRegisterData) => {
      const formDataToSend = new FormData();
      
      // Append text data
      formDataToSend.append("email", data.email);
      formDataToSend.append("password", data.password);
      formDataToSend.append("firstName", data.firstName);
      formDataToSend.append("lastName", data.lastName);
      formDataToSend.append("phone", data.phone);
      formDataToSend.append("collegeRollNumber", data.collegeRollNumber);
      
      // Append file
      if (data.idCard) {
        formDataToSend.append("idCard", data.idCard);
      }
      
      try {
        const res = await fetch("/api/auth/spoc/register", {
          method: "POST",
          body: formDataToSend,
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Registration failed");
        }
        
        return res.json();
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Registration successful! Please check your email to verify your account.");
      router.push("/auth/spoc/login?registrationSuccess=true");
    },
  });
  
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
              <UserCheck className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Become a SPOC</h2>
          </div>
          
          <div className="prose prose-orange">
            <p className="text-gray-600">
              Join our network of trusted <strong>Single Points of Contact (SPOCs)</strong> and help ensure 
              sponsorship transparency between colleges and companies.
            </p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Your Role as a SPOC:</h3>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">1</span>
                  <span>Document sponsorship implementation with photos</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">2</span>
                  <span>Track and verify promised metrics (banners, signups, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">3</span>
                  <span>Submit verification reports through our platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">4</span>
                  <span>Ensure transparency for sponsorships at your college</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-700 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Benefits of being a SPOC
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Certificate of verified sponsor experience</li>
                <li>• Network with companies and college organizers</li>
                <li>• Earn incentives for completed verifications</li>
                <li>• Gain experience in event management</li>
                <li>• Build your resume with real-world experience</li>
              </ul>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Once registered, your application will be reviewed and you'll be assigned to events at your college.
            </div>
          </div>
        </div>
        
        {/* Registration Form - Right side */}
        <Card className="w-full shadow-lg border-none">
          <CardHeader className="space-y-1">
            <div className="w-full flex justify-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <UserCheck className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">SPOC Registration</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Register as a Single Point of Contact (SPOC) for college events
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
                      className={`${errors.email ? "border-red-500" : ""} focus-visible:ring-orange-500`}
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
                    <PasswordStrength password={formData.password} />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </p>
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
                // Step 2: Personal Information
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`${errors.firstName ? "border-red-500" : ""} focus-visible:ring-orange-500`}
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`${errors.lastName ? "border-red-500" : ""} focus-visible:ring-orange-500`}
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`${errors.phone ? "border-red-500" : ""} focus-visible:ring-orange-500`}
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collegeRollNumber">College Roll Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="collegeRollNumber"
                      value={formData.collegeRollNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, collegeRollNumber: e.target.value }))}
                      className={`${errors.collegeRollNumber ? "border-red-500" : ""} focus-visible:ring-orange-500`}
                      placeholder="Your college roll/registration number"
                    />
                    {errors.collegeRollNumber && (
                      <p className="text-sm text-red-500">{errors.collegeRollNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idCard">College ID Card <span className="text-red-500">*</span></Label>
                    <div 
                      className={`border-2 border-dashed rounded-md p-4 transition-colors ${
                        errors.idCardError 
                          ? "border-red-500 bg-red-50" 
                          : previewUrl 
                            ? "border-green-300 bg-green-50" 
                            : "border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                      }`}
                    >
                      <input
                        id="idCard"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      
                      {previewUrl ? (
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded overflow-hidden">
                            <img 
                              src={previewUrl} 
                              alt="ID Card Preview" 
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, idCard: null }));
                                setPreviewUrl(null);
                              }}
                              className="text-orange-500 border-orange-500 hover:text-orange-600 hover:bg-orange-50"
                            >
                              Change Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label 
                          htmlFor="idCard" 
                          className="flex flex-col items-center justify-center h-32 cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-orange-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload your college ID card</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG only, up to 5MB</p>
                        </label>
                      )}
                    </div>
                    {errors.idCardError && (
                      <p className="text-sm text-red-500">{errors.idCardError}</p>
                    )}
                  </div>
                  
                  {/* <div className="space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                        className={`${errors.agreeToTerms ? "border-red-500" : ""} data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500`}
                      />
                      <Label 
                        htmlFor="terms" 
                        className={`text-sm ${errors.agreeToTerms ? "text-red-500" : "text-gray-600"}`}
                      >
                        I agree to the <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                    )}
                  </div> */}

                  <div className="flex flex-col space-y-3 mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
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

            {mutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/spoc/login" className="text-orange-500 hover:text-orange-600 hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}