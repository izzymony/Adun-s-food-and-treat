'use client'
import Link from "next/link"
import { addToCart } from "@/lib/firebase/cart"
import { useState } from "react"
// You need to implement/use a hook to get the current user
// Example: import { useAuth } from "@/hooks/use-auth"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    description: string
    price: number
    category?: string
    image: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  // Replace this with your actual auth logic
  // const { user } = useAuth()
  const user = { uid: "demo-user-id" } // Replace with real user

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please sign in to add to cart")
      return
    }
    setAdding(true)
    try {
      await addToCart(user.uid, { ...product, id: String(product.id) })
      alert("Added to cart!")
    } catch (e) {
      alert("Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className=" relative overflow-hidden  rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
         <div className="h-48 overflow-hidden"> {/* Fixed height */}
      <img
        src={product.image || "/image.png"}
        alt={product.name}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      </div>
      </Link>
      <div className="p-4">
        {product.category && <div className="text-xs text-gray-500 mb-1">{product.category}</div>}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium text-lg">₦{product.price.toFixed(2)}</span>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}