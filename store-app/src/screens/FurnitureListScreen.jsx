
import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import FurnitureCard from '../components/FurnitureCard';
import { useNavigation } from '@react-navigation/native';
import { fetchFurnitureByCategoryAndSub } from '../services/furnitureService';

export default function FurnitureListScreen({ route }) {

  const navigation = useNavigation();

  console.log('📝 route.params:', route.params); 
  const { categoryId, subcategory } = route.params;
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadFurniture() {
      if (!categoryId || !subcategory) return;
      const data = await fetchFurnitureByCategoryAndSub(categoryId, subcategory);
      setFurniture(data);
      setLoading(false); 
  }
  loadFurniture();
}, [categoryId, subcategory]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (furniture.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No furniture found in this category.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={furniture}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <FurnitureCard
        furniture={item}
        onPress={() => navigation.navigate('FurnitureDetails', { furnitureId: item.id })}
      />
    )}
    contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});