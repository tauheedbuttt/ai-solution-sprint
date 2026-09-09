import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, borderWidth, font, type as t, space } from '../theme/tokens';

type size = 'hero' | 'default' | 'bento' | 'compact';
type layout = 'stack' | 'row';

type props = {
  label: string;
  value: string;
  suffix?: string;
  valueColor?: string;
  description?: string;
  footnote?: string;
  progress?: number;
  size?: size;
  layout?: layout;
  icon?: keyof typeof Ionicons.glyphMap;
};

const valueSize: Record<size, number> = { hero: 46, default: 22, bento: 40, compact: 26 };
const cardPadding: Record<size, number> = { hero: space.lg, default: space.md, bento: space.lg, compact: space.md };

export function StatCard({
  label,
  value,
  suffix,
  valueColor,
  description,
  footnote,
  progress,
  size = 'default',
  layout = 'stack',
  icon,
}: props) {
  if (layout === 'row') {
    return (
      <View style={[styles.card, { padding: cardPadding[size] }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            {icon ? <Ionicons name={icon} size={16} color={color.mint} /> : null}
            <Text style={styles.label} numberOfLines={1}>{label}</Text>
          </View>
          <Text style={[styles.value, { fontSize: valueSize[size] }, valueColor ? { color: valueColor } : null]}>{value}</Text>
        </View>
        {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.card, { padding: cardPadding[size] }, size === 'hero' && styles.hero]}>
      <View style={styles.labelRow}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        {icon ? <Ionicons name={icon} size={14} color={color.mint} /> : null}
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { fontSize: valueSize[size] }, valueColor ? { color: valueColor } : null]}>{value}</Text>
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {progress !== undefined ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, Math.round(progress * 100)))}%` }]} />
        </View>
      ) : null}
      {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: borderWidth.hairline, borderColor: color.border, backgroundColor: color.card, gap: space.xs, flexGrow: 1 },
  hero: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...t.eyebrow, color: color.mutedForeground },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.xs },
  value: { fontFamily: font.display, fontWeight: '800', color: color.foreground },
  suffix: { ...t.bodySmall, color: color.mutedForeground, marginBottom: 4 },
  description: { ...t.bodySmall, color: color.mutedForeground },
  footnote: { ...t.bodySmall, fontFamily: font.mono, color: color.mutedForeground },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: color.secondary, overflow: 'hidden', marginTop: space.xs },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: color.mint },
});
