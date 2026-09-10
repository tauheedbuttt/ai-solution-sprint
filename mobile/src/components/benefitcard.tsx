import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, type as t, space } from "../theme/tokens";
import { ProgressBar } from "./progressbar";
import type { benefit } from "../services/api";

type props = {
  benefit: benefit;
  progressCount: number;
  onPress: () => void;
};

export function BenefitCard({ benefit, progressCount, onPress }: props) {
  const unlocked = progressCount >= benefit.threshold.count;
  const remaining = Math.max(0, benefit.threshold.count - progressCount);
  const progress =
    benefit.threshold.count === 0 ? 1 : progressCount / benefit.threshold.count;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.hero}>
        {benefit.image ? (
          <Image source={benefit.image} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <Ionicons
            name="image-outline"
            size={28}
            color={color.mutedForeground}
          />
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.actor} numberOfLines={1}>
          {benefit.employerName}
        </Text>
        <Text style={styles.headline} numberOfLines={2}>
          {benefit.headline}
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
    flex: 1,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  hero: {
    height: 120,
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%" },
  body: { padding: space.md, gap: space.xs },
  actor: { ...t.eyebrow, color: color.mint },
  headline: { ...t.h3, color: color.foreground, minHeight: 48 },
  eyebrow: { ...t.eyebrow, color: color.mutedForeground },
  eyebrowUnlocked: { color: color.brownInk },
});
