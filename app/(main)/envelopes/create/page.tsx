"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockCategories } from "@/lib/mock-data";

export default function CreateEnvelopePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isMonthly, setIsMonthly] = useState(false);
  const [resetOnCycle, setResetOnCycle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Envelope name is required");
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Valid amount is required");
      return;
    }
    
    if (!category) {
      toast.error("Category is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log({
        name,
        amount: parseFloat(amount),
        category,
        description,
        isRecurring,
        date,
        isMonthly,
        resetOnCycle,
      });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Envelope created successfully");
      
      // Navigate to envelopes list
      router.push("/envelopes");
    } catch (error) {
      console.error("Error creating envelope:", error);
      toast.error("Failed to create envelope");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Create New Envelope</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Envelope Details</CardTitle>
            <CardDescription>
              Fill in the details to create a new budget envelope.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Groceries, Rent, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isOpen}
                      className="w-full justify-between"
                    >
                      {category
                        ? mockCategories.find((cat) => cat.id === parseInt(category))?.name
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full" align="start">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {mockCategories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.id.toString()}
                            onSelect={(currentValue: string) => {
                              setCategory(currentValue === category ? "" : currentValue);
                              setIsOpen(false);
                            }}
                          >
                            {cat.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any extra details about this envelope"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring">This is a recurring budget</Label>
              </div>
              
              {isRecurring && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="cycle-date">Renewal Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="cycle-date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="monthly"
                        checked={isMonthly}
                        onCheckedChange={(checked) => setIsMonthly(checked as boolean)}
                      />
                      <Label htmlFor="monthly">Renews monthly on this date</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reset"
                        checked={resetOnCycle}
                        onCheckedChange={(checked) => setResetOnCycle(checked as boolean)}
                      />
                      <Label htmlFor="reset">Reset remaining amount on renewal</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/envelopes")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Creating..." : "Create Envelope"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 