import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius } from '../theme/tokens';

type props = {
  onPress: () => void;
};

export function Fab({ onPress }: props) {
  return (
    <Pressable onPress={onPress} style={styles.fab} hitSlop={8}>
      <Ionicons name="add" size={28} color={color.primaryForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: color.brownInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
