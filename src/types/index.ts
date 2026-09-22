import type { ShaheenGetCapabilitiesResult } from 'shaheen';

export type TabKey = 'pay' | 'batch' | 'credential' | 'benchmark' | 'telemetry';

export type LogTag = 'RPC' | 'MWA' | 'JSI' | 'SECURITY' | 'SUCCESS' | 'ERROR';

export interface LogEntry {
  id: string;
  time: string;
  tag: LogTag;
  text: string;
  detail?: string;
}

export interface TxHistoryItem {
  id: string;
  signature: string;
  amountSol: number;
  recipient: string;
  timestamp: string;
  type: 'transfer' | 'batch' | 'airdrop';
  memo?: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface BatchItem {
  id: string;
  recipient: string;
  amount: number;
  label: string;
}

export interface BatchExecutionReport {
  totalTransactions: number;
  chunksExecuted: number;
  walletBatchLimit: number | 'Unlimited';
  signatures: string[];
  executionTimeMs: number;
  timestamp: string;
}

export interface DeveloperCredential {
  serial: string;
  address: string;
  domain: string;
  statement: string;
  issuedAt: string;
  nonce: string;
  signatureHex: string | null;
  isVerified: boolean;
  curve: 'Ed25519';
}

export interface BenchmarkMetrics {
  jsiLatencyMs: string;
  iterations: number;
  rustSpeedupMultiplier: string;
  bundleSavingsKb: number;
  timestamp: string;
}

export type ProtocolPhase =
  | 'IDLE'
  | 'DISPATCH_INTENT'
  | 'ECDH_P256_EXCHANGE'
  | 'HKDF_DERIVATION'
  | 'ENCRYPTED_TUNNEL'
  | 'WALLET_AUTHORIZED'
  | 'TX_DISPATCH'
  | 'RPC_CONFIRMED';
