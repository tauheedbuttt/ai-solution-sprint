import type { ReactNode } from 'react';
import { Modal, SafeAreaView, StyleSheet } from 'react-native';
import { color } from '../theme/tokens';

type props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Sheet({ visible, onClose, children }: props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.root}>{children}</SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
});
