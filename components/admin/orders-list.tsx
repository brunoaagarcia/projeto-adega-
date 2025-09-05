"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, MessageCircle, Package, Trash2 } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  total: number
  subtotal: number
  deliveryFee: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  deliveryType: "pickup" | "delivery"
  address?: string | null
  observations?: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    total: number
  }>
  createdAt: string
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders)
    localStorage.setItem("orders", JSON.stringify(newOrders))
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm) ||
      order.customerPhone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      completed: { label: "Concluído", variant: "secondary" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    saveOrders(updatedOrders)
  }

  const deleteOrder = (orderId: string) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      const updatedOrders = orders.filter((order) => order.id !== orderId)
      saveOrders(updatedOrders)
    }
  }

  const openWhatsApp = (order: Order) => {
    const message = `Olá ${order.customerName}! Sobre seu pedido #${order.id} no valor de ${formatPrice(order.total)}. Como posso ajudá-lo?`
    const whatsappUrl = `https://wa.me/55${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pedidos ({orders.length} total, {todayOrders.length} hoje)
        </CardTitle>
        <CardDescription>Gerencie todos os pedidos recebidos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, ID ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Pedido #{order.id}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-blue-600">{formatPrice(order.total)}</p>
                  <Badge variant="outline" className="text-xs">
                    {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Cliente:</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  {order.customerEmail && <p className="text-sm text-gray-600">{order.customerEmail}</p>}
                </div>

                {order.address && (
                  <div>
                    <p className="text-sm font-medium">Endereço:</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Itens:</p>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa de entrega:</span>
                      <span>{formatPrice(order.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Pedido #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Cliente</h4>
                            <p>{selectedOrder.customerName}</p>
                            <p>{selectedOrder.customerPhone}</p>
                            {selectedOrder.customerEmail && <p>{selectedOrder.customerEmail}</p>}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Pedido</h4>
                            <p>Data: {formatDate(selectedOrder.createdAt)}</p>
                            <p>Status: {getStatusBadge(selectedOrder.status)}</p>
                            <p>Tipo: {selectedOrder.deliveryType === "delivery" ? "Entrega" : "Retirada"}</p>
                          </div>
                        </div>
                        {selectedOrder.address && (
                          <div>
                            <h4 className="font-semibold mb-2">Endereço</h4>
                            <p>{selectedOrder.address}</p>
                          </div>
                        )}
                        {selectedOrder.observations && (
                          <div>
                            <h4 className="font-semibold mb-2">Observações</h4>
                            <p>{selectedOrder.observations}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => openWhatsApp(order)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                <Select
                  value={order.status}
                  onValueChange={(value: Order["status"]) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => deleteOrder(order.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-400">
              {orders.length === 0
                ? "Os pedidos aparecerão aqui conforme forem sendo recebidos"
                : "Tente ajustar os filtros de busca"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
