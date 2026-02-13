import { FadeInWhenVisible } from '../common/FadeInWhenVisible';

const TRUST_ITEMS = [
  { icon: '\u{1F6E1}', title: 'Non-Custodial', desc: 'No private keys stored' },
  { icon: '\u{1F512}', title: 'Secure Auth', desc: 'Firebase-secured login' },
  { icon: '\u{1F9EA}', title: 'Testnet Only', desc: 'Risk-free simulation' },
  { icon: '\u{1F4A1}', title: 'Transparent', desc: 'AI-explained routing' },
];

export function TrustIndicators() {
  return (
    <section
      style={{
        marginTop: '48px',
        padding: '32px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}
      >
        {TRUST_ITEMS.map((item, i) => (
          <FadeInWhenVisible key={item.title} delay={i * 0.1}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          </FadeInWhenVisible>
        ))}
      </div>
    </section>
  );
}
