export function Footer() {
  return (
    <footer
      style={{
        marginTop: '48px',
        padding: '24px 0',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
          Chain<span style={{ color: 'var(--green)' }}>Route</span> AI
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 500,
            background: 'var(--bg)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          TESTNET
        </span>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          maxWidth: '400px',
          textAlign: 'right',
          lineHeight: 1.5,
        }}
      >
        Hackathon prototype. No real funds are transferred. All transactions
        occur on blockchain testnets.
      </p>
    </footer>
  );
}
