import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { useAuth } from '../../context/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onToggleMode: () => void;
}

export interface AuthFormData {
  email: string;
  password: string;
  displayName?: string;
}

export function AuthForm({ mode, onSubmit, onToggleMode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>();

  const submit = async (data: AuthFormData) => {
    try {
      setLoading(true);
      setError('');
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) return;
    try {
      setResetLoading(true);
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px',
      }}
    >
      <Card
        glass
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--green)' }}>⬡</span>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px', color: 'var(--text)' }}>
            Chain<span style={{ color: 'var(--green)' }}>Route</span> AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.displayName?.message}
              {...register('displayName', { required: 'Name is required' })}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />

          {/* Forgot Password */}
          {mode === 'login' && (
            <div>
              {!showReset ? (
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--green)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              ) : (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'var(--green-tint)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {resetSent ? (
                    <p style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 500 }} role="status" aria-live="polite">
                      Check your email for a password reset link.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Enter your email to receive a reset link.
                      </p>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          background: 'var(--surface)',
                          color: 'var(--text)',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          loading={resetLoading}
                          onClick={handleResetPassword}
                          style={{ flex: 1 }}
                        >
                          Send Reset Email
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => { setShowReset(false); setResetSent(false); }}
                          style={{ width: 'auto' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--error-tint)',
                color: 'var(--error)',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" style={{ marginTop: '8px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={onToggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--green)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </Card>
    </div>
  );
}
