import { sql } from "@vercel/postgres"
import type {
  User,
  Product,
  Category,
  Order,
  Payment,
  UserQueries,
  ProductQueries,
  CategoryQueries,
  OrderQueries,
  PaymentQueries,
  ProductFilters,
  OrderCreate,
} from "../types"

// User queries
export const userQueries: UserQueries = {
  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { passwordHash: string; marketingConsent?: boolean }): Promise<User> {
    const { rows } = await sql`
      INSERT INTO users (email, password_hash, name, phone, address, role, marketing_consent)
      VALUES (${userData.email}, ${userData.passwordHash}, ${userData.name}, ${userData.phone}, ${userData.address}, ${userData.role || "customer"}, ${userData.marketingConsent || false})
      RETURNING id, email, name, phone, address, role, email_verified, created_at, updated_at
    `
    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      phone: rows[0].phone,
      address: rows[0].address,
      role: rows[0].role,
      emailVerified: rows[0].email_verified,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    }
  },

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await sql`
      SELECT id, email, name, phone, address, role, email_verified, password_hash, created_at, updated_at
      FROM users 
      WHERE email = ${email}
    `
    if (rows.length === 0) return null

    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      phone: rows[0].phone,
      address: rows[0].address,
      role: rows[0].role,
      emailVerified: rows[0].email_verified,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    }
  },

  async findById(id: number): Promise<User | null> {
    const { rows } = await sql`
      SELECT id, email, name, phone, address, role, email_verified, password_hash, created_at, updated_at
      FROM users 
      WHERE id = ${id}
    `
    if (rows.length === 0) return null

    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      phone: rows[0].phone,
      address: rows[0].address,
      role: rows[0].role,
      emailVerified: rows[0].email_verified,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    }
  },

  async updateLastLogin(id: number): Promise<void> {
    await sql`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${id}
    `
  },

  async verifyEmail(id: number): Promise<void> {
    await sql`
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW()
      WHERE id = ${id}
    `
  },

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${id}
    `
  },

  async savePasswordResetOTP(id: number, otp: string, expiresAt: Date): Promise<void> {
    await sql`
      UPDATE users 
      SET password_reset_otp = ${otp}, password_reset_otp_expires = ${expiresAt.toISOString()}, updated_at = NOW()
      WHERE id = ${id}
    `
  },

  async findByEmailAndOTP(email: string, otp: string): Promise<User | null> {
    const { rows } = await sql`
      SELECT id, email, name, phone, address, role, email_verified, password_reset_otp_expires, created_at, updated_at
      FROM users 
      WHERE email = ${email} AND password_reset_otp = ${otp}
    `
    if (rows.length === 0) return null

    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      phone: rows[0].phone,
      address: rows[0].address,
      role: rows[0].role,
      emailVerified: rows[0].email_verified,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    }
  },

  async resetPassword(id: number, passwordHash: string): Promise<void> {
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, password_reset_otp = NULL, password_reset_otp_expires = NULL, updated_at = NOW()
      WHERE id = ${id}
    `
  },

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const { rows } = await sql`
      SELECT id, email, name, phone, address, role, email_verified, email_verification_expires, created_at, updated_at
      FROM users 
      WHERE email_verification_token = ${token}
    `
    if (rows.length === 0) return null

    return {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      phone: rows[0].phone,
      address: rows[0].address,
      role: rows[0].role,
      emailVerified: rows[0].email_verified,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
    }
  },
}

// Product queries
export const productQueries: ProductQueries = {
  async getAll(filters: ProductFilters = {}): Promise<Product[]> {
    let query = `
      SELECT p.*, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.in_stock = true
    `
    const params: any[] = []
    let paramIndex = 1

    if (filters.category && filters.category !== "all") {
      query += ` AND c.slug = $${paramIndex}`
      params.push(filters.category)
      paramIndex++
    }

    if (filters.search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${filters.search}%`)
      paramIndex++
    }

    query += ` ORDER BY p.is_popular DESC, p.rating DESC, p.name ASC`

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`
      params.push(filters.limit)
      paramIndex++
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`
      params.push(filters.offset)
    }

    const { rows } = await sql.query(query, params)

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number.parseFloat(row.price),
      originalPrice: row.original_price ? Number.parseFloat(row.original_price) : undefined,
      image: row.image_url || `/images/${row.name.toLowerCase().replace(/ /g, "-")}.png`,
      category: row.category_slug,
      rating: Number.parseFloat(row.rating || "0"),
      reviews: row.review_count || 0,
      isPopular: row.is_popular,
      inStock: row.in_stock,
      preparationTime: row.preparation_time,
    }))
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    const { rows } = await sql`
      SELECT p.*, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_popular = true AND p.in_stock = true
      ORDER BY p.rating DESC, p.review_count DESC
      LIMIT ${limit}
    `

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number.parseFloat(row.price),
      originalPrice: row.original_price ? Number.parseFloat(row.original_price) : undefined,
      image: row.image_url || `/images/${row.name.toLowerCase().replace(/ /g, "-")}.png`,
      category: row.category_slug,
      rating: Number.parseFloat(row.rating || "0"),
      reviews: row.review_count || 0,
      isPopular: row.is_popular,
      inStock: row.in_stock,
      preparationTime: row.preparation_time,
    }))
  },

  async getById(id: number): Promise<Product | null> {
    const { rows } = await sql`
      SELECT p.*, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
    `
    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number.parseFloat(row.price),
      originalPrice: row.original_price ? Number.parseFloat(row.original_price) : undefined,
      image: row.image_url || `/images/${row.name.toLowerCase().replace(/ /g, "-")}.png`,
      category: row.category_slug,
      rating: Number.parseFloat(row.rating || "0"),
      reviews: row.review_count || 0,
      isPopular: row.is_popular,
      inStock: row.in_stock,
      preparationTime: row.preparation_time,
    }
  },

  async getByCategory(category: string): Promise<Product[]> {
    return this.getAll({ category })
  },
}

// Category queries
export const categoryQueries: CategoryQueries = {
  async getAll(): Promise<Category[]> {
    const { rows } = await sql`
      SELECT id, name, slug, description, image_url
      FROM categories
      ORDER BY name ASC
    `

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image_url || `/images/categories/${row.slug}.png`,
    }))
  },

  async getById(id: number): Promise<Category | null> {
    const { rows } = await sql`
      SELECT id, name, slug, description, image_url
      FROM categories
      WHERE id = ${id}
    `
    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image_url || `/images/categories/${row.slug}.png`,
    }
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const { rows } = await sql`
      SELECT id, name, slug, description, image_url
      FROM categories
      WHERE slug = ${slug}
    `
    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image_url || `/images/categories/${row.slug}.png`,
    }
  },
}

// Order queries
export const orderQueries: OrderQueries = {
  async create(orderData: OrderCreate & { userId: number }): Promise<{ id: number }> {
    const { rows } = await sql`
      INSERT INTO orders (user_id, total_amount, delivery_fee, discount_amount, delivery_address, phone, notes, payment_method, status, payment_status)
      VALUES (${orderData.userId}, ${orderData.totalAmount}, ${orderData.deliveryFee}, ${orderData.discountAmount}, ${orderData.deliveryAddress}, ${orderData.phone}, ${orderData.notes || ""}, ${orderData.paymentMethod}, 'pending', 'pending')
      RETURNING id
    `

    const orderId = rows[0].id

    // Insert order items
    for (const item of orderData.items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES (${orderId}, ${item.productId}, ${item.name}, ${item.quantity}, ${item.price})
      `
    }

    return { id: orderId }
  },

  async getById(id: number): Promise<Order | null> {
    const { rows: orderRows } = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `
    if (orderRows.length === 0) return null

    const { rows: itemRows } = await sql`
      SELECT * FROM order_items WHERE order_id = ${id}
    `

    const order = orderRows[0]
    return {
      id: order.id,
      items: itemRows.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
        image_url: item.image_url || `/images/${item.product_name.toLowerCase().replace(/ /g, "-")}.png`,
      })),
      total_amount: Number.parseFloat(order.total_amount),
      delivery_fee: Number.parseFloat(order.delivery_fee),
      discount_amount: Number.parseFloat(order.discount_amount),
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      phone: order.phone,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }
  },

  async getByUserId(userId: number): Promise<Order[]> {
    const { rows: orderRows } = await sql`
      SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC
    `

    const orders: Order[] = []
    for (const order of orderRows) {
      const { rows: itemRows } = await sql`
        SELECT * FROM order_items WHERE order_id = ${order.id}
      `

      orders.push({
        id: order.id,
        items: itemRows.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: Number.parseFloat(item.price),
          image_url: item.image_url || `/images/${item.product_name.toLowerCase().replace(/ /g, "-")}.png`,
        })),
        total_amount: Number.parseFloat(order.total_amount),
        delivery_fee: Number.parseFloat(order.delivery_fee),
        discount_amount: Number.parseFloat(order.discount_amount),
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        delivery_address: order.delivery_address,
        phone: order.phone,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
    }

    return orders
  },

  async updateStatus(id: number, status: Order["status"]): Promise<Order | null> {
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `
    return this.getById(id)
  },

  async updatePaymentStatus(id: number, paymentStatus: Order["payment_status"]): Promise<void> {
    await sql`
      UPDATE orders 
      SET payment_status = ${paymentStatus}, updated_at = NOW()
      WHERE id = ${id}
    `
  },
}

// Payment queries
export const paymentQueries: PaymentQueries = {
  async create(paymentData: Omit<Payment, "id" | "created_at" | "updated_at">): Promise<Payment> {
    const { rows } = await sql`
      INSERT INTO payments (order_id, amount, currency, status, payment_provider, provider_reference, payment_method_type, description)
      VALUES (${paymentData.order_id}, ${paymentData.amount}, ${paymentData.currency}, ${paymentData.status}, ${paymentData.payment_provider}, ${paymentData.provider_reference}, ${paymentData.payment_method_type}, ${paymentData.description})
      RETURNING *
    `

    const payment = rows[0]
    return {
      id: payment.id,
      order_id: payment.order_id,
      amount: Number.parseFloat(payment.amount),
      currency: payment.currency,
      status: payment.status,
      payment_provider: payment.payment_provider,
      provider_reference: payment.provider_reference,
      payment_method_type: payment.payment_method_type,
      description: payment.description,
      provider_response: payment.provider_response,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    }
  },

  async updateByReference(reference: string, updates: Partial<Payment>): Promise<Payment | null> {
    const setClause = Object.keys(updates)
      .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    if (!setClause) return null

    const values = [
      reference,
      ...Object.values(updates).filter((_, index) => {
        const key = Object.keys(updates)[index]
        return key !== "id" && key !== "created_at" && key !== "updated_at"
      }),
    ]

    const { rows } = await sql.query(
      `UPDATE payments SET ${setClause}, updated_at = NOW() WHERE provider_reference = $1 RETURNING *`,
      values,
    )

    if (rows.length === 0) return null

    const payment = rows[0]
    return {
      id: payment.id,
      order_id: payment.order_id,
      amount: Number.parseFloat(payment.amount),
      currency: payment.currency,
      status: payment.status,
      payment_provider: payment.payment_provider,
      provider_reference: payment.provider_reference,
      payment_method_type: payment.payment_method_type,
      description: payment.description,
      provider_response: payment.provider_response,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    }
  },

  async getByOrderId(orderId: number): Promise<Payment[]> {
    const { rows } = await sql`
      SELECT * FROM payments WHERE order_id = ${orderId} ORDER BY created_at DESC
    `

    return rows.map((payment: any) => ({
      id: payment.id,
      order_id: payment.order_id,
      amount: Number.parseFloat(payment.amount),
      currency: payment.currency,
      status: payment.status,
      payment_provider: payment.payment_provider,
      provider_reference: payment.provider_reference,
      payment_method_type: payment.payment_method_type,
      description: payment.description,
      provider_response: payment.provider_response,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    }))
  },
}

// Database connection helper
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
