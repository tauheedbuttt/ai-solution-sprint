import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/services/auth/context';
import { RootNavigator } from './src/navigation/root';
import { color, layout } from './src/theme/tokens';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.backgroundColor = color.background;
      document.body.style.backgroundColor = color.background;

      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.setAttribute('name', 'theme-color');
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute('content', color.background);

      let metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        let content = metaViewport.getAttribute('content') || '';
        if (!content.includes('viewport-fit=cover')) {
          metaViewport.setAttribute('content', `${content}, viewport-fit=cover`);
        }
      }

      const styleId = 'careloop-global-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          html, body, #root {
            background-color: ${color.background} !important;
            overscroll-behavior-y: none;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

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
    ...(Platform.OS === 'web' ? { alignItems: 'center' as const, width: '100%', minHeight: '100dvh' as any } : null),
  },
  frame: {
    flex: 1,
    width: '100%',
    backgroundColor: color.background,
    ...(Platform.OS === 'web' ? { maxWidth: layout.maxWidth } : null),
  },
});
