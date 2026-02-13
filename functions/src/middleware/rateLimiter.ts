import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

/**
 * Firestore-backed rate limiter keyed by UID + time window.
 * Rate limit state persists across Cloud Function instances.
 *
 * @param maxRequests  Maximum requests per minute window
 * @param _refillRate  Kept for API compat (unused — window-based now)
 */
export function rateLimiter(maxRequests: number, _refillRate: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const uid = (req as Request & { uid?: string }).uid || req.ip || 'anon';
        const window = Math.floor(Date.now() / 60000); // 1-minute window
        const docId = `${uid}_${window}`;
        const db = admin.firestore();
        const ref = db.collection('rateLimits').doc(docId);

        try {
            const allowed = await db.runTransaction(async (t) => {
                const doc = await t.get(ref);
                const count = doc.exists ? (doc.data()!.count as number) : 0;

                if (count >= maxRequests) {
                    return false;
                }

                t.set(ref, {
                    count: count + 1,
                    uid,
                    window,
                    expiresAt: admin.firestore.Timestamp.fromMillis((window + 2) * 60000),
                }, { merge: true });

                return true;
            });

            if (!allowed) {
                res.status(429).json({
                    error: 'Too many requests. Please try again later.',
                    retryAfter: 60 - (Math.floor(Date.now() / 1000) % 60),
                });
                return;
            }

            next();
        } catch (err) {
            // Fail open on Firestore errors to avoid blocking legitimate requests
            console.warn('Rate limiter Firestore error (failing open):', err);
            next();
        }
    };
}

// Pre-configured limiters for different endpoint categories
/** AI endpoints: 10 requests per minute */
export const aiLimiter = rateLimiter(10, 10 / 60);

/** Blockchain/send endpoints: 5 requests per minute */
export const sendLimiter = rateLimiter(5, 5 / 60);

/** General API endpoints: 30 requests per minute */
export const generalLimiter = rateLimiter(30, 30 / 60);
