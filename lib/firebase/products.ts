import { db } from "@/firebaseConfig"
import { collection, addDoc, Timestamp, getDocs, query, where, setDoc, doc } from "firebase/firestore"

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

export async function fetchProductsByCategory(category: string) {
  const q = query(collection(db, "products"), where("category", "==", category))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function setProductWithId(product: { id: string; name: string; description: string; price: number; category: string; image: string }) {
  const ref = doc(collection(db, "products"), product.id)
  await setDoc(ref, {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
  })
}