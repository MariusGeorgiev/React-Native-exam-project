import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/CategoriesScreen';
import FurnitureListScreen from '../screens/FurnitureListScreen';
// import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function CustomHeader({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

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
        options={{  headerShown: false, }}
      />
      <Stack.Screen 
        name="FurnitureList" 
        component={FurnitureListScreen} 
        options={({ route }) => ({
          header: () => <CustomHeader title={`${route.params.categoryTitle} › ${route.params.subcategory}`} />,
          
        })}
      />
      {/* <Stack.Screen 
        name="FurnitureDetails" 
        component={FurnitureDetailsScreen} 
        options={{ title: 'Details' }}
      /> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 40,
    backgroundColor: '#b09999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});