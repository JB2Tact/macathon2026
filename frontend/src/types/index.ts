export type Blockchain = 'stellar' | 'ethereum' | 'solana';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface User {
  id: string;
  email: string;
  displayName: string;
  wallets: {
    stellar?: string;
    ethereum?: string;
    solana?: string;
  };
  createdAt: string;
}

export interface ParsedInput {
  naturalLanguage: string;
  parsedAmount: number;
  parsedCurrency: string;
  parsedRecipient: string;
  parsedCountry?: string;
}

export interface Route {
  blockchain: Blockchain;
  estimatedFee: number;
  estimatedTime: string;
  exchangeRate?: number;
  txHash?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  status: TransactionStatus;
  input: ParsedInput;
  routes: Route[];
  selectedRoute?: Route;
  aiExplanation: string;
  createdAt: string;
  completedAt?: string;
}

export interface SendRequest {
  naturalLanguage: string;
}

export interface SendResponse {
  transactionId: string;
  parsed: ParsedInput;
  routes: Route[];
  aiExplanation: string;
}

export interface ConfirmRequest {
  transactionId: string;
  blockchain: Blockchain;
}

export interface ConfirmResponse {
  transaction: Transaction;
}

// Bank Connection
export type BankConnectionStatus = 'not_connected' | 'connecting' | 'connected';

export interface BankAccount {
  id: string;
  bankName: string;
  last4: string;
  status: BankConnectionStatus;
  connectedAt?: string;
}

export interface BankLinkResponse {
  url: string;
  sessionId: string;
}

export interface BankStatusResponse {
  connected: boolean;
  account?: BankAccount;
}

// Contacts
export interface Contact {
  id: string;
  userId: string;
  name: string;
  country: string;
  walletAddress: string;
  network: Blockchain;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateContactRequest {
  name: string;
  country: string;
  walletAddress: string;
  network: Blockchain;
  email?: string;
  notes?: string;
}

// Market & Crypto Prices
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

export interface NetworkFee {
  blockchain: string;
  feeUSD: number;
  feeNative: number;
  estimatedTime: string;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface RouteOption {
  blockchain: string;
  score: number;
  fees: NetworkFee;
  price: CryptoPrice;
  reasoning: string;
}

export interface MarketAnalysis {
  recommendation: string;
  routes: RouteOption[];
  marketConditions: string;
  aiExplanation: string;
  timestamp: string;
}

export interface MarketPricesResponse {
  prices: Record<string, CryptoPrice>;
  timestamp: string;
}

export interface ConversionResult {
  amount: number;
  rate: number;
  from: string;
  to: string;
  timestamp: string;
}
