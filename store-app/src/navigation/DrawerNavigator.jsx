import ProfileScreen from '../screens/ProfileScreen';
import OrdersStackNavigator from './OrdersStackNavigator';

import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabsNavigator from './BottomTabsNavigator';

import SettingsScreen from '../screens/SettingsScreen';
import InfoScreen from '../screens/InfoScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { SimpleHeader, BackHeader } from '../components/headers';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: true,
        drawerType: 'front',
        drawerStyle: {
          width: '55%',
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabsNavigator}  options={{ headerShown: false }}  />
      <Drawer.Screen name="Profile" component={ProfileScreen} 
          options={({ navigation }) => ({
             header: () => <BackHeader title='Profile' navigation={navigation}/> })}
      />
      <Drawer.Screen name="Orders" component={OrdersStackNavigator} 
          options={{
            headerShown: false
          }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} 
        options={({ navigation }) => ({
             header: () => <BackHeader title='Settings' navigation={navigation}/> })}
      />
      <Drawer.Screen name="Info & Contact" component={InfoScreen} 
        options={({ navigation }) => ({
             header: () => <BackHeader title='Info & Contact' navigation={navigation}/> })}
      />
    </Drawer.Navigator>
  );
}