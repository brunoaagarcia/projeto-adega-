"use client"

import { useState, useEffect, useCallback } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  stock?: number
}

const CART_STORAGE_KEY = "abaixo-de-zero-cart"
const CART_UPDATE_EVENT = "cart-updated"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const saveCart = (newItems: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
      window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT))
      console.log("[v0] Carrinho salvo e evento disparado:", newItems)
    }
  }

  const handleCartUpdate = useCallback(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      try {
        const parsedCart = savedCart ? JSON.parse(savedCart) : []
        setItems(parsedCart)
        console.log("[v0] Carrinho atualizado pelo evento:", parsedCart)
      } catch (error) {
        console.error("[v0] Erro ao sincronizar carrinho:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleCartUpdate() // Load initial cart
      setIsLoaded(true)
      window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate)
      return () => window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate)
    }
  }, [handleCartUpdate])

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    const currentItems = items
    const existingItem = currentItems.find((item) => item.id === product.id)
    let newItems: CartItem[]

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      const cappedQuantity = Math.min(newQuantity, product.stock || newQuantity)
      newItems = currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: cappedQuantity } : item,
      )
    } else {
      const cappedQuantity = Math.min(quantity, product.stock || quantity)
      newItems = [...currentItems, { ...product, quantity: cappedQuantity }]
    }
    saveCart(newItems)
  }

  const addItem = (product: any, quantity = 1) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }
    addToCart(cartItem, quantity)
  }

  const removeFromCart = (productId: string) => {
    const newItems = items.filter((item) => item.id !== productId)
    saveCart(newItems)
  }

  const removeItem = (productId: string) => {
    removeFromCart(productId)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const newItems = items.map((item) => (item.id === productId ? { ...item, quantity } : item))
    saveCart(newItems)
  }

  const clearCart = () => {
    saveCart([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const total = totalPrice

  return {
    items,
    totalItems,
    total,
    addToCart,
    addItem,
    removeFromCart,
    removeItem,
    updateQuantity,
    clearCart,
    isLoaded,
  }
}