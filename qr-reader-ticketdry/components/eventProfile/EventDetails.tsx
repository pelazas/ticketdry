'use client'

export default function EventDetails({ eventData }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
        <p><strong>Date:</strong> {new Date(eventData?.dateOfEvent).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
        <p><strong>Ticket Limit Date:</strong> {new Date(eventData?.limitDateToBuy).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
        <p><strong>Price:</strong> {eventData?.price}</p>
        <p><strong>Commission:</strong> {eventData?.commission}</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Organizer Information</h2>
        <p><strong>Location:</strong> {eventData?.location}</p>
        <p><strong>Max Attendees:</strong> {eventData?.maxNOfPeople}</p>
        <p><strong>Status:</strong> {eventData?.status}</p>
      </div>
    </div>
  )
}
