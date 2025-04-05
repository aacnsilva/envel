'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 
import { Calendar } from "@/components/ui/calendar";

// This would come from the API in a real app - updated to match new database schema
const mockEnvelopes = [
  { 
    id: 1, 
    name: "Groceries", 
    recurring: true,
    amounts: [
      { id: 1, amount: 500, date: new Date("2025-03-01") },
      { id: 2, amount: 550, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 2, 
    name: "Entertainment", 
    recurring: true,
    amounts: [
      { id: 3, amount: 200, date: new Date("2025-03-01") },
      { id: 4, amount: 250, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 3, 
    name: "Transportation", 
    recurring: true,
    amounts: [
      { id: 5, amount: 300, date: new Date("2025-03-01") },
      { id: 6, amount: 300, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 4, 
    name: "Dining Out", 
    recurring: false,
    amounts: [
      { id: 7, amount: 400, date: new Date("2025-03-01") },
    ]
  },
];

// Mock used amounts - would be calculated from entries in a real app
const mockUsedAmounts = [
  { envelopeId: 1, date: new Date("2025-03-01"), used: 250 },
  { envelopeId: 1, date: new Date("2025-04-01"), used: 100 },
  { envelopeId: 2, date: new Date("2025-03-01"), used: 150 },
  { envelopeId: 2, date: new Date("2025-04-01"), used: 50 },
  { envelopeId: 3, date: new Date("2025-03-01"), used: 100 },
  { envelopeId: 3, date: new Date("2025-04-01"), used: 75 },
  { envelopeId: 4, date: new Date("2025-03-01"), used: 320 },
];

// This would come from the API in a real app
const mockRecentEntries = [
  { id: 1, amount: 50, category: "Dining", envelope: "Dining Out", date: new Date("2025-03-20") },
  { id: 2, amount: 120, category: "Food", envelope: "Groceries", date: new Date("2025-03-19") },
  { id: 3, amount: 40, category: "Fun", envelope: "Entertainment", date: new Date("2025-03-18") },
  { id: 4, amount: 65, category: "Gas", envelope: "Transportation", date: new Date("2025-03-16") },
  { id: 5, amount: 35, category: "Coffee", envelope: "Dining Out", date: new Date("2025-03-15") },
];

export default function DashboardPage() {
  // State for the selected month
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<typeof mockRecentEntries>([]);
  const [envelopeSummaries, setEnvelopeSummaries] = useState<Array<{
    id: number;
    name: string;
    amount: number;
    used: number;
    remaining: number;
    recurring: boolean;
  }>>([]);
  
  // Format date range for display
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const dateRangeDisplay = format(selectedMonth, "MMMM yyyy");
  
  // Calculate envelope summaries when month changes
  useEffect(() => {
    // Filter entries for the selected month
    const filtered = mockRecentEntries.filter(
      entry => entry.date >= monthStart && entry.date <= monthEnd
    );
    setRecentEntries(filtered);

    // Calculate envelope summaries for the selected month
    const summaries = mockEnvelopes
      .map(envelope => {
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

        return {
          id: envelope.id,
          name: envelope.name,
          amount,
          used,
          remaining,
          recurring: envelope.recurring
        };
      })
      // Filter out non-recurring envelopes that don't have an amount for the selected month
      .filter(envelope => {
        // Find the first envelope amount date (creation date)
        const envelopeData = mockEnvelopes.find(e => e.id === envelope.id);
        const firstAmountDate = envelopeData?.amounts.length ? 
          [...envelopeData.amounts].sort((a, b) => a.date.getTime() - b.date.getTime())[0].date : 
          new Date();
        
        // Don't display envelopes for months before their creation
        if (monthStart < firstAmountDate) return false;
        
        // Always keep recurring envelopes for months on or after their creation
        if (envelope.recurring) return true;
        
        // For non-recurring envelopes, check if they have an amount specifically for this month
        // This checks if there's an amount record with a date in the currently selected month
        const hasAmountThisMonth = envelopeData?.amounts.some(amt => 
          format(amt.date, "yyyy-MM") === format(monthStart, "yyyy-MM")
        ) || false;
        
        // Also check if there's usage in this month
        const hasUsageThisMonth = envelope.used > 0;
        
        // Only show non-recurring envelopes if they have an amount or usage for this specific month
        return hasAmountThisMonth || hasUsageThisMonth;
      });

    setEnvelopeSummaries(summaries);
  }, [setEnvelopeSummaries]);

  // Calculate total budget and used amounts
  const totalBudget = envelopeSummaries.reduce((sum, env) => sum + env.amount, 0);
  const totalUsed = envelopeSummaries.reduce((sum, env) => sum + env.used, 0);
  const totalRemaining = totalBudget - totalUsed;
  const percentUsed = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  // Handle month navigation
  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <div className="space-y-5">
      {/* Page Header and Month Selector */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your budget for {dateRangeDisplay}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center justify-between sm:justify-start">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="mx-2 h-8 px-3 py-2 font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeDisplay}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
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
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
          
          <Link href="/envelopes/create" className="block sm:inline-block">
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Envelope</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overall Budget Summary */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Total Budget Overview</CardTitle>
          <CardDescription>
            Your budget status for {dateRangeDisplay}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                ${totalUsed.toFixed(2)} used of ${totalBudget.toFixed(2)}
              </span>
              <span className="text-sm font-medium">
                ${totalRemaining.toFixed(2)} remaining
              </span>
            </div>
            <Progress value={percentUsed} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Envelopes Summary */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Envelopes</h2>
          <Link href="/envelopes">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {envelopeSummaries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {envelopeSummaries.map((envelope) => {
              const percentUsed = envelope.amount > 0 ? Math.round((envelope.used / envelope.amount) * 100) : 0;
              const isLow = percentUsed > 75;
              
              return (
                <Card key={envelope.id} className="overflow-hidden">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-base">{envelope.name}</CardTitle>
                    <CardDescription>
                      ${envelope.used.toFixed(2)} of ${envelope.amount.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <Progress 
                      value={percentUsed} 
                      className={`h-2 ${isLow ? "bg-red-200" : ""}`}
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs sm:text-sm">{percentUsed}% used</span>
                      {isLow && (
                        <Badge variant="destructive" className="text-xs">Low Balance</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 sm:p-4 pt-0 flex justify-end">
                    <Link href={`/envelopes/${envelope.id}`}>
                      <Button variant="ghost" size="sm">Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center flex flex-col items-center gap-4">
            <div className="text-muted-foreground">
              No envelopes to display for {dateRangeDisplay}
            </div>
            <Link href="/envelopes/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create an Envelope
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Entries */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Entries</h2>
          <Link href="/entries">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Envelope</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEntries.length > 0 ? (
                recentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="py-2 px-3 sm:p-4">{format(entry.date, "MMM d, yyyy")}</TableCell>
                    <TableCell className="py-2 px-3 sm:p-4">${entry.amount.toFixed(2)}</TableCell>
                    <TableCell className="py-2 px-3 sm:p-4 hidden sm:table-cell">{entry.category}</TableCell>
                    <TableCell className="py-2 px-3 sm:p-4 hidden sm:table-cell">{entry.envelope}</TableCell>
                    <TableCell className="py-2 px-3 sm:p-4 text-right">
                      <Link href={`/entries/${entry.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                          <span className="sr-only sm:not-sr-only">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No entries for this month
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
} 