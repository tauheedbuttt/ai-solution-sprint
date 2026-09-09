import { View, Text, StyleSheet } from "react-native";
import { color, type as t, space } from "../theme/tokens";
import type { scoreBreakdown, scoreCategory } from "../services/api";

const categories: { key: scoreCategory; label: string; color: string }[] = [
  { key: "health", label: "Health", color: color.health },
  { key: "planet", label: "Planet", color: color.planet },
  { key: "ethics", label: "Ethics", color: color.ethics },
  { key: "longevity", label: "Longevity", color: color.longevity },
];

const segmentCount = 20;

export function ScoreBars({ scores }: { scores: scoreBreakdown }) {
  return (
    <View style={styles.list}>
      {categories.map((c) => {
        const { value, tag } = scores[c.key];
        const filled = Math.round((value / 100) * segmentCount);
        return (
          <View key={c.key} style={styles.row}>
            <View style={styles.headerRow}>
              <View style={styles.left}>
                <View style={[styles.swatch, { backgroundColor: c.color }]} />
                <Text style={styles.labelText}>{c.label}</Text>
                <Text style={styles.tagText}> · {tag.toUpperCase()}</Text>
              </View>
              <Text style={styles.value}>
                {value}
                <Text style={styles.valueSuffix}> /100</Text>
              </Text>
            </View>
            <View style={styles.bar}>
              {Array.from({ length: segmentCount }).map((_, i) => (
                <View key={i} style={[styles.segment, { backgroundColor: i < filled ? c.color : color.secondary }]} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.md },
  row: { gap: space.xs },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { flexDirection: "row", alignItems: "center", gap: space.xs },
  swatch: { width: 10, height: 10 },
  labelText: { ...t.eyebrow, color: color.foreground },
  tagText: { ...t.eyebrow, color: color.mutedForeground },
  value: { ...t.h3, color: color.foreground },
  valueSuffix: { ...t.bodySmall, color: color.mutedForeground },
  bar: { flexDirection: "row", gap: 3 },
  segment: { flex: 1, height: 8 },
});
