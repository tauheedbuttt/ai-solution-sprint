import { Pressable, Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, type as t, space } from '../theme/tokens';

type props = {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function PillButton({ label, onPress, disabled, icon }: props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.base, disabled && styles.disabled, pressed && styles.pressed]}
    >
      {icon ? <Ionicons name={icon} size={18} color={color.primaryForeground} /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    backgroundColor: color.brownInk,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { ...t.body, fontWeight: '600', color: color.primaryForeground },
});
