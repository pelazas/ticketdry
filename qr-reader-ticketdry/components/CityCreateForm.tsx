'use client'

import { FC, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from 'react-toastify'
import { getToken } from '@/utils/auth'
import { useRouter } from 'next/navigation'

interface CityCreateFormProps {
  
}


type FormData = {
    name: string
    municipality: string
    photo: File | null
    isFeatured: boolean
  }

const CityCreateForm: FC<CityCreateFormProps> = ({}) => {

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<FormData>()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setValue('photo', acceptedFiles[0])
      setPreviewImage(URL.createObjectURL(acceptedFiles[0]))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  })

  const onSubmit = async (data: FormData) => {


    console.log("Form submitted with data:", data);


    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('municipality', data.municipality);
    formData.append('isFeatured', data.isFeatured.toString());
    formData.append('photo', data.photo);

    // Append all form fields to FormData
    // Object.keys(result).forEach(key => {
    //   if (key === 'image') {
    //     if (data.image instanceof File) {
    //       formData.append('image', data.image);
    //     } else if (typeof data.image === 'string' && data.image.startsWith('data:')) {
    //       // Convert base64 to File
    //       fetch(data.image)
    //         .then(res => res.blob())
    //         .then(blob => {
    //           const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    //           formData.append('image', file);
    //         });
    //     }
    //   } else {
    //     formData.append(key, result[key]);
    //   }
    // });
    
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city`, {
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
        toast.success('Ciudad creada correctamente!');
        router.push(`/admin`);
        console.log("Ciudad creada correctamente:", result);
      }
    } catch (error) {
      console.error('Error creando ciudad:', error);
      toast.error('Error creando la ciudad. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }

    // Here you would send formData to your API, but for now, it only logs it to the console
    console.log('FormData ready for submission:', formData);

    // Reset the form after submission
    reset();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Imagen</Label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            {previewImage ? (
              <img src={previewImage} alt="Vista previa" className="mx-auto max-h-48 object-cover" />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Inserta imagen de la ciudad'}
                </p>
                <p className="text-xs text-gray-400">
                  Soporta JPG, JPEG, PNG
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register('name', { required: 'El nombre es obligatorio' })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipality">Municipio</Label>
          <Input id="municipality" {...register('municipality', { required: 'El municipio es obligatorio' })} />
          {errors.municipality && <p className="text-sm text-red-500">{errors.municipality.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <Switch
                id="isFeatured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isFeatured">Destacada</Label>
        </div>

        <Button type="submit" className="w-full">Crear Ciudad</Button>
      </form>
    </div>
  )
}

export default CityCreateForm