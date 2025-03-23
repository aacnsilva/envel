"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PlusCircle, Filter, Search } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockEntries, mockEnvelopes } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define types based on the database schema
type Entry = {
  id: number;
  amount: number;
  date: Date;
  category: string;
  note: string;
  envelopeId: number;
  envelopeName?: string;
};

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnvelope, setSelectedEnvelope] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories from entries
  const categories = Array.from(new Set(mockEntries.map(entry => entry.category)));

  // Load and process entries data
  useEffect(() => {
    // Combine entries with envelope names
    const processedEntries = mockEntries.map(entry => {
      const envelope = mockEnvelopes.find(env => env.id === entry.envelopeId);
      return {
        ...entry,
        envelopeName: envelope?.name || "Unknown"
      };
    });
    
    setEntries(processedEntries);
    setFilteredEntries(processedEntries);
  }, []);

  // Filter entries when filters change
  useEffect(() => {
    let result = entries;
    
    // Filter by envelope
    if (selectedEnvelope !== "all") {
      result = result.filter(entry => entry.envelopeId === parseInt(selectedEnvelope));
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(entry => entry.category === selectedCategory);
    }
    
    // Filter by search term (note or category)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        entry => 
          entry.note.toLowerCase().includes(term) || 
          entry.category.toLowerCase().includes(term) ||
          entry.envelopeName?.toLowerCase().includes(term)
      );
    }
    
    setFilteredEntries(result);
  }, [entries, searchTerm, selectedEnvelope, selectedCategory]);

  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEnvelopeChange = (value: string) => {
    setSelectedEnvelope(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Expense Entries</h1>
        <Link href="/entries/new">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="sm:w-auto"
            onClick={handleToggleFilter}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {isFilterOpen && (
          <div className="flex flex-col sm:flex-row gap-3 p-3 border rounded-md bg-background">
            <div className="w-full sm:w-1/2">
              <p className="text-sm mb-1">Envelope</p>
              <Select value={selectedEnvelope} onValueChange={handleEnvelopeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Envelopes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Envelopes</SelectItem>
                  {mockEnvelopes.map(envelope => (
                    <SelectItem key={envelope.id} value={envelope.id.toString()}>
                      {envelope.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/2">
              <p className="text-sm mb-1">Category</p>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No entries found. Try adjusting your filters or create a new entry.
          </div>
        ) : (
          filteredEntries.map(entry => (
            <Link href={`/entries/${entry.id}`} key={entry.id}>
              <Card className="hover:bg-accent/5 transition-colors">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <CardTitle className="text-base">{entry.note}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(entry.date, "MMM d, yyyy")}
                      </div>
                    </div>
                    <div className="text-lg font-medium">
                      ${entry.amount.toFixed(2)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{entry.category}</Badge>
                      <Badge variant="secondary">{entry.envelopeName}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 