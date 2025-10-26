"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
});

type FormData = yup.InferType<typeof formSchema>;

const defaultValues: FormData = {
  email: "",
};

export default function ResetPassword() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

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
      /* Try to send reset password link */
      const result = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      /* If the sign in is not complete, show the error */
      if (result.status !== "needs_first_factor") {
        console.log(JSON.stringify(result, null, 2));
        return;
      } else {
        /* If the sign in is complete, set the active session */
        router.push("/reset-password");
      }
    } catch (error: any) {
      console.log(">>> Error on sent link: ", error);
      form.setError("email", { message: error.errors?.[0]?.longMessage });
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center p-16 md:w-[500px] md:shadow-lg rounded-md bg-background">
        <p className="text-2xl font-semibold text-center">
          Welcome to
          <br />
          SUSL Hostel Management System
        </p>
        <p className="text-sm text-muted">Enter your email to receive reset password code</p>

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
            <Button className="w-full" type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
              Send Code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
