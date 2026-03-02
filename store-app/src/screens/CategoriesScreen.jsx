import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'living', title: 'Living Room' },
  { id: 'bedroom', title: 'Bedroom' },
  { id: 'kitchen', title: 'Kitchen' },
  { id: 'bathroom', title: 'Bathroom' },
  { id: 'office', title: 'Office' },
  { id: 'kids', title: 'Kids Room' },
  { id: 'hallway', title: 'Hallway' },
  { id: 'outdoor', title: 'Garden & Outdoor' },
  { id: 'storage', title: 'Storage & Shelving' },
  { id: 'decor', title: 'Home Decor' },
  { id: 'lighting', title: 'Lighting' },
  { id: 'pet', title: 'Pet Furniture' },
];

export default function CategoriesScreen({ navigation }) {
  return (
    <View >
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FurnitureList', {
                categoryId: item.id,
                categoryTitle: item.title,
              })
            }
            style={{
              padding: 16,
              marginBottom: 12,
              backgroundColor: '#eee',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}