import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';

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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E8F5E9 100%)',
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
          <span style={{ fontSize: '36px', fontWeight: 700, color: '#00C853' }}>⬡</span>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px', color: '#0A0A0A' }}>
            Chain<span style={{ color: '#00C853' }}>Route</span> AI
          </h1>
          <p style={{ color: '#666666', fontSize: '14px', marginTop: '4px' }}>
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

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FF525210',
                color: '#FF5252',
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
          <span style={{ color: '#666666', fontSize: '14px' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={onToggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#00C853',
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
