"use client"

import { useState } from "react"
import { addCategory } from "@/lib/firebase/cartegory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddCategoryPage() {
  const [form, setForm] = useState({ name: "", image: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    if (!form.name || !form.image) {
      setError("Please provide both name and image URL.")
      setLoading(false)
      return
    }
    try {
      await addCategory(form)
      setSuccess("Category added!")
      setForm({ name: "", image: "" })
    } catch {
      setError("Failed to add category.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 max-w-xl px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" value={form.image} onChange={handleChange} required />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </Button>
      </form>
    </div>
  )
}