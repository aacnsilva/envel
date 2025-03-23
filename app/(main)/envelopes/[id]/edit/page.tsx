"use client";

import { useState, useEffect, use } from "react";
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
import { mockEnvelopes } from "@/lib/mock-data";

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

export default function EditEnvelopePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const p = use(params);
  const envelopeId = parseInt(p.id);

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

  // Fetch envelope data and populate form
  useEffect(() => {
    const fetchEnvelopeData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // Here we're using mock data
        const envelope = mockEnvelopes.find(e => e.id === envelopeId);
        
        if (envelope) {
          // Find the most recent amount
          const latestAmount = envelope.amounts.sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          )[0];
          
          form.reset({
            name: envelope.name,
            amount: latestAmount.amount.toString(),
            date: latestAmount.date,
            recurring: envelope.recurring
          });
        } else {
          toast.error("Envelope not found");
          router.push("/envelopes");
        }
      } catch (error) {
        console.error("Error fetching envelope:", error);
        toast.error("Failed to load envelope data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvelopeData();
  }, [envelopeId, form, router]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Updating envelope:", { id: envelopeId, ...values });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Envelope updated successfully");
      router.push(`/envelopes/${envelopeId}`);
    } catch (error) {
      console.error("Error updating envelope:", error);
      toast.error("Failed to update envelope");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Envelope</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envelope Details</CardTitle>
          <CardDescription>
            Update your budget envelope settings
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
                      The name of your envelope
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
                      The total budget for this envelope
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
                      When this budget period starts
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
              <Link href={`/envelopes/${envelopeId}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Envelope"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
} 