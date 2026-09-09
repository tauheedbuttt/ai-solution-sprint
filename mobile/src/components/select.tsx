import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../theme/tokens';

type option = { value: string; label: string };

type props = {
  label?: string;
  value: string | undefined;
  placeholder: string;
  options: option[];
  onChange: (value: string) => void;
};

export function Select({ label, value, placeholder, options, onChange }: props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setOpen((o) => !o)} style={[styles.field, open && styles.fieldOpen]}>
        <Text style={selected ? styles.value : styles.placeholder}>{selected ? selected.label : placeholder}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={color.mutedForeground} />
      </Pressable>
      {open ? (
        <View style={styles.list}>
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={[styles.option, active && styles.optionActive]}
              >
                <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{opt.label}</Text>
                {active ? <Ionicons name="checkmark" size={16} color={color.primaryForeground} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { ...t.eyebrow, color: color.foreground },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 4,
  },
  fieldOpen: { borderColor: color.brownInk },
  value: { ...t.body, color: color.foreground },
  placeholder: { ...t.body, color: color.mutedForeground },
  list: { borderWidth: borderWidth.hairline, borderTopWidth: 0, borderColor: color.border },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 4,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: color.border,
  },
  optionActive: { backgroundColor: color.brownInk },
  optionLabel: { ...t.body, color: color.foreground },
  optionLabelActive: { color: color.primaryForeground, fontWeight: '600' },
});
