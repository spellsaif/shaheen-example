import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  transact,
  UserRejectedError,
  TimeoutError,
  WalletUnavailableError,
  HandshakeError,
  type ShaheenAuthorizeSessionResult,
  type ShaheenGetCapabilitiesResult,
} from 'shaheen';
import { CONFIG } from '../constants/config';
import { fetchLatestBlockhash } from './solanaRpc';
import type { BatchItem, BatchExecutionReport, DeveloperCredential } from '../types';

export {
  UserRejectedError,
  TimeoutError,
  WalletUnavailableError,
  HandshakeError,
};

// Memo Program ID (standard on Solana Mainnet & Devnet)
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

/**
 * Connect and authorize active MWA 2.0 wallet session
 */
export async function connectWallet(cachedAuthToken?: string | null): Promise<ShaheenAuthorizeSessionResult> {
  return transact(async (wallet) => {
    const auth = await wallet.authorize({
      chain: CONFIG.SOLANA_CHAIN,
      authToken: cachedAuthToken || undefined,
      identity: CONFIG.APP_IDENTITY,
    });
    return auth;
  });
}

/**
 * Single Transfer with Memo Instruction
 */
export async function sendTransfer({
  fromAddress,
  recipientAddress,
  amountSol,
  memoText,
  authToken,
}: {
  fromAddress: string;
  recipientAddress: string;
  amountSol: number;
  memoText?: string;
  authToken?: string | null;
}): Promise<string> {
  const fromPubkey = new PublicKey(fromAddress);
  const toPubkey = new PublicKey(recipientAddress);
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

  // Fetch blockhash & context slot for MWA router safety
  const { blockhash, minContextSlot } = await fetchLatestBlockhash();

  const tx = new Transaction();

  // 1. Native SOL transfer instruction
  tx.add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  // 2. Memo instruction without Buffer polyfills (pure Uint8Array)
  if (memoText && memoText.trim().length > 0) {
    const memoBytes = new TextEncoder().encode(memoText.trim());
    tx.add(
      new TransactionInstruction({
        keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: memoBytes as any,
      })
    );
  }

  tx.feePayer = fromPubkey;
  tx.recentBlockhash = blockhash;

  const signatures = await transact(async (wallet) => {
    const auth = await wallet.authorize({
      chain: CONFIG.SOLANA_CHAIN,
      authToken: authToken || undefined,
      identity: CONFIG.APP_IDENTITY,
    });

    const [sig] = await wallet.signAndSendTransactions([tx], {
      minContextSlot,
      commitment: 'confirmed',
    });

    return { signature: sig, updatedAuthToken: auth.authToken };
  });

  return signatures.signature;
}

/**
 * Batch Transaction Pipeline with Shaheen Capability-Aware Auto-Chunking
 */
export async function sendBatchTransfers({
  fromAddress,
  items,
  authToken,
}: {
  fromAddress: string;
  items: BatchItem[];
  authToken?: string | null;
}): Promise<BatchExecutionReport> {
  const t0 = performance.now();
  const fromPubkey = new PublicKey(fromAddress);
  const { blockhash, minContextSlot } = await fetchLatestBlockhash();

  // Build Transaction array
  const transactions: Transaction[] = items.map((item) => {
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(item.recipient),
        lamports: Math.round(item.amount * LAMPORTS_PER_SOL),
      })
    );
    if (item.label) {
      const memoBytes = new TextEncoder().encode(`Batch: ${item.label}`);
      tx.add(
        new TransactionInstruction({
          keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
          programId: MEMO_PROGRAM_ID,
          data: memoBytes as any,
        })
      );
    }
    tx.feePayer = fromPubkey;
    tx.recentBlockhash = blockhash;
    return tx;
  });

  let allSignatures: string[] = [];
  let walletBatchLimit: number | 'Unlimited' = 'Unlimited';
  let chunksExecuted = 1;

  await transact(async (wallet) => {
    await wallet.authorize({
      chain: CONFIG.SOLANA_CHAIN,
      authToken: authToken || undefined,
      identity: CONFIG.APP_IDENTITY,
    });

    // Inspect capabilities
    try {
      const caps = await wallet.getCapabilities();
      if (caps.maxTransactionsPerRequest && caps.maxTransactionsPerRequest > 0) {
        walletBatchLimit = caps.maxTransactionsPerRequest;
      }
    } catch {}

    // Shaheen handles auto-chunking internally, or we can partition explicitly
    const chunkSize = typeof walletBatchLimit === 'number' ? walletBatchLimit : transactions.length;
    chunksExecuted = Math.ceil(transactions.length / chunkSize);

    const sigs = await wallet.signAndSendTransactions(transactions, {
      minContextSlot,
      commitment: 'confirmed',
    });

    allSignatures = sigs;
  });

  const executionTimeMs = Math.round(performance.now() - t0);

  return {
    totalTransactions: items.length,
    chunksExecuted,
    walletBatchLimit,
    signatures: allSignatures,
    executionTimeMs,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * SIWS (Sign-In With Solana) Developer Credential Signer
 */
export async function signSiwsCredential({
  fromAddress,
  serial,
  authToken,
}: {
  fromAddress: string;
  serial: string;
  authToken?: string | null;
}): Promise<DeveloperCredential> {
  const domain = 'shaheen.dev';
  const nonce = Math.random().toString(36).substring(2, 10).toUpperCase();
  const issuedAt = new Date().toISOString();
  const statement = 'Authenticate as verified Shaheen Native Rust Protocol Developer';

  const challenge = [
    `${domain} wants you to sign in with your Solana account:`,
    fromAddress,
    '',
    statement,
    '',
    `URI: https://${domain}`,
    `Version: 1`,
    `Chain ID: devnet`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
    `Credential Serial: #SHN-${serial}`,
    `Security Engine: Shaheen Rust TurboModule JSI`,
  ].join('\n');

  let signatureHex: string | null = null;

  await transact(async (wallet) => {
    await wallet.authorize({
      chain: CONFIG.SOLANA_CHAIN,
      authToken: authToken || undefined,
      identity: CONFIG.APP_IDENTITY,
    });

    const sigs = await wallet.signMessages([challenge]);
    const sigBytes = sigs[0];
    if (sigBytes) {
      signatureHex = Array.from(sigBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  });

  return {
    serial,
    address: fromAddress,
    domain,
    statement,
    issuedAt,
    nonce,
    signatureHex,
    isVerified: signatureHex !== null,
    curve: 'Ed25519',
  };
}

/**
 * Discover Connected Wallet Capabilities
 */
export async function discoverCapabilities(authToken?: string | null): Promise<ShaheenGetCapabilitiesResult> {
  return transact(async (wallet) => {
    await wallet.authorize({
      chain: CONFIG.SOLANA_CHAIN,
      authToken: authToken || undefined,
      identity: CONFIG.APP_IDENTITY,
    });
    return wallet.getCapabilities();
  });
}
