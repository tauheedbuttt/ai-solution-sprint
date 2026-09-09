import {
  View,
  Text,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, radius, type as t, space } from "../theme/tokens";
import { ProgressBar } from "./progressbar";
import { PillButton } from "./pillbutton";
import type { discount } from "../services/api";

type props = {
  discount: discount;
  progressCount: number;
  onBack: () => void;
};

export function DiscountDetail({ discount, progressCount, onBack }: props) {
  const unlocked = progressCount >= discount.threshold.count;
  const remaining = Math.max(0, discount.threshold.count - progressCount);
  const progress =
    discount.threshold.count === 0
      ? 1
      : progressCount / discount.threshold.count;

  function share() {
    Share.share({ message: `${discount.actorName}: ${discount.headline}` });
  }

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={color.foreground} />
        </Pressable>
        <Pressable onPress={share} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={color.foreground} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons
            name="image-outline"
            size={40}
            color={color.mutedForeground}
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.actor}>{discount.actorName}</Text>
          <Text style={styles.headline}>{discount.headline}</Text>
          <Text style={styles.description}>{discount.description}</Text>
          <Text style={styles.terms}>{discount.terms}</Text>
          <ProgressBar progress={progress} />
          <Text style={[styles.eyebrow, unlocked && styles.eyebrowUnlocked]}>
            {unlocked
              ? "unlocked"
              : `${remaining} more log${remaining === 1 ? "" : "s"} to unlock`}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PillButton
          label={
            unlocked ? "Get the discount" : `Log ${remaining} more to unlock`
          }
          onPress={() => {}}
          disabled={!unlocked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  content: { paddingBottom: space.xl },
  hero: {
    height: 220,
    backgroundColor: color.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    position: "absolute",
    top: space.md,
    left: space.md,
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { ...t.h3, color: color.foreground },
  body: { padding: space.lg, gap: space.sm },
  actor: { ...t.eyebrow, color: color.mint },
  headline: { ...t.h2, color: color.foreground },
  description: { ...t.body, color: color.foreground },
  terms: { ...t.bodySmall, color: color.mutedForeground, fontStyle: "italic" },
  eyebrow: { ...t.eyebrow, color: color.mutedForeground, marginTop: space.xs },
  eyebrowUnlocked: { color: color.brownInk },
  footer: {
    padding: space.lg,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: color.border,
  },
});
