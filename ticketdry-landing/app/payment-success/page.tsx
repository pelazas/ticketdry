"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="flex flex-col items-center p-6 space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h1 className="text-2xl font-bold text-center">¡Pago Exitoso!</h1>
          <p className="text-gray-600 text-center">Tu pago ha sido completado.</p>
          <p className="text-gray-600 text-center">Revisa tu correo electrónico para la confirmación.</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push('/')}>
            Finalizar
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center items-center p-4 text-xs text-gray-500">
          <span>Pagos seguros</span>
          <span className="mx-2">•</span>
          <span>Desarrollado por Stripe</span>
        </CardFooter>
      </Card>
    </div>
  )
}