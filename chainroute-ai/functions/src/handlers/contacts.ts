import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

interface AuthRequest extends Request {
    uid: string;
}

interface Contact {
    id: string;
    userId: string;
    name: string;
    email?: string;
    walletAddress?: string;
    country?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * GET /api/contacts
 * Returns all contacts for the authenticated user
 */
export async function getContacts(req: Request, res: Response) {
    try {
        const { uid } = req as AuthRequest;
        const db = admin.firestore();

        const snapshot = await db
            .collection('contacts')
            .where('userId', '==', uid)
            .orderBy('name')
            .get();

        const contacts: Contact[] = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        } as Contact));

        res.json(contacts);
    } catch (err) {
        console.error('getContacts error:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
}

/**
 * POST /api/contacts
 * Creates a new contact for the authenticated user
 */
export async function createContact(req: Request, res: Response) {
    try {
        const { uid } = req as AuthRequest;
        const { name, email, walletAddress, country, notes } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }

        const db = admin.firestore();
        const now = new Date().toISOString();

        const contact: Omit<Contact, 'id'> = {
            userId: uid,
            name,
            email: email || null,
            walletAddress: walletAddress || null,
            country: country || null,
            notes: notes || null,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await db.collection('contacts').add(contact);

        res.status(201).json({
            id: docRef.id,
            ...contact,
        });
    } catch (err) {
        console.error('createContact error:', err);
        res.status(500).json({ error: 'Failed to create contact' });
    }
}

/**
 * PUT /api/contacts/:id
 * Updates an existing contact
 */
export async function updateContact(req: Request, res: Response) {
    try {
        const { uid } = req as AuthRequest;
        const { id } = req.params;
        const { name, email, walletAddress, country, notes } = req.body;

        const db = admin.firestore();
        const docRef = db.collection('contacts').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }

        const existingContact = doc.data() as Contact;

        if (existingContact.userId !== uid) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const updates: Partial<Contact> = {
            updatedAt: new Date().toISOString(),
        };

        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (walletAddress !== undefined) updates.walletAddress = walletAddress;
        if (country !== undefined) updates.country = country;
        if (notes !== undefined) updates.notes = notes;

        await docRef.update(updates);

        const { id: _existingId, ...existingData } = existingContact;
        res.json({
            id,
            ...existingData,
            ...updates,
        });
    } catch (err) {
        console.error('updateContact error:', err);
        res.status(500).json({ error: 'Failed to update contact' });
    }
}

/**
 * DELETE /api/contacts/:id
 * Deletes a contact
 */
export async function deleteContact(req: Request, res: Response) {
    try {
        const { uid } = req as AuthRequest;
        const { id } = req.params;

        const db = admin.firestore();
        const docRef = db.collection('contacts').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }

        const contact = doc.data() as Contact;

        if (contact.userId !== uid) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        await docRef.delete();

        res.json({ success: true });
    } catch (err) {
        console.error('deleteContact error:', err);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
}
