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
import { Loader2, Upload } from "lucide-react";
import { validateEmail, validatePassword, validateRequired } from "@/app/lib/authValidation";
import { toast } from "sonner";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, idCard: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate email and password
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    // Validate required fields
    const requiredFields: (keyof SpocRegisterData)[] = ["firstName", "lastName", "phone", "collegeRollNumber"];
    requiredFields.forEach(field => {
      const error = validateRequired(formData[field] as string, field.toString());
      if (error) newErrors[field as keyof FormErrors] = error;
    });
    
    // Validate ID card
    if (!formData.idCard) {
      newErrors.idCardError = "College ID card is required";
    } else {
      // Validate file type (only images)
      const fileType = formData.idCard.type;
      if (!fileType.startsWith('image/')) {
        newErrors.idCardError = "Please upload an image file (JPG, PNG, etc.)";
      }
      
      // Validate file size (max 5MB)
      const fileSize = formData.idCard.size / 1024 / 1024; // size in MB
      if (fileSize > 5) {
        newErrors.idCardError = "File size should not exceed 5MB";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">SPOC Registration</CardTitle>
          <CardDescription className="text-center">
            Register as a Single Point of Contact (SPOC) for college events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeRollNumber">College Roll Number</Label>
              <Input
                id="collegeRollNumber"
                value={formData.collegeRollNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, collegeRollNumber: e.target.value }))}
                className={errors.collegeRollNumber ? "border-red-500" : ""}
              />
              {errors.collegeRollNumber && (
                <p className="text-sm text-red-500">{errors.collegeRollNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idCard">College ID Card (Image)</Label>
              <div 
                className={`border-2 border-dashed rounded-md p-4 ${
                  errors.idCardError ? "border-red-500" : "border-gray-300"
                } ${previewUrl ? "bg-gray-50" : ""}`}
              >
                <input
                  id="idCard"
                  type="file"
                  accept="image/*"
                  className="hidden"
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
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload your college ID card</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                  </label>
                )}
              </div>
              {errors.idCardError && (
                <p className="text-sm text-red-500">{errors.idCardError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as SPOC"
              )}
            </Button>
          </form>

          {mutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/spoc/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}