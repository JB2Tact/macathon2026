import * as dotenv from 'dotenv';
dotenv.config();

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { sendAnalyze, sendConfirm } from './handlers/send';
import { getTransactions, getTransaction } from './handlers/transactions';
import { bankLink, bankStatus, bankDisconnect } from './handlers/bank';
import { getContacts, createContact, updateContact, deleteContact } from './handlers/contacts';
import { getMarketPrices, analyzeMarket, getSinglePrice, convertCurrency } from './handlers/market';
import { aiLimiter, sendLimiter, generalLimiter } from './middleware/rateLimiter';
import { requestIdMiddleware } from './middleware/requestId';

admin.initializeApp();

const app = express();

// CORS - restrict to known origins
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5000',  // Firebase Hosting emulator
  'https://chain-f4e1f.web.app',  // Firebase Hosting production
  'https://chain-f4e1f.firebaseapp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(requestIdMiddleware);

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

// Routes - Send (strict rate limit)
app.post('/api/send/analyze', aiLimiter, sendAnalyze);
app.post('/api/send/confirm', sendLimiter, sendConfirm);

// Routes - Transactions (general rate limit)
app.get('/api/transactions', generalLimiter, getTransactions);
app.get('/api/transactions/:id', generalLimiter, getTransaction);

// Routes - Bank (general rate limit)
app.post('/api/bank/link', generalLimiter, bankLink);
app.get('/api/bank/status', generalLimiter, bankStatus);
app.post('/api/bank/disconnect', generalLimiter, bankDisconnect);

// Routes - Contacts (general rate limit)
app.get('/api/contacts', generalLimiter, getContacts);
app.post('/api/contacts', generalLimiter, createContact);
app.put('/api/contacts/:id', generalLimiter, updateContact);
app.delete('/api/contacts/:id', generalLimiter, deleteContact);

// Routes - Market (AI rate limit for analyze, general for others)
app.get('/api/market/prices', generalLimiter, getMarketPrices);
app.post('/api/market/analyze', aiLimiter, analyzeMarket);
app.get('/api/market/price/:symbol', generalLimiter, getSinglePrice);
app.get('/api/market/convert', generalLimiter, convertCurrency);

export const api = functions.https.onRequest(app);

// Stripe webhook — exposed as a separate function (no auth middleware)
export { stripeWebhook } from './handlers/webhooks';
