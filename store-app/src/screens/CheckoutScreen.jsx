import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
  const [placingOrder, setPlacingOrder] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [locationUpdated, setLocationUpdated] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);

        setUsername(data.username || "");
        setEmail(data.email || "");
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


async function handlePickLocation() {
  try {
    const location = await pickLocation();
    if (!location) return;

    setStreet(location.street || "");
    setCity(location.city || "");
    setPostalCode(location.postalCode || "");
    setCountry(location.country || "");

    setLocationUpdated(true);
    setTimeout(() => setLocationUpdated(false), 3000);
  } catch (error) {
    alert("Unable to get location.");
  }
}


  const placeOrder = async () => {
    if (!profile || placingOrder) return;
    setPlacingOrder(true);

    const error = validateForm();
    if (error) {
      alert(error);
      setPlacingOrder(false);
      return;
    }

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.furniture.id,
        title: item.furniture.title,
        price: item.furniture.price,
        quantity: item.quantity,
      }));

      const orderData = {
        userId: user.uid,
        username,
        email,
        phoneCode,
        phone,
        address: { street, city, postalCode, country },
        items: orderItems,
        total: totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      await updateDoc(doc(db, "users", user.uid), {
        orders: arrayUnion(orderRef.id),
        cart: [],
      });

      if (setUserProfile) setUserProfile((prev) => ({ ...prev, cart: [] }));

      alert("Order placed successfully!");
      navigation.reset({ index: 0, routes: [{ name: "Orders" }] });
    } catch (err) {
      console.log(err);
      alert("Something went wrong while placing your order!");
    } finally {
      setPlacingOrder(false);
    }
  };

  const validateForm = () => {
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
  };


  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (!profile)
    return (
      <View style={styles.center}>
        <Text>No profile data found.</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
     
      <Text style={styles.section}>Customer Info</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>

     
      <View style={styles.row}>
        <View style={{ flex: 0.3 }}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            style={styles.input}
            value={phoneCode}
            onChangeText={setPhoneCode}
            keyboardType="phone-pad"
          />
        </View>
        <View style={{ flex: 0.7, marginLeft: 10 }}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.section}>Shipping Address</Text>

<View style={styles.row}>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>
        <View style={{ flex: 0.5, marginLeft: 10 }}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />
        </View>
      </View>


      <View style={styles.row}>
        <View style={{ flex: 0.3, }}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 0.7, marginLeft: 10 }}>
          <Text style={styles.label}>Street</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
          />
        </View>
      </View>

      {locationUpdated && (
        <Text style={{ color: "green", marginBottom: 8, textAlign: "center" }}>
          Location updated!
        </Text>
      )}


      <TouchableOpacity style={styles.locationBtn} onPress={handlePickLocation}>
        <Text style={styles.locationBtnText}>Use Phone Location</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Order Summary</Text>
      {cartItems.map((item) => (
        <Text key={item.id} style={styles.orderItem}>
          {item.furniture.title} x {item.quantity}
        </Text>
      ))}
      <Text style={styles.total}>Total: €{totalPrice}</Text>

      <TouchableOpacity
        style={styles.orderBtn}
        onPress={placeOrder}
        disabled={placingOrder}
      >
        <Text style={styles.orderBtnText}>
          {placingOrder ? "Placing order..." : "Place Order"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>Back to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  label: { fontSize: 14, marginBottom: 4, color: "#555", textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: 'center'
  },
  row: { flexDirection: "row", marginBottom: 12 },
  locationBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#879484",
    borderRadius: 6,
    alignItems: "center",
  },
  locationBtnText: { color: "#fff", fontWeight: "bold", },
  orderItem: { fontSize: 16, marginTop: 4 },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  orderBtn: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  orderBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#31737a",
    alignItems: "center",
  },
  backBtnText: { color: "#31737a", fontWeight: "bold", fontSize: 16 },
});