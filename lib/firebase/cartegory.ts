import { db } from "@/firebaseConfig"
import { collection, getDocs, addDoc } from "firebase/firestore"

export async function fetchCategories() {
  const querySnapshot = await getDocs(collection(db, "categories"))
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function addCategory(category: { name: string; image: string }) {
  return await addDoc(collection(db, "categories"), category)
}

