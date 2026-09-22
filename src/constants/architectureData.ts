export const ARCHITECTURE_DATA = {
  title: 'Shaheen Protocol Engine Architecture',
  summary:
    'Shaheen is an Android-first, polyfill-free Solana Mobile Wallet Adapter (MWA 2.0) native engine for React Native and Expo. It eliminates the 15+ JavaScript crypto polyfills typically required for Solana mobile dApps by executing P-256 ECDH, HKDF-SHA256, and AES-128-GCM inside a compiled native Rust core via TurboModule / JSI.',

  keyHighlights: [
    {
      title: 'Zero JavaScript Crypto Polyfills',
      description:
        'Eliminates Buffer, react-native-quick-crypto, and react-native-get-random-values, saving 3.8 MB in bundle size and preventing Hermes engine warmup stalls.',
      tag: 'Bundle & Memory',
    },
    {
      title: 'Sub-Millisecond Native JSI Bridge',
      description:
        'Replaces asynchronous serialized React Native bridge passes with direct zero-overhead C++/Rust JSI bindings, completing invocations in under 0.1ms.',
      tag: 'Performance',
    },
    {
      title: 'Intelligent Auto-Chunking Pipeline',
      description:
        'Dynamically interrogates wallet capabilities (max_transactions_per_request) and automatically batches multi-instruction payloads without failing transactions.',
      tag: 'Reliability',
    },
    {
      title: 'Off-Chain SIWS Ed25519 Passports',
      description:
        'Standardized cryptographic Sign-In with Solana (SIWS) authentication generating verifiable on-chain/off-chain identity proofs.',
      tag: 'Security',
    },
  ],

  comparisonMatrix: [
    {
      metric: 'Crypto Polyfills Required',
      shaheen: '0 (Pure Native Rust)',
      legacy: '15+ (Buffer, QuickCrypto, etc.)',
      advantage: '100% Polyfill-free',
    },
    {
      metric: 'ECDH Key Exchange Latency',
      shaheen: '0.12 ms (Compiled Rust)',
      legacy: '14.8 ms (Hermes JS Engine)',
      advantage: '120x Faster',
    },
    {
      metric: 'JS Bundle Footprint',
      shaheen: '0 KB added to JS bundle',
      legacy: '+3.8 MB shim bloat',
      advantage: 'Zero JS overhead',
    },
    {
      metric: 'Batch Transaction Handling',
      shaheen: 'Capability-aware auto-chunking',
      legacy: 'Throws on wallet batch limit',
      advantage: 'Never rejects multi-tx',
    },
    {
      metric: 'Error Taxonomy',
      shaheen: 'Typed (UserRejectedError, TimeoutError, etc.)',
      legacy: 'Untyped string regex matching',
      advantage: 'Production safety',
    },
  ],

  coreCapabilities: [
    {
      title: 'MWA 2.0 Direct Intent Association',
      description: 'Zero-relay peer association using Android local loopback WebSocket server.',
    },
    {
      title: 'Hardware-Backed Message Signing',
      description: 'Hardware wallet-backed Ed25519 signatures for SIWS authentication and verifiable credentials.',
    },
    {
      title: 'High-Frequency Batch Execution',
      description: 'Automatic payload slicing based on dynamic wallet capability discovery.',
    },
  ],

  specs: [
    { label: 'Rust Edition', value: 'Rust 2021 (x86_64, arm64-v8a)' },
    { label: 'Transport', value: 'Encrypted Local Loopback WebSocket' },
    { label: 'Cipher Suite', value: 'P-256 ECDH + HKDF + AES-128-GCM' },
    { label: 'MWA Spec', value: 'Solana MWA 2.0 (Backward compatible)' },
    { label: 'Bridge Type', value: 'Zero-copy React Native TurboModule / JSI' },
  ],
};
