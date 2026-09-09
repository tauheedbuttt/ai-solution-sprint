import { View, Text, StyleSheet } from 'react-native';
import { color, borderWidth, type as t, space } from '../theme/tokens';

type props = {
  title: string;
  subtitle: string;
};

export function EventCard({ title, subtitle }: props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.md,
    gap: space.xs,
  },
  title: { ...t.body, fontWeight: '600', color: color.foreground },
  subtitle: { ...t.bodySmall, color: color.mutedForeground },
});
