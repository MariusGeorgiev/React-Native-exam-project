import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthProvider';

export default function App() {
  return (
    
    <NavigationContainer>

        <AuthProvider>
            <StatusBar style="auto" />
            <AppNavigator />
        </AuthProvider>

    </NavigationContainer>
   
  );
}


