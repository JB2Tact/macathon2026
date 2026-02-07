import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { HowItWorks } from '../components/bank/HowItWorks';
import { ConnectionStatus } from '../components/bank/ConnectionStatus';
import { getBankStatus, createBankLink, disconnectBank } from '../services/api';
import type { BankAccount, BankConnectionStatus } from '../types';
import toast from 'react-hot-toast';

export function ConnectBankPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connectionStatus, setConnectionStatus] = useState<BankConnectionStatus>('not_connected');
  const [account, setAccount] = useState<BankAccount | undefined>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchStatus = useCallback(async (sessionId?: string) => {
    try {
      const res = await getBankStatus(sessionId);
      if (res.connected && res.account) {
        setConnectionStatus('connected');
        setAccount(res.account);
        if (sessionId) {
          toast.success('Card connected successfully!');
        }
      } else {
        setConnectionStatus('not_connected');
        setAccount(undefined);
      }
    } catch {
      setConnectionStatus('not_connected');
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  // On mount or Stripe redirect, check status
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');

    if (cancelled) {
      toast.error('Card connection was cancelled');
      setSearchParams({}, { replace: true });
      setInitialLoading(false);
      return;
    }

    if (sessionId) {
      // Returning from Stripe Checkout — verify the session
      setConnectionStatus('connecting');
      setSearchParams({}, { replace: true });
      fetchStatus(sessionId);
    } else {
      fetchStatus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = async () => {
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      const res = await createBankLink();
      // Redirect to Stripe's hosted Checkout page
      window.location.href = res.url;
    } catch {
      setConnectionStatus('not_connected');
      setLoading(false);
      toast.error('Failed to start card connection. Check your Stripe configuration.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectBank();
      setConnectionStatus('not_connected');
      setAccount(undefined);
      toast.success('Card disconnected');
    } catch {
      toast.error('Failed to disconnect card');
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <span
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #E0E0E0',
              borderTopColor: '#00C853',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              display: 'inline-block',
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Section 1: Introduction */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0A0A0A',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            Connect your card
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#666666',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Add a payment card to fund crypto transfers. Your card details are
            handled entirely by Stripe — we never see or store them.
          </p>
        </div>

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3 & 4: Connect Card / Connection Status */}
        <ConnectionStatus
          status={connectionStatus}
          account={account}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          loading={loading}
        />

        {/* Section 5: Next Actions (shown when connected) */}
        {connectionStatus === 'connected' && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '520px',
              margin: '24px auto 0',
            }}
          >
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/send')}
            >
              Continue to Send Money
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/send')}
              style={{ width: 'auto', flex: '0 0 auto', padding: '12px 24px' }}
            >
              Dashboard
            </Button>
          </div>
        )}

        {/* Security & Trust Footer */}
        <Card
          style={{
            marginTop: '40px',
            background: '#F5F5F5',
            border: 'none',
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'center',
              fontSize: '13px',
              color: '#666666',
            }}
          >
            <span>&#128274; PCI-DSS compliant</span>
            <span>&#9989; No raw card data stored</span>
            <span>&#128737; End-to-end encryption</span>
            <span>&#9888;&#65039; Crypto transfers simulated on testnet</span>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
