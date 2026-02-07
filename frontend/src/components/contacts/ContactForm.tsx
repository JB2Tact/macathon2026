import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Contact, Blockchain } from '../../types';

interface ContactFormProps {
  initial?: Contact;
  onSave: (data: {
    name: string;
    country: string;
    walletAddress: string;
    network: Blockchain;
    email?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  loading: boolean;
}

const countries = [
  'Mexico', 'India', 'Philippines', 'Nigeria', 'Egypt',
  'Brazil', 'Colombia', 'Pakistan', 'Bangladesh', 'Kenya',
  'Vietnam', 'Guatemala', 'Dominican Republic', 'El Salvador', 'Honduras',
];

const networks: { value: Blockchain; label: string; placeholder: string }[] = [
  { value: 'stellar', label: 'Stellar', placeholder: 'G...' },
  { value: 'ethereum', label: 'Ethereum', placeholder: '0x...' },
  { value: 'solana', label: 'Solana', placeholder: 'So...' },
];

export function ContactForm({ initial, onSave, onCancel, loading }: ContactFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [country, setCountry] = useState(initial?.country || '');
  const [walletAddress, setWalletAddress] = useState(initial?.walletAddress || '');
  const [network, setNetwork] = useState<Blockchain>(initial?.network || 'stellar');
  const [email, setEmail] = useState(initial?.email || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  const canSave = name.trim() && country && walletAddress.trim();

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      country,
      walletAddress: walletAddress.trim(),
      network,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const selectedNetwork = networks.find((n) => n.value === network);

  return (
    <Card style={{ padding: '28px', marginBottom: '16px' }}>
      <h3
        style={{
          fontSize: '17px',
          fontWeight: 600,
          color: '#0A0A0A',
          marginBottom: '20px',
        }}
      >
        {initial ? 'Edit Contact' : 'Add Contact'}
      </h3>

      {/* Name */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipient's name"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Country */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Country *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: country === c ? '1.5px solid #00C853' : '1px solid #E0E0E0',
                background: country === c ? '#00C85310' : '#FFFFFF',
                color: country === c ? '#00C853' : '#666666',
                fontSize: '12px',
                fontWeight: country === c ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Network */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Blockchain Network *</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {networks.map((n) => (
            <button
              key={n.value}
              onClick={() => setNetwork(n.value)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: network === n.value ? '1.5px solid #00C853' : '1px solid #E0E0E0',
                background: network === n.value ? '#00C85310' : '#FFFFFF',
                color: network === n.value ? '#00C853' : '#666666',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Address */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Wallet Address *</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder={selectedNetwork?.placeholder || 'Enter wallet address'}
          style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Email (optional) */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="recipient@email.com"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Notes (optional) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Notes (optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Monthly rent, Family support"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button onClick={handleSubmit} loading={loading} disabled={!canSave} size="md">
          {initial ? 'Save Changes' : 'Add Contact'}
        </Button>
        <Button variant="secondary" onClick={onCancel} size="md" style={{ width: 'auto', padding: '12px 24px' }}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: '#999999',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid #E0E0E0',
  fontSize: '15px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  background: '#FFFFFF',
  color: '#0A0A0A',
};

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#00C853';
  e.target.style.boxShadow = '0 0 0 3px rgba(0,200,83,0.1)';
}

function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#E0E0E0';
  e.target.style.boxShadow = 'none';
}
