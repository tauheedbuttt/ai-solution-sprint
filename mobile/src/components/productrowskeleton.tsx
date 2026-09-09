import { View, StyleSheet } from 'react-native';
import { borderWidth, color, radius, space } from '../theme/tokens';
import { Skeleton } from './skeleton';

export function ProductRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton style={styles.thumb} />
      <View style={styles.body}>
        <Skeleton style={styles.line} />
        <Skeleton style={styles.lineShort} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  thumb: { width: 40, height: 40, borderRadius: radius.md },
  body: { flex: 1, gap: space.xs },
  line: { height: 14, width: '60%' },
  lineShort: { height: 12, width: '35%' },
});
