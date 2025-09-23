"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLoginErrorMessage } from "@/utils/errors";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof formSchema>;

const defaultValues: FormData = {
  email: "",
  password: "",
};

export default function Login() {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    if (!isLoaded) {
      alert("Please wait while we are loading the page.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }

    try {
      /* Try to sign in */
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      /* If the sign in is not complete, show the error */
      if (result.status !== "complete") {
        console.log(JSON.stringify(result, null, 2));
      }

      /* If the sign in is complete, set the active session */
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (error: any) {
      console.log(error.message);
      const errorMessage = getLoginErrorMessage(error.message);
      if (errorMessage) {
        form.setError(errorMessage.key, { message: errorMessage.message });
      } else {
        console.log(">>> Error on login: ", error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <div className="h-full flex items-center justify-center">
      {/* Form Section */}
      <div className="flex flex-col gap-4 items-center justify-center p-16 md:w-[500px] md:shadow-lg rounded-md bg-background">
        <p className="text-2xl font-semibold text-center">
          Welcome to
          <br />
          SUSL Hostel Management System
        </p>
        <p className="text-sm text-muted">Login to your account to continue</p>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={isPasswordVisible ? "text" : "password"} className="pr-8" {...field} />
                      {isPasswordVisible ? (
                        <EyeClosed
                          size={18}
                          color="#4d4d4d"
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <Eye
                          size={18}
                          color="#4d4d4d"
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={togglePasswordVisibility}
                        />
                      )}
                      <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                    </div>
                  </FormControl>
                  <div className="flex justify-end">
                    <Link href="/login/forgot-password">
                      <p className="text-sm text-muted">Forgot Password?</p>
                    </Link>
                  </div>
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
