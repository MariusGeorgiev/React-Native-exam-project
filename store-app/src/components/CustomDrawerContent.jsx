import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthProvider';

export default function CustomDrawerContent(props) {
  const { user } = useAuth();


  const handleLogout = async () => {
    try {
      await signOut(auth);

      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                index: 0,
                routes: [{ name: 'Home' }],
              },
            },
          ],
        })
      );
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>

      <View style={styles.top}>


        {user && (
                <>
                  <DrawerItem
                    label="Profile"
                    icon={({ color, size }) => (
                      <Ionicons name="person-outline" size={size} color={color} />
                    )}
                    onPress={() => props.navigation.navigate("Profile")}
                  />

                  <DrawerItem
                    label="Orders"
                    icon={({ color, size }) => (
                      <Ionicons name="receipt-outline" size={size} color={color} />
                    )}
                    onPress={() => props.navigation.navigate("Orders")}
                  />

                  </>
                
              )}

        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Settings')}
        />

        


        <DrawerItem
          label="Info & Contact"
          icon={({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Info & Contact')}
        />
      </View>

      {user && (
        <View style={styles.bottom}>
          <DrawerItem
            label="Logout"
            labelStyle={{ color: 'red' }}
            icon={({ size }) => (
              <Ionicons name="log-out-outline" size={size} color="red" />
            )}
            onPress={handleLogout}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    marginTop: 20,
  },
  bottom: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingBottom: 20,
  },
});