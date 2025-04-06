// Mock data based on database.md schema
// This is a centralized location for all mock data in the application

import {
  Envelope,
  UsedAmount,
  Entry,
  Category,
  ShareRequest,
  SharedWithMeEnvelope,
  PendingShareRequest,
  MySharedEnvelope,
  User,
  SharedEnvelope
} from './types';

// Envelopes with their amounts
export const mockEnvelopes: Envelope[] = [
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
    recurring: false,
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
      { id: 8, amount: 450, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 5, 
    name: "Utilities", 
    recurring: true,
    amounts: [
      { id: 9, amount: 350, date: new Date("2025-03-01") },
      { id: 10, amount: 360, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 6, 
    name: "Savings", 
    recurring: true,
    amounts: [
      { id: 11, amount: 1000, date: new Date("2025-03-01") },
      { id: 12, amount: 1000, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 7, 
    name: "Healthcare", 
    recurring: false,
    amounts: [
      { id: 13, amount: 200, date: new Date("2025-03-01") },
      { id: 14, amount: 250, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 8, 
    name: "Shopping", 
    recurring: false,
    amounts: [
      { id: 15, amount: 300, date: new Date("2025-03-01") },
      { id: 16, amount: 350, date: new Date("2025-04-01") },
    ]
  },
];

// Used amounts for each envelope
export const mockUsedAmounts: UsedAmount[] = [
  { envelopeId: 1, date: new Date("2025-03-01"), used: 250 },
  { envelopeId: 1, date: new Date("2025-04-01"), used: 100 },
  { envelopeId: 2, date: new Date("2025-03-01"), used: 150 },
  { envelopeId: 2, date: new Date("2025-04-01"), used: 50 },
  { envelopeId: 3, date: new Date("2025-03-01"), used: 100 },
  { envelopeId: 3, date: new Date("2025-04-01"), used: 75 },
  { envelopeId: 4, date: new Date("2025-03-01"), used: 320 },
  { envelopeId: 4, date: new Date("2025-04-01"), used: 150 },
  { envelopeId: 5, date: new Date("2025-03-01"), used: 200 },
  { envelopeId: 5, date: new Date("2025-04-01"), used: 150 },
  { envelopeId: 6, date: new Date("2025-03-01"), used: 0 },
  { envelopeId: 6, date: new Date("2025-04-01"), used: 0 },
  { envelopeId: 7, date: new Date("2025-03-01"), used: 75 },
  { envelopeId: 7, date: new Date("2025-04-01"), used: 50 },
  { envelopeId: 8, date: new Date("2025-03-01"), used: 280 },
  { envelopeId: 8, date: new Date("2025-04-01"), used: 100 },
];

// Entries for envelopes
export const mockEntries: Entry[] = [
  { id: 1, amount: 50, date: new Date("2025-03-20"), category: "Produce", note: "Farmers Market", envelopeId: 1 },
  { id: 2, amount: 85, date: new Date("2025-03-15"), category: "Dairy", note: "Weekly shopping", envelopeId: 1 },
  { id: 3, amount: 65, date: new Date("2025-03-10"), category: "Meat", note: "Monthly meat purchase", envelopeId: 1 },
  { id: 4, amount: 30, date: new Date("2025-03-05"), category: "Bakery", note: "Bread and pastries", envelopeId: 1 },
  { id: 5, amount: 20, date: new Date("2025-03-02"), category: "Snacks", note: "Party supplies", envelopeId: 1 },
  { id: 6, amount: 45, date: new Date("2025-04-18"), category: "Produce", note: "Vegetables", envelopeId: 1 },
  { id: 7, amount: 55, date: new Date("2025-04-10"), category: "Dairy", note: "Milk and cheese", envelopeId: 1 },
]; 

// Categories
export const mockCategories: Category[] = [
  { id: 1, name: "Groceries", description: "Food and household supplies" },
  { id: 2, name: "Utilities", description: "Electricity, water, gas, etc." },
  { id: 3, name: "Dining Out", description: "Restaurants and cafes" },
  { id: 4, name: "Entertainment", description: "Movies, concerts, events" },
  { id: 5, name: "Transportation", description: "Gas, public transit, rideshares" },
  { id: 6, name: "Shopping", description: "Clothes, electronics, etc." },
  { id: 7, name: "Healthcare", description: "Doctor visits, medicine, etc." },
  { id: 8, name: "Personal Care", description: "Haircuts, gym, etc." },
];

// Mock data for share requests - would come from API in real app
export const mockRequests: ShareRequest[] = [
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

// Mock data for shared envelopes
export const mockSharedWithMe: SharedWithMeEnvelope[] = [
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
export const mockPendingRequests: PendingShareRequest[] = [
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
export const mockMySharedEnvelopes: MySharedEnvelope[] = [
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

// Mock user data - this would come from auth in real app
export const mockUser: User = {
  name: "User",
  email: "user@example.com",
  image: null,
};

// Mock data for shared envelopes - would come from API in real app
export const mockSharedEnvelopes: SharedEnvelope[] = [
  { 
    id: 1, 
    name: "Family Groceries",
    recurring: true,
    owner: {
      name: "Jane Doe",
      email: "jane@example.com",
      image: null
    },
    amounts: [
      { id: 1, amount: 800, date: new Date("2025-03-01") },
      { id: 2, amount: 850, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 2, 
    name: "Vacation Fund",
    recurring: false,
    owner: {
      name: "John Smith",
      email: "john@example.com",
      image: null
    },
    amounts: [
      { id: 3, amount: 1200, date: new Date("2025-03-01") },
      { id: 4, amount: 1500, date: new Date("2025-04-01") },
    ]
  },
  { 
    id: 3, 
    name: "Household Expenses",
    recurring: true,
    owner: {
      name: "Mark Wilson",
      email: "mark@example.com",
      image: null
    },
    amounts: [
      { id: 5, amount: 600, date: new Date("2025-03-01") },
      { id: 6, amount: 620, date: new Date("2025-04-01") },
    ]
  },
];