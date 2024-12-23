'use client'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getToken } from '@/utils/auth'
import { format, parseISO } from 'date-fns';
import Image from 'next/image'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

type FormData = {
  name: string;
  photo: string | File;
  dateOfEvent: string;
  limitDateToBuy: string;
  price: number;
  maxNOfPeople: number;
  commission: number;
  status: boolean;
  featured: boolean;
  photoFile: File;
  location: string;
}

export default function EventEditForm() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      photo: '',
      dateOfEvent: '',
      limitDateToBuy: '',
      price: 0,
      maxNOfPeople: 0,
      commission: 0,
      status: false,
      featured: false,
      photoFile: null,
      location: '',
    }
  });

  // fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/id/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data)
        // Convert date strings to the correct format
        const formattedData = {
          ...data,
          dateOfEvent: data.dateOfEvent ? format(parseISO(data.dateOfEvent), 'yyyy-MM-dd') : '',
          limitDateToBuy: data.limitDateToBuy ? format(parseISO(data.limitDateToBuy), 'yyyy-MM-dd') : '',
          status: data.status == 'active' ? true : false,
        };
        delete formattedData.clientsFullInformation;
        delete formattedData.organizer;
        
        reset(formattedData);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [eventId, reset]);

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);

    const result = data as any;
    result.status = result.status ? 'active' : 'inactive';

    const formData = new FormData();

    // Append all form fields to FormData
    Object.keys(result).forEach(key => {
      if (key === 'photo') {
        if (data.photo instanceof File) {
          formData.append('photo', data.photo);
        } else if (typeof data.photo === 'string' && data.photo.startsWith('data:')) {
          // Convert base64 to File
          fetch(data.photo)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
              formData.append('photo', file);
            });
        }
      } else {
        formData.append(key, result[key]);
      }
    });

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/id/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove 'Content-Type' header to let the browser set it automatically with the boundary
        },
        body: formData
      });
      const result = await response.json();
      // handle response, if there is an error, show it in the toast
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Evento actualizado correctamente!');
        router.push(`/event/${eventId}`);
        console.log("Event updated successfully:", result);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Error actualizando el evento. Por favor, inténtalo de nuevo.');
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      reset({ ...control._formValues, photo: file })
    }
  }, [reset, control._formValues])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="photo">Foto del evento</Label>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <div
                {...getRootProps()}
                className="relative w-full h-64 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <input {...getInputProps()} />
                {field.value ? (
                  <Image
                    src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                    alt="Event photo"
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      {isDragActive
                        ? "Drop the image here"
                        : "Click or drag to upload an image"}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white">Cambiar imagen</p>
                </div>
              </div>
            )}
          />
        </div>
        <div>
          <Label htmlFor="name">Nombre del evento</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="location">Ubicación del evento</Label>
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="dateOfEvent">Día del evento</Label>
          <Controller
            name="dateOfEvent"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="limitDateToBuy">Día limite de compra</Label>
          <Controller
            name="limitDateToBuy"
            control={control}
            rules={{ required: "Ticket limit date is required" }}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="price">Precio</Label>
          <Controller
            name="price"
            control={control}
            rules={{ required: "Price is required", min: 0 }}
            render={({ field }) => <Input type="number" min="0" step="0.01" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="maxNOfPeople">Máximo de tickets vendidos</Label>
          <Controller
            name="maxNOfPeople"
            control={control}
            rules={{ required: "Max number of people is required", min: 0 }}
            render={({ field }) => <Input type="number" min="0" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="commission">Comisión</Label>
          <Controller
            name="commission"
            control={control}
            rules={{ required: "Commission is required", min: 0 }}
            render={({ field }) => <Input type="number" min="0" step="0.01" {...field} />}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="status">Evento activo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="featured">Presentado en portada (www.ticketdry.com)</Label>
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </>
  )
}