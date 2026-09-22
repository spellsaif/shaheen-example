import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { THEME, DEMO_RECIPIENTS } from '../constants/config';
import type { BatchItem, BatchExecutionReport } from '../types';

interface BatchTabProps {
  address: string | null;
  loading: boolean;
  onExecuteBatch: (items: BatchItem[]) => Promise<BatchExecutionReport | void>;
}

export const BatchTab: React.FC<BatchTabProps> = ({
  address,
  loading,
  onExecuteBatch,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(3);
  const [lastReport, setLastReport] = useState<BatchExecutionReport | null>(null);

  // Generate batch items based on selected count
  const generateItems = (count: number): BatchItem[] => {
    const list: BatchItem[] = [];
    for (let i = 0; i < count; i++) {
      const recipient = DEMO_RECIPIENTS[i % DEMO_RECIPIENTS.length].address;
      list.push({
        id: `batch-${i + 1}`,
        recipient,
        amount: 0.005,
        label: `Micro-Settlement #${i + 1}`,
      });
    }
    return list;
  };

  const handleRunBatch = async () => {
    const items = generateItems(selectedCount);
    const report = await onExecuteBatch(items);
    if (report) {
      setLastReport(report);
    }
  };

  const openExplorer = (sig: string) => {
    Linking.openURL(`https://explorer.solana.com/tx/${sig}?cluster=devnet`).catch(() => {});
  };

  const items = generateItems(selectedCount);
  const totalSol = (selectedCount * 0.005).toFixed(3);

  return (
    <View style={styles.container}>
      {/* Overview Card */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <View style={styles.featureBadge}>
            <Text style={styles.featureBadgeText}>MWA 2.0 AUTO-CHUNKING</Text>
          </View>
        </View>

        <Text style={styles.title}>Capability-Aware Batch Engine</Text>
        <Text style={styles.description}>
          Standard Solana dApps crash when wallet transaction payloads exceed <Text style={styles.highlightText}>max_transactions_per_request</Text>. Shaheen automatically queries wallet constraints and chunks payloads sequentially off the JS thread.
        </Text>

        {/* Batch Size Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>SELECT BATCH WORKLOAD SIZE</Text>
          <View style={styles.optionsRow}>
            {[
              { count: 2, label: '2 Txs', sub: 'Single Chunk' },
              { count: 4, label: '4 Txs', sub: 'Dual Chunk' },
              { count: 6, label: '6 Txs', sub: 'Multi Chunk' },
            ].map((opt) => {
              const isSelected = selectedCount === opt.count;
              return (
                <TouchableOpacity
                  key={opt.count}
                  style={[styles.optionCard, isSelected && styles.optionCardActive]}
                  onPress={() => setSelectedCount(opt.count)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.optionCount, isSelected && styles.optionCountActive]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.optionSub, isSelected && styles.optionSubActive]}>
                    {opt.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Visual Partitioning Pipeline */}
        <View style={styles.pipelineBox}>
          <Text style={styles.pipelineTitle}>ACTIVE BATCH WORKLOAD ({selectedCount} TRANSACTIONS)</Text>
          {items.map((item, idx) => (
            <View key={item.id} style={styles.pipelineItem}>
              <View style={styles.pipelineIndexCircle}>
                <Text style={styles.pipelineIndexText}>{idx + 1}</Text>
              </View>
              <View style={styles.pipelineInfo}>
                <Text style={styles.pipelineLabel}>{item.label}</Text>
                <Text style={styles.pipelineRecipient} numberOfLines={1}>
                  {item.recipient.slice(0, 10)}...{item.recipient.slice(-6)}
                </Text>
              </View>
              <Text style={styles.pipelineAmount}>{item.amount} SOL</Text>
            </View>
          ))}
          <View style={styles.pipelineTotalRow}>
            <Text style={styles.pipelineTotalLabel}>TOTAL BATCH VALUE</Text>
            <Text style={styles.pipelineTotalValue}>{totalSol} SOL</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!address || loading) && styles.submitButtonDisabled,
          ]}
          onPress={handleRunBatch}
          disabled={!address || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#080B11" />
          ) : (
            <Text style={styles.submitButtonText}>
              {address ? `Execute ${selectedCount}-Tx Batch Pipeline` : 'Connect Wallet to Test Batch'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Execution Report Card */}
      {lastReport && (
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>Batch Settlement Telemetry</Text>
            <View style={styles.successTag}>
              <Text style={styles.successTagText}>Completed in {lastReport.executionTimeMs}ms</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>TOTAL TXS</Text>
              <Text style={styles.metricValue}>{lastReport.totalTransactions}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>CHUNKS</Text>
              <Text style={styles.metricValue}>{lastReport.chunksExecuted}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>WALLET LIMIT</Text>
              <Text style={styles.metricValue}>
                {typeof lastReport.walletBatchLimit === 'number'
                  ? `${lastReport.walletBatchLimit} / batch`
                  : 'Unlimited'}
              </Text>
            </View>
          </View>

          <Text style={styles.sigsHeader}>BROADCAST SIGNATURES</Text>
          {lastReport.signatures.map((sig, i) => (
            <TouchableOpacity
              key={i}
              style={styles.sigRow}
              onPress={() => openExplorer(sig)}
              activeOpacity={0.7}
            >
              <Text style={styles.sigIndex}>Tx #{i + 1}</Text>
              <Text style={styles.sigHash} numberOfLines={1} ellipsizeMode="middle">
                {sig}
              </Text>
              <Text style={styles.sigLink}>Explorer ↗</Text>
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
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  featureBadge: {
    backgroundColor: THEME.solanaPurpleMuted,
    borderWidth: 1,
    borderColor: 'rgba(153, 69, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featureBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D8B4FE',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  highlightText: {
    color: THEME.cyanAccent,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  selectorSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionCardActive: {
    backgroundColor: THEME.solanaGreenMuted,
    borderColor: THEME.solanaGreen,
  },
  optionCount: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textSecondary,
  },
  optionCountActive: {
    color: THEME.solanaGreen,
  },
  optionSub: {
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 2,
  },
  optionSubActive: {
    color: THEME.solanaGreen,
    fontWeight: '600',
  },
  pipelineBox: {
    backgroundColor: '#05070B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#111726',
    marginBottom: 16,
    gap: 8,
  },
  pipelineTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pipelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  pipelineIndexCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineIndexText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  pipelineInfo: {
    flex: 1,
  },
  pipelineLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  pipelineRecipient: {
    fontSize: 10,
    color: THEME.textMuted,
    fontFamily: 'monospace',
  },
  pipelineAmount: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.solanaGreen,
  },
  pipelineTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#111726',
    paddingTop: 8,
    marginTop: 4,
  },
  pipelineTotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
  },
  pipelineTotalValue: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.solanaGreen,
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
  },
  reportCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    gap: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  successTag: {
    backgroundColor: THEME.solanaGreenMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  successTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.solanaGreen,
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  sigsHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
    letterSpacing: 0.5,
  },
  sigRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
    gap: 8,
  },
  sigIndex: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
  },
  sigHash: {
    flex: 1,
    fontSize: 11,
    color: THEME.textSecondary,
    fontFamily: 'monospace',
  },
  sigLink: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.cyanAccent,
  },
});
