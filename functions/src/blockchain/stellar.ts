import * as StellarSdk from 'stellar-sdk';
import * as functions from 'firebase-functions';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

function getKeypair(): StellarSdk.Keypair {
  const secret = process.env.STELLAR_SECRET_KEY || functions.config().stellar?.secret_key || '';
  return StellarSdk.Keypair.fromSecret(secret);
}

export async function getStellarFee(xlmPrice: number): Promise<{ fee: number; time: string }> {
  try {
    const feeStats = await server.feeStats();
    const baseFee = parseInt(feeStats.last_ledger_base_fee, 10);
    // Convert stroops to USD using live price
    const feeInXLM = baseFee / 10_000_000;
    const feeInUSD = feeInXLM * xlmPrice;
    return { fee: Math.max(feeInUSD, 0.0001), time: '5s' };
  } catch {
    // Fallback estimate
    return { fee: 0.0001, time: '5s' };
  }
}

export async function sendStellarPayment(
  destinationId: string,
  amount: string
): Promise<string> {
  const keypair = getKeypair();
  const sourceAccount = await server.loadAccount(keypair.publicKey());

  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationId,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .addMemo(StellarSdk.Memo.text('ChainRoute AI'))
    .setTimeout(30)
    .build();

  transaction.sign(keypair);

  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export function getStellarPublicKey(): string {
  return getKeypair().publicKey();
}
