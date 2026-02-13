import { ethers } from 'ethers';
import * as functions from 'firebase-functions';

function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.ETH_RPC_URL || functions.config().eth?.rpc_url || 'https://sepolia.infura.io/v3/';
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getWallet(): ethers.Wallet {
  const privateKey = process.env.ETH_PRIVATE_KEY || functions.config().eth?.private_key || '';
  return new ethers.Wallet(privateKey, getProvider());
}

export async function getEthereumFee(ethPrice: number): Promise<{ fee: number; time: string }> {
  try {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const gasLimit = 21000n; // simple transfer
    const feeWei = gasPrice * gasLimit;
    const feeEth = parseFloat(ethers.formatEther(feeWei));
    // Convert ETH to USD using live price
    const feeInUSD = feeEth * ethPrice;
    return { fee: Math.max(feeInUSD, 0.01), time: '15s' };
  } catch {
    return { fee: 0.50, time: '15s' };
  }
}

export async function sendEthereumPayment(
  toAddress: string,
  amountUSD: number,
  ethPrice: number
): Promise<string> {
  const wallet = getWallet();
  // Convert USD to ETH using live price
  const amountEth = amountUSD / ethPrice;

  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountEth.toFixed(18)),
    data: ethers.hexlify(ethers.toUtf8Bytes('ChainRoute AI')),
  });

  const receipt = await tx.wait();
  return receipt?.hash || tx.hash;
}

export function getEthereumAddress(): string {
  return getWallet().address;
}
