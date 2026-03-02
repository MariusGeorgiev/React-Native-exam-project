import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabsNavigator from './BottomTabsNavigator';

// import ProfileScreen from '../screens/ProfileScreen';
// import OrdersScreen from '../screens/OrdersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InfoScreen from '../screens/InfoScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      
      screenOptions={{
        drawerPosition: "right",
        headerShown: false, 
        drawerType: 'front',
        drawerStyle: {
        width: '55%',
    },
      }}
    >
      
      <Drawer.Screen name="MainTabs" component={BottomTabsNavigator} />
      
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Drawer.Screen name="Orders" component={OrdersScreen} /> */}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Info" component={InfoScreen} />
    </Drawer.Navigator>
  );
}