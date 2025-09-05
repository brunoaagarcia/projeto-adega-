import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Snowflake } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 text-balance">Abaixo de Zero</h1>
            <Snowflake className="h-10 w-10 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Sua adega online com os melhores vinhos e bebidas geladas
          </p>
        </div>

        <div className="flex justify-center max-w-md mx-auto">
          <Card className="hover:shadow-lg transition-shadow w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                Nossa Adega
              </CardTitle>
              <CardDescription className="text-center">Explore nossa seleção de vinhos e bebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/loja">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Entrar na Adega</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Como funciona?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <p>Navegue pelos vinhos e bebidas</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <p>Adicione itens ao carrinho</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <p>Finalize via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600">
            Área Administrativa
          </Link>
        </div>
      </div>
    </div>
  )
}
