"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Snowflake,
  LogOut,
} from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"
import { OrdersList } from "@/components/admin/orders-list"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth")
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [router])

  useEffect(() => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }

    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem("products", JSON.stringify(newProducts))
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const newProducts = products.filter((p) => p.id !== productId)
      saveProducts(newProducts)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockProducts = products.filter((product) => product.stock < 10).length
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 shadow-lg border-b-4 border-blue-900 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-none w-24"></div>

            <div className="flex-1 min-w-0 text-center">
              <div className="flex items-center justify-center gap-2">
                <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  adega-abaixodezer00
                </h1>
                <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <div className="flex-none flex justify-end items-center gap-2 w-24">
              <Button
                size="sm"
                onClick={handleLogout}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
              <p className="text-xs text-muted-foreground">valor total em estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">produtos com estoque baixo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayOrders}</div>
              <p className="text-xs text-muted-foreground">pedidos recebidos hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(totalSales)}</div>
              <p className="text-xs text-muted-foreground">vendas realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Produtos</CardTitle>
                    <CardDescription>Adicione, edite ou remova produtos do seu catálogo</CardDescription>
                  </div>
                  <Button onClick={() => setShowProductForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                    <p className="text-sm text-gray-400">
                      {products.length === 0
                        ? "Adicione seu primeiro produto clicando em 'Novo Produto'"
                        : "Tente ajustar os filtros de busca"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg?height=64&width=64&query=produto"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="font-semibold text-blue-600">{formatPrice(product.price)}</span>
                            <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="text-xs">
                              Estoque: {product.stock}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product)
                              setShowProductForm(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersList />
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
          onSave={(product) => {
            if (editingProduct) {
              // Editar produto existente
              const newProducts = products.map((p) => (p.id === product.id ? product : p))
              saveProducts(newProducts)
            } else {
              // Adicionar novo produto
              saveProducts([...products, product])
            }
            setShowProductForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
