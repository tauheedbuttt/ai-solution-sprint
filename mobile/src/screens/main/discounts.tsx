import { useEffect, useMemo, useState } from "react";
import { View, FlatList, ScrollView, StyleSheet } from "react-native";
import { color, borderWidth, space } from "../../theme/tokens";
import { Chip } from "../../components/chip";
import { DiscountCard } from "../../components/discountcard";
import { DiscountDetail } from "../../components/discountdetail";
import {
  api,
  type actorType,
  type discount,
  type period,
} from "../../services/api";

const actorTabs: { value: actorType; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "service_provider", label: "Service provider" },
  { value: "retailer", label: "Retailer" },
  { value: "city", label: "City" },
];

export function DiscountsScreen() {
  const [actor, setActor] = useState<actorType | null>(null);
  const [discounts, setDiscounts] = useState<discount[]>([]);
  const [progress, setProgress] = useState<Partial<Record<period, number>>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    function load() {
      api.discounts.list().then(async (list) => {
        setDiscounts(list);
        const periods = Array.from(
          new Set(list.map((d) => d.threshold.period)),
        );
        const counts = await Promise.all(
          periods.map((p) => api.stats.logsInPeriod(p)),
        );
        setProgress(Object.fromEntries(periods.map((p, i) => [p, counts[i]])));
      });
    }
    load();
    return api.subscribe(load);
  }, []);

  const visible = useMemo(
    () => (actor ? discounts.filter((d) => d.actorType === actor) : discounts),
    [discounts, actor],
  );
  const selected = discounts.find((d) => d.id === selectedId) || null;

  if (selected) {
    return (
      <DiscountDetail
        discount={selected}
        progressCount={progress[selected.threshold.period] ?? 0}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {actorTabs.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={opt.value === actor}
            onPress={() =>
              setActor((prev) => (prev === opt.value ? null : opt.value))
            }
          />
        ))}
      </ScrollView>
      <FlatList
        data={visible}
        keyExtractor={(d) => d.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DiscountCard
            discount={item}
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
  chipsScroll: { flexGrow: 0 },
  chips: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    gap: space.sm,
    alignItems: "center",
  },
  list: { padding: space.lg, gap: space.md },
  row: { gap: space.md },
});
