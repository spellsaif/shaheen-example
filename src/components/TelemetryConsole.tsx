import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { THEME } from '../constants/config';
import type { LogEntry, LogTag, ProtocolPhase } from '../types';

interface TelemetryConsoleProps {
  logs: LogEntry[];
  currentPhase: ProtocolPhase;
  onClearLogs: () => void;
}

const PHASES: { key: ProtocolPhase; label: string }[] = [
  { key: 'IDLE', label: 'IDLE' },
  { key: 'DISPATCH_INTENT', label: 'INTENT' },
  { key: 'ECDH_P256_EXCHANGE', label: 'ECDH P-256' },
  { key: 'ENCRYPTED_TUNNEL', label: 'TUNNEL' },
  { key: 'WALLET_AUTHORIZED', label: 'AUTH' },
  { key: 'RPC_CONFIRMED', label: 'CONFIRMED' },
];

export const TelemetryConsole: React.FC<TelemetryConsoleProps> = ({
  logs,
  currentPhase,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<LogTag | 'ALL'>('ALL');

  const filteredLogs =
    filter === 'ALL' ? logs : logs.filter((item) => item.tag === filter);

  const handleCopyLogs = async () => {
    const text = logs
      .map((l) => `[${l.time}] [${l.tag}] ${l.text}`)
      .join('\n');
    try {
      await Share.share({ message: text });
    } catch {}
  };

  const getTagColor = (tag: LogTag) => {
    switch (tag) {
      case 'SUCCESS':
        return THEME.solanaGreen;
      case 'MWA':
        return '#C084FC'; // light purple
      case 'JSI':
        return THEME.cyanAccent;
      case 'RPC':
        return '#60A5FA';
      case 'SECURITY':
        return '#F59E0B';
      case 'ERROR':
        return THEME.error;
      default:
        return THEME.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Console Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.statusDot} />
          <Text style={styles.titleText}>PROTOCOL TELEMETRY HUD</Text>
          <Text style={styles.logCount}>({logs.length})</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCopyLogs} activeOpacity={0.7}>
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>
          <Text style={styles.actionDivider}>•</Text>
          <TouchableOpacity onPress={onClearLogs} activeOpacity={0.7}>
            <Text style={styles.actionText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Protocol State Pipeline Visualizer */}
      <View style={styles.phasePipeline}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phaseScroll}>
          {PHASES.map((p, idx) => {
            const isCurrent = currentPhase === p.key;
            return (
              <View key={p.key} style={styles.phaseItem}>
                <View
                  style={[
                    styles.phaseNode,
                    isCurrent && styles.phaseNodeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.phaseNodeText,
                      isCurrent && styles.phaseNodeTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </View>
                {idx < PHASES.length - 1 && (
                  <Text style={styles.phaseArrow}>→</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'MWA', 'JSI', 'RPC', 'SUCCESS', 'ERROR'] as const).map(
          (tag) => {
            const isSelected = filter === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setFilter(tag)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* Terminal View */}
      <View style={styles.terminalBox}>
        <ScrollView
          nestedScrollEnabled
          style={styles.terminalScroll}
          contentContainerStyle={styles.terminalContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredLogs.length === 0 ? (
            <Text style={styles.emptyText}>No logs matching filter.</Text>
          ) : (
            filteredLogs.map((log) => {
              const tagColor = getTagColor(log.tag);
              return (
                <View key={log.id} style={styles.logRow}>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <View
                    style={[
                      styles.tagBadge,
                      { backgroundColor: `${tagColor}22` },
                    ]}
                  >
                    <Text style={[styles.tagBadgeText, { color: tagColor }]}>
                      {log.tag}
                    </Text>
                  </View>
                  <Text style={styles.logMessage}>{log.text}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.solanaGreen,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: 0.6,
  },
  logCount: {
    fontSize: 11,
    color: THEME.textMuted,
    fontFamily: 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.cyanAccent,
  },
  actionDivider: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  phasePipeline: {
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  phaseScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phaseNode: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  phaseNodeActive: {
    backgroundColor: THEME.solanaGreenMuted,
    borderWidth: 1,
    borderColor: THEME.solanaGreen,
  },
  phaseNodeText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.textMuted,
    fontFamily: 'monospace',
  },
  phaseNodeTextActive: {
    color: THEME.solanaGreen,
  },
  phaseArrow: {
    fontSize: 11,
    color: THEME.textMuted,
    marginHorizontal: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    backgroundColor: THEME.surfaceSubtle,
  },
  filterChipSelected: {
    backgroundColor: THEME.surfaceBorderHighlight,
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  filterChipTextSelected: {
    color: THEME.textPrimary,
  },
  terminalBox: {
    backgroundColor: '#05070B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111726',
    maxHeight: 180,
    padding: 10,
  },
  terminalScroll: {
    maxHeight: 160,
  },
  terminalContent: {
    gap: 6,
  },
  emptyText: {
    fontSize: 11,
    color: THEME.textMuted,
    fontStyle: 'italic',
    paddingVertical: 10,
    textAlign: 'center',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  logTime: {
    fontSize: 10,
    color: THEME.textMuted,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  tagBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  logMessage: {
    flex: 1,
    fontSize: 11,
    color: THEME.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
