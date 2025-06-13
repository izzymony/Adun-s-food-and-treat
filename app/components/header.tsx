"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image' 
import { Search, Menu, X, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { CartButton } from "@/app/components/cart-button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"

export default function Header() {
  const isMobile = useMobile()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          firstName: firebaseUser.displayName?.split(" ")[0] || "User",
          lastName: firebaseUser.displayName?.split(" ")[1] || "",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        })
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white bg-white/30 backdrop-blur-md  border border-white/40 shadow-md">
      <div className="container flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white bg-white/30 backdrop-blur-md  border border-white/40 shadow-md">
            <nav className="flex flex-col gap-4 mt-8 p-3 text-white ">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium">
                All Products
              </Link>
              <Link href="/category/1" className="text-lg font-medium">
                Fruits & Vegetables
              </Link>
              <Link href="/category/2" className="text-lg font-medium">
                Meat & Seafood
              </Link>
              <Link href="/category/3" className="text-lg font-medium">
                Dairy & Eggs
              </Link>
              <Link href="/category/4" className="text-lg font-medium">
                Bakery
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center">
         <Image src='/WhatsApp_Image_2025-06-11_at_21.52.10_d4ac8615-removebg-preview.png' alt="" width={60} height={60}/>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm "> 
          <Link href="/" className="font-medium transition-colors hover:text-green-600">
            Home
          </Link>
          <Link href="/products" className="font-medium transition-colors hover:text-green-600">
            All Products
          </Link>
          <Link href="/category/1" className="font-medium transition-colors hover:text-green-600">
            Fruits & Vegetables
          </Link>
          <Link href="/category/2" className="font-medium transition-colors hover:text-green-600">
            Meat & Seafood
          </Link>
          <Link href="/category/3" className="font-medium transition-colors hover:text-green-600">
            Dairy & Eggs
          </Link>
          <Link href="/category/4" className="font-medium transition-colors hover:text-green-600">
            Bakery
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isSearchOpen && !isMobile ? (
            <div className="relative flex items-center">
              <Input type="search" placeholder="Search products..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <CartButton />

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="w-[100px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Order History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}