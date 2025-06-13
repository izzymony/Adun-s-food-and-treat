"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/app/components/cart-provider"

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Button>
    </Link>
  )
}
