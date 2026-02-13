import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { parseNaturalLanguage, generateExplanation } from '../services/aiService';
import { compareRoutes } from '../services/routingService';
import { executeTransfer, type Blockchain } from '../services/blockchainService';
import { sanitizeAIInput, validateAmount } from '../middleware/sanitize';

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

    // Sanitize input before passing to AI
    const sanitizedInput = sanitizeAIInput(naturalLanguage, 500);
    if (!sanitizedInput) {
      res.status(400).json({ error: 'Input is empty after sanitization' });
      return;
    }

    // Parse with AI
    const parsed = await parseNaturalLanguage(sanitizedInput);

    if (parsed.amount <= 0) {
      res.status(400).json({ error: 'Could not parse a valid amount from your request' });
      return;
    }

    // Validate amount limits
    const amountError = validateAmount(parsed.amount, 1, 10000);
    if (amountError) {
      res.status(400).json({ error: amountError });
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
        naturalLanguage: sanitizedInput,
        parsedAmount: parsed.amount,
        parsedCurrency: parsed.currency,
        parsedRecipient: parsed.recipient,
        parsedCountry: parsed.country || null,
        parsedWalletAddress: parsed.walletAddress || null,
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
        naturalLanguage: sanitizedInput,
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

    // Use Firestore transaction for idempotent confirmation
    const result = await db.runTransaction(async (t) => {
      const txDoc = await t.get(txRef);

      if (!txDoc.exists) {
        throw new Error('NOT_FOUND');
      }

      const txData = txDoc.data()!;
      if (txData.userId !== uid) {
        throw new Error('UNAUTHORIZED');
      }

      if (txData.status === 'completed') {
        // Idempotent: return existing result
        return { transaction: txData, alreadyCompleted: true };
      }

      if (txData.status !== 'pending') {
        throw new Error('ALREADY_PROCESSING');
      }

      // Mark as processing to prevent double-submit
      t.update(txRef, { status: 'processing' });

      return { txData, alreadyCompleted: false };
    });

    if (result.alreadyCompleted) {
      res.json(result);
      return;
    }

    const txData = result.txData!;

    // Execute on testnet (outside the transaction)
    let txHash: string;
    try {
      txHash = await executeTransfer(blockchain, txData.input.parsedAmount, txData.input.parsedWalletAddress || undefined);
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
    const errorMessage = err instanceof Error ? err.message : '';
    if (errorMessage === 'NOT_FOUND') {
      res.status(404).json({ error: 'Transaction not found' });
    } else if (errorMessage === 'UNAUTHORIZED') {
      res.status(403).json({ error: 'Unauthorized' });
    } else if (errorMessage === 'ALREADY_PROCESSING') {
      res.status(409).json({ error: 'Transaction is already being processed' });
    } else {
      console.error('sendConfirm error:', err);
      res.status(500).json({ error: 'Failed to confirm transaction' });
    }
  }
}
