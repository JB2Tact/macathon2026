import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
        overflow: 'hidden'
      }}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? '12px' : '0'
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">
            AI Analysis
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
            GEMINI
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-300">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
