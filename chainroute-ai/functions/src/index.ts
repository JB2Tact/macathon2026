import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { sendAnalyze, sendConfirm } from './handlers/send';
import { getTransactions, getTransaction } from './handlers/transactions';
import { bankLink, bankStatus, bankDisconnect } from './handlers/bank';
import { getContacts, createContact, updateContact, deleteContact } from './handlers/contacts';
import { getMarketPrices, analyzeMarket, getSinglePrice, convertCurrency } from './handlers/market';

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

// Routes - Send
app.post('/api/send/analyze', sendAnalyze);
app.post('/api/send/confirm', sendConfirm);

// Routes - Transactions
app.get('/api/transactions', getTransactions);
app.get('/api/transactions/:id', getTransaction);

// Routes - Bank
app.post('/api/bank/link', bankLink);
app.get('/api/bank/status', bankStatus);
app.post('/api/bank/disconnect', bankDisconnect);

// Routes - Contacts
app.get('/api/contacts', getContacts);
app.post('/api/contacts', createContact);
app.put('/api/contacts/:id', updateContact);
app.delete('/api/contacts/:id', deleteContact);

// Routes - Market (Crypto Prices & AI Analysis)
app.get('/api/market/prices', getMarketPrices);
app.post('/api/market/analyze', analyzeMarket);
app.get('/api/market/price/:symbol', getSinglePrice);
app.get('/api/market/convert', convertCurrency);

export const api = functions.https.onRequest(app);
