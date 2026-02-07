import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ContactSelector } from '../contacts/ContactSelector';
import type { Contact } from '../../types';

interface Prefill {
  name: string;
  country: string;
  walletAddress: string;
  network: string;
}

interface NaturalLanguageInputProps {
  onSubmit: (text: string) => void;
  loading: boolean;
  prefill?: Prefill;
}

const countries = [
  'Mexico', 'India', 'Philippines', 'Nigeria', 'Egypt',
  'Brazil', 'Colombia', 'Pakistan', 'Bangladesh', 'Kenya',
  'Vietnam', 'Guatemala', 'Dominican Republic', 'El Salvador', 'Honduras',
];

const quickAmounts = [25, 50, 100, 200, 500];

export function NaturalLanguageInput({ onSubmit, loading, prefill }: NaturalLanguageInputProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [country, setCountry] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');

  useEffect(() => {
    if (prefill) {
      if (prefill.name) setRecipient(prefill.name);
      if (prefill.country) setCountry(prefill.country);
      if (prefill.walletAddress) setWalletAddress(prefill.walletAddress);
      if (prefill.network) setNetwork(prefill.network);
    }
  }, [prefill]);

  const handleContactSelect = (contact: Contact) => {
    setRecipient(contact.name);
    setCountry(contact.country);
    setWalletAddress(contact.walletAddress);
    setNetwork(contact.network);
  };

  const canSubmit = amount && parseFloat(amount) > 0 && recipient.trim() && country;

  const handleSubmit = () => {
    if (!canSubmit) return;
    let text = `Send $${amount} to ${recipient.trim()} in ${country}`;
    if (walletAddress) text += ` at ${walletAddress}`;
    if (network) text += ` on ${network}`;
    onSubmit(text);
  };

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#0A0A0A', lineHeight: 1.2 }}>
          Send money anywhere,
          <br />
          <span style={{ color: '#00C853' }}>in seconds.</span>
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', marginTop: '12px' }}>
          Choose amount, recipient, and destination. AI finds the best blockchain route.
        </p>
      </div>

      <Card
        glass
        style={{
          maxWidth: '580px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        {/* Contact Selector */}
        <ContactSelector onSelect={handleContactSelect} />

        {/* Amount */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Amount (USD)</label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#666666',
              }}
            >
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={{
                ...inputStyle,
                paddingLeft: '40px',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                height: '56px',
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                onClick={() => setAmount(String(qa))}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  border: amount === String(qa) ? '1.5px solid #00C853' : '1px solid #E0E0E0',
                  background: amount === String(qa) ? '#00C85310' : '#FFFFFF',
                  color: amount === String(qa) ? '#00C853' : '#333333',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono, monospace',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                ${qa}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Recipient Name</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient's name"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={loading}
          />
        </div>

        {/* Country */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Destination Country</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: country === c ? '1.5px solid #00C853' : '1px solid #E0E0E0',
                  background: country === c ? '#00C85310' : '#FFFFFF',
                  color: country === c ? '#00C853' : '#666666',
                  fontSize: '13px',
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

        {/* Wallet Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="e.g. GBX4K...or 0x1a2..."
            style={{
              ...inputStyle,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              letterSpacing: '0.3px',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={loading}
          />
          {network && (
            <div
              style={{
                display: 'inline-block',
                marginTop: '8px',
                padding: '4px 12px',
                borderRadius: '12px',
                background: '#00C85310',
                color: '#00C853',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {network}
            </div>
          )}
        </div>

        {/* Summary preview */}
        {canSubmit && (
          <div
            style={{
              background: '#F5F5F5',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#333333',
            }}
          >
            Sending{' '}
            <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00C853' }}>
              ${parseFloat(amount).toFixed(2)}
            </strong>{' '}
            to <strong>{recipient.trim()}</strong> in <strong>{country}</strong>
            {walletAddress && (
              <>
                {' '}at{' '}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            )}
            {network && <> via <strong>{network}</strong></>}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
          size="lg"
        >
          {loading ? 'Finding Best Route...' : 'Find Best Route'}
        </Button>
      </Card>
    </div>
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
