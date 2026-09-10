import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, type as t, space } from "../theme/tokens";
import type { recentLogItem } from "../services/api";
import { timeAgo } from "../lib/date";

const kindIcon: Record<recentLogItem["kind"], keyof typeof Ionicons.glyphMap> = {
  care: "sparkles-outline",
  repair: "build-outline",
  nextLife: "sync-outline",
};

export function RecentActivity({ items, onSelectProduct }: { items: recentLogItem[]; onSelectProduct: (productId: string) => void }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Pressable key={item.id} style={styles.row} onPress={() => onSelectProduct(item.productId)}>
          <View style={styles.thumb}>
            <Ionicons name={kindIcon[item.kind]} size={18} color={color.mint} />
          </View>
          <View style={styles.body}>
            <View style={styles.headRow}>
              <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
              <Text style={styles.date}>{timeAgo(item.date)}</Text>
            </View>
            <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  thumb: {
    width: 40,
    height: 40,
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  headRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: space.sm },
  label: { ...t.body, fontWeight: "600", color: color.foreground, flex: 1 },
  date: { ...t.bodySmall, color: color.mutedForeground },
  product: { ...t.bodySmall, color: color.mutedForeground },
});
