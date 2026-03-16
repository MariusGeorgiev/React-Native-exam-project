import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useRef  } from 'react';
import { CATEGORIES } from '../data/categories';


export default function CategoriesScreen({ navigation }) {

  const [openCategory, setOpenCategory] = useState(null);
  const flatListRef = useRef(null);

  return (
    <View >
   <FlatList
        ref={flatListRef}
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => {
                const newOpenCategory = openCategory === item.id ? null : item.id;
                setOpenCategory(newOpenCategory);

                if (newOpenCategory && flatListRef.current) {
                  const index = CATEGORIES.findIndex(cat => cat.id === item.id);
                  flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.2 });
                }
              }}
              style={{ padding: 16, backgroundColor: '#879484', borderRadius: 8, }}
            >
              <Text style={{ fontSize: 16, color: 'white', }}>{item.title}</Text>
          </TouchableOpacity>

            {openCategory === item.id && (
              <View style={{ marginTop: 8, paddingLeft: 16,  }}>
                {item.subcategories.map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate('FurnitureList', {
                        categoryId: item.title,
                        categoryTitle: item.title,
                        subcategory: sub,
                      })
                    }
                    style={{ padding: 8,  }}
                  >
                    <Text style={{color: 'white', padding: 8, borderRadius: 8, backgroundColor: '#879484', textAlign: 'center'}}>{sub}</Text>
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