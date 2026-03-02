import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from './DrawerNavigator.jsx';

export default function AppNavigator() {

    const Stack = createNativeStackNavigator();
    
     return (
        <Stack.Navigator 
            screenOptions={{
                headerShown: false, 
            }}
        >

            <Stack.Screen name="App" component={DrawerNavigator} />

        </Stack.Navigator>
    );
}