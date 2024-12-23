import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface AdditionalGuestsProps {
  attendees: number;
  attendeesNames: string[];
  setAttendeesNames: (names: string[]) => void;
}

const AdditionalGuests: FC<AdditionalGuestsProps> = ({attendees, attendeesNames, setAttendeesNames}) => {
    const { register } = useFormContext();

    const handleAttendeesNamesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newNames = [...attendeesNames];
        newNames[index] = e.target.value;
        setAttendeesNames(newNames);
    }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Nombre de los asistentes</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: attendees }).map((_, index) => (
              <div key={index}>
                <Label htmlFor={`name-${index}`}>Nombre completo {index + 1}</Label>
                <Input id={`name-${index}`} {...register(`name_${index}`, { required: "El nombre es obligatorio" })} onChange={(e) => handleAttendeesNamesChange(e, index)}/>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default AdditionalGuests