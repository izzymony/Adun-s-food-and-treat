
import type { Cart } from "./cart"

export function calculateCartTotals(cart: Cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 35 ? 0 : 5.99
  const total = subtotal + shipping
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotal,
    shipping,
    total,
    itemCount,
  }
}