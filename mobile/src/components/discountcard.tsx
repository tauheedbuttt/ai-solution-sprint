import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, type as t, space } from "../theme/tokens";
import { ProgressBar } from "./progressbar";
import type { discount } from "../services/api";

type props = {
  discount: discount;
  progressCount: number;
  onPress: () => void;
};

export function DiscountCard({ discount, progressCount, onPress }: props) {
  const unlocked = progressCount >= discount.threshold.count;
  const remaining = Math.max(0, discount.threshold.count - progressCount);
  const progress =
    discount.threshold.count === 0
      ? 1
      : progressCount / discount.threshold.count;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb}>
        <Ionicons
          name="image-outline"
          size={22}
          color={color.mutedForeground}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.actor} numberOfLines={1}>
          {discount.actorName}
        </Text>
        <Text style={styles.headline} numberOfLines={2}>
          {discount.headline}
        </Text>
        <ProgressBar progress={progress} />
        <Text style={[styles.eyebrow, unlocked && styles.eyebrowUnlocked]}>
          {unlocked
            ? "unlocked"
            : `${remaining} more log${remaining === 1 ? "" : "s"} to unlock`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: radius.lg,
    backgroundColor: color.card,
    padding: space.md,
    gap: space.md,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, justifyContent: "center", gap: space.xs },
  actor: { ...t.eyebrow, color: color.mint },
  headline: { ...t.h3, color: color.foreground },
  eyebrow: { ...t.eyebrow, color: color.mutedForeground },
  eyebrowUnlocked: { color: color.brownInk },
});
