import { View, StyleSheet } from 'react-native';
import { color, radius } from '../theme/tokens';

type props = { progress: number };

export function ProgressBar({ progress }: props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: radius.pill, backgroundColor: color.secondary, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: color.brownInk },
});
