import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthProvider";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { getFurnitureById } from "../services/furnitureService";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function OrdersScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt")
      );
      const snapshot = await getDocs(q);

      const ordersData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          const itemsWithFurniture = await Promise.all(
  (data.items || []).map(async (item) => {
    if (!item.productId) return { ...item, furniture: null };

    try {
      
      const furniture = await getFurnitureById(item.productId);
      return { ...item, furniture };
    } catch (e) {
      console.log("Furniture not found for productId:", item.productId);
      return { ...item, furniture: null };
    }
  })
);

          console.log("Order items with furniture:", itemsWithFurniture);

          return {
            id: doc.id,
            createdAt: data.createdAt || null,
            total: data.total || 0,
            status: data.status || "Unknown",
            items: itemsWithFurniture,
            username: data.username || "N/A",      
            phoneCode: data.phoneCode || "N/A",
            phone: data.phone || "N/A",           
            address: data.address || "N/A",        
            };
        })
      );

      setOrders(ordersData);
    } catch (error) {
      console.log("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "";
    const d = date?.toDate ? date.toDate() : new Date(date);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(",", "")} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  if (!orders.length)
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Orders</Text>
        <Text>You have no orders yet.</Text>
      </View>
    );

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.orderId}>Order #{item.id.slice(0, 6)}</Text>
      <Text style={styles.text}>Date: {formatDate(item.createdAt)}</Text>
      <Text style={styles.text}>Items: {(item.items || []).length}</Text>
      <Text style={styles.text}>Total: ${item.total?.toFixed(2)}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
      <Text style={styles.header}>Total Orders ({orders.length})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <OrderDetailsModal
  visible={modalVisible}
  order={selectedOrder}
  onClose={() => setModalVisible(false)}
  navigation={navigation}
  formatDate={formatDate}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     padding: 16,
     backgroundColor: "#fff" 
    },
  center: { flex: 1, justifyContent: "center", alignItems: "center",  },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: 'center', },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10,  },
  orderCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
  },
  orderId: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  text: { fontSize: 14, marginTop: 2 },
  status: { marginTop: 6, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { fontSize: 14 },
  closeBtn: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
});