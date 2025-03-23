// Mock data based on database.md schema
// This is a centralized location for all mock data in the application

// Envelopes with their amounts
export const mockEnvelopes = [
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
export const mockUsedAmounts = [
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
export const mockEntries = [
  { id: 1, amount: 50, date: new Date("2025-03-20"), category: "Produce", note: "Farmers Market", envelopeId: 1 },
  { id: 2, amount: 85, date: new Date("2025-03-15"), category: "Dairy", note: "Weekly shopping", envelopeId: 1 },
  { id: 3, amount: 65, date: new Date("2025-03-10"), category: "Meat", note: "Monthly meat purchase", envelopeId: 1 },
  { id: 4, amount: 30, date: new Date("2025-03-05"), category: "Bakery", note: "Bread and pastries", envelopeId: 1 },
  { id: 5, amount: 20, date: new Date("2025-03-02"), category: "Snacks", note: "Party supplies", envelopeId: 1 },
  { id: 6, amount: 45, date: new Date("2025-04-18"), category: "Produce", note: "Vegetables", envelopeId: 1 },
  { id: 7, amount: 55, date: new Date("2025-04-10"), category: "Dairy", note: "Milk and cheese", envelopeId: 1 },
]; 