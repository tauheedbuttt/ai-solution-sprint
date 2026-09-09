import { View, Text, Pressable, StyleSheet } from "react-native";
import { color, borderWidth, type as t, space } from "../theme/tokens";

type option = { value: string; label: string };

type props = {
  value: string;
  onChange: (value: string) => void;
  options: option[];
};

export function SegmentTabs({ value, onChange, options }: props) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={styles.item}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
            <View
              style={[styles.underline, active && styles.underlineActive]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    gap: space.lg,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  item: { alignItems: "center", gap: space.xs, paddingVertical: space.sm },
  label: { ...t.eyebrow, color: color.mutedForeground },
  labelActive: { color: color.foreground },
  underline: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: "transparent",
  },
  underlineActive: { backgroundColor: color.brownInk },
});
