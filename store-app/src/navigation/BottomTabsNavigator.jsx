import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import CartStackNavigator from './CartStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import CreateFurnitureScreen from '../screens/CreateFurnitureScreen';
import { SimpleHeader } from '../components/headers';

import { useAuth } from '../contexts/AuthProvider';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {!user && (
        <Tab.Screen
          name="Login"
          component={AuthStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {user && (
        <>
          <Tab.Screen
            name="Favorites"
            component={FavoritesStackNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" size={size} color={color} />
              ),
            }}
          />

            
          <Tab.Screen
            name="Cart"
            component={CartStackNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cart-outline" size={size} color={color} />
              ),
            }}
          />


          {userProfile?.role === "admin" && (
          <Tab.Screen
                name="Add"
                component={CreateFurnitureScreen}
                options={{
                  headerShown: true,
                  header: () => <SimpleHeader title="Create new Furniture" />,
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="add-circle-outline" size={size} color={color} />
                  ),
                }}
          />
           )}

        </>
      )}


    </Tab.Navigator>
  );
}