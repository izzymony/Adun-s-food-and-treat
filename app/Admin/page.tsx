"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createProduct } from "@/lib/firebase/products"
import { addCategory, fetchCategories } from "@/lib/firebase/cartegory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()

  // Product form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Category form state
  const [catForm, setCatForm] = useState({ id: "", name: "", image: "" })
  const [catLoading, setCatLoading] = useState(false)
  const [catError, setCatError] = useState("")
  const [catSuccess, setCatSuccess] = useState("")

  // Categories for dropdown
  const [categories, setCategories] = useState<any[]>([])
  const [catDropdownLoading, setCatDropdownLoading] = useState(true)

  useEffect(() => {
    fetchCategories().then(data => {
      setCategories(data)
      setCatDropdownLoading(false)
    })
  }, [])

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
      })
      setForm({ id: "", name: "", description: "", price: "", category: "", image: "" })
      router.refresh?.()
    } catch (err: any) {
      setError("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCatLoading(true)
    setCatError("")
    setCatSuccess("")
    if (!catForm.id || !catForm.name || !catForm.image) {
      setCatError("Please provide ID, name, and image URL.")
      setCatLoading(false)
      return
    }
    try {
      await addCategory(catForm)
      setCatSuccess("Category added successfully!")
      setCatForm({ id: "", name: "", image: "" })
      // Refresh categories dropdown
      setCatDropdownLoading(true)
      fetchCategories().then(data => {
        setCategories(data)
        setCatDropdownLoading(false)
      })
    } catch {
      setCatError("Failed to add category.")
    } finally {
      setCatLoading(false)
    }
  }

  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Form Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Add New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-id" className="text-gray-700">Category ID</Label>
                <Input 
                  id="cat-id" 
                  name="id" 
                  value={catForm.id} 
                  onChange={handleCatChange} 
                  placeholder="e.g., 'fruits-veg'" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-name" className="text-gray-700">Category Name</Label>
                <Input 
                  id="cat-name" 
                  name="name" 
                  value={catForm.name} 
                  onChange={handleCatChange} 
                  placeholder="e.g., 'Fruits & Vegetables'" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-image" className="text-gray-700">Image URL</Label>
                <Input 
                  id="cat-image" 
                  name="image" 
                  value={catForm.image} 
                  onChange={handleCatChange} 
                  placeholder="https://example.com/image.jpg" 
                  required 
                />
              </div>
              
              {catError && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {catError}
                </div>
              )}
              {catSuccess && (
                <div className="text-green-600 text-sm p-2 bg-green-50 rounded-md">
                  {catSuccess}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              onClick={handleCatSubmit}
              disabled={catLoading}
              className="w-full bg-[#ec8403] hover:bg-[#d97800]"
            >
              {catLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Add Category"}
            </Button>
          </CardFooter>
        </Card>

        {/* Product Form Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prod-id" className="text-gray-700">Product ID</Label>
                <Input 
                  id="prod-id" 
                  name="id" 
                  value={form.id} 
                  onChange={handleChange} 
                  placeholder="e.g., 'avocado-001'" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Product name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  required
                  rows={3}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={form.price} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Category</Label>
                <Select 
                  name="category" 
                  value={form.category} 
                  onValueChange={(value) => setForm({...form, category: value})}
                  disabled={catDropdownLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-700">Image URL</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={form.image} 
                  onChange={handleChange} 
                  placeholder="https://example.com/product.jpg" 
                  required 
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#ec8403] hover:bg-[#d97800]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Create Product"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}