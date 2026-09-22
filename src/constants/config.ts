export const CONFIG = {
  DEVNET_RPC_URL: 'https://api.devnet.solana.com',
  SOLANA_CHAIN: 'solana:devnet' as const,
  APP_IDENTITY: {
    name: 'Shaheen Mobile Suite',
    uri: 'https://shaheen.dev',
    icon: 'favicon.ico',
  },
  DEFAULT_MEMO_TAG: 'Sent via Shaheen Native Rust MWA 2.0',
  SOL_USD_ESTIMATE: 154.20,
};

export const DEMO_RECIPIENTS = [
  {
    name: 'Solana Devnet Faucet',
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    badge: 'Faucet',
  },
  {
    name: 'Shaheen Protocol Vault',
    address: 'Vote111111111111111111111111111111111111111',
    badge: 'Protocol',
  },
  {
    name: 'Developer Sandbox',
    address: '4Nd1mBQtrMJVYVfKf2PJy9NZXdWBcdAu5PFh6z4a9pHp',
    badge: 'Devnet',
  },
];

export const MEMO_PRESETS = [
  'Shaheen Protocol Settlement',
  'Micropayment Bounty #402',
  'SIWS Identity Verification',
  'Automated Batch Distribution',
];

export const THEME = {
  bg: '#080B11',
  surface: '#0F1420',
  surfaceSubtle: '#141A29',
  surfaceBorder: '#1E2638',
  surfaceBorderHighlight: '#2A354D',
  
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Solana Accent Palette
  solanaGreen: '#14F195',
  solanaGreenMuted: 'rgba(20, 241, 149, 0.15)',
  solanaPurple: '#9945FF',
  solanaPurpleMuted: 'rgba(153, 69, 255, 0.15)',
  cyanAccent: '#38BDF8',
  cyanMuted: 'rgba(56, 189, 248, 0.12)',

  // Alerts & Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
};
