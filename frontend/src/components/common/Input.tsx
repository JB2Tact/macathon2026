import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text)',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: `1.5px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            fontSize: '15px',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            background: 'var(--surface)',
            color: 'var(--text)',
            width: '100%',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--green)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0,200,83,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {error && (
          <span role="alert" style={{ fontSize: '12px', color: 'var(--error)' }}>{error}</span>
        )}
      </div>
    );
  }
);
