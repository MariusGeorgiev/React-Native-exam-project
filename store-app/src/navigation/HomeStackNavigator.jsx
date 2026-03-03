import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';


const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator 
      >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
          headerShown: false,
         
        }}/>
      <Stack.Screen name="FurnitureList" component={FurnitureListScreen} />
      <Stack.Screen name="FurnitureDetails" component={FurnitureDetailsScreen} />
      
      
    </Stack.Navigator>
  );
}