import { useState, useEffect } from 'react';
import { getContacts } from '../../services/api';
import type { Contact } from '../../types';

interface ContactSelectorProps {
  onSelect: (contact: Contact) => void;
}

const chainIcons: Record<string, string> = {
  stellar: '\u2605',
  ethereum: '\u25C6',
  solana: '\u25CE',
};

export function ContactSelector({ onSelect }: ContactSelectorProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getContacts()
      .then(setContacts)
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || contacts.length === 0) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 500,
          color: '#999999',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Send to a saved contact
      </label>

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1.5px solid #E0E0E0',
          background: '#FFFFFF',
          color: '#666666',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color 0.15s ease',
        }}
      >
        <span>Choose a contact ({contacts.length})</span>
        <span style={{ fontSize: '12px' }}>{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: '6px',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            background: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                onSelect(contact);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderBottom: '1px solid #F5F5F5',
                background: '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background 0.1s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'; }}
            >
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
                  fontSize: '14px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A0A0A', margin: 0 }}>
                  {contact.name}
                </p>
                <p style={{ fontSize: '12px', color: '#999999', margin: 0 }}>
                  {contact.country} {chainIcons[contact.network]} {contact.network}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
