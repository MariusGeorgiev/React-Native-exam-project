
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
    <FlatList
      data={furniture}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
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
        <View style={styles.center}>
          <Text>No furniture found in this category.</Text>
        </View>
      )}

    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});