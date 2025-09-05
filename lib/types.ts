export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  deliveryType: "delivery" | "pickup"
  address?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "customer"
}
