"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Plus, PencilIcon, TrashIcon, ShareIcon, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { mockEnvelopes, mockUsedAmounts, mockEntries } from "@/lib/mock-data";

export default function EnvelopeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [envelopeSummary, setEnvelopeSummary] = useState<{
    id: number;
    name: string;
    amount: number;
    used: number;
    remaining: number;
    recurring: boolean;
    date: Date;
  } | null>(null);
  const [visibleEntries, setVisibleEntries] = useState<typeof mockEntries>([]);
  
  // In a real app, we would fetch the envelope and entries data here
  const p = use(params);
  const envelopeId = parseInt(p.id);

  // Calculate envelope summary when month changes
  useEffect(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    // Find the envelope
    const envelope = mockEnvelopes.find(e => e.id === envelopeId);
    
    if (envelope) {
      // Find the amount for the selected month or closest previous month
      let relevantAmount = envelope.amounts
        .filter(amt => amt.date <= monthEnd)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (!relevantAmount) {
        relevantAmount = { id: 0, amount: 0, date: new Date() };
      }

      // Find used amount for the selected month
      const relevantUsed = mockUsedAmounts.find(
        used => used.envelopeId === envelope.id && 
        format(used.date, "yyyy-MM") === format(monthStart, "yyyy-MM")
      );

      const amount = relevantAmount.amount;
      const used = relevantUsed?.used || 0;
      const remaining = amount - used;

      setEnvelopeSummary({
        id: envelope.id,
        name: envelope.name,
        amount,
        used,
        remaining,
        recurring: envelope.recurring,
        date: relevantAmount.date
      });

      // Filter entries for the selected month
      const monthEntries = mockEntries.filter(
        entry => 
          entry.envelopeId === envelopeId &&
          entry.date >= monthStart && 
          entry.date <= monthEnd
      );
      setVisibleEntries(monthEntries);
    }
  }, [envelopeId, selectedMonth]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Deleting envelope:", envelopeId);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Envelope deleted successfully");
      router.push("/envelopes");
    } catch (error) {
      console.error("Error deleting envelope:", error);
      toast.error("Failed to delete envelope");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleShare = () => {
    // In a real app, this would open a sharing dialog or redirect
    toast.info("Sharing feature is coming soon!");
  };

  // Calculate percentage used
  const percentUsed = envelopeSummary && envelopeSummary.amount > 0 
    ? Math.round((envelopeSummary.used / envelopeSummary.amount) * 100) 
    : 0;
  const isLow = percentUsed > 80;
  
  if (!envelopeSummary) {
    return <div>Loading...</div>;
  }

  const dateRangeDisplay = format(selectedMonth, "MMMM yyyy");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{envelopeSummary.name}</h1>
          <div className="flex items-center mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreviousMonth}
              className="h-7 w-7 p-0 rounded-r-none"
            >
              <span className="sr-only">Previous month</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </Button>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none min-w-[120px]"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRangeDisplay}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedMonth(date);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  captionLayout="dropdown-buttons"
                  fromMonth={new Date(2020, 0)}
                  toMonth={new Date(2030, 11)}
                />
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextMonth}
              className="h-7 w-7 p-0 rounded-l-none"
            >
              <span className="sr-only">Next month</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex-1 sm:flex-initial"
          >
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link 
            href={`/envelopes/${envelopeId}/edit`}
            className="flex-1 sm:flex-initial"
          >
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the envelope and all its entries.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Envelope Summary Card */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg sm:text-xl">Budget Summary</CardTitle>
              <CardDescription>
                {envelopeSummary.recurring ? "Monthly recurring budget" : `Budget for ${dateRangeDisplay}`}
              </CardDescription>
            </div>
            {envelopeSummary.recurring && (
              <Badge variant="outline">Recurring</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                ${envelopeSummary.used.toFixed(2)} used of ${envelopeSummary.amount.toFixed(2)}
              </span>
              <span className="text-sm font-medium">
                ${envelopeSummary.remaining.toFixed(2)} remaining
              </span>
            </div>
            <Progress 
              value={percentUsed} 
              className={`h-2 ${isLow ? "bg-red-200" : ""}`}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs sm:text-sm">{percentUsed}% used</span>
              {isLow && (
                <Badge variant="destructive">Low Balance</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Tab */}
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="entries" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold">Spending Entries</h2>
            <Link href={`/envelopes/${envelopeId}/entries/new`}>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </Link>
          </div>
          
          <Card className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your spending entries for this envelope in {dateRangeDisplay}.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleEntries.length > 0 ? (
                  visibleEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="py-2">{format(entry.date, "MMM d, yyyy")}</TableCell>
                      <TableCell className="py-2">${entry.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden sm:table-cell py-2">{entry.category}</TableCell>
                      <TableCell className="hidden md:table-cell py-2">{entry.note}</TableCell>
                      <TableCell className="text-right py-2">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Link href={`/envelopes/${envelopeId}/entries/${entry.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No entries for {dateRangeDisplay}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Analytics</CardTitle>
              <CardDescription>
                View your spending patterns for this envelope
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                Analytics charts would appear here in a real app
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 