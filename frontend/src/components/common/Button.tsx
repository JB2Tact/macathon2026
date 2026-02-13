import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    width: '100%',
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '15px' },
    lg: { padding: '16px 32px', fontSize: '17px' },
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--green)',
      color: '#FFFFFF',
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--green)',
    },
  };

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onMouseEnter={(e) => {
        if (variant === 'primary' && !disabled && !loading) {
          (e.target as HTMLButtonElement).style.background = 'var(--green-hover)';
          (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
          (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,200,83,0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          (e.target as HTMLButtonElement).style.background = 'var(--green)';
          (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          (e.target as HTMLButtonElement).style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {loading && (
        <span
          role="status"
          aria-label="Loading"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}
