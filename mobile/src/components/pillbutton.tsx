import { Pressable, Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import { color, radius, type as t, space } from '../theme/tokens';

type props = {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function PillButton({ label, onPress, disabled }: props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.base, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: color.brownInk,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { ...t.body, fontWeight: '600', color: color.primaryForeground },
});
