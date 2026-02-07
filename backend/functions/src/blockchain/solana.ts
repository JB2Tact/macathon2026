import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import * as functions from 'firebase-functions';

const DEVNET_URL = 'https://api.devnet.solana.com';

function getConnection(): Connection {
  return new Connection(DEVNET_URL, 'confirmed');
}

function getKeypair(): Keypair {
  const key = process.env.SOLANA_PRIVATE_KEY || functions.config().solana?.private_key || '';
  try {
    // Try JSON array format first
    const parsed = JSON.parse(key);
    return Keypair.fromSecretKey(Uint8Array.from(parsed));
  } catch {
    try {
      // Try base58 via Buffer
      const decoded = Buffer.from(key, 'base64');
      return Keypair.fromSecretKey(decoded);
    } catch {
      return Keypair.generate(); // fallback for development
    }
  }
}

export async function getSolanaFee(): Promise<{ fee: number; time: string }> {
  try {
    const connection = getConnection();
    const { feeCalculator } = await connection.getRecentBlockhash();
    const feeLamports = feeCalculator.lamportsPerSignature;
    const feeSOL = feeLamports / LAMPORTS_PER_SOL;
    // Convert SOL to USD (approximate)
    const feeInUSD = feeSOL * 150;
    return { fee: Math.max(feeInUSD, 0.0005), time: '1s' };
  } catch {
    return { fee: 0.001, time: '1s' };
  }
}

export async function sendSolanaPayment(
  toPublicKey: string,
  amountUSD: number
): Promise<string> {
  const connection = getConnection();
  const fromKeypair = getKeypair();
  const toPubkey = new PublicKey(toPublicKey);

  // Convert USD to SOL (approximate)
  const amountSOL = amountUSD / 150;
  const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPubkey,
      lamports: lamports,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
  return signature;
}

export function getSolanaPublicKey(): string {
  return getKeypair().publicKey.toBase58();
}
