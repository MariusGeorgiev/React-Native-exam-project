
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFile(uri, folder = 'uploads') {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const filename = `${folder}/${Date.now()}.jpg`; 
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);

    console.log('✅ File uploaded:', downloadUrl);
    return downloadUrl;
  } catch (err) {
    console.error('Error uploading file:', err);
    return null;
  }
}