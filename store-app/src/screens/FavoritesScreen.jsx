import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { getFurnitureById } from '../services/furnitureService';

export default function FavoritesScreen({ navigation }) {
  const { userProfile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!userProfile?.favorites?.length) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(
          userProfile.favorites.map(id => getFurnitureById(id))
        );
        setFavorites(items);
      } catch (error) {
        console.log("Error fetching favorite items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [userProfile?.favorites]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!favorites.length) return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text>You currently have no favorites.</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('FurnitureDetails', { furnitureId: item.id })}
    >
      {item.images?.[0] && <Image source={{ uri: item.images[0] }} style={styles.image} />}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text>Price: ${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  itemContainer: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
});