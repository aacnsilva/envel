"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockEnvelopes, mockUsedAmounts } from "@/lib/mock-data";

export default function EnvelopesPage() {
  const [currentMonth] = useState(new Date());
  const [envelopeSummaries, setEnvelopeSummaries] = useState<Array<{
    id: number;
    name: string;
    amount: number;
    used: number;
    remaining: number;
    recurring: boolean;
    date: Date;
  }>>([]);

  // Calculate envelope summaries for the current month
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const summaries = mockEnvelopes.map(envelope => {
      // Find the amount for the current month or closest previous month
      let relevantAmount = envelope.amounts
        .filter(amt => amt.date <= monthEnd)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (!relevantAmount) {
        relevantAmount = { id: 0, amount: 0, date: new Date() };
      }

      // Find used amount for the current month
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
        recurring: envelope.recurring,
        date: relevantAmount.date
      };
    });

    setEnvelopeSummaries(summaries);
  }, [currentMonth]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Envelopes</h1>
        <Link href="/envelopes/new">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Envelope
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {envelopeSummaries.map((envelope) => {
          const percentUsed = envelope.amount > 0 ? Math.round((envelope.used / envelope.amount) * 100) : 0;
          const isLow = percentUsed > 80;
          
          return (
            <Card key={envelope.id} className="overflow-hidden">
              <CardHeader className="p-3 sm:p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{envelope.name}</CardTitle>
                  {envelope.recurring && (
                    <Badge variant="outline" className="text-xs">Recurring</Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
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
                  <span className="text-xs sm:text-sm font-medium">
                    ${envelope.remaining.toFixed(2)} remaining
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                <div className="text-xs text-muted-foreground">
                  Started: {format(envelope.date, "MMM d, yyyy")}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link href={`/envelopes/${envelope.id}/edit`} className="w-1/2 sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  </Link>
                  <Link href={`/envelopes/${envelope.id}`} className="w-1/2 sm:w-auto">
                    <Button variant="ghost" size="sm" className="w-full">View</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 