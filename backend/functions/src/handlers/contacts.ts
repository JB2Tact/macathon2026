import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

interface AuthRequest extends Request {
  uid: string;
}

const VALID_NETWORKS = ['stellar', 'ethereum', 'solana'];

export async function getContacts(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const db = admin.firestore();

    const snapshot = await db
      .collection('contacts')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const contacts = snapshot.docs.map((doc) => doc.data());
    res.json(contacts);
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ error: 'Failed to load contacts' });
  }
}

export async function createContact(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { name, country, walletAddress, network, email, notes } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (!country || typeof country !== 'string') {
      res.status(400).json({ error: 'Country is required' });
      return;
    }
    if (!walletAddress || typeof walletAddress !== 'string') {
      res.status(400).json({ error: 'Wallet address is required' });
      return;
    }
    if (!network || !VALID_NETWORKS.includes(network)) {
      res.status(400).json({ error: 'Network must be stellar, ethereum, or solana' });
      return;
    }

    const db = admin.firestore();
    const ref = db.collection('contacts').doc();

    const contact = {
      id: ref.id,
      userId: uid,
      name: name.trim(),
      country,
      walletAddress: walletAddress.trim(),
      network,
      email: email?.trim() || null,
      notes: notes?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    await ref.set(contact);
    res.json(contact);
  } catch (err) {
    console.error('createContact error:', err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
}

export async function updateContact(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { id } = req.params;

    const db = admin.firestore();
    const ref = db.collection('contacts').doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const data = doc.data()!;
    if (data.userId !== uid) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const updates: Record<string, string | null> = {};
    const { name, country, walletAddress, network, email, notes } = req.body;

    if (name !== undefined) updates.name = name.trim();
    if (country !== undefined) updates.country = country;
    if (walletAddress !== undefined) updates.walletAddress = walletAddress.trim();
    if (network !== undefined) {
      if (!VALID_NETWORKS.includes(network)) {
        res.status(400).json({ error: 'Network must be stellar, ethereum, or solana' });
        return;
      }
      updates.network = network;
    }
    if (email !== undefined) updates.email = email?.trim() || null;
    if (notes !== undefined) updates.notes = notes?.trim() || null;

    await ref.update(updates);
    const updated = (await ref.get()).data();
    res.json(updated);
  } catch (err) {
    console.error('updateContact error:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
}

export async function deleteContact(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { id } = req.params;

    const db = admin.firestore();
    const ref = db.collection('contacts').doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const data = doc.data()!;
    if (data.userId !== uid) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error('deleteContact error:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
}
