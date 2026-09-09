import { Pressable, Text, View, StyleSheet } from 'react-native';
import { color, radius, borderWidth, type as t } from '../theme/tokens';
import type { role } from '../services/api';

type props = {
  value: role;
  onChange: (role: role) => void;
};

const options: { value: role; label: string }[] = [
  { value: 'shopper', label: 'Shopper' },
  { value: 'service_provider', label: 'Service provider' },
];

export function RoleSwitch({ value, onChange }: props) {
  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: color.secondary },
  label: { ...t.eyebrow, color: color.mutedForeground },
  labelActive: { color: color.mint },
});
