import { View, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Tabs } from './tabs';
import { CaptureRoot } from '../screens/capture/captureroot';

export function Shell() {
  const activeRoute = useNavigationState((state) => state?.routes[state.index]?.name);

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
