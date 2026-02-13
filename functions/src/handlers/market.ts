import { Request, Response } from 'express';
import { fetchPrices, analyzeRoutesWithAI, getPrice, convertAmount } from '../services/priceService';
import { validateAmount } from '../middleware/sanitize';

/**
 * GET /api/market/prices
 * Returns current prices for supported cryptocurrencies
 */
export async function getMarketPrices(req: Request, res: Response) {
    try {
        const symbols = (req.query.symbols as string)?.split(',') || ['BTC', 'ETH', 'XLM', 'SOL', 'USDC'];
        const prices = await fetchPrices(symbols);

        res.json({
            prices: Object.fromEntries(prices),
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('getMarketPrices error:', err);
        res.status(500).json({ error: 'Failed to fetch market prices' });
    }
}

/**
 * POST /api/market/analyze
 * Returns AI-powered route analysis with real-time pricing
 */
export async function analyzeMarket(req: Request, res: Response) {
    try {
        const { amount, sourceCurrency, destinationCountry } = req.body;

        if (!amount || amount <= 0) {
            res.status(400).json({ error: 'Valid amount is required' });
            return;
        }

        const amountError = validateAmount(amount, 1, 50000);
        if (amountError) {
            res.status(400).json({ error: amountError });
            return;
        }

        const analysis = await analyzeRoutesWithAI(
            amount,
            sourceCurrency || 'USD',
            destinationCountry || 'Global'
        );

        res.json({
            ...analysis,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('analyzeMarket error:', err);
        res.status(500).json({ error: 'Failed to analyze market' });
    }
}

/**
 * GET /api/market/price/:symbol
 * Returns price for a single cryptocurrency
 */
export async function getSinglePrice(req: Request, res: Response) {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            res.status(400).json({ error: 'Symbol is required' });
            return;
        }

        const price = await getPrice(symbol.toUpperCase());

        res.json({
            price,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('getSinglePrice error:', err);
        res.status(500).json({ error: 'Failed to fetch price' });
    }
}

/**
 * GET /api/market/convert
 * Converts between cryptocurrencies
 */
export async function convertCurrency(req: Request, res: Response) {
    try {
        const { amount, from, to } = req.query;

        if (!amount || !from || !to) {
            res.status(400).json({ error: 'amount, from, and to are required' });
            return;
        }

        const result = await convertAmount(
            parseFloat(amount as string),
            (from as string).toUpperCase(),
            (to as string).toUpperCase()
        );

        res.json({
            ...result,
            from,
            to,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('convertCurrency error:', err);
        res.status(500).json({ error: 'Failed to convert currency' });
    }
}
