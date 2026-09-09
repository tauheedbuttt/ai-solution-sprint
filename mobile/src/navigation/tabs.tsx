import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabBar } from './tabbar';
import { AppBar } from '../components/appbar';
import { HomeScreen } from '../screens/main/home';
import { DiscountsScreen } from '../screens/main/discounts';
import { EpassiScreen } from '../screens/main/epassi';
import { VerifyScreen } from '../screens/main/verify';

const Tab = createBottomTabNavigator();

function makeIcon(name: keyof typeof Ionicons.glyphMap) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
}

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: true, header: () => <AppBar /> }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: makeIcon('home') }} />
      <Tab.Screen name="Discounts" component={DiscountsScreen} options={{ tabBarIcon: makeIcon('pricetag') }} />
      <Tab.Screen name="Epassi" component={EpassiScreen} options={{ tabBarIcon: makeIcon('wallet') }} />
      <Tab.Screen name="Verify" component={VerifyScreen} options={{ tabBarIcon: makeIcon('shield-checkmark') }} />
    </Tab.Navigator>
  );
}
