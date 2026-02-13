import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

/**
 * Stripe webhook handler for checkout.session.completed events.
 * Updates user's bank connection status in Firestore when a Stripe
 * Checkout session completes successfully.
 *
 * This is exported as a separate Cloud Function (not behind auth middleware).
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || functions.config().stripe?.webhook_secret;

    if (!stripeSecretKey) {
        console.error('Stripe secret key not configured');
        res.status(500).send('Server configuration error');
        return;
    }

    const stripe = new Stripe(stripeSecretKey);

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
        const signature = req.headers['stripe-signature'] as string;
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            res.status(400).send('Webhook signature verification failed');
            return;
        }
    } else {
        // In development without webhook secret, parse the event directly
        console.warn('No STRIPE_WEBHOOK_SECRET configured — skipping signature verification');
        event = req.body as Stripe.Event;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
            console.error('checkout.session.completed event missing userId in metadata');
            res.status(400).send('Missing userId in session metadata');
            return;
        }

        try {
            const db = admin.firestore();
            await db.collection('users').doc(userId).set(
                {
                    bankConnection: {
                        status: 'connected',
                        stripeCustomerId: session.customer as string,
                        connectedAt: new Date().toISOString(),
                    },
                },
                { merge: true }
            );

            console.log(`Bank connected for user ${userId}`);
        } catch (err) {
            console.error(`Failed to update bank status for user ${userId}:`, err);
            res.status(500).send('Failed to update bank status');
            return;
        }
    }

    res.json({ received: true });
});
