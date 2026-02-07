import { GoogleGenerativeAI } from '@google/generative-ai';
import * as functions from 'firebase-functions';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || functions.config().gemini?.api_key || ''
);

export interface ParsedTransfer {
  amount: number;
  currency: string;
  recipient: string;
  country?: string;
}

export async function parseNaturalLanguage(text: string): Promise<ParsedTransfer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Parse this money transfer request and return ONLY a JSON object with these fields:
- amount (number)
- currency (string, default "USD")
- recipient (string, the person's name)
- country (string or null, the destination country)

User request: "${text}"

Return ONLY valid JSON, no markdown or explanation.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = response.replace(/^```json?\s*/, '').replace(/\s*```$/, '');

  try {
    const parsed = JSON.parse(cleaned);
    return {
      amount: Number(parsed.amount),
      currency: parsed.currency || 'USD',
      recipient: parsed.recipient || 'Unknown',
      country: parsed.country || undefined,
    };
  } catch {
    // Fallback: try regex
    const amountMatch = text.match(/\$?([\d,.]+)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;

    return {
      amount,
      currency: 'USD',
      recipient: 'Unknown',
      country: undefined,
    };
  }
}

export interface RouteInfo {
  blockchain: string;
  estimatedFee: number;
  estimatedTime: string;
}

export async function generateExplanation(
  parsed: ParsedTransfer,
  routes: RouteInfo[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const sortedRoutes = [...routes].sort((a, b) => a.estimatedFee - b.estimatedFee);
  const best = sortedRoutes[0];

  const prompt = `You are a crypto remittance advisor. A user wants to send $${parsed.amount} ${parsed.currency} to ${parsed.recipient}${parsed.country ? ` in ${parsed.country}` : ''}.

Here are the blockchain routes compared:
${routes.map((r) => `- ${r.blockchain}: fee $${r.estimatedFee.toFixed(4)}, time ~${r.estimatedTime}`).join('\n')}

The recommended route is ${best.blockchain} with the lowest fee of $${best.estimatedFee.toFixed(4)}.

Write a concise 2-3 sentence explanation of why ${best.blockchain} is the best route for this transfer. Mention the fee savings and speed. Keep it friendly and informative. Do not use markdown formatting.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
