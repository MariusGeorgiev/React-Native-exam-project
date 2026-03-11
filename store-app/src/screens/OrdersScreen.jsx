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

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function OrdersScreen() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
    } catch (error) {
      console.log("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  console.log('Orders:', orders);
  


  function formatDate(date) {
    if (!date) return "";

    const d = date?.toDate ? date.toDate() : new Date(date);

    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).replace(",", "");

    const timePart = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart} ${timePart}`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Orders</Text>
        <Text>You have no orders yet.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <Text style={styles.orderId}>Order #{item.id.slice(0, 6)}</Text>

      <Text style={styles.text}>
        Date: {formatDate(item.createdAt)}
      </Text>

      <Text style={styles.text}>
        Items: {item.items?.length || 0}
      </Text>

      <Text style={styles.text}>
        Total: ${item.total?.toFixed(2)}
      </Text>

      <Text style={styles.status}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Total Orders ({orders?.length || 0})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  orderCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
  },

  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },

  text: {
    fontSize: 14,
    marginTop: 2,
  },

  status: {
    marginTop: 6,
    fontWeight: "bold",
  },
});