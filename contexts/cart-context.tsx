"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Garantir que estamos no lado do cliente
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          console.log("[v0] Carrinho carregado do localStorage:", parsedCart)
          setItems(parsedCart)
        }
      } catch (error) {
        console.log("[v0] Erro ao carregar carrinho:", error)
        setItems([])
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change (only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
      console.log("[v0] Carrinho salvo no localStorage:", items)
    }
  }, [items, isLoaded])

  const addItem = (product: Product, quantity = 1) => {
    console.log("[v0] Adicionando produto ao carrinho:", product.name, "quantidade:", quantity)
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        const updatedItems = currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
        console.log("[v0] Produto existente atualizado, novo carrinho:", updatedItems)
        return updatedItems
      }

      const newItems = [...currentItems, { product, quantity }]
      console.log("[v0] Novo produto adicionado, novo carrinho:", newItems)
      return newItems
    })
  }

  const removeItem = (productId: string) => {
    console.log("[v0] Removendo produto do carrinho:", productId)
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    console.log("[v0] Atualizando quantidade:", productId, "para:", quantity)
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    console.log("[v0] Limpando carrinho")
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isLoaded) {
    return <div className="min-h-screen bg-white" />
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
