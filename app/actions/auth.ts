"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { z } from "zod"

// In a real app, this would be in a database
const users: UserData[] = []

// Secret key for JWT signing (in production, use a proper env variable)
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this_in_production")

// JWT expiration time (24 hours)
const JWT_EXPIRATION = "24h"

// User data interface
export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

// User interface (without password)
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

// Validation schemas
const SignUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

// Create a JWT token
async function createToken(user: User): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secretKey)
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    const userId = payload.sub as string
    const user = users.find((u) => u.id === userId)

    if (!user) return null

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    return null
  }
}

// Get the current user from the session
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  return verifyToken(token);
}

// Sign up action
export async function signUp(formData: FormData) {
  // Validate form data
  const validatedFields = SignUpSchema.safeParse({
    firstName: formData.get("first-name"),
    lastName: formData.get("last-name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { firstName, lastName, email, password } = validatedFields.data

  // Check if user already exists
  if (users.some((user) => user.email === email)) {
    return {
      success: false,
      error: { email: ["User with this email already exists"] },
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create new user
  const newUser: UserData = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    passwordHash,
  }

  // Add user to "database"
  users.push(newUser)

  return {
    success: true,
  }
}

// Sign in action
export async function signIn(formData: FormData) {
  // Validate form data
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // Find user
  const user = users.find((u) => u.email === email)

  if (!user) {
    return {
      success: false,
      error: { email: ["Invalid email or password"] },
    }
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatch) {
    return {
      success: false,
      error: { email: ["Invalid email or password"] },
    }
  }

  // Create JWT token
  const { passwordHash, ...userWithoutPassword } = user
  const token = await createToken(userWithoutPassword)

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "strict",
  })

  return {
    success: true,
    user: userWithoutPassword,
  }
}

// Sign out action
export async function signOut() {
  // Delete auth cookie
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/")
}

// Update profile action
export async function updateProfile(formData: FormData) {
  // Get current user
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return {
      success: false,
      error: { _form: ["Not authenticated"] },
    }
  }

  // Validate form data
  const validatedFields = UpdateProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const updatedData = validatedFields.data

  // Check if email is being changed and if it's already in use
  if (updatedData.email !== currentUser.email && users.some((user) => user.email === updatedData.email)) {
    return {
      success: false,
      error: { email: ["Email already in use"] },
    }
  }

  // Update user in "database"
  const userIndex = users.findIndex((u) => u.id === currentUser.id)

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updatedData,
    }
  }

  return {
    success: true,
    user: {
      ...currentUser,
      ...updatedData,
    },
  }
}

// Add a test user for development
if (process.env.NODE_ENV !== "production") {
  // Only add if not already present
  if (!users.some((user) => user.email === "john.doe@example.com")) {
    users.push({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      passwordHash: bcrypt.hashSync("password123", 10),
      phone: "+1 (555) 123-4567",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    })
  }
}
