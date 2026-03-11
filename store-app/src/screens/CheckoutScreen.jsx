import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { getUserProfile } from "../services/authService";

import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

export default function CheckoutScreen({ navigation }) {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (err) {
        console.log("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function placeOrder() {
    if (!profile) return;

    try {
      setPlacingOrder(true);

      const orderData = {
        userId: user.uid,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        phoneCode: profile.phoneCode,

        address: profile.address,

        items: [], 
        total: 0,  

        status: "pending",
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      await updateDoc(doc(db, "users", user.uid), {
        orders: arrayUnion(orderRef.id),
      });

      alert("Order placed successfully!");

      navigation.navigate("Profile");

    } catch (error) {
      console.log("Order error:", error);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      {/* Customer Info */}
      <Text style={styles.section}>Customer</Text>

      <Text style={styles.value}>{profile.username}</Text>

      <Text style={styles.value}>
        {profile.phoneCode} {profile.phone}
      </Text>

      <Text style={styles.value}>{profile.email}</Text>

      {/* Address */}
      <Text style={styles.section}>Delivery Address</Text>

      <Text style={styles.value}>{profile.address?.street}</Text>

      <Text style={styles.value}>
        {profile.address?.postalCode} {profile.address?.city}
      </Text>

      <Text style={styles.value}>{profile.address?.country}</Text>

      {/* Order Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={placingOrder ? "Placing order..." : "Place Order"}
          onPress={placeOrder}
          disabled={placingOrder}
        />
      </View>

      <Button title="Back to Cart" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },

  value: {
    fontSize: 16,
    marginTop: 4,
  },

  buttonContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
});