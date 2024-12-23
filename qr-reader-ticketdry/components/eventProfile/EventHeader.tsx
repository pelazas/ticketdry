'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

export default function EventHeader({ eventData }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        
        <Image
          src={eventData?.photo}
          alt={eventData?.name}
          width={100}
          height={100}
          className="rounded-lg shadow-lg"
        />
        <h1 className="text-4xl font-bold">{eventData?.name}</h1>
      </div>
      <Link href={`/event/${eventData?._id}/edit`} passHref>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" /> Edit Event
        </Button>
      </Link>
    </div>
  )
}
