import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserProfile({
          ...data,
          cart: data.cart || [],
          favorites: data.favorites || []
        });
      }
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  });

  return unsubscribe;
}, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleFavorite = async (furnitureId) => {
    if (!user) throw new Error("User not logged in");

    const docRef = doc(db, 'users', user.uid);
    let added = false;

    if (userProfile.favorites.includes(furnitureId)) {
     
      await updateDoc(docRef, { favorites: arrayRemove(furnitureId) });
    } else {
      
      await updateDoc(docRef, { favorites: arrayUnion(furnitureId) });
      added = true;
    }

    setUserProfile(prev => ({
      ...prev,
      favorites: added
        ? [...prev.favorites, furnitureId]
        : prev.favorites.filter(id => id !== furnitureId)
    }));

    return added;
  };


const addToCart = async (furnitureId, quantity = 1) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);

  const existingItem = userProfile.cart?.find(item => item.id === furnitureId);

  let updatedCart;

  if (existingItem) {

    updatedCart = userProfile.cart.map(item =>
      item.id === furnitureId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    
    updatedCart = [
      ...(userProfile.cart || []),
      { id: furnitureId, quantity }
    ];
  }

  await updateDoc(userRef, { cart: updatedCart });

  setUserProfile(prev => ({
    ...prev,
    cart: updatedCart
  }));
};

  const removeFromCart = async (furnitureId) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const updatedCart = userProfile.cart.filter(item => item.id !== furnitureId);

    await updateDoc(userRef, { cart: updatedCart });
    setUserProfile(prev => ({ ...prev, cart: updatedCart }));
  };

  const updateCartQuantity = async (furnitureId, quantity) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);

    const updatedCart = userProfile.cart.map(item =>
      item.id === furnitureId ? { ...item, quantity } : item
    );
    await updateDoc(userRef, { cart: updatedCart });
    setUserProfile(prev => ({ ...prev, cart: updatedCart }));
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout, toggleFavorite, addToCart, removeFromCart, updateCartQuantity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);