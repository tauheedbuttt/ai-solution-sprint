import { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, radius, type as t, space } from "../../theme/tokens";
import { PillButton } from "../../components/pillbutton";
import { BenefitCard } from "../../components/benefitcard";
import { BenefitDetail } from "../../components/benefitdetail";
import { api, type benefit, type period } from "../../services/api";

export function EpassiScreen() {
  const [identified, setIdentified] = useState(false);
  const [benefits, setBenefits] = useState<benefit[]>([]);
  const [progress, setProgress] = useState<Partial<Record<period, number>>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enabling, setEnabling] = useState(false);

  useEffect(() => {
    api.epassi.isIdentified().then(setIdentified);
  }, []);

  useEffect(() => {
    if (!identified) return;
    function load() {
      api.epassi.benefits.list().then(async (list) => {
        setBenefits(list);
        const periods = Array.from(new Set(list.map((b) => b.threshold.period)));
        const counts = await Promise.all(periods.map((p) => api.stats.logsInPeriod(p)));
        setProgress(Object.fromEntries(periods.map((p, i) => [p, counts[i]])));
      });
    }
    load();
    return api.subscribe(load);
  }, [identified]);

  const selected = useMemo(
    () => benefits.find((b) => b.id === selectedId) || null,
    [benefits, selectedId],
  );

  async function enableIdentification() {
    setEnabling(true);
    await api.epassi.enableIdentification();
    setIdentified(true);
    setEnabling(false);
  }

  if (!identified) {
    return (
      <View style={styles.gateRoot}>
        <View style={styles.gateIcon}>
          <Ionicons name="finger-print-outline" size={32} color={color.brownInk} />
        </View>
        <Text style={styles.gateEyebrow}>strong identification</Text>
        <Text style={styles.gateHeadline}>Unlock your employer benefits</Text>
        <Text style={styles.gateBody}>
          Verify your identity once to see what Epassi has for you.
        </Text>
        <View style={styles.gateCta}>
          <PillButton
            label="Enable strong identification"
            onPress={enableIdentification}
            disabled={enabling}
          />
        </View>
      </View>
    );
  }

  if (selected) {
    return (
      <BenefitDetail
        benefit={selected}
        progressCount={progress[selected.threshold.period] ?? 0}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={benefits}
        keyExtractor={(b) => b.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerEyebrow}>epassi</Text>
            <Text style={styles.headerTitle}>Your benefits</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BenefitCard
            benefit={item}
            progressCount={progress[item.threshold.period] ?? 0}
            onPress={() => setSelectedId(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  list: { padding: space.lg, gap: space.md },
  row: { gap: space.md },
  header: { paddingBottom: space.md, gap: space.xs },
  headerEyebrow: { ...t.eyebrow, color: color.mint },
  headerTitle: { ...t.h2, color: color.foreground },
  gateRoot: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  gateIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: color.secondary,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  gateEyebrow: { ...t.eyebrow, color: color.mint },
  gateHeadline: { ...t.h2, color: color.foreground, textAlign: "center" },
  gateBody: {
    ...t.body,
    color: color.mutedForeground,
    textAlign: "center",
    maxWidth: 280,
  },
  gateCta: { alignSelf: "stretch", marginTop: space.lg },
});
