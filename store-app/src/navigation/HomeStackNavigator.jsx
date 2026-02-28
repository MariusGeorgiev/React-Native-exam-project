import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
// import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';
import DrawerButton from '../components/DrawerButton';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FurnitureList" component={FurnitureListScreen} />
      {/* <Stack.Screen name="FurnitureDetails" component={FurnitureDetailsScreen} /> */}
      <Stack.Screen name="btn" component={DrawerButton} />
      
    </Stack.Navigator>
  );
}