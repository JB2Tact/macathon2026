import { motion } from 'framer-motion';

interface RouteVisualizationProps {
  blockchain: string;
}

const nodeStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  border: '2px solid var(--green)',
  background: 'var(--surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  fontSize: '20px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginTop: '8px',
};

export function RouteVisualization({ blockchain }: RouteVisualizationProps) {
  const chainIcon = blockchain === 'stellar' ? '\u2605' : blockchain === 'ethereum' ? '\u25C6' : '\u25CE';

  return (
    <div
      style={{
        position: 'relative',
        padding: '48px 16px',
        marginBottom: '24px',
        userSelect: 'none',
      }}
    >
      {/* Background Track */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '4px',
          background: 'var(--border)',
          transform: 'translateY(-50%)',
          borderRadius: '4px',
        }}
      />

      {/* Animated Path */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: '4px',
          background: 'var(--green)',
          transform: 'translateY(-50%)',
          borderRadius: '4px',
        }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Source Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={nodeStyle}>
            <span style={{ color: 'var(--green)' }}>&#9788;</span>
          </div>
          <span style={labelStyle}>You</span>
        </motion.div>

        {/* Blockchain Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              border: '2px solid var(--green)',
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              boxShadow: '0 0 24px rgba(0,200,83,0.2)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            {chainIcon}
          </div>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--green)',
              marginTop: '8px',
              textTransform: 'capitalize',
            }}
          >
            {blockchain} Network
          </span>
        </motion.div>

        {/* Destination Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={nodeStyle}>
            <span style={{ color: 'var(--green)' }}>&#127760;</span>
          </div>
          <span style={labelStyle}>Recipient</span>
        </motion.div>
      </div>
    </div>
  );
}
