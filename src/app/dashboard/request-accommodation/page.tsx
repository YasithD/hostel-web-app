"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProgressRing } from "@/components/ui/progress-ring";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Create Yup schema
const formSchema = yup.object({
  typeOfStudent: yup
    .string()
    .oneOf(["internal", "external"] as const)
    .defined(),

  // Internal student fields
  faculty: yup
    .string()
    .when("typeOfStudent", {
      is: "internal",
      then: (schema) => schema.required("Faculty is required"),
      otherwise: (schema) => schema.notRequired().default(""),
    })
    .defined(),
  academicYear: yup
    .string()
    .when("typeOfStudent", {
      is: "internal",
      then: (schema) =>
        schema
          .required("Academic year is required")
          .matches(/^\d{2}\/\d{2}$/, "Academic year must be in format YY/YY (e.g. 22/23)")
          .test("valid-academic-year", "Second year must be one more than first year", (val) => {
            if (!val) return false;
            const [first, second] = val.split("/");
            return parseInt(second) === parseInt(first) + 1;
          }),
      otherwise: (schema) => schema.notRequired().default(""),
    })
    .defined(),
  semester: yup
    .string()
    .when("typeOfStudent", {
      is: "internal",
      then: (schema) => schema.required("Semester is required"),
      otherwise: (schema) => schema.notRequired().default(""),
    })
    .defined(),

  // External student fields
  institution: yup
    .string()
    .when("typeOfStudent", {
      is: "external",
      then: (schema) => schema.required("Institution is required"),
      otherwise: (schema) => schema.notRequired().default(""),
    })
    .defined(),
  reason: yup
    .string()
    .when("typeOfStudent", {
      is: "external",
      then: (schema) => schema.oneOf(["sports", "event", "other"] as const).defined(),
      otherwise: (schema) => schema.notRequired().default(""),
    })
    .defined(),
  otherReason: yup
    .string()
    .when(["typeOfStudent", "reason"], {
      is: (type: any, reason: any) => type === "external" && reason === "other",
      then: (schema) => schema.required("Other reason is required"),
      otherwise: (schema) => schema.transform(() => ""),
    })
    .defined(),

  // Common fields
  maleStudentCount: yup
    .number()
    .min(0, "Male student count must be at least 0")
    .required("Male student count is required"),
  femaleStudentCount: yup
    .number()
    .min(0, "Female student count must be at least 0")
    .required("Female student count is required"),
  startDate: yup
    .date()
    .required("Start date is required")
    .test("start-after-today", "Start date cannot be in the past", (date) => {
      if (!date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }),
  endDate: yup
    .date()
    .required("End date is required")
    .test("end-after-start", "End date cannot be before start date", function (endDate) {
      const startDate = this.parent.startDate;
      if (!endDate || !startDate) return true;
      return endDate >= startDate;
    }),
});

// Type definition for the form data
export type FormData = yup.InferType<typeof formSchema>;

// Default values
const defaultValues: FormData = {
  typeOfStudent: "internal",
  faculty: "",
  academicYear: "",
  semester: "",
  institution: "",
  reason: "",
  otherReason: "",
  maleStudentCount: 0,
  femaleStudentCount: 0,
  startDate: new Date(),
  endDate: new Date(),
};

export default function RequestAccommodation() {
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const isInternal = form.watch("typeOfStudent") === "internal";
  const isReasonOther = form.watch("reason") === "other";

  async function onSubmit(values: FormData) {
    await fetch("/api/request", {
      method: "POST",
      body: JSON.stringify(values),
    });
  }

  return (
    <div className="mx-auto h-full w-full md:w-[550px]">
      {/* Form Component */}
      {!form.formState.isSubmitting && (
        <div className="flex flex-col items-center p-10 md:my-10 md:shadow-[0_0_16px_4px_rgba(0,0,0,0.1)] rounded-lg">
          <div className="flex flex-col gap-4 mb-10">
            <h1 className="text-2xl font-bold text-primary">Request Accommodation</h1>
            <p className="text-sm">Please fill in the form below to request accommodation for your students.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="typeOfStudent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Student</FormLabel>
                    <FormDescription>
                      Please select the type of students for which you are requesting accommodation.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="internal" id="internal" />
                          <Label htmlFor="internal">Internal</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="external" id="external" />
                          <Label htmlFor="external">External</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              {isInternal && (
                <>
                  <FormField
                    control={form.control}
                    name="faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty</FormLabel>
                        <FormDescription>Please select the faculty the students are in.</FormDescription>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a faculty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Faculty of Agricultural Sciences">
                                Faculty of Agricultural Sciences
                              </SelectItem>
                              <SelectItem value="Faculty of Applied Sciences">Faculty of Applied Sciences</SelectItem>
                              <SelectItem value="Faculty of Computing">Faculty of Computing</SelectItem>
                              <SelectItem value="Faculty of Geomatics">Faculty of Geomatics</SelectItem>
                              <SelectItem value="Faculty of Graduate Studies">Faculty of Graduate Studies</SelectItem>
                              <SelectItem value="Faculty of Management Studies">
                                Faculty of Management Studies
                              </SelectItem>
                              <SelectItem value="Faculty of Medicine">Faculty of Medicine</SelectItem>
                              <SelectItem value="Faculty of Social Sciences and Languages">
                                Faculty of Social Sciences and Languages
                              </SelectItem>
                              <SelectItem value="Faculty of Technology">Faculty of Technology</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <FormDescription>Please select the academic year the students are in.</FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormDescription>Please select the semester the students are in.</FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {!isInternal && (
                <>
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormDescription>Please enter the institution the students are from.</FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormDescription>
                          Please enter the reason the students are requesting accommodation.
                        </FormDescription>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="sports" id="sports" />
                              <Label htmlFor="sports">Sports</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="event" id="event" />
                              <Label htmlFor="event">Event</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isReasonOther && (
                    <FormField
                      control={form.control}
                      name="otherReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Reason</FormLabel>
                          <FormDescription>
                            Please enter the other reason the students are requesting accommodation.
                          </FormDescription>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
              <FormField
                control={form.control}
                name="maleStudentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Male Student Count</FormLabel>
                    <FormDescription>Please enter the number of male students.</FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        {...form.register("maleStudentCount", {
                          setValueAs: (v) => (v === "" ? 0 : Number(v)),
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="femaleStudentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Female Student Count</FormLabel>
                    <FormDescription>Please enter the number of female students.</FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        {...form.register("femaleStudentCount", {
                          setValueAs: (v) => (v === "" ? 0 : Number(v)),
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormDescription>Please enter the start date of the accommodation.</FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormDescription>Please enter the end date of the accommodation.</FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Progress Ring */}
      {form.formState.isSubmitting && (
        <div className="flex flex-col h-full items-center justify-center gap-4">
          <ProgressRing className="w-20 h-20" />
          <p className="text-lg text-muted-foreground">Submitting...</p>
        </div>
      )}
    </div>
  );
}
