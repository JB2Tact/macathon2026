import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { NaturalLanguageInput } from '../send/NaturalLanguageInput';

interface QuickSendWidgetProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

export function QuickSendWidget({ onAnalyze, loading }: QuickSendWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        style={{
          maxWidth: '580px',
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
              background: 'var(--green-tint-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            &#9889;
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>
            Quick Send
          </h2>
        </div>
        <NaturalLanguageInput onSubmit={onAnalyze} loading={loading} compact />
      </Card>
    </motion.div>
  );
}
