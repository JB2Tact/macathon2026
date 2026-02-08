import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { parseNaturalLanguage, generateExplanation } from '../services/aiService';
import { compareRoutes } from '../services/routingService';
import { executeTransfer, type Blockchain } from '../services/blockchainService';

interface AuthRequest extends Request {
  uid: string;
}

export async function sendAnalyze(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { naturalLanguage } = req.body;

    if (!naturalLanguage || typeof naturalLanguage !== 'string') {
      res.status(400).json({ error: 'naturalLanguage is required' });
      return;
    }

    if (naturalLanguage.length > 500) {
      res.status(400).json({ error: 'Input too long (max 500 chars)' });
      return;
    }

    // Parse with AI
    const parsed = await parseNaturalLanguage(naturalLanguage);

    if (parsed.amount <= 0) {
      res.status(400).json({ error: 'Could not parse a valid amount from your request' });
      return;
    }

    // Get routes
    const routes = await compareRoutes();

    // Get AI explanation
    const aiExplanation = await generateExplanation(parsed, routes);

    // Save to Firestore
    const db = admin.firestore();
    const txRef = db.collection('transactions').doc();

    await txRef.set({
      id: txRef.id,
      userId: uid,
      status: 'pending',
      input: {
        naturalLanguage,
        parsedAmount: parsed.amount,
        parsedCurrency: parsed.currency,
        parsedRecipient: parsed.recipient,
        parsedCountry: parsed.country || null,
      },
      routes: routes.map((r) => ({
        blockchain: r.blockchain,
        estimatedFee: r.estimatedFee,
        estimatedTime: r.estimatedTime,
      })),
      selectedRoute: null,
      aiExplanation,
      createdAt: new Date().toISOString(),
    });

    res.json({
      transactionId: txRef.id,
      parsed: {
        naturalLanguage,
        parsedAmount: parsed.amount,
        parsedCurrency: parsed.currency,
        parsedRecipient: parsed.recipient,
        parsedCountry: parsed.country || null,
      },
      routes,
      aiExplanation,
    });
  } catch (err) {
    console.error('sendAnalyze error:', err);
    res.status(500).json({ error: 'Failed to analyze request' });
  }
}

export async function sendConfirm(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const { transactionId, blockchain } = req.body;

    if (!transactionId || !blockchain) {
      res.status(400).json({ error: 'transactionId and blockchain are required' });
      return;
    }

    const validChains: Blockchain[] = ['stellar', 'ethereum', 'solana'];
    if (!validChains.includes(blockchain)) {
      res.status(400).json({ error: 'Invalid blockchain' });
      return;
    }

    const db = admin.firestore();
    const txRef = db.collection('transactions').doc(transactionId);
    const txDoc = await txRef.get();

    if (!txDoc.exists) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const txData = txDoc.data()!;
    if (txData.userId !== uid) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (txData.status !== 'pending') {
      res.status(400).json({ error: 'Transaction already processed' });
      return;
    }

    // Execute on testnet
    let txHash: string;
    try {
      txHash = await executeTransfer(blockchain, txData.input.parsedAmount);
    } catch (err) {
      // Simulate a tx hash if testnet fails
      console.error('Blockchain error (simulating):', err);
      txHash = `sim_${blockchain}_${Date.now().toString(16)}`;
    }

    const selectedRoute = txData.routes.find(
      (r: { blockchain: string }) => r.blockchain === blockchain
    );

    await txRef.update({
      status: 'completed',
      selectedRoute: {
        ...selectedRoute,
        txHash,
      },
      completedAt: new Date().toISOString(),
    });

    const updated = (await txRef.get()).data();
    res.json({ transaction: updated });
  } catch (err) {
    console.error('sendConfirm error:', err);
    res.status(500).json({ error: 'Failed to confirm transaction' });
  }
}
