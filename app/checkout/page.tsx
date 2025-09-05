"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, MapPin, Store, Snowflake } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
  })

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("pickup")
  const [addressData, setAddressData] = useState({
    street: "",
    neighborhood: "",
    city: "",
    reference: "",
  })
  const [observations, setObservations] = useState("")

  const deliveryFee = 10.0
  const finalTotal = deliveryType === "delivery" ? total + deliveryFee : total

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (items.length === 0) {
        router.push("/loja")
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [items, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
  }

  const generateWhatsAppMessage = () => {
    const itemsList = items.map((item) => `• ${item.name} - Qtd: ${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n")
    const fullAddress = deliveryType === "delivery" ? `${addressData.street}, ${addressData.neighborhood}, ${addressData.city}${addressData.reference ? ` - Ref: ${addressData.reference}` : ""}` : ""
    const deliveryInfo = deliveryType === "delivery" ? `📍 *Entrega:* ${fullAddress}\n💰 *Taxa de entrega:* ${formatPrice(deliveryFee)}` : `🏪 *Retirada:* Na loja (Grátis)`
    const message = `🍷 *NOVO PEDIDO - Abaixo de Zero*\n\n👤 *Cliente:* ${customerData.name}\n📱 *Telefone:* ${customerData.phone}\n\n\n🛒 *Produtos:*
${itemsList}\n\n*Subtotal:* ${formatPrice(total)}\n\n${deliveryInfo}\n\n💰 *TOTAL FINAL:* ${formatPrice(finalTotal)}\n\n${observations ? `📝 *Observações:* ${observations}` : ""}\n\n---\nPedido gerado automaticamente pelo site`
    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerData.name || !customerData.phone) {
      toast({ title: "Dados incompletos", description: "Por favor, preencha nome e telefone", variant: "destructive" })
      return
    }
    if (deliveryType === "delivery" && (!addressData.street || !addressData.neighborhood || !addressData.city)) {
      toast({ title: "Endereço incompleto", description: "Por favor, preencha rua, bairro e cidade para entrega", variant: "destructive" })
      return
    }
    const order = {
      id: Date.now().toString(),
      customerName: customerData.name,
      customerPhone: customerData.phone,
      total: finalTotal,
      subtotal: total,
      deliveryFee: deliveryType === "delivery" ? deliveryFee : 0,
      status: "pending",
      deliveryType,
      address: deliveryType === "delivery" ? `${addressData.street}, ${addressData.neighborhood}, ${addressData.city}${addressData.reference ? ` - Ref: ${addressData.reference}` : ""}` : null,
      observations,
      items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price, total: item.price * item.quantity })),
      createdAt: new Date().toISOString(),
    }
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("orders", JSON.stringify(existingOrders))
    const whatsappNumber = "5517991725731"
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    clearCart()
    window.open(whatsappUrl, "_blank")
    toast({ title: "Pedido enviado!", description: "Você será redirecionado para o WhatsApp" })
    setTimeout(() => { router.push("/loja") }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Snowflake className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando checkout...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 shadow-lg border-b-4 border-blue-900 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <Link href="/loja">
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 flex-shrink-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Voltar à Loja</span>
              </Button>
            </Link>

            <div className="flex items-center gap-2 overflow-hidden">
              <Snowflake className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                Finalizar Pedido
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="flex-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input id="name" value={customerData.name} onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Seu nome completo" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                      <Input id="phone" value={customerData.phone} onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))} placeholder="(11) 99999-9999" required />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Label>Forma de Recebimento</Label>
                    <RadioGroup value={deliveryType} onValueChange={(value: "delivery" | "pickup") => setDeliveryType(value)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg"><RadioGroupItem value="pickup" id="pickup" /><Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer"><Store className="h-4 w-4" />Retirar na loja (Grátis)</Label></div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg"><RadioGroupItem value="delivery" id="delivery" /><Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer"><MapPin className="h-4 w-4" />Entrega ({formatPrice(deliveryFee)})</Label></div>
                    </RadioGroup>
                    {deliveryType === "delivery" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-900">Endereço de Entrega</h4>
                        <div><Label htmlFor="street">Rua e Número *</Label><Input id="street" value={addressData.street} onChange={(e) => setAddressData((prev) => ({ ...prev, street: e.target.value }))} placeholder="Ex: Rua das Flores, 123" required={deliveryType === "delivery"} /></div>
                        <div><Label htmlFor="neighborhood">Bairro *</Label><Input id="neighborhood" value={addressData.neighborhood} onChange={(e) => setAddressData((prev) => ({ ...prev, neighborhood: e.target.value }))} placeholder="Ex: Centro" required={deliveryType === "delivery"} /></div>
                        <div><Label htmlFor="city">Cidade *</Label><Input id="city" value={addressData.city} onChange={(e) => setAddressData((prev) => ({ ...prev, city: e.target.value }))} placeholder="Ex: São Paulo" required={deliveryType === "delivery"} /></div>
                        <div><Label htmlFor="reference">Ponto de Referência (opcional)</Label><Input id="reference" value={addressData.reference} onChange={(e) => setAddressData((prev) => ({ ...prev, reference: e.target.value }))} placeholder="Ex: Próximo ao mercado" /></div>
                      </div>
                    )}
                  </div>
                  <div><Label htmlFor="observations">Observações</Label><Textarea id="observations" value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Alguma observação sobre o pedido..." /></div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg"><MessageCircle className="h-5 w-5 mr-2" />Confirmar Pedido no WhatsApp</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-2/5 lg:order-1">
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg?height=64&width=64&query=produto"} alt={item.name} fill className="object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity} × {formatPrice(item.price)}</p>
                      <p className="font-semibold text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><span>Subtotal:</span><span>{formatPrice(total)}</span></div>
                  {deliveryType === "delivery" && (<div className="flex justify-between items-center text-sm text-gray-600"><span>Taxa de entrega:</span><span>{formatPrice(deliveryFee)}</span></div>)}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold"><span>Total:</span><span className="text-blue-600">{formatPrice(finalTotal)}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}