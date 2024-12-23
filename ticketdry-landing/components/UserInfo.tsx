import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormContext } from 'react-hook-form'

export default function UserInfo() {

  const { register, formState: { errors }, watch } = useFormContext();
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Tu información</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name', { required: "El nombre es obligatorio" })}/>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="surname">Apellidos</Label>
              <Input id="surname" {...register('surname', { required: "Los apellidos son obligatorios" })}/>
              {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                {...register('email', { 
                  required: "El correo electrónico es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "El formato del correo electrónico no es válido"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="confirmEmail">Confirma Correo Electrónico</Label>
              <Input 
                id="confirmEmail" 
                type="email" 
                {...register('confirmEmail', { 
                  required: "La confirmación del correo electrónico es obligatoria",
                  validate: (value) => value === watch('email') || "Los correos electrónicos no coinciden"
                })}
              />
              {errors.confirmEmail && <p className="text-red-500 text-xs mt-1">{errors.confirmEmail.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" {...register('phone', { required: true })}/>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}