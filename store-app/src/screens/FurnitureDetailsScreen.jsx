import { useEffect, useState, useCallback  } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, Image, ActivityIndicator, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { getFurnitureById, deleteFurniture } from '../services/furnitureService';
import { useAuth } from '../contexts/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';

export default function FurnitureDetailsScreen({ route, navigation }) {
  const { furnitureId } = route.params;
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { user, userProfile, toggleFavorite, addToCart} = useAuth();


   useFocusEffect(
  useCallback(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const data = await getFurnitureById(furnitureId);
        setFurniture(data);
      } catch (error) {
        console.log("Error fetching furniture details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [furnitureId])
);

  

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (!furniture) return <Text>Furniture not found</Text>;

const handleIncrement = () => setQuantity(prev => prev + 1);

const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

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


const handleAddToCart = async () => {
  if (!user) return alert("Please login");

  await addToCart(furniture.id, quantity);

  const addedQty = quantity; 
  setQuantity(1); 

  alert(`Added ${addedQty} item${addedQty > 1 ? "s" : ""} to cart`);
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
        <Text>Price: €{furniture.price}</Text>
        <Text>Description: {furniture.description}</Text>


        {user && (
            <>
                
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <TouchableOpacity onPress={handleDecrement} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={{ marginHorizontal: 12 }}>{quantity}</Text>

                    <TouchableOpacity onPress={handleIncrement} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartBtn}>
                      <Text style={styles.addToCartBtnText}>🛒 Add to Cart ({quantity})</Text>
                    </TouchableOpacity>
                  </View>
                

                {userProfile?.role === "admin" && (
                  
                  <View style={{ marginTop: 20 }}>
                    
                  <Button
                    title="Edit"
                    onPress={() => navigation.navigate("EditFurniture", {
                      furnitureId,
                      onUpdate: async () => {
                        const data = await getFurnitureById(furnitureId);
                        setFurniture(data); 
                      },
                    })}
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
            onPress={() => toggleFavorite(furniture.id)}
          >
            <FontAwesome
              name={userProfile?.favorites?.includes(furniture.id) ? "heart" : "heart-o"}
              size={32}
              color={userProfile?.favorites?.includes(furniture.id) ? "red" : "gray"}
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
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartBtn: {
    marginLeft: 12,
    backgroundColor: '#b09999',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addToCartBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});