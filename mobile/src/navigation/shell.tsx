import { View, StyleSheet } from 'react-native';
import { Tabs } from './tabs';
import { CaptureRoot } from '../screens/capture/captureroot';

export function Shell() {
  return (
    <View style={styles.root}>
      <Tabs />
      <CaptureRoot />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
