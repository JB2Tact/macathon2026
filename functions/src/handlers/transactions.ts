import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

interface AuthRequest extends Request {
  uid: string;
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const db = admin.firestore();
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    let query = db
      .collection('transactions')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    // Cursor-based pagination
    if (cursor) {
      const cursorDoc = await db.collection('transactions').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();

    const transactions = snapshot.docs.map((doc) => doc.data());
    const nextCursor = snapshot.docs.length === limit
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

    res.json({ transactions, nextCursor });
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
