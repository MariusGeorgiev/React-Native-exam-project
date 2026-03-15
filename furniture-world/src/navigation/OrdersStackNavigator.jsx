import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OrdersScreen from "../screens/OrdersScreen";
import FurnitureDetails from "../screens/FurnitureDetailsScreen";
import EditFurnitureScreen from "../screens/EditFurnitureScreen";

import { BackHeader } from "../components/headers";


const Stack = createNativeStackNavigator();

export default function OrdersStackNavigator() {
  return (
    <Stack.Navigator >

      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={({ navigation }) => ({
          header: () => <BackHeader title="Orders" navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="FurnitureDetails"
        component={FurnitureDetails}
        options={({ navigation }) => ({
          header: () => <BackHeader title="Details" navigation={navigation} />,
          
        })}
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