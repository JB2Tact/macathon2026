import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../services/api';
import type { Transaction } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      // Silently handle network errors - show empty state instead of error
      console.warn('Failed to load transactions:', err);
      setTransactions([]);
      // Only show error for non-network issues
      const errorMessage = err instanceof Error ? err.message : 'Failed to load';
      if (!errorMessage.includes('Network') && !errorMessage.includes('connect')) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, loading, error, refetch: fetch };
}
