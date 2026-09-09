import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, type as t, space } from '../theme/tokens';

export type timelineKind = 'care' | 'repair' | 'nextLife' | 'origin';
export type timelineItem = { id: string; kind: timelineKind; label: string; date: string; note?: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const icon: Record<timelineKind, keyof typeof Ionicons.glyphMap> = {
  care: 'sparkles-outline',
  repair: 'build-outline',
  nextLife: 'sync-outline',
  origin: 'pricetag-outline',
};

const dotBg: Record<timelineKind, string> = {
  care: `${color.mint}40`,
  repair: color.secondary,
  nextLife: `${color.mint}40`,
  origin: color.border,
};

export function Timeline({ items, emptyLabel = 'No events logged yet.' }: { items: timelineItem[]; emptyLabel?: string }) {
  if (items.length === 0) {
    return <Text style={styles.empty}>{emptyLabel}</Text>;
  }
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      {items.map((item, i) => (
        <Row key={item.id + i} item={item} last={i === items.length - 1} />
      ))}
    </View>
  );
}

function Row({ item, last }: { item: timelineItem; last: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={[styles.dot, { backgroundColor: dotBg[item.kind] }]}>
        <Ionicons name={icon[item.kind]} size={11} color={color.mint} />
      </View>
      <View style={styles.rowHead}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { ...t.bodySmall, color: color.mutedForeground },
  wrap: { position: 'relative', paddingLeft: space.xl, marginTop: space.xs },
  line: { position: 'absolute', left: 9, top: 6, bottom: 6, width: 1.5, backgroundColor: color.border },
  row: { position: 'relative', paddingBottom: space.lg },
  rowLast: { paddingBottom: 0 },
  dot: {
    position: 'absolute',
    left: -space.xl,
    top: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm },
  label: { ...t.body, fontWeight: '600', color: color.foreground },
  date: { ...t.bodySmall, color: color.mutedForeground },
  note: { ...t.bodySmall, color: color.mutedForeground, marginTop: 2 },
});
