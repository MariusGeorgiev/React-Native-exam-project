import { View, Text, Image, StyleSheet } from 'react-native';

export default function FurnitureCard({ furniture }) {
  return (
    <View style={styles.card}>
      {furniture.images?.[0] && (
        <Image source={{ uri: furniture.images[0] }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{furniture.title}</Text>
        <Text style={styles.price}>${furniture.price.toFixed(2)}</Text>
        <Text style={styles.desc} numberOfLines={2}>{furniture.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
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