import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/services/auth/context';
import { RootNavigator } from './src/navigation/root';
import { color, layout } from './src/theme/tokens';

export default function App() {
  return (
    <View style={styles.page}>
      <View style={styles.frame}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: color.background,
    ...(Platform.OS === 'web' ? { alignItems: 'center' as const } : null),
  },
  frame: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web' ? { maxWidth: layout.maxWidth } : null),
  },
});
