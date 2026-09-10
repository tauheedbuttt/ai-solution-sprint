import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, type as t, space } from "../theme/tokens";
import { ScoreRing } from "./scorering";
import type { product } from "../services/api";

export function ProductCard({ product, onPress }: { product: product; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.image}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={28} color={color.mutedForeground} />
        )}
        {product.careScore !== undefined ? (
          <View style={styles.badge}>
            <ScoreRing score={product.careScore} size={44} />
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: "47%", flexGrow: 1, gap: space.sm },
  image: {
    aspectRatio: 1,
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumb: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  badge: { position: "absolute", top: space.sm, right: space.sm },
  body: { gap: 2 },
  brand: { ...t.eyebrow, color: color.mutedForeground },
  name: { ...t.body, fontWeight: "600", color: color.foreground },
  category: { ...t.bodySmall, color: color.mutedForeground },
});
