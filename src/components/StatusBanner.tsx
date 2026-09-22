import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { THEME } from '../constants/config';

interface StatusBannerProps {
  loading: boolean;
  message: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  loading,
  message,
}) => {
  if (!loading || !message) return null;

  return (
    <View style={styles.bannerContainer}>
      <ActivityIndicator size="small" color={THEME.solanaGreen} />
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1523',
    borderWidth: 1,
    borderColor: THEME.surfaceBorderHighlight,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  messageText: {
    fontSize: 12,
    color: THEME.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
});
