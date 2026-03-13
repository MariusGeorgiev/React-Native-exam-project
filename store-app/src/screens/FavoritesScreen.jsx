import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { getFurnitureById } from '../services/furnitureService';
import FurnitureCard from '../components/FurnitureCard';
import usePullToRefresh from '../hooks/usePullToRefresh';

export default function FavoritesScreen({ navigation }) {
  const { userProfile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFavorites() {
    if (!userProfile?.favorites?.length) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const items = await Promise.all(
        userProfile.favorites.map(async id => {
          try {
            return await getFurnitureById(id);
          } catch (error) {
            console.warn(`Furniture with id ${id} not found, skipping`);
            return null; 
          }
        })
      );
 
      const validItems = items.filter(item => item !== null);
      setFavorites(validItems);
    } catch (error) {
      console.log("Error fetching favorite items:", error);
    } finally {
      setLoading(false);
    }
  }

  const { refreshing, onRefresh } = usePullToRefresh(fetchFavorites);

  useEffect(() => {
    fetchFavorites();
  }, [userProfile?.favorites]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;


  return (
       <View style={styles.container}>
          <FlatList
            data={favorites}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <FurnitureCard
                furniture={item}
                onPress={() => navigation.navigate('FurnitureDetails', { furnitureId: item.id })}
              />
            )}

            ListHeaderComponent={favorites.length >= 1 ? () => (
              <Text style={styles.title}>All Favorites ({favorites.length})</Text>
            ) : null}
            
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>You currently have no favorites.</Text>
              </View>
            )}
            contentContainerStyle={favorites.length === 0 ? { flex: 1, justifyContent: 'center' } : undefined}
          />
        </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptyText: { fontSize: 22, color: '#555', textAlign: 'center' },
});