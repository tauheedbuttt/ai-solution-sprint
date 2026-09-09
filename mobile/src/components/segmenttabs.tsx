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
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
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
    gap: space.xs,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  item: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  itemActive: {
    backgroundColor: color.foreground,
  },
  label: {
    ...t.eyebrow,
    color: color.foreground,
  },
  labelActive: {
    color: color.background,
  },
});
