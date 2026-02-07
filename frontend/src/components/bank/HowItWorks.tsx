import { Card } from '../common/Card';

const steps = [
  {
    number: '1',
    title: 'Add your card',
    description: 'Securely enter your card details on Stripe\'s hosted checkout page.',
  },
  {
    number: '2',
    title: 'Card is verified',
    description: 'Stripe validates your card and stores it securely for future use.',
  },
  {
    number: '3',
    title: 'Send globally',
    description: 'Use your card to fund crypto transfers to anyone, anywhere.',
  },
];

export function HowItWorks() {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#0A0A0A',
          marginBottom: '16px',
        }}
      >
        How it works
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        {steps.map((step) => (
          <Card key={step.number} style={{ padding: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#00C85315',
                color: '#00C853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                marginBottom: '12px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {step.number}
            </div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#0A0A0A',
                marginBottom: '6px',
              }}
            >
              {step.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666', lineHeight: 1.5 }}>
              {step.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
