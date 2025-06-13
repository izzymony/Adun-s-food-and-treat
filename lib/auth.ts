import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import type { PasswordValidation } from "@/types"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key"

// Password validation
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Nigerian phone validation
export function validateNigerianPhone(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT token generation
export function generateToken(userId: number, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" })
}

// JWT token verification
export function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}

// Email verification token generation
export async function generateEmailVerificationToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex")
}

// Email verification expiry time
export function getEmailVerificationExpiryTime(): Date {
  const expiryTime = new Date()
  expiryTime.setHours(expiryTime.getHours() + 24) // 24 hours from now
  return expiryTime
}

// Password reset OTP generation
export function generatePasswordResetOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// OTP expiry time
export function getOTPExpiryTime(): Date {
  const expiryTime = new Date()
  expiryTime.setMinutes(expiryTime.getMinutes() + 15) // 15 minutes from now
  return expiryTime
}

// Check if OTP is expired
export function isOTPExpired(expiryTime: Date): boolean {
  return new Date() > expiryTime
}

// Email sending functions (mock implementations)
export async function sendEmailVerification(email: string, name: string, token: string): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify-email?token=${token}`

    console.log(`Email verification would be sent to ${email}`)
    console.log(`Verification URL: ${verificationUrl}`)

    // In a real implementation, you would send the email here
    // For now, we'll just log it and return true
    return true
  } catch (error) {
    console.error("Failed to send email verification:", error)
    return false
  }
}

export async function sendPasswordResetOTP(email: string, name: string, otp: string): Promise<boolean> {
  try {
    console.log(`Password reset OTP would be sent to ${email}`)
    console.log(`OTP: ${otp}`)

    // In a real implementation, you would send the email here
    // For now, we'll just log it and return true
    return true
  } catch (error) {
    console.error("Failed to send password reset OTP:", error)
    return false
  }
}

// Email service configuration
export function getEmailConfig() {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  }
}

// Generate secure random string
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

// Hash sensitive data
export function hashSensitiveData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Validate token format
export function isValidTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token)
}

// Rate limiting helper
export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts = new Map<string, { count: number; resetTime: number }>()

  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now()
      const userAttempts = attempts.get(identifier)

      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(identifier, { count: 1, resetTime: now + windowMs })
        return true
      }

      if (userAttempts.count >= maxAttempts) {
        return false
      }

      userAttempts.count++
      return true
    },
    getRemainingTime: (identifier: string): number => {
      const userAttempts = attempts.get(identifier)
      if (!userAttempts) return 0
      return Math.max(0, userAttempts.resetTime - Date.now())
    },
  }
}
