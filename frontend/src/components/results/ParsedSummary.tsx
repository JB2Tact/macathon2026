import { Card } from '../common/Card';
import type { ParsedInput } from '../../types';

interface ParsedSummaryProps {
  parsed: ParsedInput;
}

export function ParsedSummary({ parsed }: ParsedSummaryProps) {
  return (
    <Card style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '13px', color: '#999999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Parsed Request
      </p>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#666666', marginBottom: '2px' }}>Amount</p>
          <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#00C853' }}>
            ${parsed.parsedAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#666666', marginBottom: '2px' }}>Recipient</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A' }}>
            {parsed.parsedRecipient}
          </p>
        </div>
        {parsed.parsedCountry && (
          <div>
            <p style={{ fontSize: '12px', color: '#666666', marginBottom: '2px' }}>Destination</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A' }}>
              {parsed.parsedCountry}
            </p>
          </div>
        )}
      </div>
      <p
        style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: '#F5F5F5',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666666',
          fontStyle: 'italic',
        }}
      >
        "{parsed.naturalLanguage}"
      </p>
    </Card>
  );
}
