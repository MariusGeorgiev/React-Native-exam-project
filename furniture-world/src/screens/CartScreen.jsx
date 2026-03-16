import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { getFurnitureById } from "../services/furnitureService";
import { Ionicons } from '@expo/vector-icons';


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
        userProfile.cart.map(async (item) => {
          try {
            const furniture = await getFurnitureById(item.id);
            return furniture ? { ...item, furniture } : null;
          } catch {
            return null;
          }
        }),
      );
      setCartItems(items.filter(Boolean));
    } catch (error) {
      console.log("Error fetching cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [userProfile?.cart]),
  );

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
    0,
  );

const renderItem = ({ item }) => (
  <View style={styles.itemContainer}>
    
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FurnitureDetails", {
          furnitureId: item.furniture.id,
        })
      }
      style={styles.row}
    >
      {item.furniture.images?.[0] && (
        <Image
          source={{ uri: item.furniture.images[0] }}
          style={styles.image}
        />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.furniture.title}
        </Text>

        <Text>Price: €{item.furniture.price.toLocaleString('fr-FR')}</Text>
        <Text>Quantity: {item.quantity}</Text>

        <Text>
          Total price items: €{(item.quantity * item.furniture.price).toLocaleString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>

    <View style={styles.controls}>
      
      <TouchableOpacity
          style={styles.trashBtn}
          onPress={() =>
            Alert.alert(
              "Remove Item",
              "Are you sure you want to remove this item from your cart?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => removeFromCart(item.id),
                },
              ],
              { cancelable: true }
            )
          }
        >
          <Ionicons name="trash-outline" size={22} color="white" />
        </TouchableOpacity>

      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={() =>
          item.quantity > 1 &&
          updateCartQuantity(item.id, item.quantity - 1)
        }
      >
        <Text style={styles.qtyText}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
      >
        <Text style={styles.qtyText}>+</Text>
      </TouchableOpacity>

    </View>

  </View>
);


  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: €{totalPrice.toLocaleString('fr-FR')}</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() =>
            navigation.navigate("Checkout", {
              cartItems,
              totalPrice,
            })
          }
        >
          <Text style={styles.checkoutText}>Go to Checkout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemContainer: {
  flexDirection: 'row',
  padding: 14,
  marginHorizontal: 12,
  marginTop: 10,
  backgroundColor: '#f4f4f4',
  borderRadius: 10,
  alignItems: 'center',

  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
},
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flexDirection: "row" },
  title: {
  fontSize: 16,
  fontWeight: 'bold',
  flexWrap: 'wrap',
},
  qtyRow: { flexDirection: "column", gap: 8, alignItems: "flex-end" },
 qtyBtn: {
  padding: 10,
  backgroundColor: '#31737a',
  borderRadius: 6,
  width: 40,
  alignItems: 'center',
},
  removeBtn: {
  padding: 8,
  backgroundColor: '#c0392b',
  marginTop: 10,
  borderRadius: 6,
  alignItems: 'center',
  width: 36,
},
footer: {
  padding: 16,
  borderTopWidth: 1,
  borderColor: '#eee',
  backgroundColor: '#ffffff',
},
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 8,  textAlign: 'center', },
  checkoutBtn: {
  backgroundColor: '#879484',
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 6,
},

checkoutText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
row: {
  flexDirection: "row",
  flex: 1,
},

textContainer: {
  flex: 1,
},

controls: {
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  marginLeft: 10,
},

trashBtn: {
  backgroundColor: "#c0392b",
  padding: 8,
  borderRadius: 6,
  width: 36,
  alignItems: "center",
},

qtyBtn: {
  backgroundColor: "#879484",
  padding: 10,
  borderRadius: 6,
  width: 36,
  alignItems: "center",
},

qtyText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},


});
