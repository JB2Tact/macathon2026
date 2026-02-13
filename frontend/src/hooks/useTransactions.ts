import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../services/api';
import type { Transaction } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTransactions();
      setTransactions(result.transactions);
      setNextCursor(result.nextCursor);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(msg);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const result = await getTransactions(nextCursor);
      setTransactions(prev => [...prev, ...result.transactions]);
      setNextCursor(result.nextCursor);
    } catch {
      // Non-fatal — user can retry
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    transactions,
    loading,
    loadingMore,
    error,
    refetch: fetch,
    loadMore,
    hasMore: nextCursor !== null,
  };
}
