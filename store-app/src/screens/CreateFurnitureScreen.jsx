import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIES } from '../data/categories';

export default function AddFurnitureScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
const [subcategory, setSubcategory] = useState('');
  
  const selectedCategory = CATEGORIES.find(c => c.id === category);

  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [material, setMaterial] = useState('');
  const [colors, setColors] = useState('');

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');

  async function addFurnitureHandler() {
    try {
      await addDoc(collection(db, 'furniture'), {
        title,
        category,
        subcategory,
        price: Number(price),
        description,

        material: material.split(',').map(m => m.trim()),
        colors: colors.split(',').map(c => c.trim()),

        dimensions: {
          width: Number(width),
          height: Number(height),
          depth: Number(depth),
        },

        images: [],

        createdAt: serverTimestamp(),
      });

      setTitle('');
      setCategory('');
      setSubcategory('');
      setPrice('');
      setDescription('');
      setMaterial('');
      setColors('');
      setWidth('');
      setHeight('');
      setDepth('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <Picker
            selectedValue={category}
            onValueChange={(value) => {
                setCategory(value);
                setSubcategory('');
            }}
            >
            <Picker.Item label="Select category" value="" />
            {CATEGORIES.map(cat => (
                <Picker.Item key={cat.id} label={cat.title} value={cat.id} />
            ))}
        </Picker>
            {selectedCategory && (
        <Picker
            selectedValue={subcategory}
            onValueChange={setSubcategory}
        >
            <Picker.Item label="Select subcategory" value="" />
            {selectedCategory.subcategories.map(sub => (
            <Picker.Item key={sub} label={sub} value={sub} />
            ))}
        </Picker>
        )}
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />

      <TextInput
        placeholder="Material (e.g. Wood, Metal)"
        value={material}
        onChangeText={setMaterial}
      />

      <TextInput
        placeholder="Colors (e.g. Black, White)"
        value={colors}
        onChangeText={setColors}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Width"
          value={width}
          onChangeText={setWidth}
          keyboardType="numeric"
          style={styles.dimInput}
        />
        <TextInput
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.dimInput}
        />
        <TextInput
          placeholder="Depth"
          value={depth}
          onChangeText={setDepth}
          keyboardType="numeric"
          style={styles.dimInput}
        />
      </View>

      <Button title="Add Furniture" onPress={addFurnitureHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dimInput: {
    flex: 1,
  },
});