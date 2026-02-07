import { motion } from 'framer-motion';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onSendMoney: () => void;
  onViewHistory: () => void;
}

export function HeroSection({ onSendMoney, onViewHistory }: HeroSectionProps) {
  return (
    <section style={{ textAlign: 'center', padding: '48px 0 40px' }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: '40px',
          fontWeight: 700,
          color: '#0A0A0A',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}
      >
        Send money globally,
        <br />
        <span style={{ color: '#00C853' }}>instantly & intelligently.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: '17px',
          color: '#666666',
          maxWidth: '520px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}
      >
        AI-powered routing finds the cheapest, fastest blockchain path for
        your crypto transfers. Secure, transparent, and built for speed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        <Button variant="primary" size="lg" onClick={onSendMoney} style={{ width: 'auto' }}>
          Send Money
        </Button>
        <Button variant="secondary" size="md" onClick={onViewHistory} style={{ width: 'auto' }}>
          View History
        </Button>
      </motion.div>
    </section>
  );
}
