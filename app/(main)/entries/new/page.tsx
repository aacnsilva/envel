"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockEnvelopes } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

// Define categories based on mock data
const categories = [
  "Produce",
  "Dairy",
  "Meat",
  "Bakery",
  "Snacks",
  "Household",
  "Dining",
  "Entertainment",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Personal Care",
  "Gifts",
  "Other"
];

export default function NewEntryPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [envelopeId, setEnvelopeId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [errors, setErrors] = useState<{
    amount?: string;
    note?: string;
    category?: string;
    envelopeId?: string;
    date?: string;
  }>({});

  // Input handlers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleEnvelopeChange = (value: string) => {
    setEnvelopeId(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
  };

  const validateForm = () => {
    const newErrors: {
      amount?: string;
      note?: string;
      category?: string;
      envelopeId?: string;
      date?: string;
    } = {};
    
    // Validate amount
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    
    // Validate note
    if (!note) {
      newErrors.note = "Note is required";
    }
    
    // Validate category
    if (!category) {
      newErrors.category = "Category is required";
    }
    
    // Validate envelope
    if (!envelopeId) {
      newErrors.envelopeId = "Envelope is required";
    }
    
    // Validate date
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would call an API to create the entry
    toast({
      title: "Entry created",
      description: "Your expense entry has been successfully created."
    });
    
    // Redirect to entries page
    router.push("/entries");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/entries">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">New Entry</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Expense Entry</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(Object.keys(errors).length > 0) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Please fix the errors below to continue.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className={cn(errors.amount && "border-destructive")}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.date && "border-destructive"
                    )}
                  >
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="envelope">Envelope</Label>
              <Select value={envelopeId} onValueChange={handleEnvelopeChange}>
                <SelectTrigger id="envelope" className={cn(errors.envelopeId && "border-destructive")}>
                  <SelectValue placeholder="Select an envelope" />
                </SelectTrigger>
                <SelectContent>
                  {mockEnvelopes.map(envelope => (
                    <SelectItem key={envelope.id} value={envelope.id.toString()}>
                      {envelope.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.envelopeId && (
                <p className="text-sm text-destructive">{errors.envelopeId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" className={cn(errors.category && "border-destructive")}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter description of the expense"
                value={note}
                onChange={handleNoteChange}
                className={cn(errors.note && "border-destructive")}
              />
              {errors.note && (
                <p className="text-sm text-destructive">{errors.note}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button variant="outline" type="button" asChild className="w-full sm:w-auto">
              <Link href="/entries">Cancel</Link>
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Check className="mr-2 h-4 w-4" />
              Create Entry
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 