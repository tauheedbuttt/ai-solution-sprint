import { useState } from 'react';
import { NavigationContainer, DarkTheme, type Theme } from '@react-navigation/native';
import { SignInScreen } from '../screens/auth/signin';
import { Shell } from './shell';
import { ProviderHome } from '../screens/provider/providerhome';
import { useAuth } from '../services/auth/context';
import { color } from '../theme/tokens';

const navTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: color.background, card: color.card, border: color.border, primary: color.brownInk },
};

export function RootNavigator() {
  const { user } = useAuth();
  const [activeRoute, setActiveRoute] = useState<string>();

  return (
    <NavigationContainer
      theme={navTheme}
      onStateChange={(state) => setActiveRoute(state?.routes[state.index]?.name)}
      onReady={() => setActiveRoute('Home')}
    >
      {user ? (
        user.role === 'service_provider' ? (
          <ProviderHome />
        ) : (
          <Shell activeRoute={activeRoute} />
        )
      ) : (
        <SignInScreen />
      )}
    </NavigationContainer>
  );
}
