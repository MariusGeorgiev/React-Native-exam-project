import { useState, useEffect } from 'react';
import { Alert, View, TextInput, Button, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

import { CATEGORIES } from '../data/categories';
import { uploadFile } from '../firebase/storage';
import { getFurnitureById, updateFurniture } from '../services/furnitureService';

export default function EditFurnitureScreen({ route, navigation }) {

  const { furnitureId } = route.params;

  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [material, setMaterial] = useState('');
  const [colors, setColors] = useState('');

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');

  const selectedCategory = CATEGORIES.find(c => c.id === category);

  useEffect(() => {

    async function loadFurniture() {

      const data = await getFurnitureById(furnitureId);

      setTitle(data.title);
      setCategory(data.category);
      setSubcategory(data.subcategory);

      setPrice(String(data.price));
      setDescription(data.description);

      setMaterial(data.material.join(', '));
      setColors(data.colors.join(', '));

      setWidth(String(data.dimensions.width));
      setHeight(String(data.dimensions.height));
      setDepth(String(data.dimensions.depth));

      if (data.images?.[0]) {
        setImageUri(data.images[0]);
      }
    }

    loadFurniture();

  }, [furnitureId]);



  const pickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required to access photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


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



  async function updateFurnitureHandler() {

    try {

      let imageUrl = imageUri;

      if (imageUri && imageUri.startsWith('file')) {
        imageUrl = await uploadFile(imageUri, 'furniture');
      }

      const updatedFurniture = {

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

      };

      await updateFurniture(furnitureId, updatedFurniture);

      Alert.alert("Success", "Furniture updated successfully");

      navigation.goBack();

    } catch (error) {

      console.log("Error updating furniture:", error);

      Alert.alert("Error", "Failed to update furniture");
    }
  }



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>

          <Button title="Select Image" onPress={pickImage} />

          <Button title="Take Photo" onPress={takePhoto} />

        </View>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginTop: 10 }}
          />
        )}

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


        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          placeholder="Material (Wood, Metal)"
          value={material}
          onChangeText={setMaterial}
        />

        <TextInput
          placeholder="Colors (Black, White)"
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

          <Button
            title="Update Furniture"
            onPress={updateFurnitureHandler}
          />

        </View>

      </ScrollView>

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