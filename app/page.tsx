import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/app/components/product-card"
import { fetchCategories } from "@/lib/firebase/cartegory"


export default function Home() {


  return (
    <div className=" w-full   min-h-screen">
      {/* Hero Section */}
     <section 
  className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
  style={{
    backgroundImage: "url('/4467f46691bf41143404de960757ddbd.jpg')",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100vw, 20vh',
    backgroundPosition: 'left'
  }}
>

  <div
  className="absolute inset-0 bg-cover bg-center
    bg-[url('/4467f46691bf41143404de960757ddbd.jpg')]
    bg-no-repeat
    bg-[length:50%_auto]
    lg:bg-[length:60%_auto]
    xl:bg-[length:40%_auto]
    bg-[position:center_top]"
>
</div>
  {/* Background overlay */}
 
  
  {/* White smoke effect at bottom */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent backdrop-blur-[2px]"></div>

  <div className="container px-4 md:px-6 relative z-10">
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
          Fresh Food Delivered to Your Door
        </h1>
        <p className="text-grey-700 font-bold md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Shop for fresh, high-quality groceries from the comfort of your home. We deliver to your doorstep.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/products">
            <Button size="lg" className="bg-[#ec8403] hover:bg-[#d97800] border-4 border-[#7d460e]">
              Shop Now
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Categories Section */}
      
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our wide range of fresh and delicious food categories.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                    width={300}
                    height={200}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 w-full p-4">
                    <p className="text-[14px] font-semibold text-white">{category.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
              <p className=" text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our most popular items this week.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample data
const categories = [
  { id: 1, name: "Fruits & Vegetables", image: "/pexels-jesus-carlon-2148935388-32481840.jpg" },
  { id: 2, name: "Meat & Seafood", image: "/4e7eb3020183d89d54ab06b1aa756d42.jpg" },
  { id: 3, name: "Swallow Foods", image: "/73f9dbd5e2cab4e598b19a8b63d386a8.jpg" },
  { id: 4, name: "Rice Dishes", image: "/64e80fa537921ca0011e0f540a3b0cb7.jpg" },
  { id: 5, name: "Beverages", image: "/placeholder.svg?height=300&width=300" },
  { id: 6, name: "Snacks", image: "/d690d5a9088ea97992459ae86d237425.jpg" },
  { id: 7, name: "Grills and BBQ", image: "/172a8896c4ad79bd6fdca81592524aecD.jpg" },
  { id: 8, name: "Pantry Staples", image: "/placeholder.svg?height=300&width=300" },
]

const featuredProducts = [
  {
    id: 1,
    name: "Organic Avocados",
    description: "Perfectly ripe, ready to eat",
    price: 3.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Free-Range Chicken Breast",
    description: "Hormone-free, locally sourced",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Artisan Sourdough Bread",
    description: "Freshly baked daily",
    price: 5.49,
    image: "/placeholder.svg?height=300&width=300",
  },
]
