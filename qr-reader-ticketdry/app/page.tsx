'use client';

import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import useLocalStorage from '@/hooks/useLocalStorage';
import Link from "next/link"
import { CalendarDays, MoreHorizontal, Users, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from 'react-toastify';
import { getToken } from '@/utils/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

function AdministrarEventos() {
  const [eventData, setEventData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [organizerId, setOrganizerId] = useLocalStorage('organizerId', '');

  useEffect(() => {
    const fetchEventData = async () => {
      
      
      if (organizerId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${organizerId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch event data');
          }
          const data = await response.json();
          setEventData(data);
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      } else {
        console.log('No organizerId found in localStorage');
      }
    };

    fetchEventData();
  }, []);

  const handleDeleteEventClick = async (eventId) => {
    setSelectedEventId(eventId);
    setIsDeleteModalOpen(true);
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/id/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the deleted event from the state
      setEventData(prevData => prevData.filter(event => event._id !== eventId));
      
      // toast success
      toast.success('Evento eliminado correctamente');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error eliminando evento:', error);
      toast.error('Error eliminando evento');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-5 mt-10 mx-4">
          <h1 className="text-2xl font-bold">Administración de Eventos</h1>
          <Link href="/event/create" className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Crear evento
          </Link>
        </div>
        <div className="rounded-md border m-4">
          <Table>
            <TableHeader className="bg-gray-200 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[100px] px-4">Imagen</TableHead>
                <TableHead className="px-4">Nombre del Evento</TableHead>
                <TableHead className="px-4">Fecha</TableHead>
                <TableHead className="px-4">Asistentes</TableHead>
                <TableHead className="px-4">Estado</TableHead>
                <TableHead className="text-right px-4">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventData ? (
                eventData.length > 0 ? (
                  eventData.map((event) => (
                    <TableRow key={event._id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="px-4">
                        <Image
                          src={event.photo}
                          alt={event.name}
                          className="w-12 h-12 rounded-full object-cover"
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell className="px-4">
                        <Link href={`/events/${event.id}`} className="font-medium">
                          {event.name}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(event.dateOfEvent).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {event.clients.length} / {event.maxNOfPeople}
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        {event.status}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link href={`/event/${event._id}`}>Ver detalles</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/event/${event._id}/edit`}>Editar evento</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleDeleteEventClick(event._id)} className="cursor-pointer hover:bg-red-500">
                              Eliminar evento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No hay datos
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              Estás seguro de que quieres eliminar el evento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDeleteEvent(selectedEventId)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdministrarEventos;