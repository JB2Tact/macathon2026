import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  glass?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, style, glass, onClick, hoverable }: CardProps) {
  const base: CSSProperties = {
    background: glass ? 'var(--surface-glass)' : 'var(--surface)',
    backdropFilter: glass ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(20px)' : undefined,
    borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '24px',
    transition: 'all 0.2s ease',
    cursor: onClick || hoverable ? 'pointer' : undefined,
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <div
      style={{ ...base, ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      onMouseEnter={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      {children}
    </div>
  );
}
