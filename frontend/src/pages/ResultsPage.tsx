import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { ParsedSummary } from '../components/results/ParsedSummary';
import { RouteCard } from '../components/results/RouteCard';
import { AIExplanation } from '../components/results/AIExplanation';
import { RouteVisualization } from '../components/results/RouteVisualization';
import { Button } from '../components/common/Button';
import { confirmSend } from '../services/api';
import type { SendResponse, Blockchain } from '../types';
import toast from 'react-hot-toast';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState<Blockchain | null>(null);

  const result = location.state as SendResponse | undefined;

  if (!result) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '16px' }}>
            No route analysis found.
          </p>
          <Button variant="secondary" onClick={() => navigate('/send')} style={{ width: 'auto' }}>
            ← Back to Send
          </Button>
        </div>
      </Layout>
    );
  }

  const sortedRoutes = [...result.routes].sort((a, b) => a.estimatedFee - b.estimatedFee);

  const handleSelect = async (blockchain: Blockchain) => {
    try {
      setConfirming(blockchain);
      await confirmSend({ transactionId: result.transactionId, blockchain });
      toast.success('Transaction submitted!');
      navigate('/history');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setConfirming(null);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/send')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>
            Route Comparison
          </h2>
        </div>

        <ParsedSummary parsed={result.parsed} />

        {/* Route Visualization (shown while confirming) */}
        {confirming && <RouteVisualization blockchain={confirming} />}

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Available Routes ({sortedRoutes.length})
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {sortedRoutes.map((route, i) => (
            <RouteCard
              key={route.blockchain}
              route={route}
              recommended={i === 0}
              onSelect={handleSelect}
              loading={confirming === route.blockchain}
            />
          ))}
        </div>

        <AIExplanation explanation={result.aiExplanation} />
      </div>
    </Layout>
  );
}
