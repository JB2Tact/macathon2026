import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ContactSelector } from '../contacts/ContactSelector';
import type { Contact } from '../../types';

interface QuickSendWidgetProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

const countries = [
  'Mexico', 'India', 'Philippines', 'Nigeria', 'Egypt',
  'Brazil', 'Colombia', 'Pakistan', 'Bangladesh', 'Kenya',
];

export function QuickSendWidget({ onAnalyze, loading }: QuickSendWidgetProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [country, setCountry] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');

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
    onAnalyze(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#00C85315',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            &#9889;
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#0A0A0A' }}>
            Quick Send
          </h2>
        </div>

        {/* Contact Selector */}
        <ContactSelector onSelect={handleContactSelect} />

        {/* Amount */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Amount (USD)</label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                fontWeight: 600,
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
                paddingLeft: '32px',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={loading}
            />
          </div>
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Recipient Name</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g. Maria, Ahmed"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={loading}
          />
        </div>

        {/* Country */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Destination Country</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                disabled={loading}
                style={{
                  padding: '7px 14px',
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

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
          size="lg"
        >
          {loading ? 'Finding Best Route...' : 'Find Best Route'}
        </Button>
      </Card>
    </motion.div>
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
