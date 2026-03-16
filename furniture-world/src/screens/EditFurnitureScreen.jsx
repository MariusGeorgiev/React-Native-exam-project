import { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, Text, Alert, View, TextInput, StyleSheet, Image, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIES } from '../data/categories';
import { getFurnitureById, updateFurniture } from '../services/furnitureService';
import { pickImageAndUpload, takePhotoAndUpload } from "../services/pickerService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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

  const [imageLoading, setImageLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.title === category);

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
   Keyboard.dismiss();
  try {
    setImageLoading(true);
    const url = await pickImageAndUpload(`furniture/${furnitureId}`);
    if (url) {
      setImageUri(url); 
    }
  } catch (err) {
    console.log("Error picking image:", err);
    alert("Failed to pick image");
  } finally {
    setImageLoading(false);
  }
};


const handleTakePhoto = async () => {
   Keyboard.dismiss();
  try {
    setImageLoading(true);
    const url = await takePhotoAndUpload(`furniture/${furnitureId}`);
    if (url) {
      setImageUri(url); 
    }
  } catch (err) {
    console.log("Error taking photo:", err);
    alert("Failed to take photo");
  } finally {
    setImageLoading(false);
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

   if (!material.trim() || material.length < 3 || material.length > 20) {
    return Alert.alert("Validation Error", "Materials must be 3-20 characters.");
  }

  if (!colors.trim() || colors.length < 3 || colors.length > 20) {
    return Alert.alert("Validation Error", "Colors must be 3-20 characters.");
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

 
  try {
    setUpdate(true);
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
  } finally {
    setUpdate(false);
  }
}


  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={300} 
      enableOnAndroid={true}  
      showsVerticalScrollIndicator={false}
    >

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: 140 }}>

        <Text style={[styles.label, {textAlign: 'center'}]}>Title:</Text>
            <TextInput
            placeholder="Enter furniture title"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, styles.titleInput]}
            multiline
            numberOfLines={2}
            />


         <View style={styles.imageButtonsRow}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePickImage}
              disabled={imageLoading}
            >
              <Text style={styles.imageButtonText}>Select Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleTakePhoto}
              disabled={imageLoading}
            >
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>


          {imageUri && (
            <View style={styles.imageWrapper}>

              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
              />

              {imageLoading && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}

            </View>
          )}


      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10}}>
              <View style={{flex: 0.6}}>
                  <View style={[styles.CatAndSubCat]}>
                        <Text style={[styles.label, {textAlign: 'center', paddingBottom: 5}]}>Category: </Text>

                        <View style={[styles.pickerWrapper, {textAlign: 'center',}]}>
                            <Picker
                            selectedValue={category}
                            onValueChange={(value) => {
                                setCategory(value);
                                setSubcategory('');
                            }}
                            >
                            <Picker.Item label="Select category" value="" />

                            {CATEGORIES.map(cat => (
                                <Picker.Item key={cat.id} label={cat.title} value={cat.title} />
                            ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.CatAndSubCat}>
                      <Text style={[styles.label,{textAlign: 'center', paddingBottom: 5}]}>Subcategory: </Text>

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
              </View>

              <View style={{flex: 0.3, gap: 10}}>
                  <Text style={[styles.label, {textAlign: 'center', fontSize: 18}]}>Price:</Text>
                  <TextInput
                  placeholder="Enter price"
                  value={price}
                  onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  maxLength={5}
                  style={[styles.input, {textAlign: 'center', fontSize: 22}]}
                  />
              </View>
        </View>


        <Text style={[styles.label, {textAlign: 'center'}]}>Material:</Text>
        <TextInput
          placeholder="Wood, Metal"
          value={material}
          onChangeText={setMaterial}
          style={styles.input}
        />

        <Text style={[styles.label, {textAlign: 'center'}]}>Colors:</Text>
        <TextInput
          placeholder="Black, White"
          value={colors}
          onChangeText={setColors}
          style={styles.input}
        />


        <Text style={[styles.label, {textAlign: 'center'}]}>Description:</Text>
          <TextInput
            placeholder="Enter Description of the Furniture"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descriptionInput]}
            multiline
            numberOfLines={6}
          />


        <View style={[styles.row, {justifyContent: 'space-evenly', gap: 10} ]}>
        
            <View style={styles.dimensionRow}>
            <Text style={[styles.label, {textAlign: 'center'}]}>Width: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                style={styles.dimInput}
                placeholder="0"
                value={width}
                onChangeText={(text) => setWidth(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={[styles.unit, {textAlign: 'center'}]}>mm</Text>
            </View>

            <View style={styles.dimensionRow}>
            <Text style={[styles.label, {textAlign: 'center'}]}>Height: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                style={styles.dimInput}
                placeholder="0"
                value={height}
                onChangeText={(text) => setHeight(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={[styles.unit, {textAlign: 'center'}]}>mm</Text>
            </View>

            <View style={styles.dimensionRow}>
            <Text style={[styles.label, {textAlign: 'center'}]}>Depth: </Text>

            <View style={styles.inputWithUnit}>
                <TextInput
                style={styles.dimInput}
                placeholder="0"
                value={depth}
                onChangeText={(text) => setDepth(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={4}
                />
                
            </View>
            <Text style={[styles.unit, {textAlign: 'center'}]}>mm</Text>
            </View>

        </View>



          <View style={{ marginBottom: 50 }}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={updateFurnitureHandler}
                    disabled={update}
                  >
                    {update ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Update Furniture</Text>
                    )}
               </TouchableOpacity>
          </View>

      </ScrollView>

    </KeyboardAwareScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    // gap: 8,
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
  flex: 1,
  flexDirection: 'column',
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
  paddingHorizontal: 6,
  textAlign: "center",
},
unit: {
  // marginLeft: 8,
  color: "#555",
  fontWeight: "500",
},
pickerWrapper: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
},
imageWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 5,
  position: "relative",
  alignItems: "center",
},

imagePreview: {
  width: 200,
  height: 200,
  borderRadius: 10,
},
imageLoadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.4)",
  borderRadius: 10,
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
 imageButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#879484",
    padding: 12,
    borderRadius: 8,
  },
  imageButtonText: { color: "#fff", fontWeight: "600" },
submitButton: {
    backgroundColor: "#879484",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});