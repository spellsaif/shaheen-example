import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { THEME } from '../constants/config';

interface HeaderProps {
  onOpenArchitectureModal: () => void;
  clusterLatencyMs?: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchitectureModal,
  clusterLatencyMs,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.headerContainer}>
      {/* Brand Identity */}
      <View style={styles.leftRow}>
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/shaheen-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Shaheen</Text>
            <View style={styles.versionTag}>
              <Text style={styles.versionText}>v1.1.2</Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>Native Rust MWA 2.0 Engine</Text>
        </View>
      </View>

      {/* Right Controls: Cluster Status & Architecture Sheet */}
      <View style={styles.rightRow}>
        <View style={styles.clusterPill}>
          <Animated.View style={[styles.clusterDot, { opacity: pulseAnim }]} />
          <Text style={styles.clusterText}>
            Devnet {clusterLatencyMs ? `${clusterLatencyMs}ms` : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.techButton}
          onPress={onOpenArchitectureModal}
          activeOpacity={0.8}
        >
          <Text style={styles.techButtonIcon}>✦</Text>
          <Text style={styles.techButtonText}>Architecture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: THEME.bg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.4,
  },
  versionTag: {
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.solanaGreen,
    fontFamily: 'monospace',
  },
  subtitleText: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clusterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.solanaGreenMuted,
    borderWidth: 1,
    borderColor: 'rgba(20, 241, 149, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  clusterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.solanaGreen,
  },
  clusterText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.solanaGreen,
  },
  techButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.solanaPurpleMuted,
    borderWidth: 1,
    borderColor: 'rgba(153, 69, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
    gap: 4,
  },
  techButtonIcon: {
    fontSize: 10,
    color: '#D8B4FE',
  },
  techButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D8B4FE',
  },
});
