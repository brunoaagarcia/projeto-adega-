"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, items: cartItems } = useCart()
  const { toast } = useToast()

  const cartItem = useMemo(() => cartItems.find((item) => item.id === product.id), [cartItems, product.id])
  const stockInCart = cartItem ? cartItem.quantity : 0
  const remainingStock = product.stock - stockInCart

  const isOutOfStock = remainingStock <= 0

  const handleAddToCart = () => {
    const quantityToAdd = Math.min(quantity, remainingStock)
    if (quantityToAdd <= 0) {
      toast({
        title: "Estoque esgotado!",
        description: "Não há mais unidades disponíveis para este produto.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Adicionando produto ao carrinho:", product.name, "quantidade:", quantityToAdd)
    addItem(product, quantityToAdd)
    toast({
      title: "✅ Produto adicionado!",
      description: `${quantityToAdd}x ${product.name} adicionado ao carrinho`,
      duration: 2000,
    })
    setQuantity(1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md ${isOutOfStock ? 'opacity-70' : ''}`}>
      <CardContent className="p-2 sm:p-3">
        <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=200&width=200&query=bebida+gelada"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isOutOfStock ? (
            <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white shadow-lg text-xs">
              Indisponível
            </Badge>
          ) : (
            <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-emerald-500 text-white shadow-lg text-xs">
              {remainingStock} disponível
            </Badge>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg sm:text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex flex-col gap-2 w-full">
        <div className="flex items-center justify-center gap-1 sm:gap-2 w-full bg-gray-50 rounded-lg p-1 sm:p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-2 hover:bg-red-50 hover:border-red-200"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="font-bold text-sm sm:text-base min-w-[2rem] text-center bg-white px-2 py-1 rounded border">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))}
            disabled={quantity >= remainingStock || isOutOfStock}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-2 hover:bg-green-50 hover:border-green-200"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-xs sm:text-sm"
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="truncate">{isOutOfStock ? 'Indisponível' : 'Adicionar'}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}