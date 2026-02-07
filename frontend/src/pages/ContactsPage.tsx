import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactForm } from '../components/contacts/ContactForm';
import { getContacts, createContact, updateContact, deleteContact } from '../services/api';
import type { Contact, Blockchain } from '../types';
import toast from 'react-hot-toast';

export function ContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch {
      // Silently handle if endpoint doesn't exist yet
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSave = async (data: {
    name: string;
    country: string;
    walletAddress: string;
    network: Blockchain;
    email?: string;
    notes?: string;
  }) => {
    try {
      setSaving(true);
      if (editingContact) {
        await updateContact(editingContact.id, data);
        toast.success('Contact updated');
      } else {
        await createContact(data);
        toast.success('Contact added');
      }
      setShowForm(false);
      setEditingContact(undefined);
      await fetchContacts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contact: Contact) => {
    try {
      await deleteContact(contact.id);
      toast.success(`${contact.name} removed`);
      await fetchContacts();
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSend = (contact: Contact) => {
    navigate(`/send?contactId=${contact.id}&name=${encodeURIComponent(contact.name)}&country=${encodeURIComponent(contact.country)}&wallet=${encodeURIComponent(contact.walletAddress)}&network=${contact.network}`);
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <span
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #E0E0E0',
              borderTopColor: '#00C853',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              display: 'inline-block',
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}>
              Contacts
            </h1>
            <p style={{ fontSize: '14px', color: '#666666' }}>
              {contacts.length} saved {contacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          {!showForm && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setEditingContact(undefined);
                setShowForm(true);
              }}
              style={{ width: 'auto' }}
            >
              + Add Contact
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <ContactForm
            initial={editingContact}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingContact(undefined);
            }}
            loading={saving}
          />
        )}

        {/* Contact List */}
        {contacts.length === 0 && !showForm && (
          <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>&#128101;</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A0A0A', marginBottom: '8px' }}>
              No contacts yet
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px' }}>
              Save your recipients so you can send money to them instantly.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(true)}
              style={{ width: 'auto', margin: '0 auto' }}
            >
              + Add Your First Contact
            </Button>
          </Card>
        )}

        {contacts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => handleEdit(contact)}
                onDelete={() => handleDelete(contact)}
                onSend={() => handleSend(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
