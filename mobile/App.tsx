import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/services/auth/context';
import { RootNavigator } from './src/navigation/root';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
