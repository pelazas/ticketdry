import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from './ui/input';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface CartProps {
  name: string;
  dateOfEvent: string;
  price: number;
  photo: string;
  commission: number;
  attendees: number;
  setAttendees: (attendees: number) => void;
}

export default function Cart({ name, dateOfEvent, price, photo, commission, attendees, setAttendees }: CartProps) {
  
  const formattedDate = dateOfEvent
    ? format(new Date(dateOfEvent), "EEEE dd 'de' MMMM, yyyy", { locale: es })
    : 'Fecha no disponible';

  const incrementAttendees = () => {
    if (attendees < 5) setAttendees(attendees + 1);
  };

  const decrementAttendees = () => {
    if (attendees > 1) setAttendees(attendees - 1);
  };

  const totalPrice = price * attendees + commission * attendees;

  return (
    <div className="w-full md:w-1/3 md:h-[calc(160vh)]">
      
      <div className="hidden md:block md:sticky md:top-24">
        <Card className="md:shadow-lg">
          <CardHeader className="bg-[#202020] text-white p-4">
            <CardTitle>TU CARRITO</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  <Image src={photo || '/placeholder.svg'} alt="Event" width={80} height={80} className="object-cover" />
                  <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                </div>
              </div>

              {/* Attendees input section */}
              <div className="flex items-center justify-between text-sm mt-4 ml-2">
                <span>Número de asistentes</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={decrementAttendees}
                    disabled={attendees <= 1}
                    className="text-white bg-[#3E31FA] hover:bg-[#3E31FA]/90 disabled:opacity-50 p-2 h-7 w-7 rounded-full"
                  >
                    <MinusIcon className="w-3 h-3 text-white" />
                  </Button>
                  <Input
                    type="number"
                    value={attendees}
                    readOnly
                    className="mx-2 text-center bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-12"
                    style={{ textAlign: 'center' }}
                  />
                  <Button
                    type="button"
                    onClick={incrementAttendees}
                    disabled={attendees >= 5}
                    className="text-white bg-[#3E31FA] hover:bg-[#3E31FA]/90 disabled:opacity-50 p-2 h-7 w-7 rounded-full"
                  >
                    <PlusIcon className="w-3 h-3 text-white" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>{attendees} x General</span>
                <span>{price},00€</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{price * attendees},00€</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Servicio</span>
                  <span>{commission * attendees},00€</span>
                </div>
              </div>
              <div className="flex justify-between font-bold pt-4 border-t">
                <span>Total</span>
                <span>{totalPrice},00€</span>
              </div>
              <Button className="w-full bg-[#3E31FA] hover:bg-[#3E31FA]/90 text-white">COMPLETA EL PEDIDO</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center justify-between px-4 pt-4 pb-0 bg-white border-t shadow-top">
          <span className='font-bold'>Número de asistentes</span>
          <div className="flex items-center">
            <Button
              type="button"
              onClick={decrementAttendees}
              disabled={attendees <= 1}
              className="text-white bg-[#3E31FA] hover:bg-[#3E31FA]/90 disabled:opacity-50 p-2 h-7 w-7 rounded-full"
            >
              <MinusIcon className="w-3 h-3 text-white" />
            </Button>
            <Input
              type="number"
              value={attendees}
              readOnly
              className="mx-2 text-center bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-12"
              style={{ textAlign: 'center' }}
            />
            <Button
              type="button"
              onClick={incrementAttendees}
              disabled={attendees >= 5}
              className="text-white bg-[#3E31FA] hover:bg-[#3E31FA]/90 disabled:opacity-50 p-2 h-7 w-7 rounded-full"
            >
              <PlusIcon className="w-3 h-3 text-white" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white ">
          <div className="flex items-center space-x-4">
            <Image src={photo || '/placeholder.svg'} alt="Event" width={50} height={50} className="object-cover" />
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">Total: {totalPrice},00€</p>
            <Button
              className="mt-2 bg-[#3E31FA] hover:bg-[#3E31FA]/90 text-white text-sm py-2 px-4 rounded cursor-pointer inline-block"
            >
              COMPLETA EL PEDIDO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
