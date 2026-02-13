import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CMC_API_KEY = process.env.CMC_API_KEY || functions.config().cmc?.api_key || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key || '';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ============================================================================
// TYPES
// ============================================================================

export interface CryptoPrice {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    lastUpdated: string;
}

export interface NetworkFee {
    blockchain: string;
    feeUSD: number;
    feeNative: number;
    estimatedTime: string;
    congestionLevel: 'low' | 'medium' | 'high';
}

export interface RouteOption {
    blockchain: string;
    score: number;
    fees: NetworkFee;
    price: CryptoPrice;
    reasoning: string;
}

export interface MarketAnalysis {
    recommendation: string;
    routes: RouteOption[];
    marketConditions: string;
    aiExplanation: string;
}

// ============================================================================
// PRICE CACHE (5-minute TTL)
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const priceCache: Map<string, CacheEntry<CryptoPrice>> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedPrice(symbol: string): CryptoPrice | null {
    const entry = priceCache.get(symbol);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data;
    }
    return null;
}

function setCachedPrice(symbol: string, data: CryptoPrice): void {
    priceCache.set(symbol, { data, timestamp: Date.now() });
}

// ============================================================================
// COINMARKETCAP API
// ============================================================================

const SUPPORTED_COINS = ['BTC', 'ETH', 'XLM', 'SOL', 'USDC', 'USDT', 'XRP'];

export async function fetchPrices(symbols: string[] = SUPPORTED_COINS): Promise<Map<string, CryptoPrice>> {
    const results = new Map<string, CryptoPrice>();
    const toFetch: string[] = [];

    // Check cache first
    for (const symbol of symbols) {
        const cached = getCachedPrice(symbol);
        if (cached) {
            results.set(symbol, cached);
        } else {
            toFetch.push(symbol);
        }
    }

    // Fetch missing from CMC
    if (toFetch.length > 0 && CMC_API_KEY) {
        try {
            const response = await fetch(
                `${CMC_BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${toFetch.join(',')}`,
                {
                    headers: {
                        'X-CMC_PRO_API_KEY': CMC_API_KEY,
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`CMC API error: ${response.status}`);
            }

            const data = await response.json();

            for (const symbol of toFetch) {
                const coinData = data.data?.[symbol];
                if (coinData) {
                    const price: CryptoPrice = {
                        symbol,
                        name: coinData.name,
                        price: coinData.quote.USD.price,
                        change24h: coinData.quote.USD.percent_change_24h,
                        marketCap: coinData.quote.USD.market_cap,
                        volume24h: coinData.quote.USD.volume_24h,
                        lastUpdated: coinData.quote.USD.last_updated,
                    };
                    setCachedPrice(symbol, price);
                    results.set(symbol, price);
                }
            }
        } catch (error) {
            console.error('CMC API error:', error);
            // Fall back to static prices
            for (const symbol of toFetch) {
                const fallback = getFallbackPrice(symbol);
                results.set(symbol, fallback);
            }
        }
    } else if (!CMC_API_KEY) {
        // Use fallback prices if no API key
        for (const symbol of toFetch) {
            const fallback = getFallbackPrice(symbol);
            results.set(symbol, fallback);
        }
    }

    return results;
}

function getFallbackPrice(symbol: string): CryptoPrice {
    const fallbackPrices: Record<string, number> = {
        BTC: 65000,
        ETH: 3200,
        XLM: 0.12,
        SOL: 180,
        USDC: 1.0,
        USDT: 1.0,
        XRP: 0.52,
    };

    return {
        symbol,
        name: symbol,
        price: fallbackPrices[symbol] || 1,
        change24h: 0,
        marketCap: 0,
        volume24h: 0,
        lastUpdated: new Date().toISOString(),
    };
}

// ============================================================================
// NETWORK FEE ESTIMATION
// ============================================================================

export async function estimateNetworkFees(): Promise<Map<string, NetworkFee>> {
    const fees = new Map<string, NetworkFee>();
    const prices = await fetchPrices(['ETH', 'XLM', 'SOL']);

    // Stellar - Ultra low fees, fast
    const xlmPrice = prices.get('XLM')?.price || 0.12;
    fees.set('stellar', {
        blockchain: 'stellar',
        feeNative: 0.00001,
        feeUSD: 0.00001 * xlmPrice,
        estimatedTime: '3-5 seconds',
        congestionLevel: 'low',
    });

    // Ethereum - Variable, slower
    const ethPrice = prices.get('ETH')?.price || 3200;
    const ethGasGwei = 25 + Math.random() * 30; // Simulate 25-55 gwei
    const ethFeeNative = (ethGasGwei * 21000) / 1e9;
    fees.set('ethereum', {
        blockchain: 'ethereum',
        feeNative: ethFeeNative,
        feeUSD: ethFeeNative * ethPrice,
        estimatedTime: '15-60 seconds',
        congestionLevel: ethGasGwei > 40 ? 'high' : ethGasGwei > 25 ? 'medium' : 'low',
    });

    // Solana - Very low fees, very fast
    const solPrice = prices.get('SOL')?.price || 180;
    fees.set('solana', {
        blockchain: 'solana',
        feeNative: 0.000005,
        feeUSD: 0.000005 * solPrice,
        estimatedTime: '0.4-1 second',
        congestionLevel: 'low',
    });

    return fees;
}

// ============================================================================
// AI-POWERED ROUTING ALGORITHM
// ============================================================================

export async function analyzeRoutesWithAI(
    amount: number,
    sourceCurrency: string,
    destinationCountry: string
): Promise<MarketAnalysis> {
    const prices = await fetchPrices();
    const fees = await estimateNetworkFees();

    // Build routes with scoring algorithm
    const routes: RouteOption[] = [];

    for (const [blockchain, fee] of fees) {
        // Advanced scoring algorithm:
        // - Lower fees = higher score (40% weight)
        // - Faster time = higher score (30% weight)
        // - Lower congestion = higher score (20% weight)
        // - Network reliability = (10% weight)

        const feeScore = Math.max(0, 100 - (fee.feeUSD * 100)); // $1 fee = 0 score
        const timeScore = blockchain === 'solana' ? 100 : blockchain === 'stellar' ? 95 : 60;
        const congestionScore = fee.congestionLevel === 'low' ? 100 : fee.congestionLevel === 'medium' ? 60 : 30;
        const reliabilityScore = blockchain === 'stellar' ? 95 : blockchain === 'ethereum' ? 90 : 85;

        const totalScore = (feeScore * 0.4) + (timeScore * 0.3) + (congestionScore * 0.2) + (reliabilityScore * 0.1);

        // Get the native coin price for this chain
        const coinSymbol = blockchain === 'stellar' ? 'XLM' : blockchain === 'ethereum' ? 'ETH' : 'SOL';
        const price = prices.get(coinSymbol) || getFallbackPrice(coinSymbol);

        routes.push({
            blockchain,
            score: Math.round(totalScore),
            fees: fee,
            price,
            reasoning: '', // Will be filled by AI
        });
    }

    // Sort by score (highest first)
    routes.sort((a, b) => b.score - a.score);

    // Generate AI explanation
    let aiExplanation = '';
    let marketConditions = '';

    if (GEMINI_API_KEY) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const prompt = `You are a crypto remittance expert. Analyze these blockchain routes for sending $${amount} ${sourceCurrency} to ${destinationCountry}.

Routes (sorted by optimization score):
${routes.map((r, i) => `${i + 1}. ${r.blockchain.toUpperCase()}
   - Score: ${r.score}/100
   - Fee: $${r.fees.feeUSD.toFixed(6)} (${r.fees.feeNative.toFixed(8)} native)
   - Speed: ${r.fees.estimatedTime}
   - Congestion: ${r.fees.congestionLevel}
   - ${r.price.symbol} Price: $${r.price.price.toFixed(2)} (${r.price.change24h > 0 ? '+' : ''}${r.price.change24h.toFixed(2)}% 24h)`).join('\n\n')}

Provide:
1. A 1-sentence recommendation for which route to use
2. For each route, a brief reason why it ranked where it did (max 15 words each)
3. Current market conditions summary (1 sentence)

Format as JSON:
{
  "recommendation": "...",
  "routeReasons": ["reason1", "reason2", "reason3"],
  "marketConditions": "..."
}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                aiExplanation = parsed.recommendation;
                marketConditions = parsed.marketConditions;

                // Apply reasons to routes
                parsed.routeReasons?.forEach((reason: string, i: number) => {
                    if (routes[i]) {
                        routes[i].reasoning = reason;
                    }
                });
            }
        } catch (error) {
            console.error('Gemini AI error:', error);
            aiExplanation = `Based on current network conditions, ${routes[0]?.blockchain} offers the best balance of speed and cost.`;
            marketConditions = 'Market data is currently being processed.';
        }
    } else {
        // No API key - use default explanations
        aiExplanation = `${routes[0]?.blockchain.toUpperCase()} is recommended for optimal speed and lowest fees.`;
        marketConditions = 'Real-time market analysis requires API configuration.';

        routes.forEach((route) => {
            if (route.blockchain === 'stellar') {
                route.reasoning = 'Lowest fees and fast settlement for remittances.';
            } else if (route.blockchain === 'solana') {
                route.reasoning = 'Ultra-fast transactions with minimal fees.';
            } else if (route.blockchain === 'ethereum') {
                route.reasoning = 'Most widely supported but higher gas costs.';
            }
        });
    }

    return {
        recommendation: routes[0]?.blockchain || 'stellar',
        routes,
        marketConditions,
        aiExplanation,
    };
}

// ============================================================================
// HELPER: Get single price
// ============================================================================

export async function getPrice(symbol: string): Promise<CryptoPrice> {
    const prices = await fetchPrices([symbol]);
    return prices.get(symbol) || getFallbackPrice(symbol);
}

// ============================================================================
// HELPER: Convert amount between currencies
// ============================================================================

export async function convertAmount(
    amount: number,
    fromSymbol: string,
    toSymbol: string
): Promise<{ amount: number; rate: number }> {
    const prices = await fetchPrices([fromSymbol, toSymbol]);
    const fromPrice = prices.get(fromSymbol)?.price || 1;
    const toPrice = prices.get(toSymbol)?.price || 1;

    const rate = fromPrice / toPrice;
    return {
        amount: amount * rate,
        rate,
    };
}
