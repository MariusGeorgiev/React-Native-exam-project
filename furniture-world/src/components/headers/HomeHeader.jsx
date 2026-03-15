import { View, Text, StyleSheet } from 'react-native';
import DrawerButton from '../DrawerButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeHeader({ title }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
    <View style={styles.header}>
      
      <Text style={styles.titleLeft} numberOfLines={1}>
        {title}
      </Text>

        <Text style={styles.nameApp}>Furniture World</Text>


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
  backgroundColor: '#31737a',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 12,
},
nameApp: {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: 20,
  color: 'white',
  fontWeight: 'bold',
},

  titleLeft: {
    paddingLeft: 4,    
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  right: {
    justifyContent: 'center',
    marginRight: -12,
  },
  
});