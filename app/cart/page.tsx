"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { fetchCart, updateCartItem, removeCartItem, clearCart } from "@/lib/firebase/cart"

const userId = "demo-user-id" // Replace with real user ID

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    fetchCart(userId).then(items => {
      setCart(items)
      setLoading(false)
    })
  }, [])

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(userId, id, newQuantity)
    setCart(cart =>
      cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    )
  }

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(userId, id)
    setCart(cart => cart.filter(item => item.id !== id))
  }

  const handleClearCart = async () => {
    await clearCart(userId)
    setCart([])
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 35 ? 0 : 5
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-center">Quantity</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cart.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded mr-4"
                          />
                          <div>
                            <Link href={`/product/${item.id}`} className="font-medium hover:text-green-600">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">₦{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium">₦{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700 hover:border-red-700"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Proceed to Checkout</Button>
              <div className="text-xs text-gray-500">
                <p>Free shipping on orders over ₦35</p>
                <p className="mt-1">Estimated delivery: 2-4 business days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}