"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDocument } from "@/lib/firestore";
import { User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const firebaseUser = userCredential.user;
      const userData = await getDocument<User>("users", firebaseUser.uid);

      if (!userData) {
        toast.error("User profile not found. Please register.");
        auth.signOut();
        setIsLoading(false);
        return;
      }

      // Handle custom token if we setup edge middleware, 
      // but for client side + simple middleware, we'll store basic identifiers in cookies.
      // In production, you would issue a session cookie via an API route.
      const token = await firebaseUser.getIdToken();
      Cookies.set("edubridge_token", token, { expires: 7 }); // 7 days
      Cookies.set("edubridge_role", userData.role, { expires: 7 });

      toast.success(`Welcome back, ${userData.name}!`);

      // Role-based routing
      if (userData.role === "student") {
        router.push("/dashboard/student");
      } else if (userData.role === "volunteer") {
        router.push("/dashboard/volunteer");
      } else if (userData.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-[header_height])] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-600">
          <div>
            {"Don't have an account? "}
            <Button
              variant="link"
              className="px-0"
              onClick={() => router.push("/auth/register/student")}
            >
              Register as Student
            </Button>
            {" | "}
            <Button
              variant="link"
              className="px-0"
              onClick={() => router.push("/volunteer/apply")}
            >
              Apply as Volunteer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
