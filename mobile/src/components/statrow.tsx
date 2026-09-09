import { View, Text, StyleSheet } from "react-native";
import { color, borderWidth, type as t, space } from "../theme/tokens";

type stat = { label: string; value: string; valueColor?: string };

export function StatRow({ stats }: { stats: stat[] }) {
  return (
    <View style={styles.row}>
      {stats.map((s, i) => (
        <View key={s.label} style={[styles.cell, i < stats.length - 1 && styles.divider]}>
          <Text style={[styles.value, s.valueColor ? { color: s.valueColor } : null]}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  cell: { flex: 1, alignItems: "center", paddingVertical: space.md, gap: space.xs },
  divider: { borderRightWidth: borderWidth.hairline, borderRightColor: color.border },
  value: { ...t.h3, color: color.foreground },
  label: { ...t.eyebrow, color: color.mutedForeground },
});
