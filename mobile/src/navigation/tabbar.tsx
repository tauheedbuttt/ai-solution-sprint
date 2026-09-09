import { Pressable, View, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { color, space } from '../theme/tokens';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, i) => {
        const active = state.index === i;
        const { tabBarIcon } = descriptors[route.key].options;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
          >
            {tabBarIcon?.({ focused: active, color: active ? color.mint : color.mutedForeground, size: 24 })}
            <View style={[styles.underline, active && styles.underlineActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: color.card,
    borderTopWidth: 1,
    borderTopColor: color.border,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  item: { flex: 1, alignItems: 'center', gap: space.xs },
  underline: { height: 2, width: 20, borderRadius: 0, backgroundColor: 'transparent' },
  underlineActive: { backgroundColor: color.brownInk },
});
