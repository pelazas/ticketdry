"use client"

import Image from "next/image"
import Navbar from "../../../components/Header"
import Footer from "../../../components/Footer"
import EventCard from "../../../components/EventCard"
import Gallery from "../../../components/Gallery"
import SuscribeForm from "../../../components/SubscribeForm"
import { Event } from "@/components/FeaturedEvents"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Organizer = {
  name: string,
  description: string,
  email: string,
  profilePhoto: string,
  photos: string[],
  events: Event[],
}

const OrganizerProfile = () => {
  const {nameoforganizer} = useParams();

  const [organizerData, setOrganizerData] = useState<Organizer>()

  useEffect(() => {
    const fetchOrganizer = async () => {
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizer/${nameoforganizer}`, {
          next: { 
            revalidate: 3600,
          },
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
    
        if (!res.ok) {
          throw new Error('Failed to fetch featured events');
        }

        const data = await res.json();
        setOrganizerData(data);
      } catch (error) {
        console.error('Error fetching featured events:', error);
        return []; // Return an empty array or some fallback data
      }
    }

    if(nameoforganizer){
      fetchOrganizer();
    }

  },[nameoforganizer])

  console.log(organizerData)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Blurred background */}
      <div className="absolute w-full h-[75vh] z-0">
        <Image
          src={organizerData?.profilePhoto || "/placeholder.svg"}
          alt="Blurred background"
          layout="fill"
          objectFit="cover"
          className="filter blur-sm"
          unoptimized
        />
      </div>

      {/* Main content */}
      <main className="flex-grow z-10 container mx-auto px-4 py-8 mt-16">
        {/* Organizer profile and events */}
        <div className="bg-background rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Organizer image */}
            <div className="md:w-1/2">
              <Image
                src={organizerData?.profilePhoto || "/placeholder.svg"}
                alt="Event organizer"
                width={600}
                height={600}
                className="w-full h-full"
                unoptimized
                layout="contain"
              />
            </div>
            {/* Events list */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold mb-4">{organizerData?.name}</h1>
              <h2 className="text-xl font-semibold mb-4">Próximos eventos ({organizerData?.events.length})</h2>
              <div className="space-y-4">
                {organizerData?.events.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Gallery photos={organizerData?.photos}/>

      </main>
      <SuscribeForm />
      <Footer />
    </div>
  )
}

export default OrganizerProfile;