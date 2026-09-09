import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../theme/tokens';

type props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (flow: 'scan' | 'log') => void;
};

export function CaptureMenu({ visible, onClose, onSelect }: props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Pressable style={styles.option} onPress={() => onSelect('scan')}>
          <Ionicons name="scan" size={20} color={color.foreground} />
          <Text style={styles.optionLabel}>Scan</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.option} onPress={() => onSelect('log')}>
          <Ionicons name="create" size={20} color={color.foreground} />
          <Text style={styles.optionLabel}>Log</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000099' },
  sheet: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    bottom: 110,
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
  },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.md, paddingHorizontal: space.md },
  divider: { height: borderWidth.hairline, backgroundColor: color.border },
  optionLabel: { ...t.body, fontWeight: '600', color: color.foreground },
});
