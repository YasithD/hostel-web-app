"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/db/schema";
import axiosInstance from "@/utils/axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon, Edit, LockIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

type FormData = yup.InferType<typeof formSchema>;

const defaultValues: FormData = {
  firstName: "",
  lastName: "",
};

export default function Profile() {
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState({ firstName: false, lastName: false });
  const { isSignedIn, isLoaded, user } = useUser();

  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const updateUserInfo = async () => {
      form.reset({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      });
    };
    updateUserInfo();
  }, [user]);

  const onSubmit = async (data: FormData) => {
    if (!isSignedIn || !isLoaded) {
      return;
    }

    const token = await getToken();
    const userEmail = user?.emailAddresses[0].emailAddress;
    const result = await axiosInstance.put(`/api/v1/users/${userEmail}`, {
      payload: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.status === 200) {
      await user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }

    setIsEditing({ firstName: false, lastName: false });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] sm:pt-10 bg-primary-gradient relative">
      {/* Home Buttom */}
      <Link href="/dashboard" className="flex items-center gap-2 py-2 px-4 mx-auto bg-secondary rounded-lg w-fit">
        <ArrowLeftIcon size={16} />
        <p className="text-sm font-medium text-foreground">Dashboard</p>
      </Link>

      {/* Profile Form */}
      <div className="mt-5 flex flex-col mx-auto w-[400px] p-10 bg-white shadow-[0_4px_24px_8px_rgba(0,0,0,0.12)] rounded-lg">
        <div className="flex flex-col gap-4 mb-10 justify-center items-center">
          <p className="text-3xl font-semibold text-primary">User Profile</p>
          <p className="text-sm text-muted">Manage your personal information.</p>
          <div className="w-20 h-1 bg-secondary rounded-full" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="text-sm font-semibold text-foreground-muted">First Name</p>
              </div>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      {isEditing.firstName ? (
                        <Input className="text-sm" {...field} />
                      ) : (
                        <div className="flex justify-between items-center border-b border-border pb-1">
                          <p className="text-sm font-semibold text-foreground">{field.value}</p>
                          <Edit
                            className="cursor-pointer"
                            size={16}
                            onClick={() => setIsEditing({ ...isEditing, firstName: true })}
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="text-sm font-semibold text-foreground-muted">Last Name</p>
              </div>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      {isEditing.lastName ? (
                        <Input className="text-sm" {...field} />
                      ) : (
                        <div className="flex justify-between items-center border-b border-border pb-1">
                          <p className="text-sm font-medium text-foreground">{field.value}</p>
                          <Edit
                            className="cursor-pointer"
                            size={16}
                            onClick={() => setIsEditing({ ...isEditing, lastName: true })}
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col w-full gap-2">
                <p className="text-sm font-semibold text-foreground-muted">Email</p>
                <div className="flex gap-2 items-center border-b border-border pb-1">
                  <LockIcon size={16} color="#4d4d4d" />
                  <p className="w-full text-sm font-medium text-muted">
                    {user?.emailAddresses[0].emailAddress ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground-muted">User Type</p>
                <p className="text-xs w-fit text-foreground py-1 px-2 rounded-md bg-success">
                  {(user?.publicMetadata.role as string)?.toUpperCase()}
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!form.formState.isValid || form.formState.isSubmitting || !form.formState.isDirty}
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
