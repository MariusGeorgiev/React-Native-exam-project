import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';
import EditFurnitureScreen from '../screens/EditFurnitureScreen';
import { BackHeader, HomeHeader } from '../components/headers';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
    
      >
      <Stack.Screen name="HomeScreen" component={HomeScreen} 
          options={{ header: () => <HomeHeader title='Home' /> }}
      />
      <Stack.Screen name="FurnitureList" component={FurnitureListScreen}
          options={({ navigation, route }) => ({
             header: () => <BackHeader title={`${route.params.categoryTitle} › ${route.params.subcategory}`} navigation={navigation}/> })}
      />
      <Stack.Screen name="FurnitureDetails" component={FurnitureDetailsScreen} 
          options={({ navigation }) => ({
             header: () => <BackHeader title='Details' navigation={navigation}/> })}
      />

      <Stack.Screen
              name="EditFurniture"
              component={EditFurnitureScreen}
              options={({ navigation }) => ({
                header: () => (
                  <BackHeader
                    title="Edit Furniture"
                    navigation={navigation}
                  />
                ),
              })}
            />
      
    </Stack.Navigator>
  );
}