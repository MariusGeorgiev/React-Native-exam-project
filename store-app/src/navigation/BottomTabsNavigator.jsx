import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
// import FavoritesStackNavigator from './FavoritesStackNavigator';
// import CartStackNavigator from './CartStackNavigator';
import DrawerButton from '../components/DrawerButton';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {

  return (
    <Tab.Navigator screenOptions={{
      headerShown: true, 
        headerTitleAlign: 'left',   
        headerRight: () => <DrawerButton />, 
      }}
      >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Categories" component={CategoriesStackNavigator} 
      />
      {/* <Tab.Screen name="Favorites" component={FavoritesStackNavigator} />
      <Tab.Screen name="Cart" component={CartStackNavigator} /> */}
    </Tab.Navigator>
  );
}