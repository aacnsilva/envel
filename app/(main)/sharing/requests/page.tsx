"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for share requests - would come from API in real app
const mockRequests = [
  { 
    id: 1, 
    envelope_name: "Groceries", 
    sender_name: "Jane Doe", 
    sender_email: "jane@example.com", 
    status: "pending", 
    created_at: "2023-03-15" 
  },
  { 
    id: 2, 
    envelope_name: "Vacation Fund", 
    sender_name: "John Smith", 
    sender_email: "john@example.com", 
    status: "pending", 
    created_at: "2023-03-14" 
  },
  { 
    id: 3, 
    envelope_name: "Household", 
    sender_name: "Mark Wilson", 
    sender_email: "mark@example.com", 
    status: "accepted", 
    created_at: "2023-03-10" 
  },
  { 
    id: 4, 
    envelope_name: "Entertainment", 
    sender_name: "Sarah Johnson", 
    sender_email: "sarah@example.com", 
    status: "rejected", 
    created_at: "2023-03-08" 
  },
];

export default function ShareRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const handleAccept = async (id: number) => {
    setIsProcessing(id);
    
    try {
      // In a real app, this would be an API call
      console.log("Accepting request:", id);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: "accepted" } : req
      ));
      
      toast.success("Share request accepted");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    setIsProcessing(id);
    
    try {
      // In a real app, this would be an API call
      console.log("Rejecting request:", id);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: "rejected" } : req
      ));
      
      toast.success("Share request rejected");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Share Requests</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Manage requests from others to share their envelopes with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No share requests found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Envelope</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.envelope_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{request.sender_name}</div>
                        <div className="text-xs text-muted-foreground">{request.sender_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.created_at}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAccept(request.id)}
                            disabled={isProcessing === request.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(request.id)}
                            disabled={isProcessing === request.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {request.status === "accepted" ? "Accepted" : "Rejected"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 