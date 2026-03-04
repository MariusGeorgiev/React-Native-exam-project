import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/CategoriesScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';
// import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SimpleHeader, BackHeader } from '../components/headers';

const Stack = createNativeStackNavigator();


export default function CategoriesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{
         
        headerTitleAlign: 'center',          
        headerStyle: {
          backgroundColor: '#b09999',                    
        }
      }}>
      
      <Stack.Screen 
        name="CategoriesScreen" 
        component={CategoriesScreen} 
        options={{ header: () => <SimpleHeader title='Categories' /> }}
      />
      <Stack.Screen 
        name="FurnitureList" 
        component={FurnitureListScreen} 
        options={({ route, navigation }) => ({
          header: () => <BackHeader title={`${route.params.categoryTitle} › ${route.params.subcategory}`} navigation={navigation}/>,
          
        })}
      />
      <Stack.Screen 
        name="FurnitureDetails" 
        component={FurnitureDetailsScreen} 
          options={({ navigation }) => ({
          header: () => (
            <BackHeader
              title="Details"
              navigation={navigation}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

// const styles = StyleSheet.create({
  
// });