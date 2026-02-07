import axios from 'axios';
import { auth } from '../config/firebase';
import type { SendRequest, SendResponse, ConfirmRequest, ConfirmResponse, Transaction } from '../types';

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
