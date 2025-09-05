"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleCheckout = () => {
    console.log("[v0] Iniciando checkout, fechando carrinho...")
    console.log("[v0] Items no carrinho:", items.length)
    console.log("[v0] Redirecionando para /checkout")

    onClose()
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    onClose()
    router.push("/loja")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full p-4">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 mt-2">Adicione produtos para continuar</p>
                <Button onClick={handleContinueShopping} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-xl bg-white shadow-sm">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=48&width=48&query=bebida"}
                          alt={item.name || "Produto"}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900">
                          {item.name || "Produto sem nome"}
                        </h4>
                        <p className="text-blue-600 font-bold text-sm">{formatPrice(item.price || 0)}</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-bold min-w-[1.5rem] text-center px-2">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= (item.stock || 0)}
                              className="h-6 w-6 p-0 hover:bg-green-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4 bg-gray-50 -mx-6 px-6 pb-6 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-900">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Taxa de entrega:</span>
                    <span>Será calculada no checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    Finalizar Pedido
                  </Button>

                  <Button
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="w-full bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    size="lg"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
