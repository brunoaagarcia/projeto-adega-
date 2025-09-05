"use client"

import { useState, useEffect } from "react"
import { categories } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, ArrowLeft, Snowflake, Package } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import type { Product } from "@/lib/types"

export default function LojaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [priceFilter, setPriceFilter] = useState("Todos")
  const { itemCount } = useCart()

  useEffect(() => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts)
      console.log("[v0] Produtos carregados do localStorage:", parsedProducts)
      setProducts(parsedProducts)
    }
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesPrice = true
    if (priceFilter === "Até R$ 50") matchesPrice = product.price <= 50
    else if (priceFilter === "R$ 51 - R$ 100") matchesPrice = product.price > 50 && product.price <= 100
    else if (priceFilter === "R$ 101 - R$ 200") matchesPrice = product.price > 100 && product.price <= 200
    else if (priceFilter === "Acima de R$ 200") matchesPrice = product.price > 200

    return matchesCategory && matchesSearch && matchesPrice
  })

  const priceRanges = ["Todos", "Até R$ 50", "R$ 51 - R$ 100", "R$ 101 - R$ 200", "Acima de R$ 200"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-blue-800 shadow-lg border-b-4 border-blue-900 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-none">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </Link>
            </div>

            <div className="flex-1 min-w-0 text-center">
              <div className="flex items-center justify-center gap-2">
                <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  adega-abaixodezer00
                </h1>
                <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <div className="flex-none">
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline ml-1">Carrinho</span>
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 animate-pulse">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar bebidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                    : "bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Filtrar por preço:</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <Button
                  key={range}
                  variant={priceFilter === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter(range)}
                  className={
                    priceFilter === range
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md text-xs"
                      : "bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50 text-xs"
                  }
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">Nenhum produto cadastrado</h2>
            <p className="text-gray-500 mb-6 px-4">A adega ainda não possui produtos disponíveis.</p>
            <p className="text-sm text-gray-400 px-4">
              Entre em contato conosco ou volte mais tarde para ver nossos produtos.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && products.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                <p className="text-gray-400">Tente ajustar os filtros ou termo de busca</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
