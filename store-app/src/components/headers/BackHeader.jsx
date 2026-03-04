import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrawerButton from '../DrawerButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BackHeader({ title, navigation }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
    <View style={styles.header}>
      
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.left}
      >
        <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>
        <DrawerButton style={{ justifyContent: 'center', }} />
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 44,
    backgroundColor: '#b09999',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  left: {
    width: 40,
    justifyContent: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});