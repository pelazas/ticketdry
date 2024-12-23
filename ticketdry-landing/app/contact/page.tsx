'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface pageProps {
  
}

const Page: FC<pageProps> = ({}) => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {

    const formattedData = JSON.stringify(data)
    console.log(formattedData)
    reset()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formattedData,
    })
    const responseData = await response.json()
    console.log('Response data:', responseData);
  };

  return (
    <div>
        <Header />
        <main className="flex-grow bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
            <div className="bg-white shadow-lg overflow-hidden w-full max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row">
                <div className="bg-indigo-600 text-white p-8 lg:w-1/3">
                <div className="sticky top-8">
                    <h2 className="text-2xl font-bold mb-4">CONTÁCTANOS</h2>
                    <p className="mb-4">Estamos aquí para responder a tus preguntas y resolver tus problemas 24/7</p>
                    <p className="mb-4">TicketDRY facilita la venta de entradas en línea para todo tipo de eventos. Conectamos a organizadores con su audiencia de manera fácil y segura.</p>
                </div>
                </div>
                <div className="lg:w-2/3 flex flex-col md:flex-row">
                <div className="hidden md:block w-full md:w-1/2 relative">
                    <Image
                    src="/undraw_personal_email_re_4lx7.svg"
                    alt="Imagen de evento"
                    layout="fill"
                    objectFit="contain"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 bg-white">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input id="nombre" {...register('name')} type="text" required className="mt-1" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <Input id="email" {...register('email')} type="email" required className="mt-1" />
                    </div>
                    <div>
                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">Mensaje</label>
                        <Textarea id="mensaje" {...register('message')} rows={4} required className="mt-1" />
                    </div>
                    <Button type="submit" className="w-full">Enviar</Button>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </main>
        <Footer />
    </div>
  )
}

export default Page


