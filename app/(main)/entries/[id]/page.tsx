"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Calendar, Tag, MessageCircle, Package } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { mockEntries, mockEnvelopes } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

type Entry = {
  id: number;
  amount: number;
  date: Date;
  category: string;
  note: string;
  envelopeId: number;
  envelopeName?: string;
};

export default function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const p = use(params);

  // Load entry data
  useEffect(() => {
    const entryId = parseInt(p.id);
    const foundEntry = mockEntries.find(e => e.id === entryId);
    
    if (foundEntry) {
      const envelope = mockEnvelopes.find(env => env.id === foundEntry.envelopeId);
      setEntry({
        ...foundEntry,
        envelopeName: envelope?.name || "Unknown"
      });
    } else {
      // Entry not found - redirect to entries page
      router.push("/entries");
    }
  }, [p.id, router]);

  const handleDelete = () => {
    // In a real app, would call API to delete entry
    // For now just show a toast and redirect
    toast({
      title: "Entry deleted",
      description: "The entry has been successfully deleted."
    });
    
    setIsDeleteDialogOpen(false);
    router.push("/entries");
  };

  if (!entry) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">Loading entry details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/entries">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Entry Details</h1>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/entries/${entry.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this entry? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">{entry.note}</h2>
              <p className="text-sm text-muted-foreground">
                ID: {entry.id}
              </p>
            </div>
            <div className="text-2xl font-bold">
              ${entry.amount.toFixed(2)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p>{format(entry.date, "PPP")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <Badge variant="outline">{entry.category}</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Envelope</p>
                <Link href={`/envelopes/${entry.envelopeId}`}>
                  <Badge className="hover:bg-primary/10 cursor-pointer">{entry.envelopeName}</Badge>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Note</p>
                <p>{entry.note}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Transaction Details</h3>
            <div className="text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span>${entry.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Date</span>
                <span>{format(entry.date, "PP")}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Envelope</span>
                <span>{entry.envelopeName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Category</span>
                <span>{entry.category}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">
            Created on {format(entry.date, "PPP 'at' p")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 