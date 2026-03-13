
import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, } from 'react-native';
import FurnitureCard from '../components/FurnitureCard';
import { useNavigation } from '@react-navigation/native';
import { fetchFurnitureByCategoryAndSub } from '../services/furnitureService';
import usePullToRefresh from '../hooks/usePullToRefresh';

export default function FurnitureListScreen({ route }) {

  const navigation = useNavigation();

  console.log('📝 route.params:', route.params); 
  const { categoryId, subcategory } = route.params;
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFurniture() {
  if (!categoryId || !subcategory) return;
  setLoading(true);
  try {
    const data = await fetchFurnitureByCategoryAndSub(categoryId, subcategory);
    setFurniture(data);
  } catch (err) {
    console.log('Error fetching furniture:', err);
    setFurniture([]);
  } finally {
    setLoading(false);
  }
}

  const { refreshing, onRefresh } = usePullToRefresh(loadFurniture);

  useEffect(() => {
  loadFurniture();
}, [categoryId, subcategory]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
      <View style={styles.container}>
        <FlatList
          data={furniture}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <FurnitureCard
              furniture={item}
              onPress={() =>
                navigation.navigate('FurnitureDetails', { furnitureId: item.id })
              }
            />
          )}
          
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No furniture found in this category.</Text>
            </View>
          )}
            contentContainerStyle={furniture.length === 0 ? { flex: 1, justifyContent: 'center' } : undefined}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptyText: { fontSize: 22, color: '#555', textAlign: 'center' },
});