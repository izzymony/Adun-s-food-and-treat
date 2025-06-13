import Link from "next/link"
import { AddToCartButton } from "@/app/components/add-to-cart-button"

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    category?: string
    image: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image || "/image.png"}
            alt={product.name}
           
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </div>
  )
}
