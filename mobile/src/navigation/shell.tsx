import { View, StyleSheet } from 'react-native';
import { Tabs } from './tabs';
import { CaptureRoot } from '../screens/capture/captureroot';

export function Shell({ activeRoute }: { activeRoute?: string }) {
  return (
    <View style={styles.root}>
      <Tabs />
      {activeRoute === 'Home' ? <CaptureRoot /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
