import { Pressable, Text, StyleSheet } from 'react-native';
import { color, radius, borderWidth, type as t, space } from '../theme/tokens';

type props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: props) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    borderRadius: radius.pill,
    paddingVertical: space.xs + 2,
    paddingHorizontal: space.md,
  },
  chipActive: { backgroundColor: color.brownInk, borderColor: color.brownInk },
  label: { ...t.eyebrow, color: color.mutedForeground },
  labelActive: { color: color.primaryForeground },
});
