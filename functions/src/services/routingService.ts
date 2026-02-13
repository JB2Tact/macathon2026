import { getStellarFee } from '../blockchain/stellar';
import { getEthereumFee } from '../blockchain/ethereum';
import { getSolanaFee } from '../blockchain/solana';
import { fetchPrices } from './priceService';

export interface RouteOption {
  blockchain: 'stellar' | 'ethereum' | 'solana';
  estimatedFee: number;
  estimatedTime: string;
}

export async function compareRoutes(): Promise<RouteOption[]> {
  // Fetch live prices for fee conversion
  const prices = await fetchPrices(['XLM', 'ETH', 'SOL']);
  const xlmPrice = prices.get('XLM')?.price || 0.12;
  const ethPrice = prices.get('ETH')?.price || 3200;
  const solPrice = prices.get('SOL')?.price || 180;

  const results = await Promise.allSettled([
    getStellarFee(xlmPrice),
    getEthereumFee(ethPrice),
    getSolanaFee(solPrice),
  ]);

  const routes: RouteOption[] = [];

  if (results[0].status === 'fulfilled') {
    routes.push({
      blockchain: 'stellar',
      estimatedFee: results[0].value.fee,
      estimatedTime: results[0].value.time,
    });
  } else {
    // Fallback estimate
    routes.push({ blockchain: 'stellar', estimatedFee: 0.0001, estimatedTime: '5s' });
  }

  if (results[1].status === 'fulfilled') {
    routes.push({
      blockchain: 'ethereum',
      estimatedFee: results[1].value.fee,
      estimatedTime: results[1].value.time,
    });
  } else {
    routes.push({ blockchain: 'ethereum', estimatedFee: 0.50, estimatedTime: '15s' });
  }

  if (results[2].status === 'fulfilled') {
    routes.push({
      blockchain: 'solana',
      estimatedFee: results[2].value.fee,
      estimatedTime: results[2].value.time,
    });
  } else {
    routes.push({ blockchain: 'solana', estimatedFee: 0.001, estimatedTime: '1s' });
  }

  return routes.sort((a, b) => a.estimatedFee - b.estimatedFee);
}
