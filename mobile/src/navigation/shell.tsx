import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from './tabs';
import { CaptureRoot } from '../screens/capture/captureroot';
import { Logo } from '../components/logo';
import { AppBar } from '../components/appbar';
import { color, space } from '../theme/tokens';

export function Shell({ activeRoute }: { activeRoute?: string }) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Logo width={140} />
        <AppBar />
      </View>
      <View style={styles.container}>
        <Tabs />
        {activeRoute === 'Home' ? <CaptureRoot /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xs,
    backgroundColor: color.background,
  },
  container: { flex: 1 },
});
