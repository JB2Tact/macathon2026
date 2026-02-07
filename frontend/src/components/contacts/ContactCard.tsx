import { Card } from '../common/Card';
import type { Contact } from '../../types';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  onSend: () => void;
}

const chainIcons: Record<string, string> = {
  stellar: '\u2605',
  ethereum: '\u25C6',
  solana: '\u25CE',
};

export function ContactCard({ contact, onEdit, onDelete, onSend }: ContactCardProps) {
  const truncatedWallet =
    contact.walletAddress.length > 16
      ? `${contact.walletAddress.slice(0, 8)}...${contact.walletAddress.slice(-6)}`
      : contact.walletAddress;

  return (
    <Card hoverable style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Left: avatar + info */}
        <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#00C85315',
              color: '#00C853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0A', marginBottom: '2px' }}>
              {contact.name}
            </p>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '6px' }}>
              {contact.country}
              {contact.email && ` \u00B7 ${contact.email}`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#999999',
                  background: '#F5F5F5',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {truncatedWallet}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#00C853',
                  background: '#00C85310',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'capitalize',
                }}
              >
                {chainIcons[contact.network]} {contact.network}
              </span>
            </div>
            {contact.notes && (
              <p style={{ fontSize: '12px', color: '#999999', marginTop: '6px', fontStyle: 'italic' }}>
                {contact.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={onSend}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#00C853',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = '#00E676'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = '#00C853'; }}
          >
            Send
          </button>
          <button
            onClick={onEdit}
            style={actionBtnStyle}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{ ...actionBtnStyle, color: '#FF5252' }}
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

const actionBtnStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
  background: '#FFFFFF',
  color: '#666666',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.15s ease',
};
