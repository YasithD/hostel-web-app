"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object({
  password: yup.string().required("Password is required"),
  code: yup.string().required("Code is required"),
});

type FormData = yup.InferType<typeof formSchema>;

const defaultValues: FormData = {
  password: "",
  code: "",
};

export default function ResetPassword() {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const form = useForm<FormData>({
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
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status !== "complete") {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      await setActive({ session: result.createdSessionId });
    } catch (error: any) {
      console.log(">>> Error on reset password: ", error);
      form.setError("password", { message: error.errors?.[0]?.longMessage });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center p-16 md:w-[500px] md:shadow-lg rounded-md bg-background">
        <p className="text-2xl font-semibold text-center">
          Welcome to
          <br />
          SUSL Hostel Management System
        </p>
        <p className="text-sm text-muted">Enter your new password along with the code sent to your email</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
