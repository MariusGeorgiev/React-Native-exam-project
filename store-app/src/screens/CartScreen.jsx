import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { getFurnitureById } from '../services/furnitureService';

export default function CartScreen({ navigation }) {
  const { userProfile, updateCartQuantity, removeFromCart } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCartItems() {
    if (!userProfile?.cart?.length) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const items = await Promise.all(
        userProfile.cart.map(async item => {
          try {
            const furniture = await getFurnitureById(item.id);
            return furniture ? { ...item, furniture } : null;
          } catch {
            return null;
          }
        })
      );
      setCartItems(items.filter(Boolean));
    } catch (error) {
      console.log('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, [userProfile?.cart]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (!cartItems.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cart</Text>
        <Text>Your cart is empty!</Text>
      </View>
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.furniture.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('FurnitureDetails', { furnitureId: item.furniture.id })}
        style={{flexDirection: 'row'}}
      >
        {item.furniture.images?.[0] && (
          <Image source={{ uri: item.furniture.images[0] }} style={styles.image} />
        )}

        <View>
          <Text style={styles.title}>{item.furniture.title}</Text>
          <Text>Price: ${item.furniture.price}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Total price items: ${item.quantity * item.furniture.price}</Text>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={{ color: 'white' }}>Remove</Text>
          </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
      

      <View style={styles.info}>
        

        

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              item.quantity > 1 && updateCartQuantity(item.id, item.quantity - 1)
            }
          >
            <Text>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>

          

        </View>
        

      </View>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
        <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flexDirection: "row"},
  title: { fontSize: 16, fontWeight: 'bold' },
  qtyRow: { flexDirection: 'column', gap: 8,  alignItems: "flex-end" },
  qtyBtn: { padding: 10, backgroundColor: '#ddd', marginRight: 8, borderRadius: 4, width: 40, alignItems: 'center', },
  removeBtn: { padding: 8, backgroundColor: 'red', marginTop: 10, borderRadius: 4, alignItems: 'center' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});