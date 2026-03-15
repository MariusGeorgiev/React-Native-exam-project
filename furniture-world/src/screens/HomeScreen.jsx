import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';
import usePullToRefresh from '../hooks/usePullToRefresh';
import { CATEGORIES } from '../data/categories';
import FurnitureCard from '../components/FurnitureCard';
import { useNavigation } from '@react-navigation/native';
import { fetchLatestFurniture } from '../services/furnitureService';

export default function HomeScreen() {
  const navigation = useNavigation();

  const SCREEN_WIDTH = Dimensions.get('window').width;

  const [latestFurniture, setLatestFurniture] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  

  const topCategories = CATEGORIES.slice(0, 4);

    const loadLatest = async () => {
    setLoadingLatest(true);
    try {
      const data = await fetchLatestFurniture();
      setLatestFurniture(data);
    } catch (error) {
      console.log('Error loading latest furniture:', error);
    } finally {
      setLoadingLatest(false);
    }
  };

   const { refreshing, onRefresh } = usePullToRefresh(loadLatest);

    useFocusEffect(
      useCallback(() => {
        loadLatest();
      }, [])
    );


  const handleCategoryPress = catId => {
    setSelectedCategory(catId === selectedCategory ? null : catId);
  };

  const handleSubcategoryPress = (cat, sub) => {
    navigation.navigate('FurnitureList', {
      categoryId: cat.id,
      categoryTitle: cat.title,
      subcategory: sub,
    });
  };

return (
  <FlatList
    data={[]} 
    keyExtractor={(_, index) => index.toString()}
    contentContainerStyle={{ paddingBottom: 0 }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    ListHeaderComponent={() => (
      <>
       
        <View style={styles.heroSection}>
          <Image source={require('../../assets/home.jpg')} style={styles.heroImage} />
      
        </View>

        
        
          <View style={styles.sectionCat}>
            <Text style={styles.sectionTitle}>Best Categories</Text>
            <View style={styles.categoriesGrid}>
              {topCategories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(cat.id)}
                >
                  <Text style={styles.categoryText}>{cat.title}</Text>
                  <Image
                    source={cat.image}  
                    style={styles.categoryImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>


      
        {selectedCategory && (
          <View style={styles.sectionSubCat}>
            <Text style={styles.sectionTitle}>
              Chose from {topCategories.find(cat => cat.id === selectedCategory)?.title} Subcategories
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
              {topCategories
                .find(cat => cat.id === selectedCategory)
                ?.subcategories.map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleSubcategoryPress(
                        topCategories.find(cat => cat.id === selectedCategory),
                        sub
                      )
                    }
                    style={styles.subcategoryButton}
                  >
                    <Text style={styles.subcategoryText}>{sub}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

       
        <View style={styles.sectionLatest}>
          <Text style={styles.sectionTitle}>Latest Furniture</Text>
          {loadingLatest ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={latestFurniture}
              horizontal
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              snapToInterval={SCREEN_WIDTH * 0.7 + 12}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <View style={{ width: SCREEN_WIDTH * 0.7, marginRight: 12 }}>
                  <FurnitureCard
                    furniture={item}
                    onPress={() =>
                      navigation.navigate('FurnitureDetails', { furnitureId: item.id })
                    }
                  />
                </View>
              )}
            />
          )}
        </View>
      </>
    )}
    ListEmptyComponent={null}
    renderItem={null}
  />
);

}

const styles = StyleSheet.create({
  heroSection: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 150,
   
  },
  sectionCat: {
    paddingTop: 10,
    //  backgroundColor: '#f3eded', 
  },
  sectionSubCat: {
    // backgroundColor: '#f3eded', 
  },
  sectionLatest: {
     paddingTop: 10,
    borderRadius: 0,
    //  backgroundColor: '#f3eded', 
  },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // categoriesRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },


  categoriesGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  // gap: 2, 
},
categoryCard: {
  width: '48%', 
  borderRadius: 8,
  overflow: 'hidden',
  alignItems: 'center',
  marginBottom: 5,
  paddingTop: 2,
  // backgroundColor: '#e4dada',
  color: 'red'
  // paddingVertical: 2,
},
categoryImage: {
  width: '100%',
  height: 130,
  borderRadius: 8,
  marginTop: 2,
  resizeMode: 'cover',
},
categoryText: {
  textAlign: 'center',
  fontSize: 14,
  fontWeight: '600',
},

  subcategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#879484',
    marginRight: 8,
    marginBottom: 8,
  },
  subcategoryText: {
    fontSize: 12,
    color: 'white',
  },
});