import useLocalStorage from '@/hooks/useLocalStorage';
import { getToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { X } from 'lucide-react'; // Import the X icon from lucide-react or any other icon library you prefer

interface FormData {
    name: string;
    profilePhoto: string | File;
    description: string;
    email: string;
    photos: File[];
    city: string;
}


const OrganizerCreateForm: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [organizerId, setOrganizerId] = useLocalStorage('organizerId', '');


  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/no-images`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Error cargando las ciudades');
      }
    };

    fetchCities();
  }, []);
  
    const { control, handleSubmit, reset, setValue } = useForm<FormData>({
      defaultValues: {
        name: '',
        profilePhoto: '',
        description: '',
        email: '',
        photos: [],
      }
    });    
    
    const [photos, setPhotos] = useState<File[]>([]);
  
    const onSubmit = async (data: FormData) => {
        data = {
            ...data,
            photos: photos
        }
        console.log("Form submitted with data:", data);
        const formData = new FormData();

        // Append all form fields to FormData
        Object.keys(data).forEach(key => {
            if (key === 'profilePhoto') {
                if (data.profilePhoto instanceof File) {
                    formData.append('profilePhoto', data.profilePhoto);
                } else if (typeof data.profilePhoto === 'string' && data.profilePhoto.startsWith('data:')) {
                    // Convert base64 to File
                    fetch(data.profilePhoto)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
                        formData.append('profilePhoto', file);
                    });
                }
            } else if (key === 'photos') {
                data.photos.forEach(photo => {
                    if (photo instanceof File) {
                        formData.append('photos', photo);
                    }
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
        const result = await response.json();
        // handle response, if there is an error, show it in the toast
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Organizador creado correctamente!');
          router.push(`/admin`);
          console.log("Organizer created successfully:", result);
        }
      } catch (error) {
        console.error('Error creando organizador:', error);
        toast.error('Error creando organizador. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }

  
      // Reset the form after submission
      reset();
    }
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        reset({ ...control._formValues, profilePhoto: file })
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



    const onDropPhotos = useCallback((acceptedFiles: File[]) => {
        setPhotos(prevPhotos => [...prevPhotos, ...acceptedFiles]);
      }, []);

    const removePhoto = useCallback((index: number) => {
        setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
      }, []);

    const { getRootProps: getPhotosRootProps, getInputProps: getPhotosInputProps, isDragActive: isPhotosDragActive } = useDropzone({
    onDrop: onDropPhotos,
    accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png']
    },
    multiple: true
    });
  
    return <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="profilePhoto">Foto del organizador</Label>
        <Controller
          name="profilePhoto"
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
        <Label htmlFor="name">Nombre del organizador</Label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <div>
          <Label htmlFor="city">Ciudad</Label>
          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona una ciudad</option>
                {cities?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      <div>
        <Label htmlFor="photos">Fotos adicionales del evento</Label>
        <Controller
          name="photos"
          control={control}
          render={() => (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-md object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div
                {...getPhotosRootProps()}
                className="relative w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <input {...getPhotosInputProps()} />
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center text-sm">
                    {isPhotosDragActive
                      ? "Suelta las imágenes aquí"
                      : photos.length > 0
                      ? "+"
                      : "Haz clic o arrastra para subir más imágenes"}
                  </p>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear organizador'}
      </Button>
    </form>

    <Dialog open={isLoading} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Creando Organizador</DialogTitle>
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold">Creando Organizador</p>
        </div>
      </DialogContent>
    </Dialog>
  </>
}

export default OrganizerCreateForm