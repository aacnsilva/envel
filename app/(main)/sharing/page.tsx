"use client";

import { useState } from "react";
import { Check, X, Share2, User, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for shared envelopes
const mockSharedWithMe = [
  {
    id: 1,
    envelopeName: "Vacation Fund",
    ownerName: "Alice Smith",
    ownerAvatar: "",
    ownerInitials: "AS",
    status: "active",
    sharedDate: "2023-12-15"
  },
  {
    id: 2,
    envelopeName: "Home Improvement",
    ownerName: "Bob Johnson",
    ownerAvatar: "",
    ownerInitials: "BJ",
    status: "active",
    sharedDate: "2023-11-20"
  }
];

// Mock data for pending share requests
const mockPendingRequests = [
  {
    id: 1,
    envelopeName: "Holiday Gifts",
    ownerName: "Charlie Brown",
    ownerAvatar: "",
    ownerInitials: "CB",
    requestDate: "2024-01-05"
  },
  {
    id: 2,
    envelopeName: "Emergency Fund",
    ownerName: "Diana Prince",
    ownerAvatar: "",
    ownerInitials: "DP",
    requestDate: "2024-01-02"
  }
];

// Mock data for envelopes I'm sharing
const mockMySharedEnvelopes = [
  {
    id: 1,
    envelopeName: "Rental Property",
    sharedWith: [
      { name: "Frank Miller", avatar: "", initials: "FM", status: "active" },
      { name: "Grace Lee", avatar: "", initials: "GL", status: "active" }
    ]
  },
  {
    id: 2,
    envelopeName: "Family Vacation",
    sharedWith: [
      { name: "Hannah Smith", avatar: "", initials: "HS", status: "active" },
      { name: "Ian Brown", avatar: "", initials: "IB", status: "pending" }
    ]
  }
];

export default function SharingPage() {
  const [sharedWithMe, setSharedWithMe] = useState(mockSharedWithMe);
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [mySharedEnvelopes, setMySharedEnvelopes] = useState(mockMySharedEnvelopes);
  const [activeTab, setActiveTab] = useState("shared-with-me");
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptShare = async (requestId: number) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      const acceptedRequest = pendingRequests.find(req => req.id === requestId);
      if (acceptedRequest) {
        // Remove from pending and add to active shares
        setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
        setSharedWithMe([...sharedWithMe, {
          id: Date.now(),
          envelopeName: acceptedRequest.envelopeName,
          ownerName: acceptedRequest.ownerName,
          ownerAvatar: acceptedRequest.ownerAvatar,
          ownerInitials: acceptedRequest.ownerInitials,
          status: "active",
          sharedDate: new Date().toISOString().split('T')[0]
        }]);
        
        toast.success(`You now have access to "${acceptedRequest.envelopeName}"`);
      }
    } catch (error) {
      console.error("Error accepting share:", error);
      toast.error("Failed to accept share request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectShare = async (requestId: number) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      const rejectedRequest = pendingRequests.find(req => req.id === requestId);
      if (rejectedRequest) {
        setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
        toast.success(`Share request for "${rejectedRequest.envelopeName}" rejected`);
      }
    } catch (error) {
      console.error("Error rejecting share:", error);
      toast.error("Failed to reject share request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Sharing</h1>
        <Button className="w-full sm:w-auto">
          <Share2 className="mr-2 h-4 w-4" />
          Share an Envelope
        </Button>
      </div>

      <Tabs defaultValue="shared-with-me" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          <TabsTrigger value="pending-requests" className="relative">
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="my-shares">My Shares</TabsTrigger>
        </TabsList>

        {/* Shared with Me Tab */}
        <TabsContent value="shared-with-me" className="space-y-4">
          {sharedWithMe.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No Shared Envelopes</h3>
                <p className="text-muted-foreground mt-1">
                  You don't have any envelopes shared with you yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sharedWithMe.map((share) => (
                <Card key={share.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{share.envelopeName}</CardTitle>
                        <CardDescription>Shared by {share.ownerName}</CardDescription>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={share.ownerAvatar} alt={share.ownerName} />
                        <AvatarFallback>{share.ownerInitials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Shared on {share.sharedDate}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        View Envelope
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="pending-requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No Pending Requests</h3>
                <p className="text-muted-foreground mt-1">
                  You don't have any pending share requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{request.envelopeName}</CardTitle>
                        <CardDescription>From {request.ownerName}</CardDescription>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.ownerAvatar} alt={request.ownerName} />
                        <AvatarFallback>{request.ownerInitials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <Clock className="mr-1 h-3 w-3" />
                      Requested on {request.requestDate}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleAcceptShare(request.id)}
                        disabled={isLoading}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-destructive border-destructive"
                        onClick={() => handleRejectShare(request.id)}
                        disabled={isLoading}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Shares Tab */}
        <TabsContent value="my-shares" className="space-y-4">
          {mySharedEnvelopes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Not Sharing Yet</h3>
                <p className="text-muted-foreground mt-1">
                  You haven't shared any of your envelopes yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mySharedEnvelopes.map((envelope) => (
                <Card key={envelope.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg">{envelope.envelopeName}</CardTitle>
                    <CardDescription>
                      Shared with {envelope.sharedWith.length} {envelope.sharedWith.length === 1 ? "person" : "people"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {envelope.sharedWith.map((person, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-7 w-7 mr-2">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback>{person.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{person.name}</span>
                          </div>
                          <Badge variant={person.status === "active" ? "default" : "outline"} className="text-xs">
                            {person.status === "active" ? "Active" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        Manage Sharing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 