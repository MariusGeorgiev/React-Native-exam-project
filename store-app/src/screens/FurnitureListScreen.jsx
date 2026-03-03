
import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import FurnitureCard from '../components/FurnitureCard';
import { useNavigation } from '@react-navigation/native';

export default function FurnitureListScreen({ route }) {

  const navigation = useNavigation();

  console.log('📝 route.params:', route.params); 
  const { categoryId, subcategory } = route.params;
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFurniture() {
      try {
        const q = query(
          collection(db, 'furniture'),
          where('category', '==', categoryId),
          where('subcategory', '==', subcategory)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFurniture(data);
      } catch (error) {
        console.log('Error fetching furniture:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFurniture();
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