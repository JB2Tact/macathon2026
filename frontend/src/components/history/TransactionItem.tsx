import { Card } from '../common/Card';
import type { Transaction, TransactionStatus, Blockchain } from '../../types';

const statusConfig: Record<TransactionStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#FFB300', bg: '#FFB30015' },
  completed: { label: 'Completed', color: '#00C853', bg: '#00C85315' },
  failed: { label: 'Failed', color: '#FF5252', bg: '#FF525215' },
};

const chainIcons: Record<Blockchain, string> = {
  stellar: '★',
  ethereum: '◆',
  solana: '◎',
};

interface TransactionItemProps {
  tx: Transaction;
}

export function TransactionItem({ tx }: TransactionItemProps) {
  const status = statusConfig[tx.status];
  const chain = tx.selectedRoute?.blockchain;

  return (
    <Card hoverable style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {chain && (
              <span style={{ fontSize: '18px' }}>{chainIcons[chain]}</span>
            )}
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#0A0A0A' }}>
              ${tx.input.parsedAmount.toFixed(2)} to {tx.input.parsedRecipient}
            </span>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '12px',
                background: status.bg,
                color: status.color,
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {status.label}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '4px' }}>
            {tx.input.naturalLanguage}
          </p>

          {tx.selectedRoute?.txHash && (
            <p
              style={{
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#999999',
                marginTop: '4px',
              }}
            >
              TX: {tx.selectedRoute.txHash.slice(0, 16)}...{tx.selectedRoute.txHash.slice(-8)}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', color: '#999999' }}>
            {new Date(tx.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {tx.selectedRoute && (
            <p style={{ fontSize: '12px', color: '#666666', marginTop: '4px' }}>
              Fee: ${tx.selectedRoute.estimatedFee.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
