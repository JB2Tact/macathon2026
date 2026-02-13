import { sendStellarPayment, getStellarPublicKey } from '../blockchain/stellar';
import { sendEthereumPayment, getEthereumAddress } from '../blockchain/ethereum';
import { sendSolanaPayment, getSolanaPublicKey } from '../blockchain/solana';
import { fetchPrices } from './priceService';

export type Blockchain = 'stellar' | 'ethereum' | 'solana';

export async function executeTransfer(
  blockchain: Blockchain,
  amount: number,
  recipientAddress?: string
): Promise<string> {
  // Fetch live prices for USD conversion
  const prices = await fetchPrices(['XLM', 'ETH', 'SOL']);
  const xlmPrice = prices.get('XLM')?.price || 0.12;
  const ethPrice = prices.get('ETH')?.price || 3200;
  const solPrice = prices.get('SOL')?.price || 180;

  switch (blockchain) {
    case 'stellar': {
      const dest = recipientAddress || getStellarPublicKey();
      // Convert USD to XLM using live price
      const xlmAmount = (amount / xlmPrice).toFixed(7);
      return sendStellarPayment(dest, xlmAmount);
    }
    case 'ethereum': {
      const dest = recipientAddress || getEthereumAddress();
      return sendEthereumPayment(dest, amount, ethPrice);
    }
    case 'solana': {
      const dest = recipientAddress || getSolanaPublicKey();
      return sendSolanaPayment(dest, amount, solPrice);
    }
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}
