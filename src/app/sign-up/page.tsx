"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  suslEmail: yup.string().email("Invalid email address").required("Email is required"),
});

type FormData = yup.InferType<typeof formSchema>;

const defaultValues: FormData = {
  firstName: "",
  lastName: "",
  suslEmail: "",
};

export default function SignUp() {
  const { getToken } = useAuth();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const token = await getToken();
    /* Submit user details to the API */
    const result = await axiosInstance.post(
      "/api/v1/users",
      {
        email: data.suslEmail,
        first_name: data.firstName,
        last_name: data.lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/login");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <div className="h-full flex items-start justify-center md:pt-[120px] pt-8">
      {/* Form Section */}
      <div className="flex flex-col gap-4 items-center justify-center sm:w-[400px]">
        <p className="text-2xl font-semibold text-center">
          Welcome to
          <br />
          SUSL Hostel Management System
        </p>
        <p className="text-sm text-muted">Send your details and our admin will contact you to create an account</p>

        {/* Sign Up Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suslEmail"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">SUSL Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              Send Details
            </Button>
          </form>
        </Form>
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
