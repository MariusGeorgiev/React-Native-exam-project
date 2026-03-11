import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { getUserProfile, updateUserProfile } from "../services/authService";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { uploadFile } from "../firebase/storage";
import { Picker } from '@react-native-picker/picker';


export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});

    useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

    useEffect(() => {
      if (profile) {
        setEditData({
          image: profile.image || null,
          username: profile.username || "",
          gender: profile.gender || "",
          age: profile.age?.toString() || "",
          phone: profile.phone || "",
          phoneCode: profile.phoneCode || "+359",
  
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          postalCode: profile.address?.postalCode || "",
          country: profile.address?.country || "",
        });
      }
    }, [profile]);

      async function pickImage() {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        const uploaded = await uploadFile(uri, "profileImages");

        setEditData(prev => ({
          ...prev,
          image: uploaded
        }));
      }
    }


    async function handleSave() {
      try {
        await updateUserProfile(user.uid, {
          image: editData.image,
          username: editData.username,
          gender: editData.gender,
          age: Number(editData.age),
          phone: editData.phone,
          phoneCode: editData.phoneCode,
           address: {
              street: editData.street,
              city: editData.city,
              postalCode: editData.postalCode,
              country: editData.country,
              latitude: editData.latitude || null,
              longitude: editData.longitude || null
            }
          
        });

        alert("Profile updated!");
      } catch (err) {
        alert("Error updating profile");
      }
    }

      async function pickLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        setEditData(prev => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));

        alert("Location saved!");
      }

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (!profile)
    return (
      <View style={styles.center}>
        <Text>No profile information found.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
  
        <Image
          source={{
            uri:
              editData.image ||
              "https://thumbs.dreamstime.com/b/simple-silhouette-profile-photo-art-simple-silhouette-profile-photo-art-240483689.jpg",
          }}
          style={styles.avatar}
        />

        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: "blue" }}>Change picture</Text>
        </TouchableOpacity>


        <Text style={styles.label}>Email:</Text>
  <Text style={styles.value}>{profile.email}</Text>

  <Text style={styles.label}>Role:</Text>
  <Text style={styles.value}>{profile.role}</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={editData.username}
        onChangeText={(text) =>
          setEditData(prev => ({ ...prev, username: text }))
        }
      />

  

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={editData.gender}
          onValueChange={(value) =>
            setEditData(prev => ({ ...prev, gender: value }))
          }
        >
          <Picker.Item label="Select gender..." value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={editData.age}
        onChangeText={(text) =>
          setEditData(prev => ({ ...prev, age: text }))
        }
      />

        <Text style={styles.label}>Phone</Text>
        <View style={styles.phoneRow}>

          <View style={styles.phoneCode}>
            <Picker
              selectedValue={editData.phoneCode}
              onValueChange={(value) =>
                setEditData(prev => ({ ...prev, phoneCode: value }))
              }
            >
              <Picker.Item label="+359 (BG)" value="+359" />
              <Picker.Item label="+1 (US)" value="+1" />
              <Picker.Item label="+44 (UK)" value="+44" />
              <Picker.Item label="+49 (DE)" value="+49" />
              <Picker.Item label="+33 (FR)" value="+33" />
              <Picker.Item label="+39 (IT)" value="+39" />
              <Picker.Item label="+34 (ES)" value="+34" />
              <Picker.Item label="+31 (NL)" value="+31" />
              <Picker.Item label="+32 (BE)" value="+32" />
              <Picker.Item label="+40 (RO)" value="+40" />
            </Picker>
          </View>

          <TextInput
            style={styles.phoneInput}
            value={editData.phone}
            keyboardType="numeric"
            maxLength={15}
            placeholder="Phone number"
            onChangeText={(text) =>
              setEditData(prev => ({ ...prev, phone: text }))
            }
          />
        </View>

        <Text style={styles.label}>Address</Text>

            <TextInput
            style={styles.input}
            placeholder="City"
            value={editData.city}
            onChangeText={(text) =>
              setEditData(prev => ({ ...prev, city: text }))
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Country"
            value={editData.country}
            onChangeText={(text) =>
              setEditData(prev => ({ ...prev, country: text }))
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Street"
            value={editData.street}
            onChangeText={(text) =>
              setEditData(prev => ({ ...prev, street: text }))
            }
          />

          

          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            keyboardType="numeric"
            value={editData.postalCode}
            onChangeText={(text) =>
              setEditData(prev => ({ ...prev, postalCode: text }))
            }
          />

          

              <TouchableOpacity style={styles.locationBtn} onPress={pickLocation}>
                <Text style={{ color: "white" }}>Use Current Location</Text>
              </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
      <Text style={{ color: "white" }}>Save Changes</Text>
    </TouchableOpacity>

  <Text style={styles.label}>Orders:</Text>
  <Text style={styles.value}>{profile.orders?.length || 0}</Text>

  <Text style={styles.label}>Favorites:</Text>
  <Text style={styles.value}>{profile.favorites?.length || 0}</Text>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontWeight: "bold", marginTop: 16 },
  value: { fontSize: 16, marginTop: 4 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  input: {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  borderRadius: 6,
  marginTop: 4
},
saveBtn: {
  marginTop: 24,
  backgroundColor: "#333",
  padding: 12,
  borderRadius: 8,
  alignItems: "center"
},
pickerWrapper: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  marginTop: 4
},
phoneRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4
},

phoneCode: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  width: 130,
  marginRight: 8
},

phoneInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 8
},
locationBtn: {
  marginTop: 10,
  backgroundColor: "#444",
  padding: 10,
  borderRadius: 6,
  alignItems: "center"
},
});