import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--error-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '16px',
            }}
          >
            ⚠
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            Something went wrong
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--green)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
