import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export async function fetchLatestFurniture(limitNumber = 5) {
  const q = query(collection(db, 'furniture'), orderBy('createdAt', 'desc'), limit(limitNumber));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// export async function fetchFurnitureByCategory(categoryId) {
//   const q = query(collection(db, 'furniture'), where('category', '==', categoryId));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

export async function fetchFurnitureByCategoryAndSub(categoryId, subcategory) {
  const q = query(
    collection(db, 'furniture'),
    where('category', '==', categoryId),
    where('subcategory', '==', subcategory)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}