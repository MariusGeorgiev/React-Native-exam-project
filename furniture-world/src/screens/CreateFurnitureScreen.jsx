import { useState, useEffect } from "react";
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { CATEGORIES } from "../data/categories";
import {
  pickImageAndUpload,
  takePhotoAndUpload,
} from "../services/pickerService";

export default function CreateFurnitureScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [colors, setColors] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [furnitureId, setFurnitureId] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const newDocRef = doc(collection(db, "furniture"));
    setFurnitureId(newDocRef.id);
  }, []);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const handlePickImage = async () => {
    Keyboard.dismiss();
    if (!furnitureId) return;

    try {
      setImageLoading(true);
      const url = await pickImageAndUpload(`furniture/${furnitureId}`);
      if (url) setImageUri(url);
    } catch (err) {
      console.log("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    Keyboard.dismiss();
    if (!furnitureId) return;

    try {
      setImageLoading(true);
      const url = await takePhotoAndUpload(`furniture/${furnitureId}`);
      if (url) setImageUri(url);
    } catch (err) {
      console.log("Error taking photo:", err);
      Alert.alert("Error", "Failed to take photo");
    } finally {
      setImageLoading(false);
    }
  };

  const validateInputs = () => {
    if (!imageUri) return "Please add image.";
    if (!title.trim() || title.length < 3)
      return "Title must be at least 3 characters.";
    if (!category) return "Please select a category.";
    if (!subcategory) return "Please select a subcategory.";
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0)
      return "Price must be a positive number.";
    if (!material.trim() || material.length < 3)
      return "Material must be at least 3 characters.";
    if (!colors.trim() || colors.length < 3)
      return "Colors must be at least 3 characters.";
    const w = Number(width),
      h = Number(height),
      d = Number(depth);
    if ([w, h, d].some((v) => isNaN(v) || v <= 0))
      return "Dimensions must be positive numbers.";
    if (!description.trim() || description.length < 10)
      return "Description must be at least 10 characters.";
    return null;
  };

  const addFurnitureHandler = async () => {
    const error = validateInputs();
    if (error) return Alert.alert("Validation Error", error);

    try {
      setAdding(true);
      const newFurniture = {
        title,
        images: imageUri ? [imageUri] : [],
        category,
        subcategory,
        price: Number(price),
        description,
        material: material.split(",").map((m) => m.trim()),
        colors: colors.split(",").map((c) => c.trim()),
        dimensions: {
          width: Number(width),
          height: Number(height),
          depth: Number(depth),
        },
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "furniture", furnitureId), newFurniture);

      const createdId = furnitureId;

      
      setTitle("");
      setCategory("");
      setSubcategory("");
      setPrice("");
      setDescription("");
      setMaterial("");
      setColors("");
      setWidth("");
      setHeight("");
      setDepth("");
      setImageUri(null);

      Alert.alert("Success", "Furniture added successfully!");
      navigation.navigate("Home", {
        screen: "FurnitureDetails",
        params: { furnitureId: createdId },
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to add furniture.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        
        <TextInput
          placeholder="Title"
          placeholderTextColor="#000"
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
            <Text style={styles.imageButtonText}>
              {imageLoading ? "Uploading..." : "Select Image"}
            </Text>
            {imageLoading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 5 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleTakePhoto}
            disabled={imageLoading}
          >
            <Text style={styles.imageButtonText}>
              {imageLoading ? "Uploading..." : "Take Photo"}
            </Text>
            {imageLoading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 5 }}
              />
            )}
          </TouchableOpacity>
        </View>

        
        {imageUri && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </View>
        )}

        
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(val) => {
              setCategory(val);
              setSubcategory("");
            }}
          >
            <Picker.Item label="Select category" value="" />
            {CATEGORIES.map((cat) => (
              <Picker.Item key={cat.id} label={cat.title} value={cat.id} />
            ))}
          </Picker>
        </View>

        
        {selectedCategory && (
          <>
            <Text style={styles.label}>Subcategory</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={subcategory}
                onValueChange={setSubcategory}
              >
                <Picker.Item label="Select subcategory" value="" />
                {selectedCategory.subcategories.map((sub) => (
                  <Picker.Item key={sub} label={sub} value={sub} />
                ))}
              </Picker>
            </View>
          </>
        )}

        
        <TextInput
          placeholder="Price €"
          placeholderTextColor="#000"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          maxLength={5}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#000"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.descriptionInput]}
          multiline
          numberOfLines={6}
        />
        <TextInput
          placeholder="Material (e.g. Wood, Aluminum, Steal, Glass)"
          placeholderTextColor="#000"
          value={material}
          onChangeText={setMaterial}
          style={styles.input}
        />
        <TextInput
          placeholder="Colors (e.g. Black, White)"
          placeholderTextColor="#000"
          value={colors}
          onChangeText={setColors}
          style={styles.input}
        />

        
        <View style={styles.row}>
          <TextInput
            placeholder="Width in mm"
            placeholderTextColor="#000"
            value={width}
            onChangeText={(text) => setWidth(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={4}
            style={styles.dimInput}
          />
          <TextInput
            placeholder="Height in mm"
            placeholderTextColor="#000"
            value={height}
            onChangeText={(text) => setHeight(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={4}
            style={styles.dimInput}
          />
          <TextInput
            placeholder="Depth in mm"
            placeholderTextColor="#000"
            value={depth}
            onChangeText={(text) => setDepth(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            maxLength={4}
            style={styles.dimInput}
          />
        </View>

        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={addFurnitureHandler}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Furniture</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  dimInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#502222",
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#502222",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  titleInput: { height: 60, textAlignVertical: "top", paddingTop: 10 },
  descriptionInput: { height: 140, textAlignVertical: "top", paddingTop: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#502222",
    borderRadius: 6,
    marginBottom: 10,
  },
  label: { fontWeight: "600", marginBottom: 4 },

  imageWrapper: {
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#502222",
    borderRadius: 8,
    padding: 5,
    backgroundColor: "#f9f9f9",
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 8,
    resizeMode: "cover",
  },

  imageButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
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
