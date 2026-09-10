import { Modal, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, radius, type as t, space, layout } from '../theme/tokens';
import type { event } from '../services/api';

type props = {
  event: event | null;
  onClose: () => void;
  onChooseAi: () => void;
  onChooseManual: () => void;
};

export function EventLogChoice({ event, onClose, onChooseAi, onChooseManual }: props) {
  return (
    <Modal visible={!!event} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.frame} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2}>{event?.title}</Text>
          <Text style={styles.subtitle} numberOfLines={3}>Log this with AI or fill it in yourself.</Text>
          <View style={styles.row}>
            <Pressable style={[styles.option, styles.optionPrimary]} onPress={onChooseAi}>
              <Ionicons name="sparkles" size={18} color={color.primaryForeground} />
              <Text style={styles.optionLabelPrimary}>AI</Text>
            </Pressable>
            <Pressable style={styles.option} onPress={onChooseManual}>
              <Ionicons name="create-outline" size={18} color={color.foreground} />
              <Text style={styles.optionLabel}>Manual</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000099' },
  frame:
    Platform.OS === 'web'
      ? { position: 'absolute', top: 0, bottom: 0, left: '50%', width: layout.maxWidth, marginLeft: -(layout.maxWidth / 2), justifyContent: 'center', alignItems: 'center' }
      : { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 340,
    marginHorizontal: space.lg,
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    padding: space.lg,
    gap: space.sm,
  },
  title: { ...t.h3, color: color.foreground },
  subtitle: { ...t.bodySmall, color: color.mutedForeground },
  row: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    borderRadius: radius.pill,
    paddingVertical: space.md,
  },
  optionPrimary: { backgroundColor: color.brownInk, borderColor: color.brownInk },
  optionLabel: { ...t.body, fontWeight: '600', color: color.foreground },
  optionLabelPrimary: { ...t.body, fontWeight: '600', color: color.primaryForeground },
});
