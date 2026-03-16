import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function FurnitureCard({ furniture, onPress }) {

  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>

      <View style={styles.imageWrapper}>
        {furniture.images?.[0] && (
          <>
            <Image
              source={{ uri: furniture.images[0] }}
              style={styles.image}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />

            {imageLoading && (
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="#555" />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {furniture.title}
        </Text>

        <Text style={styles.price}>€{furniture.price.toLocaleString('fr-FR')}</Text>

        <Text style={styles.desc} numberOfLines={2}>
          {furniture.description}
        </Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f2f1f9',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  imageWrapper: {
  width: 100,
  height: 100,
  borderRadius: 6,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
},

loader: {
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
},
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#555',
    marginTop: 4,
  },
  desc: {
    color: '#777',
    marginTop: 2,
    fontSize: 12,
  },
});