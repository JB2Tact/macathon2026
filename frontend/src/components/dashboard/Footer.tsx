export function Footer() {
  return (
    <footer
      style={{
        marginTop: '48px',
        padding: '24px 0',
        borderTop: '1px solid #E0E0E0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0A0A0A' }}>
          Chain<span style={{ color: '#00C853' }}>Route</span> AI
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 500,
            background: '#F5F5F5',
            color: '#999999',
            border: '1px solid #E0E0E0',
          }}
        >
          TESTNET
        </span>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: '#999999',
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
