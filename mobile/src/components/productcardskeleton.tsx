import { View, StyleSheet } from 'react-native';
import { space } from '../theme/tokens';
import { Skeleton } from './skeleton';

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton style={styles.image} />
      <View style={styles.body}>
        <Skeleton style={styles.line} />
        <Skeleton style={styles.lineShort} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: '47%', flexGrow: 1, gap: space.sm },
  image: { aspectRatio: 1, borderRadius: 0 },
  body: { gap: space.xs },
  line: { height: 14, width: '80%' },
  lineShort: { height: 12, width: '50%' },
});
