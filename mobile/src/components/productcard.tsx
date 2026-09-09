import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, radius, type as t, space } from "../theme/tokens";
import type { product } from "../services/api";

export function ProductCard({ product }: { product: product }) {
  return (
    <View style={styles.card}>
      <View style={styles.image}>
        <Ionicons name="image-outline" size={28} color={color.mutedForeground} />
        {product.careScore !== undefined ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.careScore}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        {product.brand ? (
          <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        ) : null}
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: "47%", flexGrow: 1, gap: space.sm },
  image: {
    aspectRatio: 1,
    backgroundColor: color.secondary,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: space.sm,
    right: space.sm,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: color.background,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { ...t.bodySmall, fontWeight: "700", color: color.foreground },
  body: { gap: 2 },
  brand: { ...t.eyebrow, color: color.mutedForeground },
  name: { ...t.body, fontWeight: "600", color: color.foreground },
  category: { ...t.bodySmall, color: color.mutedForeground },
});
