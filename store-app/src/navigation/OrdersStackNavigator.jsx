import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrdersScreen from "../screens/OrdersScreen";
import FurnitureDetails from "../screens/FurnitureDetailsScreen";

import { BackHeader } from "../components/headers";

const Stack = createNativeStackNavigator();

export default function OrdersStackNavigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={({  }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="FurnitureDetails"
        component={FurnitureDetails}
        options={({ navigation }) => ({
          header: () => <BackHeader title="Furniture Details" navigation={navigation} />,
          
        })}
      />

    </Stack.Navigator>
  );
}