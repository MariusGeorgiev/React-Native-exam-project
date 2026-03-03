import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CATEGORIES } from '../data/categories';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import FurnitureCard from '../components/FurnitureCard';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [latestFurniture, setLatestFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestFurniture() {
      try {
        const q = query(
          collection(db, 'furniture'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLatestFurniture(data);
      } catch (error) {
        console.log('Error fetching latest furniture:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestFurniture();
  }, []);

  const topCategories = CATEGORIES.slice(0, 4);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
     
      <View style={styles.heroSection}>
        <Image source={require('../../assets/icon.png')} style={styles.heroImage} />
        <Image source={require('../../assets/adaptive-icon.png')} style={styles.heroImage} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {topCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate('FurnitureList', {
                  categoryId: cat.id,
                  categoryTitle: cat.title,
                  subcategory: cat.subcategories[0] || '', 
                })
              }
            >
              <Image source={cat.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Furniture</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={latestFurniture}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <FurnitureCard
                furniture={item}
                onPress={() => navigation.navigate('FurnitureDetails', { furnitureId: item.id })}
              />
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heroImage: {
    width: '48%',
    height: 150,
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '23%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 12,
  },
});