import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, type as t, space } from "../theme/tokens";
import { ProgressBar } from "./progressbar";
import { PillButton } from "./pillbutton";
import type { benefit } from "../services/api";

type props = {
  benefit: benefit;
  progressCount: number;
  onBack: () => void;
};

export function BenefitDetail({ benefit, progressCount, onBack }: props) {
  const unlocked = progressCount >= benefit.threshold.count;
  const remaining = Math.max(0, benefit.threshold.count - progressCount);
  const progress =
    benefit.threshold.count === 0 ? 1 : progressCount / benefit.threshold.count;

  function share() {
    Share.share({ message: `${benefit.employerName}: ${benefit.headline}` });
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
          {benefit.image ? (
            <Image source={benefit.image} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <Ionicons
              name="image-outline"
              size={40}
              color={color.mutedForeground}
            />
          )}
        </View>
        <View style={styles.body}>
          <Text style={styles.actor}>{benefit.employerName}</Text>
          <Text style={styles.headline}>{benefit.headline}</Text>
          <Text style={styles.description}>{benefit.description}</Text>
          <Text style={styles.terms}>{benefit.terms}</Text>
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
          label={unlocked ? "Get the benefit" : `Log ${remaining} more to unlock`}
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
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%" },
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
