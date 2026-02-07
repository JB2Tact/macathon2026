import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { NaturalLanguageInput } from '../components/send/NaturalLanguageInput';
import { analyzeSend } from '../services/api';
import type { SendResponse } from '../types';
import toast from 'react-hot-toast';

export function SendPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill from contact if navigated from contacts page
  const prefill = searchParams.get('name')
    ? {
        name: searchParams.get('name') || '',
        country: searchParams.get('country') || '',
        walletAddress: searchParams.get('wallet') || '',
        network: searchParams.get('network') || '',
      }
    : undefined;

  const handleSend = async (text: string) => {
    try {
      setLoading(true);
      const result: SendResponse = await analyzeSend({ naturalLanguage: text });
      navigate('/results', { state: result });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to analyze request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NaturalLanguageInput onSubmit={handleSend} loading={loading} prefill={prefill} />
    </Layout>
  );
}
