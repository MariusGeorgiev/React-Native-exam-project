import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export async function registerUser(email, password) {
 
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

 
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
   
    const username = email.split("@")[0];
    await setDoc(userRef, {
      email,
    username,
    role: "user", 
    favorites: [],
    orders: [],
    phone: null,
    address: {
      street: null,
      city: null,
      country: null,
      postalCode: null,
    },
    age: null,
    gender: null,
    image: null,
    createdAt: serverTimestamp(),
    });
  }

  return userCredential.user;
}

export async function loginUser(email, password) {
  if (!email || !password) throw new Error("Email and password are required");
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}