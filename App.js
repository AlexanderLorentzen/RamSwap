import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { AppProvider, useApp } from './context/AppContext';
import { colors } from './styles/styles';
import HomeScreen from './screens/HomeScreen';
import ShareScreen from './screens/ShareScreen';
import MarketScreen from './screens/MarketScreen';
import MachineDetailScreen from './screens/MachineDetailScreen';
import ActivityScreen from './screens/ActivityScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Forside: 'home',
  Udlej: 'hardware-chip',
  Marked: 'storefront',
  Aktivitet: 'stats-chart',
  Indstillinger: 'settings',
};

// Tab-navigation: de fem hovedskærme. Stack-navigation lægger "Maskine" og "Om RamSwap" ovenpå.
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        headerTitleStyle: { fontWeight: '800' },
      })}
    >
      <Tab.Screen name="Forside" component={HomeScreen} options={{ title: 'RamSwap', tabBarLabel: 'Forside' }} />
      <Tab.Screen name="Udlej" component={ShareScreen} options={{ title: 'Udlej min computer', tabBarLabel: 'Udlej' }} />
      <Tab.Screen name="Marked" component={MarketScreen} options={{ title: 'Lej computerkraft', tabBarLabel: 'Marked' }} />
      <Tab.Screen name="Aktivitet" component={ActivityScreen} />
      <Tab.Screen name="Indstillinger" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { loaded } = useApp();
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="MachineDetail" component={MachineDetailScreen} options={{ title: 'Maskine' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Om RamSwap' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
