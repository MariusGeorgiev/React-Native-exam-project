import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/CategoriesScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
// import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';

const Stack = createNativeStackNavigator();

export default function CategoriesStackNavigator() {
  return (
    <Stack.Navigator 
      
    >
      <Stack.Screen 
        name="CategoriesScreen" 
        component={CategoriesScreen} 
        options={{  headerShown: false, }}
      />
      <Stack.Screen 
        name="FurnitureList" 
        component={FurnitureListScreen} 
        options={{ title: 'Furniture List' }}
      />
      {/* <Stack.Screen 
        name="FurnitureDetails" 
        component={FurnitureDetailsScreen} 
        options={{ title: 'Details' }}
      /> */}
    </Stack.Navigator>
  );
}