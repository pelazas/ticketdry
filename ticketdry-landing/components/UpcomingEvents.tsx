"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"

type Organizer = {
  _id: string;
  name: string;
  minPrice: number | null;
  profilePhoto: string;
};

const UpcomingEvents = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizer`);
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events');
        }
        const data = await response.json();
        console.log(data);
        setOrganizers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="w-full py-6 md:py-8 lg:py-10 bg-[#3E31FA]/5">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8" style={{ color: "#3E31FA" }}>
          Próximos Eventos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((organizer) => (
            <Link href={`/organizer/${organizer._id}`} key={organizer._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <Card key={organizer._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <Image src={organizer.profilePhoto} alt={organizer.name} width={300} height={200} className="w-full h-48 object-cover" unoptimized/>
                <div className="p-4">
                  <h3 className="font-semibold text-lg" style={{ color: "#3E31FA" }}>{organizer.name}</h3>
                  {organizer.minPrice !== null && (
                    <p className="mt-2 font-bold">Desde {organizer.minPrice.toFixed(2)}€</p>
                  )}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
