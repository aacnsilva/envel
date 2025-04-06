"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockSharedEnvelopes, mockUsedAmounts } from "@/lib/mock-data";

export default function SharedWithMePage() {
  const [currentMonth] = useState(new Date());
  const [sharedEnvelopeSummaries, setSharedEnvelopeSummaries] = useState<Array<{
    id: number;
    name: string;
    amount: number;
    used: number;
    remaining: number;
    owner: {
      name: string;
      email: string;
      image: string | null;
    };
    date: Date;
    recurring: boolean;
  }>>([]);

  // Calculate envelope summaries for the current month
  useEffect(() => {
    const summaries = mockSharedEnvelopes.map(envelope => {
      // Find the amount for the current month or closest previous month
      let relevantAmount = envelope.amounts
        .filter(amt => amt.date <= currentMonth)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (!relevantAmount) {
        relevantAmount = { id: 0, amount: 0, date: new Date() };
      }

      // Find used amount for the current month
      const relevantUsed = mockUsedAmounts.find(
        used => used.envelopeId === envelope.id && 
        format(used.date, "yyyy-MM") === format(currentMonth, "yyyy-MM")
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
        owner: envelope.owner,
        date: relevantAmount.date,
        recurring: envelope.recurring
      };
    });

    setSharedEnvelopeSummaries(summaries);
  }, [currentMonth]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Shared With Me</h1>
      </div>

      {sharedEnvelopeSummaries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-muted-foreground mb-4">
              You don&apos;t have any envelopes shared with you yet.
            </p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              When someone shares an envelope with you, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedEnvelopeSummaries.map((envelope) => {
            const percentUsed = envelope.amount > 0 ? Math.round((envelope.used / envelope.amount) * 100) : 0;
            
            return (
              <Card key={envelope.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{envelope.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">Shared</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={envelope.owner.image || ""} alt={envelope.owner.name} />
                        <AvatarFallback className="text-xs">{envelope.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{envelope.owner.name}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        ${envelope.used.toFixed(2)} used of ${envelope.amount.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium">
                        ${envelope.remaining.toFixed(2)} remaining
                      </span>
                    </div>
                    <Progress value={percentUsed} className="h-2" />
                    <div className="mt-2 text-sm">
                      {percentUsed}% used
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Budget for: {format(envelope.date, "MMM yyyy")}
                  </div>
                  <Link href={`/sharing/shared-with-me/${envelope.id}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 