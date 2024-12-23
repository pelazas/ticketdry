'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import EventHeader from '../../../components/eventProfile/EventHeader'
import EventDetails from '../../../components/eventProfile/EventDetails'
import ClientTable from '../../../components/eventProfile/ClientTable'
import Pagination from '../../../components/eventProfile/Pagination'
import Navbar from '@/components/Navbar'
import { useParams } from 'next/navigation'

const eventData = {
  name: 'Summer Music Festival 2024',
  image: '/placeholder.svg?height=100&width=100',
  date: '2024-07-15',
  ticketLimit: '2024-07-01',
  price: '$150',
  commission: '$15',
  organizer: 'Melody Productions',
  maxAttendees: 5000,
  status: 'Active',
}

type EventType = {
  name: string
  image: string
  date: string
  ticketLimit: string
  price: string
  commission: string
  organizer: string
  maxAttendees: number
  clientsFullInformation: ClientType[]
}

type ClientType = {
  name: string
  surname: string
  email: string
  phone: string
  receiveEmails: boolean,
  attendees: AttendeeType[]
}

type AttendeeType = {
  name: string
  status: string
  scanType: string
  clientId: string
}

export default function EventDetailsPage() {
  const [attendees, setAttendees] = useState<AttendeeType[]>([])
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc')
  const itemsPerPage = 5

  //get the eventid from the url
  const { eventId } = useParams();


  useEffect(() => {
    const fetchEventData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/fullId/${eventId}`)
      const data = await response.json()
      setEventData(data)
      setAttendees(data.clientsFullInformation.flatMap(client => client.attendeesFullInformation))
    }

    fetchEventData()
  }, [eventId])

  const filteredAndSortedAttendees = useMemo(() => {
    console.log("attendees", attendees)
    if (!attendees) return [];

    return attendees
      .filter((attendee) =>
        (filterStatus === 'all' || attendee.status === filterStatus) &&
        (attendee.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.status.localeCompare(b.status)
        return b.status.localeCompare(a.status)
      })
  }, [attendees, filterStatus, searchTerm, sortOrder])

  const pageCount = Math.ceil(filteredAndSortedAttendees.length / itemsPerPage)
  const paginatedAttendees = filteredAndSortedAttendees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <Navbar />
    
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <EventHeader eventData={eventData} />
      <EventDetails eventData={eventData} />
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Search clients..."
          className="max-w-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="checked-in">Checked-in</option>
        </select>
      </div>
      <ClientTable attendees={paginatedAttendees} sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pageCount} />
    </div>
    </div>
  )
}
