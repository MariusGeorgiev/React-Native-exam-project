import { View, Text, StyleSheet } from 'react-native';
import DrawerButton from '../DrawerButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SimpleHeader({ title }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <DrawerButton style={{ justifyContent: 'center', }} />
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
    paddingLeft: 15,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});