import axios from 'axios';
import { auth } from '../config/firebase';
import type { SendRequest, SendResponse, ConfirmRequest, ConfirmResponse, Transaction, BankLinkResponse, BankStatusResponse, Contact, CreateContactRequest, MarketPricesResponse, MarketAnalysis, CryptoPrice, ConversionResult } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function analyzeSend(data: SendRequest): Promise<SendResponse> {
  const res = await api.post<SendResponse>('/api/send/analyze', data);
  return res.data;
}

export async function confirmSend(data: ConfirmRequest): Promise<ConfirmResponse> {
  const res = await api.post<ConfirmResponse>('/api/send/confirm', data);
  return res.data;
}

export async function getTransactions(): Promise<Transaction[]> {
  const res = await api.get<Transaction[]>('/api/transactions');
  return res.data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const res = await api.get<Transaction>(`/api/transactions/${id}`);
  return res.data;
}

// Bank Connection
export async function getBankStatus(sessionId?: string): Promise<BankStatusResponse> {
  const params = sessionId ? { session_id: sessionId } : {};
  const res = await api.get<BankStatusResponse>('/api/bank/status', { params });
  return res.data;
}

export async function createBankLink(): Promise<BankLinkResponse> {
  const res = await api.post<BankLinkResponse>('/api/bank/link');
  return res.data;
}

export async function disconnectBank(): Promise<void> {
  await api.post('/api/bank/disconnect');
}

// Contacts
export async function getContacts(): Promise<Contact[]> {
  const res = await api.get<Contact[]>('/api/contacts');
  return res.data;
}

export async function createContact(data: CreateContactRequest): Promise<Contact> {
  const res = await api.post<Contact>('/api/contacts', data);
  return res.data;
}

export async function updateContact(id: string, data: Partial<CreateContactRequest>): Promise<Contact> {
  const res = await api.put<Contact>(`/api/contacts/${id}`, data);
  return res.data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/api/contacts/${id}`);
}

// Market & Crypto Prices
export async function getMarketPrices(symbols?: string[]): Promise<MarketPricesResponse> {
  const params = symbols ? { symbols: symbols.join(',') } : {};
  const res = await api.get<MarketPricesResponse>('/api/market/prices', { params });
  return res.data;
}

export async function getMarketAnalysis(
  amount: number,
  sourceCurrency?: string,
  destinationCountry?: string
): Promise<MarketAnalysis> {
  const res = await api.post<MarketAnalysis>('/api/market/analyze', {
    amount,
    sourceCurrency: sourceCurrency || 'USD',
    destinationCountry: destinationCountry || 'Global',
  });
  return res.data;
}

export async function getCryptoPrice(symbol: string): Promise<{ price: CryptoPrice; timestamp: string }> {
  const res = await api.get<{ price: CryptoPrice; timestamp: string }>(`/api/market/price/${symbol}`);
  return res.data;
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult> {
  const res = await api.get<ConversionResult>('/api/market/convert', {
    params: { amount, from, to },
  });
  return res.data;
}
