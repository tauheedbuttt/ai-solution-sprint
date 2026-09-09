import { Modal, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space, layout } from '../theme/tokens';

type props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (flow: 'scan' | 'log' | 'ai') => void;
};

export function CaptureMenu({ visible, onClose, onSelect }: props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.frame} pointerEvents="box-none">
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
          <View style={styles.divider} />
          <Pressable style={styles.option} onPress={() => onSelect('ai')}>
            <Ionicons name="sparkles" size={20} color={color.foreground} />
            <Text style={styles.optionLabel}>AI</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000099' },
  frame:
    Platform.OS === 'web'
      ? { position: 'absolute', top: 0, bottom: 0, left: '50%', width: layout.maxWidth, marginLeft: -(layout.maxWidth / 2) }
      : { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheet: {
    position: 'absolute',
    // fab sits right:24 width:56 bottom:100 (fab.tsx) - clear its left edge with a gap
    right: 24 + 56 + space.sm,
    bottom: 100,
    width: 176,
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
  },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.md, paddingHorizontal: space.md },
  divider: { height: borderWidth.hairline, backgroundColor: color.border },
  optionLabel: { ...t.body, fontWeight: '600', color: color.foreground },
});
