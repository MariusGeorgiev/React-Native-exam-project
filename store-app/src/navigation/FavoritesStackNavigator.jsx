import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/FavoritesScreen';
// import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';

const Stack = createNativeStackNavigator();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator
            screenOptions={{
                headerShown: false, 
            }}
    >
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      {/* <Stack.Screen
        name="FurnitureDetails"
        component={FurnitureDetailsScreen}
        options={{ title: 'Details' }}
      /> */}
    </Stack.Navigator>
  );
}