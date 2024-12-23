'use client'

import { FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useLocalStorage from '@/hooks/useLocalStorage'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react'
import OrganizerCreateForm from '@/components/OrganizerCreateForm'

const CreateOrganizerPage: FC = () => {
  const router = useRouter()
  const [role, setRole] = useLocalStorage('role', '')

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/unauthorized') // Redirect to an unauthorized page
    }
  }, [router])

  return <div>
  <Navbar />
  <div className="max-w-2xl mx-auto p-4">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Crear Nuevo Organizador</h1>
      <Link 
        href="/" 
        className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </Link>
    </div>
    <OrganizerCreateForm />
  </div>
</div>
}

export default CreateOrganizerPage