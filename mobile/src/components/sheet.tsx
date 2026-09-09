import type { ReactNode } from 'react';
import { Modal, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { color, layout } from '../theme/tokens';

type props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Sheet({ visible, onClose, children }: props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.outer}>
        <SafeAreaView style={styles.root}>{children}</SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: color.background,
    ...(Platform.OS === 'web' ? { alignItems: 'center' as const } : null),
  },
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: color.background,
    ...(Platform.OS === 'web' ? { maxWidth: layout.maxWidth } : null),
  },
});
