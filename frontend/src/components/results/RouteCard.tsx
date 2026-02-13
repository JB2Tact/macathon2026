import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AnimatedCounter } from '../common/AnimatedCounter';
import type { Route, Blockchain } from '../../types';

interface RouteCardProps {
  route: Route;
  recommended: boolean;
  onSelect: (blockchain: Blockchain) => void;
  loading: boolean;
}

const chainMeta: Record<Blockchain, { name: string; icon: string; color: string }> = {
  stellar: { name: 'Stellar', icon: '★', color: 'var(--stellar-color)' },
  ethereum: { name: 'Ethereum', icon: '◆', color: 'var(--ethereum-color)' },
  solana: { name: 'Solana', icon: '◎', color: 'var(--solana-color)' },
};

export function RouteCard({ route, recommended, onSelect, loading }: RouteCardProps) {
  const meta = chainMeta[route.blockchain];

  return (
    <Card
      hoverable
      style={{
        position: 'relative',
        border: recommended ? '2px solid var(--green)' : '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {recommended && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--green)',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.3px',
          }}
        >
          BEST ROUTE
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--green-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
        >
          {meta.icon}
        </div>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>{meta.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{route.blockchain} testnet</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Estimated Fee</p>
          <p style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)' }}>
            <AnimatedCounter value={route.estimatedFee} prefix="$" decimals={4} />
          </p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Est. Time</p>
          <p style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)' }}>
            {route.estimatedTime}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onSelect(route.blockchain)}
        loading={loading}
        variant={recommended ? 'primary' : 'secondary'}
      >
        {recommended ? 'Send via ' : 'Use '}{meta.name}
      </Button>
    </Card>
  );
}
