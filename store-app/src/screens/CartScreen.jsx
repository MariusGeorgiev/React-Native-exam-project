import { View, Text, StyleSheet, Button } from 'react-native';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <Text>Cart is empty!.</Text>
      <Button title="Go to Checkout" onPress={() => { /* placeholder */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});