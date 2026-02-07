import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { NaturalLanguageInput } from '../components/send/NaturalLanguageInput';
import { analyzeSend } from '../services/api';
import type { SendResponse } from '../types';
import toast from 'react-hot-toast';

export function SendPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      <NaturalLanguageInput onSubmit={handleSend} loading={loading} />
    </Layout>
  );
}
