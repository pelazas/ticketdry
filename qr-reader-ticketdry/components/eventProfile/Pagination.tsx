'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, setCurrentPage, pageCount }) {
  return (
    <div className="flex justify-end mt-4 space-x-2">
      <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount}>
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
