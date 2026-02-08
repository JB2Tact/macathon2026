import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

interface AuthRequest extends Request {
  uid: string;
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const db = admin.firestore();

    const snapshot = await db
      .collection('transactions')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const transactions = snapshot.docs.map((doc) => doc.data());
    res.json(transactions);
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
}

export async function getTransaction(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { id } = req.params;

    const db = admin.firestore();
    const doc = await db.collection('transactions').doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const data = doc.data()!;
    if (data.userId !== uid) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('getTransaction error:', err);
    res.status(500).json({ error: 'Failed to load transaction' });
  }
}
