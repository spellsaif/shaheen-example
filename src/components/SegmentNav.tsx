import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { THEME } from '../constants/config';
import type { TabKey } from '../types';

interface SegmentNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

interface TabOption {
  key: TabKey;
  label: string;
  badge?: string;
}

const TABS: TabOption[] = [
  { key: 'pay', label: 'Transfer' },
  { key: 'batch', label: 'Batch Engine', badge: 'MWA 2.0' },
  { key: 'credential', label: 'SIWS Pass' },
  { key: 'benchmark', label: 'Benchmark', badge: 'Rust' },
  { key: 'telemetry', label: 'Telemetry' },
];

export const SegmentNav: React.FC<SegmentNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.badge && (
                <View
                  style={[
                    styles.tabBadge,
                    isActive ? styles.tabBadgeActive : styles.tabBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      isActive ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                    ]}
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  tabTextActive: {
    color: THEME.textPrimary,
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  tabBadgeActive: {
    backgroundColor: THEME.solanaGreenMuted,
  },
  tabBadgeInactive: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  tabBadgeTextActive: {
    color: THEME.solanaGreen,
  },
  tabBadgeTextInactive: {
    color: THEME.textMuted,
  },
});
