import { View, Text, StyleSheet } from 'react-native';
import { color, radius, borderWidth, font, type as t, space } from '../theme/tokens';

type props = {
  label: string;
  value: string;
  suffix?: string;
  valueColor?: string;
  description?: string;
  footnote?: string;
  progress?: number;
};

export function StatCard({ label, value, suffix, valueColor, description, footnote, progress }: props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
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
  card: { borderWidth: borderWidth.hairline, borderColor: color.border, padding: space.lg, gap: space.sm },
  label: { ...t.eyebrow, color: color.mutedForeground },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.xs },
  value: { fontFamily: font.display, fontSize: 44, fontWeight: '800', color: color.foreground },
  suffix: { ...t.body, color: color.mutedForeground, marginBottom: 6 },
  description: { ...t.body, color: color.foreground },
  footnote: { ...t.bodySmall, fontFamily: font.mono, color: color.mutedForeground },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: color.secondary, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: color.mint },
});
