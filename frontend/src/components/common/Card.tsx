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
    background: glass
      ? 'rgba(255, 255, 255, 0.7)'
      : '#FFFFFF',
    backdropFilter: glass ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(20px)' : undefined,
    borderRadius: '16px',
    border: '1px solid rgba(224, 224, 224, 0.5)',
    padding: '24px',
    transition: 'all 0.2s ease',
    cursor: onClick || hoverable ? 'pointer' : undefined,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  return (
    <div
      style={{ ...base, ...style }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        }
      }}
    >
      {children}
    </div>
  );
}
