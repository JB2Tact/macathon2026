import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface NaturalLanguageInputProps {
  onSubmit: (text: string) => void;
  loading: boolean;
}

const examples = [
  'Send $100 to Maria in Mexico',
  'Transfer 50 USD to Ahmed in Egypt',
  'Pay $200 to Priya in India',
  'Send $75 to Carlos in Brazil',
];

export function NaturalLanguageInput({ onSubmit, loading }: NaturalLanguageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#0A0A0A', lineHeight: 1.2 }}>
          Send money anywhere,
          <br />
          <span style={{ color: '#00C853' }}>just say it.</span>
        </h1>
        <p style={{ color: '#666666', fontSize: '16px', marginTop: '12px' }}>
          Type a natural language command and AI will find the best blockchain route.
        </p>
      </div>

      <Card
        glass
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder='Try "Send $100 to Maria in Mexico"'
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid #E0E0E0',
              fontSize: '17px',
              fontFamily: 'Inter, sans-serif',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              background: '#FFFFFF',
              color: '#0A0A0A',
              lineHeight: 1.5,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00C853';
              e.target.style.boxShadow = '0 0 0 3px rgba(0,200,83,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E0E0E0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!text.trim()}
          size="lg"
          style={{ marginTop: '16px' }}
        >
          {loading ? 'Analyzing Routes...' : 'Find Best Route →'}
        </Button>

        {/* Example pills */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#999999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Try an example
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => setText(example)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #E0E0E0',
                  background: '#FFFFFF',
                  color: '#666666',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = '#00C853';
                  (e.target as HTMLButtonElement).style.color = '#00C853';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = '#E0E0E0';
                  (e.target as HTMLButtonElement).style.color = '#666666';
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
