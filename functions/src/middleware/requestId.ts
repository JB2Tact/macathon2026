import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware that generates a unique request ID for traceability.
 * Attaches it to the request object and response headers.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] as string || randomUUID();
    (req as Request & { requestId: string }).requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
}
