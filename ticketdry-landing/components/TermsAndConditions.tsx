import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormContext } from "react-hook-form";

export default function TermsAndConditions() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Términos y Condiciones</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms"
                checked
                {...register('terms', { 
                  required: "Debes aceptar los términos y condiciones para continuar" 
                })}
              />
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message as string}</p>}
              <label htmlFor="terms" className="text-sm">
                Por favor, lee y acepta los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> para proceder con tu pedido
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="newsletter" {...register('newsletter', { required: false })}/>
              <label htmlFor="newsletter" className="text-sm">
                Doy consentimiento a recibir emails para nuevos eventos
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}