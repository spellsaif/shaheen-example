import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { THEME } from '../constants/config';
import { ARCHITECTURE_DATA } from '../constants/architectureData';

interface ArchitectureModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  visible,
  onClose,
}) => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.techBadge}>
                <Text style={styles.techBadgeText}>ENGINEERING SPECIFICATION</Text>
              </View>
              <Text style={styles.headerSubtitle}>System Architecture & Native Rust Core</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Overview */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Protocol Architecture</Text>
              <Text style={styles.bodyParagraph}>
                {ARCHITECTURE_DATA.summary}
              </Text>
            </View>

            {/* Core Capabilities */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Core Capabilities</Text>
              {ARCHITECTURE_DATA.coreCapabilities.map((cap, idx) => (
                <View key={idx} style={styles.capItem}>
                  <Text style={styles.capItemTitle}>{cap.title}</Text>
                  <Text style={styles.capItemDesc}>{cap.description}</Text>
                </View>
              ))}
            </View>

            {/* Key Innovations */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Architectural Highlights</Text>
              <View style={styles.innovationsGrid}>
                {ARCHITECTURE_DATA.keyHighlights.map((h, i) => (
                  <View key={i} style={styles.innovationItem}>
                    <View style={styles.innovationTag}>
                      <Text style={styles.innovationTagText}>{h.tag}</Text>
                    </View>
                    <Text style={styles.innovationTitle}>{h.title}</Text>
                    <Text style={styles.innovationDesc}>{h.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Hard Specs */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>System Specifications</Text>
              {ARCHITECTURE_DATA.specs.map((spec, i) => (
                <View key={i} style={styles.specRow}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>

            {/* Links */}
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={styles.externalLinkBtn}
                onPress={() => openLink('https://github.com/spellsaif/shaheen-example')}
                activeOpacity={0.8}
              >
                <Text style={styles.externalLinkText}>GitHub Repository ↗</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.externalLinkBtn, styles.primaryLinkBtn]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryLinkText}>Close Specification</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
  },
  badgeRow: {
    gap: 4,
  },
  techBadge: {
    backgroundColor: THEME.solanaPurpleMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(153, 69, 255, 0.3)',
  },
  techBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D8B4FE',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollBody: {
    padding: 18,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  bodyParagraph: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  capItem: {
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  capItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.solanaGreen,
    marginBottom: 2,
  },
  capItemDesc: {
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 16,
  },
  innovationsGrid: {
    gap: 10,
    marginTop: 4,
  },
  innovationItem: {
    backgroundColor: THEME.surfaceSubtle,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  innovationTag: {
    backgroundColor: THEME.cyanMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  innovationTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.cyanAccent,
  },
  innovationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 3,
  },
  innovationDesc: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 17,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
  },
  specLabel: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textPrimary,
    fontFamily: 'monospace',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    paddingBottom: 20,
  },
  externalLinkBtn: {
    flex: 1,
    backgroundColor: THEME.surfaceSubtle,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  externalLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  primaryLinkBtn: {
    backgroundColor: THEME.solanaGreen,
    borderColor: THEME.solanaGreen,
  },
  primaryLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#080B11',
  },
});
