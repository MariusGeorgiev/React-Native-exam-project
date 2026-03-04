import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { BackHeader, SimpleHeader } from '../components/headers';


const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          header: () => <SimpleHeader title="Login" />,
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          header: () => <SimpleHeader title="Register" />,
        }}
      />
    </Stack.Navigator>
  );
}