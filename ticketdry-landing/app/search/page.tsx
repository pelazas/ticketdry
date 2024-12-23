"use client"

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface Event {
  _id: string
  name: string
  dateOfEvent: string
  photo: string
  price: number
  commission: number
  maxNOfPeople: number
  clients: any[]
  organizer: string,
  location: string
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    // fetch events from backend
    const fetchEvents = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/all`)
      const data = await response.json()
      setEvents(data)
    }
    fetchEvents()
  }, []) // Empty dependency array as we only want to fetch events once when the component mounts

  const filterEvents = useCallback((query: string) => {
    const filteredEvents = events.filter(event => 
      event.name.toLowerCase().includes(query.toLowerCase())
    )
    setEvents(filteredEvents)
  }, [events])

  useEffect(() => {
    const query = searchParams.get('content')
    if (query) {
      setSearchQuery(query)
      filterEvents(query)
    }
  }, [searchParams, filterEvents])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`?content=${encodeURIComponent(searchQuery)}`)
    filterEvents(searchQuery)
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/checkout?eventId=${eventId}`)
  }

  return (
    <>
      <div className="bg-[#3E31FA]">
        <h1 className="text-3xl font-bold text-center mb-8 text-white pt-16">Buscar Eventos</h1>
        <form onSubmit={handleSubmit} className="flex justify-center flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pb-16">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar Eventos"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l-md flex-1 bg-white text-gray-900 placeholder-gray-500 md:h-10"
          />
          <Button 
            type="submit" 
            className="bg-yellow-400 text-[#3E31FA] hover:bg-yellow-300 md:h-10"
          >
              <Search className="h-4 w-4 sm:mr-2" />
            Buscar
          </Button>
        </form>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Eventos Disponibles</h2>
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map((event) => {
                const formattedDate = new Date(event.dateOfEvent).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                return (
              <li 
                key={event._id} 
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={() => handleEventClick(event._id)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                  <p className="text-gray-600">Día: {formattedDate}</p>
                  <p className="text-gray-600">Ubicación: {event.location}</p>
                </div>
                <div className="w-24 h-24 flex-shrink-0">
                  <Image 
                    src={event.photo} 
                    alt={event.name} 
                    className="w-full h-full object-cover rounded-md"
                    width={96}
                    height={96}
                    layout="contain"
                  />
                </div>
              </li>
            )})}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No se encontraron eventos que coincidan con su búsqueda.</p>
        )}
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageContent />
      </Suspense>
      <Footer />
    </div>
  )
}