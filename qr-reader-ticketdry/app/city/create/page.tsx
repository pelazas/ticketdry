"use client"
import CityCreateForm from '@/components/CityCreateForm'
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return <div>
    <Navbar />
    <div className="max-w-2xl mx-auto p-4">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Crear Nueva Ciudad</h1>
      <Link 
        href="/" 
        className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </Link>
    </div>
    <CityCreateForm />
  </div>
  </div>
}

export default page