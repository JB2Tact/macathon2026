import { Card } from '../common/Card';

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  return (
    <Card
      glass
      style={{
        borderLeft: '4px solid #00C853',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #00C853, #00E676)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          AI Analysis
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '8px',
            background: '#00C85310',
            color: '#00C853',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          Gemini
        </span>
      </div>
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#333333',
          whiteSpace: 'pre-wrap',
        }}
      >
        {explanation}
      </p>
    </Card>
  );
}
