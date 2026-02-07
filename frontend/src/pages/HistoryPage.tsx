import { Layout } from '../components/common/Layout';
import { TransactionItem } from '../components/history/TransactionItem';
import { Spinner } from '../components/common/Spinner';
import { useTransactions } from '../hooks/useTransactions';

export function HistoryPage() {
  const { transactions, loading, error, refetch } = useTransactions();

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A' }}>
            Transaction History
          </h2>
          <button
            onClick={refetch}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              background: '#FFFFFF',
              color: '#666666',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Spinner />
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#FF525210',
              color: '#FF5252',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ color: '#666666', fontSize: '16px' }}>No transactions yet</p>
            <p style={{ color: '#999999', fontSize: '14px', marginTop: '4px' }}>
              Send your first remittance to get started.
            </p>
          </div>
        )}

        {transactions.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </div>
    </Layout>
  );
}
