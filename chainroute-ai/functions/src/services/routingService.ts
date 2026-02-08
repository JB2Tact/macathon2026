import { getStellarFee } from '../blockchain/stellar';
import { getEthereumFee } from '../blockchain/ethereum';
import { getSolanaFee } from '../blockchain/solana';

export interface RouteOption {
  blockchain: 'stellar' | 'ethereum' | 'solana';
  estimatedFee: number;
  estimatedTime: string;
}

export async function compareRoutes(): Promise<RouteOption[]> {
  const results = await Promise.allSettled([
    getStellarFee(),
    getEthereumFee(),
    getSolanaFee(),
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
