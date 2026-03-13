import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "../firebase/storage";

export async function pickImageAndUpload(path) {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permission required to access photos.");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    // aspect: [4, 3],
    quality: 0.5,
  });

  if (!result.canceled && result.assets?.length > 0) {
    return await uploadFile(result.assets[0].uri, path);
  }
  return null;
}

export async function takePhotoAndUpload(path) {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permission required to use camera.");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    // aspect: [4, 3],
    quality: 0.5,
  });

  if (!result.canceled && result.assets?.length > 0) {
    return await uploadFile(result.assets[0].uri, path);
  }
  return null;
}