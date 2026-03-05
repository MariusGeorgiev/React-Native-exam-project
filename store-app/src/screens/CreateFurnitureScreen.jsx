import { useState } from 'react';
import { Alert, View, TextInput, Button, StyleSheet, Image, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIES } from '../data/categories';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../firebase/storage';


export default function CreateFurnitureScreen() {

  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState(null);

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


const pickImage = async () => {

  const status = await ImagePicker.getMediaLibraryPermissionsAsync();
  console.log(status);


    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
      Alert.alert("Permission required to access photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }

  }

const takePhoto = async () => {

  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert("Permission required to use camera.");
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

  async function addFurnitureHandler() {
    try {

         let imageUrl = null;

            if (imageUri) {
            imageUrl = await uploadFile(imageUri, 'furniture');
            }

        const newFurniture = {
            title,
            images: imageUrl ? [imageUrl] : [],
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
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'furniture'), newFurniture);

        console.log('✅ Furniture added successfully!');
        console.log('📄 Document ID:', docRef.id);
        console.log('🖼 Image URL:', imageUrl);
        console.log('📦 Data:', newFurniture);

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
      setImageUri(null);
    } catch (error) {
      console.log('Error adding furniture:', error);
    }
  }


    // if (!status) {
    //     return <ActivityIndicator />;
    // }

    // if (!status.granted) {
    //     return (
    //         <Button
    //             title="Grant Photo Permission"
    //             onPress={requestPermission}
    //         />
    //     );
    // }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
    <ScrollView  style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Select Image" onPress={pickImage} />

              <Button title="Take Photo" onPress={takePhoto} />

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 200, height: 200, marginTop: 10 }}
                />
              )}
        </View>

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

      
        <View style={{ marginBottom: 50 }}>
        <Button title="Add Furniture" onPress={addFurnitureHandler} />
        </View>

    </ScrollView >
    </KeyboardAvoidingView>
         
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