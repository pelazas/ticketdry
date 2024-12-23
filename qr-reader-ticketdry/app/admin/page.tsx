"use client"
import React, { FC, useEffect, useState } from 'react'
import Navbar from "../../components/Navbar";
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Users, Plus, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation';
import useLocalStorage from '../../hooks/useLocalStorage';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from "../../components/ui/button"

interface Organizer {
  _id: string;
  name: string;
  description: string;
  email: string;
  profilePhoto: string;
  minPrice: number;
}

const AdminPage: FC = () => {

    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const router = useRouter();
    const [organizerId, setOrganizerId] = useLocalStorage('organizerId', '');
    // get list of organizers, display them in a table
    // be able to select an organizer and view their events
    // be able to add an organizer
    // be able to edit an organizer
    // be able to delete an organizer
    useEffect(() => {
        const fetchOrganizers = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizer`);
            if (!response.ok) {
                throw new Error('Failed to fetch event data');
              }

            const data = await response.json();
            setOrganizers(data);
        }
        fetchOrganizers();
    }, []);

    const handleOrganizerClick = (organizerId: string) => {
        // add to local storage organizerId
        setOrganizerId(organizerId);
        // redirect to /
        router.push('/');
    }

    const handleDeleteOrganizer = async (organizerId) => {
        // try {
        //   const token = await getToken();
        //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/id/${eventId}`, {
        //     method: 'DELETE',
        //     headers: {
        //       'Authorization': `Bearer ${token}`
        //     }
        //   });
    
        //   if (!response.ok) {
        //     throw new Error('Failed to delete event');
        //   }
    
        //   // Remove the deleted event from the state
        //   setEventData(prevData => prevData.filter(event => event._id !== eventId));
          
        //   // toast success
        //   toast.success('Evento eliminado correctamente');
        //   setIsDeleteModalOpen(false);
        // } catch (error) {
        //   console.error('Error eliminando evento:', error);
        //   toast.error('Error eliminando evento');
        // }
      };

      const handleDeleteOrganizerClick = async (organizerId) => {
        setSelectedOrganizerId(organizerId);
        setIsDeleteModalOpen(true);
      }

  return <div>
    <Navbar />
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-5 mt-10 mx-4">
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          <div className="flex gap-2">
          <Link href="/city/create" className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Crear ciudad
          </Link>
          <Link href="/organizer/create" className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Crear organizador
          </Link>
          </div>
        </div>
        <div className="rounded-md border m-4">
          <Table>
            <TableHeader className="bg-gray-200 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[100px] px-4">Imagen</TableHead>
                <TableHead className="px-4">Nombre del Evento</TableHead>
                <TableHead className="px-4">Email</TableHead>
                <TableHead className="px-4">Ir al organizador</TableHead>
                <TableHead className="text-right px-4">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizers ? (
                organizers.length > 0 ? (
                  organizers.map((organizer) => (
                    <TableRow key={organizer._id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="px-4">
                        <Image
                          src={organizer.profilePhoto}
                          alt={organizer.name}
                          className="w-12 h-12 rounded-full object-cover"
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {organizer.name}
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {organizer.email}
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <Button onClick={() => handleOrganizerClick(organizer._id)} className="font-medium">
                          Ir al organizador
                        </Button>
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
                              <Link href={`/organizer/${organizer._id}/edit`}>Editar organizador</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleDeleteOrganizer(organizer._id)} className="cursor-pointer hover:bg-red-500">
                              Eliminar organizador
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
              onClick={() => handleDeleteOrganizer(selectedOrganizerId)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
    </div>
}

export default AdminPage