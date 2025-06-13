import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would be fetched from an API in a real app
  const product = {
    id: Number.parseInt(params.id),
    name: "Organic Avocados",
    description:
      "Our organic avocados are hand-picked at peak ripeness to ensure the best flavor and texture. Rich in healthy fats, fiber, and various nutrients, these avocados are perfect for making guacamole, adding to salads, or enjoying on toast.",
    price: 3.99,
    category: "Fruits & Vegetables",
    rating: 4.8,
    reviews: 124,
    stock: 50,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    nutritionFacts: {
      servingSize: "1 avocado (150g)",
      calories: 240,
      totalFat: "22g",
      saturatedFat: "3g",
      transFat: "0g",
      cholesterol: "0mg",
      sodium: "10mg",
      totalCarbs: "12g",
      dietaryFiber: "10g",
      sugars: "1g",
      protein: "3g",
    },
    relatedProducts: [
      {
        id: 6,
        name: "Organic Strawberries",
        price: 4.99,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 8,
        name: "Organic Spinach",
        price: 3.49,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 10,
        name: "Organic Bananas",
        price: 2.49,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg border cursor-pointer">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <div className="text-sm text-gray-500 mb-2">{product.category}</div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="mt-6">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-gray-500">/ each</span>
          </div>

          <div className="mt-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mt-6 flex items-center">
            <div className="mr-6 flex items-center border rounded-md">
              <button className="px-3 py-2 hover:bg-gray-100">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2">1</span>
              <button className="px-3 py-2 hover:bg-gray-100">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-sm text-gray-500">{product.stock} available</div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex items-center text-sm text-gray-500">
              <Truck className="mr-2 h-5 w-5" />
              Free shipping on orders over $35
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Details</h3>
              <p>
                Our organic avocados are hand-picked at peak ripeness to ensure the best flavor and texture. Rich in
                healthy fats, fiber, and various nutrients, these avocados are perfect for making guacamole, adding to
                salads, or enjoying on toast.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Certified organic</li>
                <li>Non-GMO</li>
                <li>Sustainably grown</li>
                <li>Rich in vitamins E, K, and B6</li>
                <li>Good source of potassium and healthy fats</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="nutrition" className="p-6 border rounded-b-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Nutrition Facts</h3>
              <div className="border rounded-lg p-4">
                <div className="border-b pb-2">
                  <p className="font-bold">Serving Size: {product.nutritionFacts.servingSize}</p>
                </div>
                <div className="border-b py-2">
                  <p className="font-bold">Calories: {product.nutritionFacts.calories}</p>
                </div>
                <div className="border-b py-2">
                  <p className="font-bold">Total Fat: {product.nutritionFacts.totalFat}</p>
                  <p className="pl-4">Saturated Fat: {product.nutritionFacts.saturatedFat}</p>
                  <p className="pl-4">Trans Fat: {product.nutritionFacts.transFat}</p>
                </div>
                <div className="border-b py-2">
                  <p>Cholesterol: {product.nutritionFacts.cholesterol}</p>
                </div>
                <div className="border-b py-2">
                  <p>Sodium: {product.nutritionFacts.sodium}</p>
                </div>
                <div className="border-b py-2">
                  <p className="font-bold">Total Carbohydrates: {product.nutritionFacts.totalCarbs}</p>
                  <p className="pl-4">Dietary Fiber: {product.nutritionFacts.dietaryFiber}</p>
                  <p className="pl-4">Sugars: {product.nutritionFacts.sugars}</p>
                </div>
                <div className="py-2">
                  <p>Protein: {product.nutritionFacts.protein}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-6 border rounded-b-lg">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <div className="space-y-4">
                {/* Sample reviews - would be dynamic in a real app */}
                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Perfect avocados!</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">By Sarah J. on May 15, 2023</p>
                  <p className="text-sm">
                    These avocados were perfectly ripe when they arrived. Great flavor and texture!
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Good quality</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">By Michael T. on April 28, 2023</p>
                  <p className="text-sm">Good quality avocados. One was a bit bruised but the rest were perfect.</p>
                </div>
                <div className="pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Will buy again!</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">By Lisa R. on April 10, 2023</p>
                  <p className="text-sm">
                    These are the best avocados I've ever had delivered. Will definitely buy again!
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Load More Reviews
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{relatedProduct.name}</h3>
                  <p className="mt-2 font-medium">${relatedProduct.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
