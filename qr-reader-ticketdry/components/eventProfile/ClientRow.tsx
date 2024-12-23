'use client'

export default function ClientRow({ attendee, index }) {
  return (
    <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
      <td className="py-2 px-4 border-b">{attendee?.name}</td>
      <td className="py-2 px-4 border-b">{attendee?.email}</td>
      <td className="py-2 px-4 border-b">{attendee.phone}</td>
      <td className="py-2 px-4 border-b">{attendee.receiveEmails ? 'Yes' : 'No'}</td>
      <td className="py-2 px-4 border-b">
        <span className={`px-2 py-1 rounded-full text-xs ${
          attendee?.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
        }`}>
          {attendee?.status}
        </span>
      </td>
    </tr>
  )
}
