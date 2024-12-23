import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Event } from "./FeaturedEvents";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.dateOfEvent), "EEEE dd 'de' MMMM, yyyy", { locale: es });

  const formattedLimitDateToBuy = format(new Date(event.limitDateToBuy), "dd/MM/yyyy", { locale: es });
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Format price with two decimals
  //const formattedPrice = (event.price + event.commission).toFixed(2);

  const formattedPrice = event.price.toFixed(2);

  return (
    <Card className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleDropdown}>
        <div className="flex items-center">
          <Image src={event.photo} alt={event.name} width={50} height={50} className="rounded-sm mr-4 h-16 w-16 object-cover" unoptimized />
          <div>
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-muted-foreground">Fecha: {formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center">
          {/* Price next to the icon */}
          {!isOpen && <p className="font-semibold mr-2">{formattedPrice}€</p>}
          {isOpen ? (
            <ChevronUpIcon className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Dropdown Section */}
      {isOpen && (
        <div className="mt-4">
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Disponible hasta:</span> {formattedLimitDateToBuy}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Precio:</span> {formattedPrice}€
              </p>
            </div>
            {/* Link button with "Comprar" text */}
            <Link href={`/checkout?eventId=${event._id}`} passHref>
              <Button className="bg-[#3E31FA] hover:bg-[#3E31FA]/90">Comprar</Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
