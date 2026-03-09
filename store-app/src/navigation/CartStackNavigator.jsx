import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
// import CheckoutScreen from '../screens/CheckoutScreen';
import FurnitureDetailsScreen from '../screens/FurnitureDetailsScreen';
import { SimpleHeader, BackHeader } from '../components/headers';

const Stack = createNativeStackNavigator();

export default function CartStackNavigator() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //           headerShown: false, 
      //       }}
    >
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ header: () => <SimpleHeader title='Cart' /> }}
      />
      <Stack.Screen name="FurnitureDetails" component={FurnitureDetailsScreen} 
          options={({ navigation }) => ({
             header: () => <BackHeader title='Details' navigation={navigation}/> })}
      />

      {/* <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      /> */}
    </Stack.Navigator>
  );
}