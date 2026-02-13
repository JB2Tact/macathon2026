import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Home', icon: '⬡' },
  { path: '/send', label: 'Send', icon: '↗' },
  { path: '/market', label: 'Market', icon: '▲' },
  { path: '/contacts', label: 'Contacts', icon: '◉' },
  { path: '/connect-bank', label: 'Bank', icon: '◈' },
  { path: '/history', label: 'History', icon: '☰' },
];

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

    const shortcuts: Record<string, string> = {
      'd': '/dashboard',
      's': '/send',
      'm': '/market',
      'c': '/contacts',
      'b': '/connect-bank',
      'h': '/history',
    };

    if (shortcuts[e.key]) {
      e.preventDefault();
      navigate(shortcuts[e.key]);
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.3s ease' }}>
      {/* Skip to content (A11y) */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      {/* Nav */}
      <nav
        aria-label="Main navigation"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'background 0.3s ease, border-color 0.3s ease',
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
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/dashboard'); }}
            aria-label="Go to dashboard"
          >
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)' }}>⬡</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              Chain<span style={{ color: 'var(--green)' }}>Route</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="nav-desktop" style={{ alignItems: 'center', gap: '4px' }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: location.pathname === item.path ? 'var(--green-tint-strong)' : 'transparent',
                  color: location.pathname === item.path ? 'var(--green)' : 'var(--text-secondary)',
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

          {/* Desktop Right */}
          <div className="nav-user-desktop" style={{ alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'light' ? '☾' : '☀'}
            </button>
            <button
              onClick={signOut}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              className="nav-mobile-trigger"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '16px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'light' ? '☾' : '☀'}
            </button>
            <button
              className="nav-mobile-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '18px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: location.pathname === item.path ? 'var(--green-tint-strong)' : 'transparent',
                  color: location.pathname === item.path ? 'var(--green)' : 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0', paddingTop: '8px' }}>
              <div style={{ padding: '8px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                {user?.displayName || user?.email}
              </div>
              <button
                onClick={signOut}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--error)',
                  fontWeight: 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main
        id="main-content"
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
