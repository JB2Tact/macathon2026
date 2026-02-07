interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = '#00C853' }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#F5F5F5',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spinner size={40} />
        <p style={{ marginTop: '16px', color: '#666666', fontSize: '14px' }}>Loading...</p>
      </div>
    </div>
  );
}
