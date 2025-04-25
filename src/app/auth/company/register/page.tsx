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
import { Loader2, Building2 } from "lucide-react";
import { RegisterData } from "@/app/types/companyAuth";
import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    personName: "",
    position: "",
    companyName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

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
      router.push("/auth/company/login");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    Object.keys(formData).forEach((key) => {
      if (key !== 'email' && key !== 'password') {
        const error = validateRequired(formData[key as keyof RegisterData], key);
        if (error) newErrors[key as keyof RegisterData] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  // const formFields = [
  //   { name: 'email', label: 'Email', type: 'email' },
  //   { name: 'password', label: 'Password', type: 'password' },
  //   { name: 'personName', label: 'Person Name', type: 'text' },
  //   { name: 'position', label: 'Position', type: 'text' },
  //   { name: 'companyName', label: 'Company Name', type: 'text' },
  //   { name: 'phone', label: 'Phone', type: 'tel' },
  // ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Company Registration</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {formFields.map((field) => (
//               <div key={field.name} className="space-y-2">
//                 <Label htmlFor={field.name}>{field.label}</Label>
//                 <Input
//                   id={field.name}
//                   name={field.name}
//                   type={field.type}
//                   value={formData[field.name as keyof RegisterData]}
//                   onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
//                   className={errors[field.name as keyof RegisterData] ? "border-red-500" : ""}
//                 />
//                 {errors[field.name as keyof RegisterData] && (
//                   <p className="text-sm text-red-500">{errors[field.name as keyof RegisterData]}</p>
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
//             <Link href="/auth/company/login" className="text-blue-600 hover:underline">
//               Login here
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'email', label: 'Work Email', type: 'email', placeholder: 'name@company.com' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'personName', label: 'Representative Name', type: 'text' },
            { id: 'position', label: 'Your Position', type: 'text' },
            { id: 'companyName', label: 'Legal Company Name', type: 'text' },
            { id: 'phone', label: 'Business Phone', type: 'tel' },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-gray-700">{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id as keyof RegisterData]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                className={`focus-visible:ring-indigo-500 ${errors[field.id as keyof RegisterData] ? "border-red-500" : ""}`}
                placeholder={field.placeholder}
              />
              {errors[field.id as keyof RegisterData] && (
                <p className="text-sm text-red-500 mt-1">{errors[field.id as keyof RegisterData]}</p>
              )}
            </div>
          ))}

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
);
}