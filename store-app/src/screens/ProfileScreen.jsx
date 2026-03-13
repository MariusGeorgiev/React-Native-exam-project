import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { getUserProfile, updateUserProfile } from "../services/authService";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { uploadFile } from "../firebase/storage";
import { Picker } from '@react-native-picker/picker';
import { formatDate } from "../utils/formatDateUtils";

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

    async function takePicture() {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const uploaded = await uploadFile(uri, "profileImages");
        setEditData(prev => ({ ...prev, image: uploaded }));
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

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.BestForNavigation });
        const address = await Location.reverseGeocodeAsync(location.coords);

        console.log("address:", address)
        const street = address[0].street;
        const streetNumber = address[0].streetNumber || "";

        let streetAndNumber = ""
        if (street !== null && streetNumber === null) {
            streetAndNumber = street
        }
        if (street === null && streetNumber === null) {
            streetAndNumber = null
        }
        if (street && streetNumber) {
            streetAndNumber = `${street} ${streetNumber}`;
        }
       
        let formattedAddress = address[0].formattedAddress || "";
        if (formattedAddress) {

          const toRemove = [address[0].postalCode, address[0].city, address[0].country].filter(Boolean);
          toRemove.forEach(part => {
            const regex = new RegExp(`\\b${part}\\b`, "gi");
            formattedAddress = formattedAddress.replace(regex, "");
          });

          formattedAddress = formattedAddress
            .split(",")          
            .map(p => p.trim())  
            .filter(Boolean)     
            .join(", ");     
          
        }

        const streetOrFormatAddress = streetAndNumber || formattedAddress || "";

        console.log("streetAndNumber:", streetAndNumber)
        console.log("formattedAddress:", formattedAddress.split(",")[0])
        console.log("formattedAddress:", formattedAddress.split(",")[1])
        console.log("formattedAddress:", formattedAddress.split(",")[2])
        console.log("formattedAddress:", formattedAddress.split(",")[3])


        setEditData(prev => ({
          ...prev,
          street: streetOrFormatAddress,
          city: address[0].city,
          country: address[0].country,
          postalCode: address[0].postalCode,
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
  
       
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <View style={[styles.nameAndRoleGroup, {marginBottom: 5}]}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Role:</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{profile.role}</Text>
            </View>
          <Image
            source={{
              uri:
                editData.image ||
                "https://thumbs.dreamstime.com/b/simple-silhouette-profile-photo-art-simple-silhouette-profile-photo-art-240483689.jpg",
            }}
            style={styles.avatar}
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <TouchableOpacity onPress={pickImage}>
              <Text style={{ color: "blue" }}>Pick from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture}>
              <Text style={{ color: "blue" }}>Take a Picture</Text>
            </TouchableOpacity>
          </View>
        </View>


          <View style={styles.nameAndRole}>

            <View style={[styles.nameAndRoleGroup, {flexDirection:'column'}]}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Email:</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{profile.email}</Text>
            </View>

            

            <View style={[styles.nameAndRoleGroup, {flexDirection:'column'}]}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Crated At:</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>
                {formatDate(profile.createdAt)}
              </Text>
            </View>

          </View>


      

  
        <View style={[styles.genderAndNameGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>

          <View style={[styles.gender, {flex: 0.25} ]}>
              <Text style={styles.label}>Gender:</Text>
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
          </View>

         <View style={[styles.username, {flex: 0.62} ]}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.inputName}
              value={editData.username}
              onChangeText={(text) =>
                setEditData(prev => ({ ...prev, username: text }))
              }
            />
          </View>

          

      </View>


          <View style={{flex: 1, flexDirection: 'row', gap: 25, justifyContent: 'center',}}>
            <View style={{ flex: 0.15, fontSize: 16 }}> 
                <Text style={styles.label}>Age:</Text>
                <TextInput
                  style={styles.ageInput}
                  keyboardType="numeric"
                  maxLength={3}
                  value={editData.age}
                  onChangeText={(text) =>
                    setEditData(prev => ({ ...prev, age: text }))
                  }
                />
            </View>

            
              <View style={{flex: 0.85, flexDirection: 'row',}}>
              
                <View >
                    <Text style={styles.label}>Code:</Text>
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
                </View>

                <View>
                  <Text style={styles.label}>Number:</Text>
                  <TextInput
                    style={[styles.phoneInput, ]}
                    value={editData.phone}
                    keyboardType="numeric"
                    maxLength={12}
                    placeholder="Phone number"
                    onChangeText={(text) =>
                      setEditData(prev => ({ ...prev, phone: text }))
                    }
                  />
                </View>
                
              </View>
            
          </View>

        
        <Text style={styles.label}>Address</Text>
          
          <View style={[styles.addressRow, { gap: 5 }]}>

            <View style={[styles.addressColumn, { flex: 0.5 }]}>
            <Text style={styles.label}>City:</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="City"
              value={editData.city}
              onChangeText={(text) =>
                setEditData(prev => ({ ...prev, city: text }))
              }
            />
            </View>
            
            <View style={[styles.addressColumn, { flex: 0.5 }]}>
            <Text style={styles.label}>Country:</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Country"
              value={editData.country}
              onChangeText={(text) =>
                setEditData(prev => ({ ...prev, country: text }))
              }
            />
            </View>
          </View>

      
          <View style={[styles.addressRow, { gap: 5 }]}>

            <View style={[styles.addressColumn, { flex: 0.25 }]}>
            <Text style={styles.label}>Postal Code:</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Postal Code"
              keyboardType="numeric"
              maxLength={9}
              value={editData.postalCode}
              onChangeText={(text) =>
                setEditData(prev => ({ ...prev, postalCode: text }))
              }
            />
            </View>
            
            <View style={[styles.addressColumn, { flex: 0.75 }]}>
            <Text style={styles.label}>Street:</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Street"
              value={editData.street}
              onChangeText={(text) =>
                setEditData(prev => ({ ...prev, street: text }))
              }
            />
            </View>
          </View>

          

              <TouchableOpacity style={styles.locationBtn} onPress={pickLocation}>
                <Text style={{ color: "white" }}>Use Current Location</Text>
              </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
             <Text style={{ color: "white" }}>Save Changes</Text>
          </TouchableOpacity>

</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontWeight: "bold", marginTop: 16, textAlign: "center" },
  value: { fontSize: 16, marginTop: 4 },
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
  marginTop: 4,
  width: 120,
},
phoneRow: {
  flexDirection: "row",
  // justifyContent: 'center',
  // alignItems: "center",
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
  fontSize: 16,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 12,
  paddingRight: 12,
  minWidth: 125,
},
locationBtn: {
  marginTop: 10,
  backgroundColor: "#444",
  padding: 10,
  borderRadius: 6,
  alignItems: "center"
},
addressRow: {
  flexDirection: "row",
  justifyContent: "space-evenly",
  
},
addressInput: {
  flex: 1,
  // minWidth: 120,
  // marginRight: 8
},
nameAndRole: {
  fontSize: 18,
  flexDirection: "row",
  justifyContent: 'space-around',

},
nameAndRoleGroup:{ 
  flexDirection: 'row',
  gap: 3,
  

},
// ageAndGenderGroup: {
//   flexDirection: 'row',
//   justifyContent: "space-evenly",
// },
ageInput: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  // marginTop: 4,
  paddingTop: 17,
  paddingBottom: 17,
  paddingLeft: 12, 
  paddingRight: 12, 
},
inputName: {
borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  marginTop: 4,
  paddingTop: 17,
  paddingBottom: 17,
  paddingLeft: 12, 
  paddingRight: 12, 
  
},
avatar: {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 12
},



});