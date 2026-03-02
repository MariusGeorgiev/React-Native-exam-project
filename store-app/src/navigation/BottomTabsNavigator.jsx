import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import CartStackNavigator from './CartStackNavigator';
import DrawerButton from '../components/DrawerButton';
import { Ionicons } from '@expo/vector-icons';

import CreateFurnitureScreen from '../screens/CreateFurnitureScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {

  return (
    <Tab.Navigator screenOptions={{
      headerShown: true, 
        headerTitleAlign: 'left',   
        headerRight: () => <DrawerButton />, 
      }}
      >
      <Tab.Screen name="Home" component={HomeStackNavigator} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
        }}
        />
      <Tab.Screen name="Categories" component={CategoriesStackNavigator}
            options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list-outline" size={size} color={color} />
                ),
              }} 
      />
      <Tab.Screen name="Favorites" component={FavoritesStackNavigator} 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="heart-outline" size={size} color={color} />
                ),
              }}
        />
      <Tab.Screen name="Cart" component={CartStackNavigator} 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" size={size} color={color} />
                ),
              }}
      />

      <Tab.Screen
        name="Add"
        component={CreateFurnitureScreen}
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
        
    />

    </Tab.Navigator>
  );
}