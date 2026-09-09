import { Pressable, View, StyleSheet } from 'react-native';
import { color } from '../theme/tokens';

type props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function SwitchToggle({ value, onChange }: props) {
  return (
    <Pressable onPress={() => onChange(!value)} style={[styles.track, value && styles.trackOn]}>
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 999,
    backgroundColor: color.secondary,
    borderWidth: 1,
    borderColor: color.border,
    padding: 2,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: color.brownInk, borderColor: color.brownInk },
  thumb: { width: 20, height: 20, borderRadius: 999, backgroundColor: color.foreground },
  thumbOn: { alignSelf: 'flex-end' },
});
