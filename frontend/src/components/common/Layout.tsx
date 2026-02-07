import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/send', label: 'Send', icon: '↗' },
    { path: '/connect-bank', label: 'Bank', icon: '◈' },
    { path: '/history', label: 'History', icon: '☰' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Nav */}
      <nav
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E0E0E0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => navigate('/send')}
          >
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#00C853' }}>⬡</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#0A0A0A' }}>
              Chain<span style={{ color: '#00C853' }}>Route</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: location.pathname === item.path ? '#00C85315' : 'transparent',
                  color: location.pathname === item.path ? '#00C853' : '#666666',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#666666' }}>
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={signOut}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                background: '#FFFFFF',
                color: '#666666',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
