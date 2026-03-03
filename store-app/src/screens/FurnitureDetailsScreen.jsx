import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function FurnitureDetailsScreen({ route }) {
  const { furnitureId } = route.params;
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFurniture() {
      try {
        const docRef = doc(db, 'furniture', furnitureId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFurniture({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such furniture!');
        }
      } catch (error) {
        console.log('Error fetching furniture details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFurniture();
  }, [furnitureId]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!furniture) return <Text>Furniture not found</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      
      <Text style={styles.title}>{furniture.title}</Text>
      
      <Text>Category: {furniture.category}</Text>
      <Text>Subcategory: {furniture.subcategory}</Text>
     
      <Text>Material: {furniture.material.join(', ')}</Text>
      <Text>Colors: {furniture.colors.join(', ')}</Text>
      
        {furniture.images && furniture.images[0] && (
        <Image source={{ uri: furniture.images[0] }} style={{ width: '100%', height: 250, borderRadius: 12, marginBottom: 16 }} />
      )}
      <Text>Dimensions: W {furniture.dimensions.width} × H {furniture.dimensions.height} × D {furniture.dimensions.depth}</Text>
        <Text>Price: ${furniture.price}</Text>
        <Text>Description: {furniture.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});