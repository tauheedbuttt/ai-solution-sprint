import { View, Text, StyleSheet } from 'react-native';
import { color, space, type as t } from '../../theme/tokens';

export function StubScreen({ title }: { title: string }) {
  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow}>coming soon</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background, alignItems: 'center', justifyContent: 'center', gap: space.sm },
  eyebrow: { ...t.eyebrow, color: color.mint },
  title: { ...t.h2, color: color.foreground },
});
