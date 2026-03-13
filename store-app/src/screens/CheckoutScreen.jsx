import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, TextInput } from "react-native";
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
import { pickLocation } from "../services/locationService";

export default function CheckoutScreen({ navigation, route }) {
  const { user, userProfile, setUserProfile } = useAuth();
  const { cartItems, totalPrice } = route.params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const data = await getUserProfile(user.uid);

        setProfile(data);

        setUsername(data.username || "");

        setPhoneCode(data.phoneCode || "");
        setPhone(data.phone || "");

        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setPostalCode(data.address?.postalCode || "");
        setCountry(data.address?.country || "");

      } catch (err) {
        console.log("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  function validateCheckoutForm({ username, phoneCode, phone, street, city, postalCode, country }) {
  
    if (!username.trim() || username.length < 3 || username.length > 40) {
    return "Username is required and should be 3-40 characters.";
  }
  
    if (!phoneCode.trim() || !/^\+\d{1,5}$/.test(phoneCode)) {
    return "Phone code is invalid. It should start with '+' and 1-5 digits.";
  }

  if (!phone.trim() || !/^\d{6,15}$/.test(phone)) {
    return "Phone number is invalid. It should be 6-15 digits.";
  }

  if (!street.trim() || street.length < 3 || street.length > 50) {
    return "Street is required and should be 3-50 characters.";
  }

  if (!city.trim() || city.length < 2 || city.length > 50) {
    return "City is required and should be 2-50 characters.";
  }

  if (postalCode && (postalCode.length < 2 || postalCode.length > 10)) {
    return "Postal code should be 2-10 characters.";
  }

  if (!country.trim() || country.length < 2 || country.length > 50) {
    return "Country is required and should be 2-50 characters.";
  }

  return null;
}

async function handlePickLocation() {
  try {
    const location = await pickLocation();

    if (!location) return;

    setStreet(location.street || "");
    setCity(location.city || "");
    setPostalCode(location.postalCode || "");
    setCountry(location.country || "");

  } catch (error) {
    alert("Unable to get location.");
  }
}

async function placeOrder() {
    if (!profile || placingOrder) return;

      const error = validateCheckoutForm({ username, phoneCode, phone, street, city, postalCode, country });
        if (error) {
          alert(error);
          return;
        }

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.furniture.id,
        title: item.furniture.title,
        price: item.furniture.price,
        quantity: item.quantity
      }));

      const orderData = {
        userId: user.uid,
        username,
        phone,
        phoneCode,
        address: { street, city, postalCode, country },
        items: orderItems,
        total: totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      
      const orderRef = await addDoc(collection(db, "orders"), orderData);

      
      await updateDoc(doc(db, "users", user.uid), { 
        orders: arrayUnion(orderRef.id), 
        cart: [] 
      });

      
      if (setUserProfile) {
        setUserProfile(prev => ({ ...prev, cart: [] }));
      }

      alert("Order placed successfully!");

      
      navigation.reset({
        index: 0,
        routes: [{ name: "Orders" }],
      });

    } catch (error) {
    alert("Something went wrong while placing your order!");
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

      <Text style={styles.section}>Customer</Text>

      <Text style={styles.value}>{profile.email}</Text>

      <TextInput
        style={styles.input}
        value={username}
        autoCapitalize="words"
        onChangeText={setUsername}
        placeholder="Name"
      />
      

      <Text style={styles.section}>Phone</Text>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phoneCode}
        onChangeText={setPhoneCode}
        placeholder="+359"
      />

      <TextInput
        style={styles.input}
        value={phone}
        keyboardType="numeric"
        onChangeText={setPhone}
        placeholder="Phone number"
      />

      
     <Text style={styles.section}>Shipping Address</Text>

      <TextInput
        style={styles.input}
        value={street}
        onChangeText={setStreet}
        placeholder="Street"
      />

      <TextInput
        style={styles.input}
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="numeric"
        placeholder="Postal Code"
      />

      <TextInput
        style={styles.input}
        value={city}
        autoCapitalize="words"
        onChangeText={setCity}
        placeholder="City"
      />

      <TextInput
        style={styles.input}
        value={country}
        autoCapitalize="words"
        onChangeText={setCountry}
        placeholder="Country"
      />

      <Button
        title="Use phone location"
        onPress={handlePickLocation}
      />

       <Text style={styles.section}>Order Summary</Text>

    {cartItems.map(item => (
      <View key={item.id} style={{marginTop:5}}>
        <Text>
          {item.furniture.title} x {item.quantity}
        </Text>
      </View>
    ))}

    <Text style={{fontWeight:"bold", marginTop:10}}>
      Total: ${totalPrice.toFixed(2)}
    </Text>

      
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