import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { useTransactions } from '../../hooks/useTransactions';

const chainIcons: Record<string, string> = {
  stellar: '\u2605',
  ethereum: '\u25C6',
  solana: '\u25CE',
};

export function RecentTransactions({ onViewAll }: { onViewAll: () => void }) {
  const { transactions, loading, error } = useTransactions();
  const recent = transactions.slice(0, 5);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: '40px' }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
          Recent Activity
        </h3>
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <span
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--green)',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              display: 'inline-block',
            }}
          />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{ marginTop: '40px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
          Recent Activity
        </h3>
        {recent.length > 0 && (
          <button
            onClick={onViewAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--green)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            View All
          </button>
        )}
      </div>

      {error && (
        <Card style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Could not load transactions.
          </p>
        </Card>
      )}

      {!error && recent.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#128172;</div>
          <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
            No transactions yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Send your first transfer and it will appear here.
          </p>
        </Card>
      )}

      {!error && recent.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.map((tx, i) => {
            const statusColor =
              tx.status === 'completed' ? 'var(--green)' :
              tx.status === 'pending' ? 'var(--warning)' : 'var(--error)';
            const statusBg =
              tx.status === 'completed' ? 'var(--green-tint)' :
              tx.status === 'pending' ? 'var(--warning-tint)' : 'var(--error-tint)';
            const chain = tx.selectedRoute?.blockchain || tx.routes?.[0]?.blockchain;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <Card
                  hoverable
                  style={{ padding: '16px 20px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: statusBg,
                          color: statusColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 700,
                        }}
                      >
                        {tx.status === 'completed' ? '\u2713' :
                         tx.status === 'pending' ? '\u25CF' : '\u2717'}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                          {tx.input?.parsedRecipient
                            ? `Sent to ${tx.input.parsedRecipient}`
                            : 'Transfer'}
                          {tx.input?.parsedCountry ? ` (${tx.input.parsedCountry})` : ''}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          <span>
                            {new Date(tx.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {chain && (
                            <>
                              <span>&#183;</span>
                              <span>{chainIcons[chain] || ''} {chain}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        ${tx.input?.parsedAmount?.toFixed(2) || '0.00'}
                      </p>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: statusColor,
                          textTransform: 'capitalize',
                        }}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
