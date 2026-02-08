import { sendStellarPayment, getStellarPublicKey } from '../blockchain/stellar';
import { sendEthereumPayment, getEthereumAddress } from '../blockchain/ethereum';
import { sendSolanaPayment, getSolanaPublicKey } from '../blockchain/solana';

export type Blockchain = 'stellar' | 'ethereum' | 'solana';

export async function executeTransfer(
  blockchain: Blockchain,
  amount: number
): Promise<string> {
  // For testnet, we send to our own wallets as simulation
  switch (blockchain) {
    case 'stellar': {
      const dest = getStellarPublicKey();
      // Stellar amounts are in XLM, convert from USD
      const xlmAmount = (amount / 0.12).toFixed(7);
      return sendStellarPayment(dest, xlmAmount);
    }
    case 'ethereum': {
      const dest = getEthereumAddress();
      return sendEthereumPayment(dest, amount);
    }
    case 'solana': {
      const dest = getSolanaPublicKey();
      return sendSolanaPayment(dest, amount);
    }
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}
