import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, type as t, space } from "../../theme/tokens";
import { ScoreRing } from "../../components/scorering";
import { ScoreBars } from "../../components/scorebars";
import { Sheet } from "../../components/sheet";
import { LogFlow, type action } from "../capture/logflow";
import type { product } from "../../services/api";

const actions: { value: action; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "care", label: "Log", icon: "create" },
  { value: "repair", label: "Repair", icon: "build" },
  { value: "nextLife", label: "Next life", icon: "sync" },
];

export function ProductDetailScreen({ product, onClose }: { product: product; onClose: () => void }) {
  const [logAction, setLogAction] = useState<action | null>(null);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={color.foreground} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.hero}>
          <Ionicons name="image-outline" size={48} color={color.mutedForeground} />
          {product.careScore !== undefined ? (
            <View style={styles.badge}>
              <ScoreRing score={product.careScore} />
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        {product.scores ? (
          <View style={styles.scores}>
            <ScoreBars scores={product.scores} />
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        {actions.map((a, i) => {
          const primary = a.value === "care";
          return (
            <Pressable
              key={a.value}
              style={[
                styles.action,
                primary ? styles.actionPrimary : styles.actionSecondary,
                { flex: primary ? 1.5 : 1 },
                i > 0 && styles.actionDivider,
              ]}
              onPress={() => setLogAction(a.value)}
            >
              <Ionicons name={a.icon} size={18} color={primary ? color.primaryForeground : color.foreground} />
              <Text style={[styles.actionLabel, primary ? styles.actionLabelPrimary : styles.actionLabelSecondary]}>
                {a.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Sheet visible={logAction !== null} onClose={() => setLogAction(null)}>
        {logAction ? (
          <LogFlow
            initialProduct={product}
            initialAction={logAction}
            onClose={() => setLogAction(null)}
            onDone={() => setLogAction(null)}
          />
        ) : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  spacer: { width: 22 },
  title: { ...t.h3, color: color.foreground, flex: 1, textAlign: "center" },
  scroll: { flex: 1 },
  hero: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: color.secondary,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: { position: "absolute", top: space.md, right: space.md },
  body: { padding: space.lg, gap: space.xs },
  brand: { ...t.eyebrow, color: color.mutedForeground },
  name: { ...t.h2, color: color.foreground },
  category: { ...t.body, color: color.mutedForeground },
  scores: { padding: space.lg, paddingTop: 0 },
  actions: {
    flexDirection: "row",
  },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    paddingVertical: space.md,
  },
  actionPrimary: { backgroundColor: color.brownInk },
  actionSecondary: { backgroundColor: "transparent" },
  actionDivider: { borderLeftWidth: borderWidth.hairline, borderLeftColor: color.border },
  actionLabel: { ...t.body, fontWeight: "600" },
  actionLabelPrimary: { color: color.primaryForeground },
  actionLabelSecondary: { color: color.foreground },
});
