// Type definitions for envelope-related data structures

// Base interfaces
export interface Amount {
  id: number;
  amount: number;
  date: Date;
}

export interface UsedAmount {
  envelopeId: number;
  date: Date;
  used: number;
}

export interface Entry {
  id: number;
  amount: number;
  date: Date;
  category: string;
  note: string;
  envelopeId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface User {
  name: string;
  email: string;
  image: string | null;
}

// Envelope interfaces
export interface Envelope {
  id: number;
  name: string;
  recurring: boolean;
  amounts: Amount[];
}

export interface SharedEnvelope extends Envelope {
  owner: User;
}

// Share request interfaces
export interface ShareRequest {
  id: number;
  envelope_name: string;
  sender_name: string;
  sender_email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface SharedWithMeEnvelope {
  id: number;
  envelopeName: string;
  ownerName: string;
  ownerAvatar: string;
  ownerInitials: string;
  status: 'active';
  sharedDate: string;
}

export interface PendingShareRequest {
  id: number;
  envelopeName: string;
  ownerName: string;
  ownerAvatar: string;
  ownerInitials: string;
  requestDate: string;
}

export interface SharedUser {
  name: string;
  avatar: string;
  initials: string;
  status: 'active' | 'pending';
}

export interface MySharedEnvelope {
  id: number;
  envelopeName: string;
  sharedWith: SharedUser[];
} 