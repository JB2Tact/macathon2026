import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

interface AuthRequest extends Request {
  uid: string;
}

/**
 * POST /api/bank/link
 * Creates a Stripe Checkout Session in setup mode so the user can add a card.
 * Returns the Stripe-hosted URL for the user to complete.
 */
export async function bankLink(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Get or create Stripe Customer
    let customerId = userData?.stripeCustomerId as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { firebaseUid: uid },
        email: userData?.email || undefined,
        name: userData?.displayName || undefined,
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    // Create Checkout Session in setup mode
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      payment_method_types: ['card'],
      success_url: `${FRONTEND_URL}/connect-bank?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/connect-bank?cancelled=true`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('bankLink error:', err);
    res.status(500).json({ error: 'Failed to create bank link session' });
  }
}

/**
 * GET /api/bank/status
 * Checks whether the user has a connected payment method on Stripe.
 * Optionally verifies a completed Checkout Session via ?session_id=
 */
export async function bankStatus(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const sessionId = req.query.session_id as string | undefined;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const customerId = userData?.stripeCustomerId as string | undefined;

    if (!customerId) {
      res.json({ connected: false });
      return;
    }

    // If a session_id is provided, verify the checkout completed
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.customer !== customerId) {
        res.status(403).json({ error: 'Session does not belong to this user' });
        return;
      }
    }

    // List payment methods on the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1,
    });

    if (paymentMethods.data.length === 0) {
      res.json({ connected: false });
      return;
    }

    const pm = paymentMethods.data[0];
    const card = pm.card!;

    // Store connection status in Firestore
    await userRef.set(
      {
        bankConnected: true,
        bankLast4: card.last4,
        bankBrand: card.brand,
        paymentMethodId: pm.id,
        bankConnectedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    res.json({
      connected: true,
      account: {
        id: pm.id,
        bankName: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
        last4: card.last4,
        status: 'connected',
        connectedAt: userData?.bankConnectedAt || new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('bankStatus error:', err);
    res.status(500).json({ error: 'Failed to check bank status' });
  }
}

/**
 * POST /api/bank/disconnect
 * Detaches the payment method from the Stripe Customer and clears Firestore.
 */
export async function bankDisconnect(req: Request, res: Response) {
  try {
    const { uid } = req as AuthRequest;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const customerId = userData?.stripeCustomerId as string | undefined;

    if (customerId) {
      // Detach all card payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      for (const pm of paymentMethods.data) {
        await stripe.paymentMethods.detach(pm.id);
      }
    }

    // Clear bank fields in Firestore
    await userRef.set(
      {
        bankConnected: false,
        bankLast4: admin.firestore.FieldValue.delete(),
        bankBrand: admin.firestore.FieldValue.delete(),
        paymentMethodId: admin.firestore.FieldValue.delete(),
        bankConnectedAt: admin.firestore.FieldValue.delete(),
      },
      { merge: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('bankDisconnect error:', err);
    res.status(500).json({ error: 'Failed to disconnect bank' });
  }
}
