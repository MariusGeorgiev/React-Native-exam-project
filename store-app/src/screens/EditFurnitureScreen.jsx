import { useState, useEffect } from 'react';
import { Text, Alert, View, TextInput, Button, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
    //   keyboardVerticalOffset={5}
    >

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <Text style={styles.label}>Title:</Text>
            <TextInput
            placeholder="Enter furniture title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
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

       <View style={styles.CatAndSubCat}>
            <Text style={styles.label}>Category: </Text>

            <View style={styles.pickerWrapper}>
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
            </View>
        </View>


           <View style={styles.CatAndSubCat}>
            <Text style={styles.label}>Subcategory: </Text>

            {selectedCategory && (
                <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={subcategory}
                    onValueChange={setSubcategory}
                >
                    <Picker.Item label="Select subcategory" value="" />

                    {selectedCategory.subcategories.map(sub => (
                    <Picker.Item key={sub} label={sub} value={sub} />
                    ))}
                </Picker>
                </View>
            )}
        </View>



        <Text style={styles.label}>Price:</Text>
            <TextInput
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            />

        

        <Text style={styles.label}>Material:</Text>
        <TextInput
          placeholder="Wood, Metal"
          value={material}
          onChangeText={setMaterial}
          style={styles.input}
        />

        <Text style={styles.label}>Colors:</Text>
        <TextInput
          placeholder="Black, White"
          value={colors}
          onChangeText={setColors}
          style={styles.input}
        />


        <Text style={styles.label}>Description:</Text>
            <TextInput
            placeholder="Enter Description of the Furniture"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            />


        <View style={styles.row}>
        
            <View style={styles.dimensionRow}>
            <Text style={styles.label}>Width: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                placeholder="0"
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={styles.unit}>mm</Text>
            </View>

            <View style={styles.dimensionRow}>
            <Text style={styles.label}>Height: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                placeholder="0"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={styles.unit}>mm</Text>
            </View>

            <View style={styles.dimensionRow}>
            <Text style={styles.label}>Depth: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                placeholder="0"
                value={depth}
                onChangeText={setDepth}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={styles.unit}>mm</Text>
            </View>

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

  label: {
  marginTop: 10,
  marginBottom: 4,
  fontWeight: '600',
},

input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 10,
  marginBottom: 10,
},
dimensionRow: {
//   marginBottom: 12,
  flexDirection: 'row',
},
inputWithUnit: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  paddingHorizontal: 5,
},
dimInput: {
  flex: 1,
  paddingVertical: 8,
},

unit: {
  marginLeft: 8,
  color: "#555",
  fontWeight: "500",
},
CatAndSubCat: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},

pickerWrapper: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
}

});