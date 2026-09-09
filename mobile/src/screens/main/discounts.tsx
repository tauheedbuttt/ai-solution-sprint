import { useEffect, useMemo, useState } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { color, borderWidth, space } from '../../theme/tokens';
import { Logo } from '../../components/logo';
import { Chip } from '../../components/chip';
import { DiscountCard } from '../../components/discountcard';
import { DiscountDetail } from '../../components/discountdetail';
import { api, type actorType, type discount, type period } from '../../services/api';

const actorTabs: { value: actorType; label: string }[] = [
  { value: 'brand', label: 'Brand' },
  { value: 'service_provider', label: 'Service provider' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'city', label: 'City' },
];

export function DiscountsScreen() {
  const [actor, setActor] = useState<actorType>('brand');
  const [discounts, setDiscounts] = useState<discount[]>([]);
  const [progress, setProgress] = useState<Partial<Record<period, number>>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    function load() {
      api.discounts.list().then(async (list) => {
        setDiscounts(list);
        const periods = Array.from(new Set(list.map((d) => d.threshold.period)));
        const counts = await Promise.all(periods.map((p) => api.stats.logsInPeriod(p)));
        setProgress(Object.fromEntries(periods.map((p, i) => [p, counts[i]])));
      });
    }
    load();
    return api.subscribe(load);
  }, []);

  const visible = useMemo(() => discounts.filter((d) => d.actorType === actor), [discounts, actor]);
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
      <View style={styles.appBar}>
        <Logo width={120} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {actorTabs.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={opt.value === actor}
            onPress={() => setActor(opt.value)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={visible}
        keyExtractor={(d) => d.id}
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
  appBar: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  chips: { paddingHorizontal: space.lg, paddingVertical: space.md, gap: space.sm },
  list: { padding: space.lg, gap: space.md },
});
