import { NavigationContainer, DarkTheme, type Theme } from '@react-navigation/native';
import { SignInScreen } from '../screens/auth/signin';
import { Shell } from './shell';
import { useAuth } from '../services/auth/context';
import { color } from '../theme/tokens';

const navTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: color.background, card: color.card, border: color.border, primary: color.brownInk },
};

export function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer theme={navTheme}>
      {user ? <Shell /> : <SignInScreen />}
    </NavigationContainer>
  );
}
