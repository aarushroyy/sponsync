"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { validateEmail, validatePassword } from "@/app/lib/authValidation";
import { toast } from "sonner";

interface SpocLoginData {
  email: string;
  password: string;
}

export default function SpocLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginData, setLoginData] = useState<SpocLoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<SpocLoginData>>({});

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

  const mutation = useMutation({
    mutationFn: async (data: SpocLoginData) => {
      const res = await fetch("/api/auth/spoc/login", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">SPOC Login</CardTitle>
          <CardDescription className="text-center">
            Log in as a Single Point of Contact (SPOC)
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
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
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
                {mutation.error?.message || "An error occurred during login"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/auth/spoc/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}