import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { getUserProfile } from "../services/authService";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
            uri: profile.image || "https://thumbs.dreamstime.com/b/simple-silhouette-profile-photo-art-simple-silhouette-profile-photo-art-240483689.jpg", // default image
        }}
        style={styles.avatar}
        />

  <Text style={styles.label}>Username:</Text>
  <Text style={styles.value}>{profile.username}</Text>

  <Text style={styles.label}>Email:</Text>
  <Text style={styles.value}>{profile.email}</Text>

  <Text style={styles.label}>Role:</Text>
  <Text style={styles.value}>{profile.role}</Text>

  <Text style={styles.label}>Gender:</Text>
  <Text style={styles.value}>{profile.gender || "-"}</Text>

  <Text style={styles.label}>Age:</Text>
  <Text style={styles.value}>{profile.age || "-"}</Text>

  <Text style={styles.label}>Phone:</Text>
  <Text style={styles.value}>{profile.phone || "-"}</Text>

  <Text style={styles.label}>Address:</Text>
  <Text style={styles.value}>
    {profile.address
      ? `${profile.address.street}, ${profile.address.postalCode}, ${profile.address.city}, ${profile.address.country}`
      : "-"}
  </Text>

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
});