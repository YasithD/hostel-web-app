"use client";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const formSchema = yup.object({
  name: yup.string().required("Hostel name is required"),
  type: yup.string().oneOf(["male", "female"]).required("Hostel type is required"),
  totalCapacity: yup.number().min(0, "Total capacity must be at least 0").required("Total capacity is required"),
  availableCapacity: yup
    .number()
    .min(0, "Available capacity must be at least 0")
    .required("Available capacity is required")
    .test(
      "available-capacity-less-than-total",
      "Available capacity must be less than total capacity",
      function (value) {
        const totalCapacity = this.parent.totalCapacity;
        return value <= totalCapacity;
      }
    ),
});

type FormData = yup.InferType<typeof formSchema>;

type HostelEditViewProps = FormData & {
  hostelId: string;
};

export default function HostelEditView({
  hostelId,
  name,
  type,
  totalCapacity,
  availableCapacity,
}: HostelEditViewProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const defaultValues: FormData = {
    name,
    type,
    totalCapacity,
    availableCapacity,
  };
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(values: FormData) {
    const token = await getToken();
    await axiosInstance.put(
      `/api/v1/hostels/${hostelId}`,
      {
        name: values.name,
        type: values.type,
        total_capacity: values.totalCapacity,
        available_capacity: values.availableCapacity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/admin/dashboard/hostels");
  }

  return (
    <div className="mx-auto h-full w-full sm:w-[450px]">
      <div className="flex flex-col items-start p-10 sm:my-10 sm:shadow-[0_0_16px_4px_rgba(0,0,0,0.1)] rounded-lg">
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-2xl font-bold text-primary">Edit Hostel</h1>
          <p className="text-sm">Please fill in the form below to edit the hostel information.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Hostel name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="absolute my-o bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Hostel type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hostel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="absolute my-o bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalCapacity"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Total capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...form.register("totalCapacity", {
                        setValueAs: (v) => (v === "" ? 0 : Number(v)),
                      })}
                    />
                  </FormControl>
                  <FormMessage className="absolute my-o bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableCapacity"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-foreground">Available capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...form.register("availableCapacity", {
                        setValueAs: (v) => (v === "" ? 0 : Number(v)),
                      })}
                    />
                  </FormControl>
                  <FormMessage className="absolute my-o bottom-0 translate-y-full pt-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !form.formState.isValid || !form.formState.isDirty}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
