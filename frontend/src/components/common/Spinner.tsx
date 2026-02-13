interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = 'var(--green)' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
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
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spinner size={40} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</p>
      </div>
    </div>
  );
}
