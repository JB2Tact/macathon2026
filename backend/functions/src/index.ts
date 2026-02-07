import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { sendAnalyze, sendConfirm } from './handlers/send';
import { getTransactions, getTransaction } from './handlers/transactions';
import { bankLink, bankStatus, bankDisconnect } from './handlers/bank';
import { getContacts, createContact, updateContact, deleteContact } from './handlers/contacts';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Auth middleware
async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const token = header.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    (req as express.Request & { uid: string }).uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(authMiddleware);

// Routes
app.post('/api/send/analyze', sendAnalyze);
app.post('/api/send/confirm', sendConfirm);
app.get('/api/transactions', getTransactions);
app.get('/api/transactions/:id', getTransaction);
app.post('/api/bank/link', bankLink);
app.get('/api/bank/status', bankStatus);
app.post('/api/bank/disconnect', bankDisconnect);
app.get('/api/contacts', getContacts);
app.post('/api/contacts', createContact);
app.put('/api/contacts/:id', updateContact);
app.delete('/api/contacts/:id', deleteContact);

export const api = functions.https.onRequest(app);
