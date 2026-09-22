import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { THEME, CONFIG, DEMO_RECIPIENTS, MEMO_PRESETS } from '../constants/config';
import type { TxHistoryItem } from '../types';

interface PayTabProps {
  address: string | null;
  loading: boolean;
  txHistory: TxHistoryItem[];
  onSendTransfer: (recipient: string, amountSol: number, memo: string) => Promise<void>;
}

export const PayTab: React.FC<PayTabProps> = ({
  address,
  loading,
  txHistory,
  onSendTransfer,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.02');
  const [memo, setMemo] = useState(CONFIG.DEFAULT_MEMO_TAG);

  const handleSend = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    const target = recipient.trim() || (address || '');
    await onSendTransfer(target, val, memo);
  };

  const openExplorer = (sig: string) => {
    Linking.openURL(`https://explorer.solana.com/tx/${sig}?cluster=devnet`).catch(() => {});
  };

  const amountUsd = !isNaN(parseFloat(amount))
    ? (parseFloat(amount) * CONFIG.SOL_USD_ESTIMATE).toFixed(2)
    : '0.00';

  return (
    <View style={styles.container}>
      {/* Transfer Form Card */}
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Fast Solana Mobile Pay</Text>
          <Text style={styles.cardSubtitle}>
            Broadcast native Solana transactions with microsecond Rust execution
          </Text>
        </View>

        {/* Recipient Address */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>RECIPIENT ADDRESS</Text>
            {address && (
              <TouchableOpacity onPress={() => setRecipient(address)}>
                <Text style={styles.quickSelfText}>Use My Address</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder={address ? `${address.slice(0, 8)}...` : 'Base58 Solana recipient address'}
            placeholderTextColor={THEME.textMuted}
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
          />

          {/* Quick Demo Recipient Pills */}
          <View style={styles.demoRecipientsRow}>
            {DEMO_RECIPIENTS.map((demo) => (
              <TouchableOpacity
                key={demo.address}
                style={styles.demoChip}
                onPress={() => setRecipient(demo.address)}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipName}>{demo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>AMOUNT (SOL)</Text>
            <Text style={styles.usdEstimateText}>≈ ${amountUsd} USD</Text>
          </View>
          <View style={styles.amountInputRow}>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.02"
              placeholderTextColor={THEME.textMuted}
            />
            <View style={styles.presetsContainer}>
              {['0.01', '0.05', '0.1', '0.5'].map((preset) => {
                const isSelected = amount === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => setAmount(preset)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected && styles.presetChipTextActive,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Memo Input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>TRANSACTION MEMO (OPTIONAL)</Text>
          <TextInput
            style={styles.input}
            value={memo}
            onChangeText={setMemo}
            placeholder="On-chain memo note"
            placeholderTextColor={THEME.textMuted}
          />
          {/* Memo Presets */}
          <View style={styles.memoPresetsRow}>
            {MEMO_PRESETS.slice(0, 3).map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.memoChip}
                onPress={() => setMemo(preset)}
                activeOpacity={0.7}
              >
                <Text style={styles.memoChipText} numberOfLines={1}>
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preflight Fee Spec */}
        <View style={styles.feeBanner}>
          <Text style={styles.feeBannerLabel}>ESTIMATED BASE NETWORK FEE</Text>
          <Text style={styles.feeBannerValue}>5,000 Lamports (~0.000005 SOL)</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!address || loading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!address || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#080B11" />
          ) : (
            <Text style={styles.submitButtonText}>
              {address ? `Sign & Broadcast ${amount} SOL` : 'Connect Wallet to Broadcast'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Transactions List */}
      {txHistory.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Confirmed Settlements</Text>
          {txHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.txRow}
              onPress={() => openExplorer(item.signature)}
              activeOpacity={0.7}
            >
              <View style={styles.txLeft}>
                <View style={styles.txIconBox}>
                  <Text style={styles.txIcon}>↗</Text>
                </View>
                <View>
                  <Text style={styles.txAmountText}>
                    {item.type === 'batch'
                      ? `Batch Settlement (${item.amountSol.toFixed(3)} SOL)`
                      : `Transferred ${item.amountSol} SOL`}
                  </Text>
                  <Text style={styles.txRecipientText} numberOfLines={1}>
                    To: {item.recipient.slice(0, 6)}...{item.recipient.slice(-4)}
                  </Text>
                </View>
              </View>

              <View style={styles.txRight}>
                <Text style={styles.txTimeText}>{item.timestamp}</Text>
                <Text style={styles.explorerText}>Explorer ↗</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  formCard: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
    lineHeight: 17,
  },
  formGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
    letterSpacing: 0.6,
  },
  quickSelfText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.solanaGreen,
  },
  usdEstimateText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.cyanAccent,
  },
  input: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.textPrimary,
  },
  demoRecipientsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  demoChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  demoChipName: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  amountInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  presetChip: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  presetChipActive: {
    backgroundColor: THEME.solanaGreenMuted,
    borderColor: THEME.solanaGreen,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textMuted,
  },
  presetChipTextActive: {
    color: THEME.solanaGreen,
  },
  memoPresetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  memoChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  memoChipText: {
    fontSize: 10,
    color: THEME.textMuted,
  },
  feeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  feeBannerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.textMuted,
  },
  feeBannerValue: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.solanaGreen,
    fontFamily: 'monospace',
  },
  submitButton: {
    backgroundColor: THEME.solanaGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: '#080B11',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  historyCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textPrimary,
    marginBottom: 12,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: THEME.solanaGreenMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.solanaGreen,
  },
  txAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  txRecipientText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txTimeText: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  explorerText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.cyanAccent,
  },
});
