import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card
      glass
      style={{
        borderLeft: '4px solid #00C853',
        marginTop: '24px',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? '12px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>&#10024;</span>
          <span
            style={{
              fontWeight: 700,
              color: '#00C853',
              fontSize: '14px',
            }}
          >
            AI Analysis
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              background: '#00C85315',
              color: '#00C853',
              borderRadius: '10px',
            }}
          >
            GEMINI
          </span>
        </div>
        <span style={{ fontSize: '14px', color: '#666666' }}>
          {isExpanded ? '\u25B2' : '\u25BC'}
        </span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#333333',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
