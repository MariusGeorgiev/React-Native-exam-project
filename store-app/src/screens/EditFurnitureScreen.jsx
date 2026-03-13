import { useState, useEffect } from 'react';
import { Text, Alert, View, TextInput, Button, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIES } from '../data/categories';
import { getFurnitureById, updateFurniture } from '../services/furnitureService';
import { pickImageAndUpload, takePhotoAndUpload } from "../services/pickerService";

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


const handlePickImage = async () => {
  try {
    const url = await pickImageAndUpload(`furniture/${furnitureId}`);
    if (url) {
      setImageUri(url); 
    }
  } catch (err) {
    console.log("Error picking image:", err);
    alert("Failed to pick image");
  }
};


const handleTakePhoto = async () => {
  try {
    const url = await takePhotoAndUpload(`furniture/${furnitureId}`);
    if (url) {
      setImageUri(url); 
    }
  } catch (err) {
    console.log("Error taking photo:", err);
    alert("Failed to take photo");
  }
};

 async function updateFurnitureHandler() {

  if (!title.trim() || title.length < 3 || title.length > 100) {
    return Alert.alert("Validation Error", "Title must be 3-100 characters.");
  }

  if (!category) return Alert.alert("Validation Error", "Please select a category.");
  if (!subcategory) return Alert.alert("Validation Error", "Please select a subcategory.");

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return Alert.alert("Validation Error", "Price must be a positive number.");
  }

   if (!material.trim() || material.length < 3 || material.length > 50) {
    return Alert.alert("Validation Error", "Material must be 3-50 characters.");
  }

  if (!colors.trim() || colors.length < 3 || colors.length > 50) {
    return Alert.alert("Validation Error", "Colors must be 3-50 characters.");
  }

  const widthNum = Number(width);
  const heightNum = Number(height);
  const depthNum = Number(depth);

  if ([widthNum, heightNum, depthNum].some(v => isNaN(v) || v <= 0)) {
    return Alert.alert("Validation Error", "Dimensions must be positive numbers.");
  }

  if (!description.trim() || description.length < 10 || description.length > 500) {
    return Alert.alert("Validation Error", "Description must be 10-500 characters.");
  }

  
  if (!imageUri) {
    const proceed = await new Promise((resolve) => {
      Alert.alert(
        "No image selected",
        "You did not select an image. Do you want to continue?",
        [
          { text: "Cancel", onPress: () => resolve(false) },
          { text: "Continue", onPress: () => resolve(true) },
        ]
      );
    });
    if (!proceed) return;
  }

  // Prepare updated furniture
  try {
    const updatedFurniture = {
      title,
      images: imageUri ? [imageUri] : [],
      category,
      subcategory,
      price: priceNum,
      description,
      material: material.split(',').map(m => m.trim()),
      colors: colors.split(',').map(c => c.trim()),
      dimensions: { width: widthNum, height: heightNum, depth: depthNum },
    };

    await updateFurniture(furnitureId, updatedFurniture);

    Alert.alert("Success", "Furniture updated successfully");
    
    if (route.params?.onUpdate) {
        await route.params.onUpdate();
      }
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
            style={[styles.input, styles.titleInput]}
            multiline
            numberOfLines={2}
            />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

          <Button title="Select Image" onPress={handlePickImage} />

          <Button title="Take Photo" onPress={handleTakePhoto} />

        </View>

        {imageUri && (
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.imagePreview}
        />
      </View>
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
                     enabled={!!category}
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
            style={[styles.input, styles.descriptionInput]}
            multiline
            numberOfLines={6}
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
},
imageWrapper: {
  alignItems: 'center',
  marginVertical: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 5,
  backgroundColor: '#f9f9f9',
},

imagePreview: {
  width: 250,
  height: 250,
  borderRadius: 8,
  resizeMode: 'cover',
},

descriptionInput: {
  height: 140,
  textAlignVertical: 'top',
  paddingTop: 10,
},
titleInput: {
  height: 60,
  textAlignVertical: 'top',
  paddingTop: 10,
},
});