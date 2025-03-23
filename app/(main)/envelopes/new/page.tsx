"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  date: z.date({
    required_error: "Please select a date",
  }),
  recurring: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewEnvelopePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      date: new Date(),
      recurring: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Submitting envelope:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Envelope created successfully");
      router.push("/envelopes");
    } catch (error) {
      console.error("Error creating envelope:", error);
      toast.error("Failed to create envelope");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Envelope</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envelope Details</CardTitle>
          <CardDescription>
            Create a new budget envelope to track your spending
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Groceries" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your envelope a descriptive name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="text"
                          placeholder="0.00"
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set the total budget for this envelope
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When does this budget period start?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Recurring Budget</FormLabel>
                      <FormDescription>
                        This envelope will automatically renew each month
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/envelopes">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Envelope"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
} 