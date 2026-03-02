import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { CATEGORIES } from '../data/categories';


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