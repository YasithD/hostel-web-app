"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/db/schema";
import axiosInstance from "@/utils/axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "lucide-react";
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
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] sm:pt-10">
      <div className="flex flex-col mx-auto w-[400px] p-10 sm:shadow-[0_0_16px_4px_rgba(0,0,0,0.1)] rounded-lg">
        <p className="text-3xl font-semibold text-primary mb-10">User Profile</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-foreground-muted">First Name</p>
                <Edit
                  className="cursor-pointer"
                  size={16}
                  onClick={() => setIsEditing({ ...isEditing, firstName: true })}
                />
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
                        <p className="text-sm font-medium text-foreground">{field.value}</p>
                      )}
                    </FormControl>
                    <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-foreground-muted">Last Name</p>
                <Edit
                  className="cursor-pointer"
                  size={16}
                  onClick={() => setIsEditing({ ...isEditing, lastName: true })}
                />
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
                        <p className="text-sm font-medium text-foreground">{field.value}</p>
                      )}
                    </FormControl>
                    <FormMessage className="absolute my-0 bottom-0 translate-y-full pt-1" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground-muted">Email</p>
                <p className="text-sm font-medium text-foreground">{user?.emailAddresses[0].emailAddress ?? "N/A"}</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground-muted">User Type</p>
                <p className="text-sm font-medium text-foreground">
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
