import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ProductCard } from "@/app/components/product-card"
import { ShoppingCart } from "lucide-react"

export default function ProductsPage() {
  // This would be fetched from an API in a real app
  const products = [
    {
      id: 1,
      name: "Organic Avocados",
      description: "Perfectly ripe, ready to eat",
      price: 3.99,
      category: "Fruits & Vegetables",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Free-Range Chicken Breast",
      description: "Hormone-free, locally sourced",
      price: 8.99,
      category: "Meat & Seafood",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Artisan Sourdough Bread",
      description: "Freshly baked daily",
      price: 5.49,
      category: "Bakery",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Organic Milk",
      description: "Whole milk from grass-fed cows",
      price: 4.29,
      category: "Dairy & Eggs",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 5,
      name: "Wild Caught Salmon",
      description: "Premium quality, sustainably sourced",
      price: 12.99,
      category: "Meat & Seafood",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 6,
      name: "Organic Strawberries",
      description: "Sweet and juicy, perfect for snacking",
      price: 4.99,
      category: "Fruits & Vegetables",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 7,
      name: "Artisan Cheese Selection",
      description: "Curated selection of gourmet cheeses",
      price: 15.99,
      category: "Dairy & Eggs",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 8,
      name: "Organic Spinach",
      description: "Fresh and crisp, locally grown",
      price: 3.49,
      category: "Fruits & Vegetables",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 9,
      name: "Chocolate Chip Cookies",
      description: "Freshly baked with premium chocolate",
      price: 6.99,
      category: "Bakery",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="lg:w-1/4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="category-all" type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                <label htmlFor="category-all" className="ml-2 text-sm">
                  All Categories
                </label>
              </div>
              <div className="flex items-center">
                <input id="category-fruits" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="category-fruits" className="ml-2 text-sm">
                  Fruits & Vegetables
                </label>
              </div>
              <div className="flex items-center">
                <input id="category-meat" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="category-meat" className="ml-2 text-sm">
                  Meat & Seafood
                </label>
              </div>
              <div className="flex items-center">
                <input id="category-dairy" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="category-dairy" className="ml-2 text-sm">
                  Dairy & Eggs
                </label>
              </div>
              <div className="flex items-center">
                <input id="category-bakery" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="category-bakery" className="ml-2 text-sm">
                  Bakery
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Price Range</h3>
            <div className="space-y-4">
              <Slider defaultValue={[0, 20]} max={50} step={1} />
              <div className="flex items-center justify-between">
                <span className="text-sm">$0</span>
                <span className="text-sm">$50+</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Sort By</h3>
            <Select defaultValue="featured">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">Apply Filters</Button>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
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
                    <span className="font-medium text-lg">${product.price.toFixed(2)}</span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled>
                <span className="sr-only">Previous page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="outline" size="sm" className="bg-green-50 text-green-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">Next page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
