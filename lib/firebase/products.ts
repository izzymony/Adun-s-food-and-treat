import { db } from "@/firebaseConfig"
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore"

export async function createProduct(product: {
  name: string
  description: string
  price: number
  category: string
  image: string
}) {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}
export async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, "products"))
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}