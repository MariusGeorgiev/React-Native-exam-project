import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.drawerBtn}
    >
      <Ionicons name="menu" size={28} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawerBtn: {
    position: 'absolute',
    top: 20,     
    right: 10,    
    zIndex: 10, 
  },
});