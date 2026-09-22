import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Share,
} from 'react-native';
import { THEME } from '../constants/config';
import type { DeveloperCredential } from '../types';

interface CredentialTabProps {
  address: string | null;
  loading: boolean;
  credential: DeveloperCredential | null;
  onSignCredential: () => Promise<void>;
}

export const CredentialTab: React.FC<CredentialTabProps> = ({
  address,
  loading,
  credential,
  onSignCredential,
}) => {
  const cardScale = useRef(new Animated.Value(1)).current;

  const handleSign = async () => {
    await onSignCredential();
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 1.025, duration: 150, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const handleSharePassport = async () => {
    if (!credential || !credential.signatureHex) return;
    const msg = [
      `✦ SHAHEEN SOLANA DEVELOPER CREDENTIAL #${credential.serial}`,
      `Subject: ${credential.address}`,
      `Verified: Ed25519 Signature Proof`,
      `Signature: ${credential.signatureHex.slice(0, 24)}...`,
      `Engine: Shaheen Native Rust MWA 2.0`,
      `Verify on: https://shaheen.dev/verify`,
    ].join('\n');
    try {
      await Share.share({ message: msg });
    } catch {}
  };

  const isVerified = credential?.isVerified ?? false;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
        {/* Holographic Header */}
        <View style={styles.passportHeader}>
          <View
            style={[
              styles.statusBadge,
              isVerified ? styles.statusBadgeVerified : styles.statusBadgeUnsigned,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isVerified ? styles.statusBadgeTextVerified : styles.statusBadgeTextUnsigned,
              ]}
            >
              {isVerified ? 'ED25519 VERIFIED ✓' : 'UNSIGNED PASSPORT'}
            </Text>
          </View>
          <Text style={styles.serialText}>
            #SHN-{credential?.serial || '1042'}
          </Text>
        </View>

        <Text style={styles.passportTitle}>Developer Identity Credential</Text>
        <Text style={styles.passportDescription}>
          Cryptographic Sign-In with Solana (SIWS) authentication verified through Shaheen's native Rust off-chain message signing bridge.
        </Text>

        {/* Spec Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>NETWORK</Text>
            <Text style={styles.metaValue}>Solana Devnet</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>SIGNATURE CURVE</Text>
            <Text style={styles.metaValue}>Ed25519</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ENGINE</Text>
            <Text style={[styles.metaValue, { color: THEME.cyanAccent }]}>Rust JSI</Text>
          </View>
        </View>

        {/* Challenge Statement Box */}
        <View style={styles.statementBox}>
          <Text style={styles.statementTitle}>SIWS CHALLENGE PAYLOAD</Text>
          <Text style={styles.statementText}>
            Domain: shaheen.dev{'\n'}
            Subject: {address ? `${address.slice(0, 10)}...${address.slice(-6)}` : 'Wallet not connected'}{'\n'}
            Nonce: {credential?.nonce || '8A2F9B01'}{'\n'}
            Security: Hardware Key Signed via MWA 2.0
          </Text>
        </View>

        {/* Signature Proof Box */}
        {credential?.signatureHex && (
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>CRYPTOGRAPHIC PROOF (HEX)</Text>
            <Text style={styles.signatureHex} numberOfLines={2} ellipsizeMode="middle">
              {credential.signatureHex}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isVerified && styles.secondaryButton,
              (!address || loading) && styles.buttonDisabled,
            ]}
            onPress={handleSign}
            disabled={!address || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#080B11" />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  isVerified && styles.secondaryButtonText,
                ]}
              >
                {isVerified ? 'Re-Sign Credential' : 'Sign Identity Credential'}
              </Text>
            )}
          </TouchableOpacity>

          {isVerified && (
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleSharePassport}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>Share Proof ↗</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeVerified: {
    backgroundColor: THEME.solanaGreenMuted,
    borderColor: 'rgba(20, 241, 149, 0.4)',
  },
  statusBadgeUnsigned: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadgeTextVerified: {
    color: THEME.solanaGreen,
  },
  statusBadgeTextUnsigned: {
    color: THEME.textMuted,
  },
  serialText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textMuted,
    fontFamily: 'monospace',
  },
  passportTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  passportDescription: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.textMuted,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  statementBox: {
    backgroundColor: '#05070B',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#111726',
    marginBottom: 12,
  },
  statementTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statementText: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 17,
  },
  signatureBox: {
    backgroundColor: 'rgba(20, 241, 149, 0.05)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(20, 241, 149, 0.2)',
    marginBottom: 14,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.solanaGreen,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  signatureHex: {
    fontSize: 10,
    color: THEME.solanaGreen,
    fontFamily: 'monospace',
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: THEME.solanaGreen,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
  },
  primaryButtonText: {
    color: '#080B11',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: THEME.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  shareButton: {
    backgroundColor: THEME.solanaPurpleMuted,
    borderWidth: 1,
    borderColor: 'rgba(153, 69, 255, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#D8B4FE',
    fontSize: 12,
    fontWeight: '700',
  },
});
