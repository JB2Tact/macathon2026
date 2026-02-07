import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { BankAccount, BankConnectionStatus } from '../../types';

interface ConnectionStatusProps {
  status: BankConnectionStatus;
  account?: BankAccount;
  onConnect: () => void;
  onDisconnect: () => void;
  loading: boolean;
}

export function ConnectionStatus({
  status,
  account,
  onConnect,
  onDisconnect,
  loading,
}: ConnectionStatusProps) {
  if (status === 'connected' && account) {
    return (
      <Card
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '40px 32px',
        }}
      >
        {/* Success indicator */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#00C85315',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <span style={{ fontSize: '28px', color: '#00C853' }}>&#10003;</span>
        </div>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0A0A0A',
            marginBottom: '8px',
          }}
        >
          Card connected
        </h3>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px' }}>
          Your card is verified and ready to fund transfers.
        </p>

        {/* Masked bank info */}
        <div
          style={{
            background: '#F5F5F5',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '20px' }}>&#128179;</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>
              {account.bankName}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: '#666666',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              ****{account.last4}
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              background: '#00C85315',
              color: '#00C853',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
            }}
          >
            Connected
          </div>
        </div>

        <button
          onClick={onDisconnect}
          style={{
            background: 'none',
            border: 'none',
            color: '#999999',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            textDecoration: 'underline',
          }}
        >
          Disconnect card
        </button>
      </Card>
    );
  }

  return (
    <Card
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '40px 32px',
      }}
    >
      {/* Card icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <span style={{ fontSize: '28px' }}>&#128179;</span>
      </div>

      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#0A0A0A',
          marginBottom: '8px',
        }}
      >
        {status === 'connecting' ? 'Connecting...' : 'Add your payment card'}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: '#666666',
          marginBottom: '28px',
          maxWidth: '360px',
          margin: '0 auto 28px',
        }}
      >
        Connect securely through Stripe. We never see or store your card details.
      </p>

      <Button
        variant="primary"
        size="lg"
        loading={loading || status === 'connecting'}
        onClick={onConnect}
      >
        Connect Card via Stripe
      </Button>

      {/* Trust badges */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '12px',
          color: '#999999',
        }}
      >
        <span>&#128274; Bank-level encryption</span>
        <span>&#183;</span>
        <span>Powered by Stripe</span>
      </div>

      {/* Supported info */}
      <p
        style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#999999',
          lineHeight: 1.5,
        }}
      >
        Supports Visa, Mastercard, American Express, and other major card networks.
      </p>
    </Card>
  );
}
