import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import CartScreen from '../screens/CartScreen';
// import CheckoutScreen from '../screens/CheckoutScreen'; 

const Stack = createNativeStackNavigator();

export default function CartStackNavigator() {
  return (
    <Stack.Navigator
      
    >
      {/* <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ title: 'Cart' }}
      /> */}
      {/* <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      /> */}
    </Stack.Navigator>
  );
}