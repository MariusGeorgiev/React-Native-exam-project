import { useEffect, useState } from 'react';
import { Alert, View, Text, Image, ActivityIndicator, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { getFurnitureById, deleteFurniture } from '../services/furnitureService';
import { toggleFavorite, addToCart } from "../services/authService";
import { useAuth } from '../contexts/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';

export default function FurnitureDetailsScreen({ route, navigation }) {
  const { furnitureId } = route.params;
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const { user, userProfile} = useAuth();

   useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getFurnitureById(furnitureId);
        setFurniture(data);
      } catch (error) {
        console.log('Error fetching furniture details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [furnitureId]);
  
  useEffect(() => {
  if (furniture && userProfile?.favorites) {
    setIsFavorite(userProfile.favorites.includes(furniture.id));
  }
}, [furniture, userProfile]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!furniture) return <Text>Furniture not found</Text>;

const handleDelete = () => {
  Alert.alert(
    "Delete furniture",
    "Are you sure you want to delete this item?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFurniture(furnitureId);
            navigation.goBack();
          } catch (error) {
            console.log("Delete error:", error);
          }
        }
      }
    ]
  );
};



const handleFavorite = async () => {
  if (!user) return alert("Please login to use favorites");

  try {
    const added = await toggleFavorite(user.uid, furniture.id);
    setIsFavorite(added);
    alert(added ? "Added to favorites!" : "Removed from favorites!");
  } catch (error) {
    console.log("Favorite error:", error);
  }
};

const handleAddToCart = async () => {
  if (!user) return;
  await addToCart(user.uid, furniture.id);
  alert("Added to cart!");
};

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


        {user && (
            <>
                {userProfile?.role === "user" && (
                  <>
                    <Button title="🛒 Add to Cart" onPress={handleAddToCart} />
                  </>
                )}

                {userProfile?.role === "admin" && (
                  
                  <View style={{ marginTop: 20 }}>
                    <Button
                      title="Edit"
                      onPress={() => navigation.navigate('EditFurniture', { furnitureId })}
                    />

                    <Button
                      title="Delete"
                      color="red"
                      onPress={handleDelete}
                    />
                  </View>
                  
                )}

                 <TouchableOpacity
                  style={styles.favoriteBtn}
                  onPress={handleFavorite}
                >
                  <FontAwesome
                    name={isFavorite ? "heart" : "heart-o"}
                    size={32}
                    color={isFavorite ? "red" : "gray"}
                  />
                </TouchableOpacity>
            </>
         )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  favoriteBtn: {
  marginTop: 16,
  alignSelf: 'flex-start',
},
});