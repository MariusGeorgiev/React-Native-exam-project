import { View, Text, StyleSheet, Button } from 'react-native';

export default function CheckoutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <Text>Checkout is empty!</Text>
      <Button title="Back to Cart" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});