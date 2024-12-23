'use client'

import ClientRow from "@/components/eventProfile/ClientRow"

export default function ClientTable({ attendees, sortOrder, setSortOrder }) {
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Phone</th>
            <th className="py-2 px-4 border-b text-left">Receive Emails</th>
            <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={handleSort}>
              Status {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {attendees?.map((attendee, index) => (
            <ClientRow key={index} attendee={attendee} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
