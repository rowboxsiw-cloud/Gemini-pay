
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  upiId: string;
  balance: number;
  lastInterestUpdate: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  fromUpiId: string;
  toUpiId: string;
  timestamp: number;
  note: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AppState {
  user: UserProfile | null;
  loading: boolean;
  transactions: Transaction[];
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  TRANSFER = 'TRANSFER',
  SCAN = 'SCAN',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  AI_CHAT = 'AI_CHAT'
}
