"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchProductsByCategory } from "@/lib/firebase/products"
import {ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryPage() {
  const { id } = useParams() // id can be category name or document ID
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  // Dummy handler for adding to cart
  const handleAddToCart = async (product: any) => {
    setAddingId(product.id)
    // Simulate async add to cart logic
    await new Promise(res => setTimeout(res, 1000))
    setAddingId(null)
    // You can add your actual add-to-cart logic here
  }

  useEffect(() => {
    if (!id) return
    fetchProductsByCategory(id as string).then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [id])

  return (
   <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Products in {id}</h1>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
            >
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                 <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-medium text-lg">₦{Number(product.price).toFixed(2)}</span>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 "
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product.id}
                  >
                    {addingId === product.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    {addingId === product.id ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
     
  )
}