import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const CATEGORIES = [
  { 
    id: 'living', 
    title: 'Living Room',
    subcategories: ['Sofas', 'Chairs', 'Coffee Tables', 'TV Stands', 'Shelves']
  },
  { 
    id: 'bedroom', 
    title: 'Bedroom',
    subcategories: ['Beds', 'Wardrobes', 'Bedroom Sets', 'Nightstands', 'Dressers']
  },
  { 
    id: 'kitchen', 
    title: 'Kitchen',
    subcategories: ['Cabinets', 'Kitchen Islands', 'Dining Sets', 'Bar Stools', 'Pantry Storage']
  },
  { 
    id: 'bathroom', 
    title: 'Bathroom',
    subcategories: ['Cabinets', 'Mirrors', 'Shelving', 'Bathroom Sets', 'Vanities']
  },
  { 
    id: 'office', 
    title: 'Office',
    subcategories: ['Office Chairs', 'Office Tables', 'Desks', 'Shelves', 'Bookcases']
  },
  { 
    id: 'kids', 
    title: 'Kids Room',
    subcategories: ['Beds', 'Toy Storage', 'Study Desks', 'Wardrobes', 'Play Tables']
  },
  { 
    id: 'hallway', 
    title: 'Hallway',
    subcategories: ['Shoe Cabinets', 'Coat Racks', 'Benches', 'Mirrors', 'Console Tables']
  },
  { 
    id: 'outdoor', 
    title: 'Garden & Outdoor',
    subcategories: ['Patio Sets', 'Lounge Chairs', 'Garden Tables', 'Outdoor Storage', 'Umbrellas']
  },
  { 
    id: 'storage', 
    title: 'Storage & Shelving',
    subcategories: ['Shelves', 'Cabinets', 'Boxes & Bins', 'Wardrobes', 'Closet Organizers']
  },
  { 
    id: 'decor', 
    title: 'Home Decor',
    subcategories: ['Rugs', 'Vases', 'Frames', 'Wall Art', 'Mirrors']
  },
  { 
    id: 'lighting', 
    title: 'Lighting',
    subcategories: ['Table Lamps', 'Ceiling Lights', 'Floor Lamps', 'Wall Lights', 'LED Strips']
  },
  { 
    id: 'pet', 
    title: 'Pet Furniture',
    subcategories: ['Cat Trees', 'Dog Beds', 'Litter Boxes', 'Pet Couches', 'Pet Shelves']
  },
];

export default function CategoriesScreen({ navigation }) {

  const [openCategory, setOpenCategory] = useState(null);

  return (
    <View >
   <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => setOpenCategory(openCategory === item.id ? null : item.id)}
              style={{ padding: 16, backgroundColor: '#eee', borderRadius: 8 }}
            >
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
            </TouchableOpacity>

            {/* Dropdown for subcategories */}
            {openCategory === item.id && (
              <View style={{ marginTop: 8, paddingLeft: 16 }}>
                {item.subcategories.map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate('FurnitureList', {
                        categoryId: item.id,
                        categoryTitle: item.title,
                        subcategory: sub,
                      })
                    }
                    style={{ padding: 8 }}
                  >
                    <Text>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}