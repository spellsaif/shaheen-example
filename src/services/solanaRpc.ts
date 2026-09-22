import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CONFIG } from '../constants/config';

export interface RpcBlockhashResult {
  blockhash: string;
  minContextSlot?: number;
}

export async function solanaRpc(method: string, params: any[] = []): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(CONFIG.DEVNET_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || `RPC Error: ${JSON.stringify(data.error)}`);
    }
    return data.result;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchBalance(pubkey: string): Promise<number> {
  const res = await solanaRpc('getBalance', [pubkey, { commitment: 'confirmed' }]);
  const lamports = res?.value ?? 0;
  return lamports / LAMPORTS_PER_SOL;
}

export async function fetchLatestBlockhash(): Promise<RpcBlockhashResult> {
  const res = await solanaRpc('getLatestBlockhash', [{ commitment: 'confirmed' }]);
  return {
    blockhash: res.value.blockhash,
    minContextSlot: res.context?.slot,
  };
}

export async function requestDevnetAirdrop(pubkey: string, solAmount: number = 1): Promise<string> {
  const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);
  const signature = await solanaRpc('requestAirdrop', [pubkey, lamports]);
  return signature;
}

export async function pingClusterLatency(): Promise<number> {
  const start = performance.now();
  await solanaRpc('getHealth');
  const elapsed = Math.round(performance.now() - start);
  return elapsed;
}
