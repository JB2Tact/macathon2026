import { Layout } from '../components/common/Layout';
import { TransactionItem } from '../components/history/TransactionItem';
import { Spinner } from '../components/common/Spinner';
import { useTransactions } from '../hooks/useTransactions';

export function HistoryPage() {
  const { transactions, loading, loadingMore, error, refetch, loadMore, hasMore } = useTransactions();

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>
            Transaction History
          </h2>
          <button
            onClick={refetch}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  height: '80px',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '24px',
              borderRadius: '12px',
              background: '#FF525210',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#FF5252', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
            <button
              onClick={refetch}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#FF5252',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No transactions yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Send your first remittance to get started.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </div>

        {hasMore && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                padding: '10px 28px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: loadingMore ? 'var(--text-muted)' : 'var(--text)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loadingMore ? 'default' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loadingMore && <Spinner size={14} />}
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
