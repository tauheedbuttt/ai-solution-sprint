import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../theme/tokens';

type props = {
  title: string;
  subtitle: string;
};

export function EventCard({ title, subtitle }: props) {
  return (
    <View style={styles.card}>
      <Ionicons name="sparkles" size={18} color={color.mint} />
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={3}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.lg,
    gap: space.xs,
    minHeight: 120,
    justifyContent: 'center',
  },
  title: { ...t.h3, color: color.foreground },
  subtitle: { ...t.bodySmall, color: color.mutedForeground },
});
