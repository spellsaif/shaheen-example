import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import { THEME, CONFIG } from '../constants/config';

interface WalletHeroProps {
  address: string | null;
  balance: number | null;
  loading: boolean;
  isDemoMode: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
  onRequestAirdrop: () => void;
  onToggleDemoMode: () => void;
}

export const WalletHero: React.FC<WalletHeroProps> = ({
  address,
  balance,
  loading,
  isDemoMode,
  onConnect,
  onDisconnect,
  onRefreshBalance,
  onRequestAirdrop,
  onToggleDemoMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [airdropLoading, setAirdropLoading] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await Share.share({ message: address });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleAirdropClick = async () => {
    setAirdropLoading(true);
    try {
      await onRequestAirdrop();
    } finally {
      setAirdropLoading(false);
    }
  };

  const balanceUsd =
    balance !== null
      ? (balance * CONFIG.SOL_USD_ESTIMATE).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      : '$0.00';

  if (!address) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.connectInner}>
          <View style={styles.heroLogoCircle}>
            <Image
              source={require('../../assets/shaheen-logo.png')}
              style={styles.heroLogoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.connectTitle}>Solana Mobile Gateway</Text>
          <Text style={styles.connectDescription}>
            Engineered with compiled native Rust for zero-polyfill MWA 2.0 communication. High-speed crypto execution directly off the JS thread.
          </Text>

          <View style={styles.buttonStack}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={onConnect}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#080B11" />
              ) : (
                <Text style={styles.connectButtonText}>Connect Solana Wallet</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoModeButton}
              onPress={onToggleDemoMode}
              activeOpacity={0.8}
            >
              <Text style={styles.demoModeButtonText}>
                {isDemoMode ? '⚡ Exit Simulator Mode' : '🎮 Test in Interactive Simulator'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.walletHint}>
            Verified with Phantom, Solflare, Backpack & Android MWA 2.0 Wallets
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      {isDemoMode && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>
            SIMULATOR MODE ACTIVE • Testing native protocol flow without mobile wallet hardware
          </Text>
        </View>
      )}

      {/* Connected Header */}
      <View style={styles.topRow}>
        <View style={styles.accountInfo}>
          <Text style={styles.metaLabel}>ACTIVE SOLANA DEVNET ACCOUNT</Text>
          <TouchableOpacity
            onPress={handleCopy}
            style={styles.addressPill}
            activeOpacity={0.7}
          >
            <View style={styles.connectedDot} />
            <Text style={styles.addressText}>
              {address.slice(0, 6)}...{address.slice(-6)}
            </Text>
            <Text style={styles.copyIcon}>{copied ? '✓' : '⧉'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={onDisconnect}
          activeOpacity={0.7}
        >
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Balance Display */}
      <View style={styles.balanceSection}>
        <View>
          <Text style={styles.metaLabel}>DEVNET BALANCE</Text>
          <View style={styles.balanceValueRow}>
            <Text style={styles.balanceNumber}>
              {balance !== null ? balance.toFixed(4) : '0.0000'}
            </Text>
            <Text style={styles.solBadge}>SOL</Text>
          </View>
          <Text style={styles.usdEquivalent}>≈ {balanceUsd} USD</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionColumn}>
          <TouchableOpacity
            style={styles.airdropButton}
            onPress={handleAirdropClick}
            disabled={airdropLoading}
            activeOpacity={0.75}
          >
            {airdropLoading ? (
              <ActivityIndicator size="small" color="#14F195" />
            ) : (
              <>
                <Text style={styles.airdropIcon}>💧</Text>
                <Text style={styles.airdropText}>Faucet +1 SOL</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefreshBalance}
            activeOpacity={0.7}
          >
            <Text style={styles.refreshText}>↻ Sync RPC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  connectInner: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  heroLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroLogoImage: {
    width: 44,
    height: 44,
  },
  connectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  connectDescription: {
    fontSize: 13,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  buttonStack: {
    width: '100%',
    gap: 8,
  },
  connectButton: {
    backgroundColor: THEME.solanaGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.solanaGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  connectButtonText: {
    color: '#080B11',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  demoModeButton: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  demoModeButtonText: {
    color: THEME.cyanAccent,
    fontSize: 13,
    fontWeight: '700',
  },
  walletHint: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
  demoBanner: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  demoBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.cyanAccent,
    letterSpacing: 0.3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    gap: 4,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
    letterSpacing: 0.6,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    alignSelf: 'flex-start',
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.solanaGreen,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
    fontFamily: 'monospace',
  },
  copyIcon: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  disconnectButton: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  disconnectButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.surfaceBorder,
    marginVertical: 14,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  balanceNumber: {
    fontSize: 30,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: -0.8,
  },
  solBadge: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.solanaGreen,
  },
  usdEquivalent: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  actionColumn: {
    gap: 6,
    alignItems: 'flex-end',
  },
  airdropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.solanaGreenMuted,
    borderWidth: 1,
    borderColor: 'rgba(20, 241, 149, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    gap: 5,
  },
  airdropIcon: {
    fontSize: 11,
  },
  airdropText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.solanaGreen,
  },
  refreshButton: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
});
