"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageProps } from 'next/image';

// Define the type for our event data
export type Event = {
  _id: string;
  name: string;
  photo: string;
  dateOfEvent: string;
  organizer: string;
  price: number;
  commission: number;
  limitDateToBuy: string;
  location: string;
};

// This function fetches the data from our API with caching


export default function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const getFeaturedEvents = async ()  => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
          next: { 
            revalidate: 3600,
          },
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
    
        if (!res.ok) {
          throw new Error('Failed to fetch featured events');
        }
        const data = await res.json();
        setFeaturedEvents(data);
      } catch (error) {
        console.error('Error fetching featured events:', error);
        return []; // Return an empty array or some fallback data
      }
    }

    getFeaturedEvents();
  }, []);

  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8" style={{ color: "#3E31FA" }}>
          Eventos destacados
        </h2>
        <div className="relative w-full max-w-4xl mx-auto">
          <Carousel className="w-full px-6 sm:px-8 md:px-10" opts={{ align: "center" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id} className="pl-2 md:pl-4 basis-4/5 sm:basis-2/3 md:basis-1/2 lg:basis-1/3">
                  <div className="px-1 sm:px-2">
                    <Link href={`/organizer/${event.organizer}`} passHref>
                      <Card className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="relative aspect-[3/4] w-full">
                            <ImageWithFallback 
                              src={event.photo} 
                              alt={event.name} 
                              fill
                              className="object-cover" 
                              unoptimized
                            />
                          </div>
                          <div className="p-4 bg-white">
                            <h3 className="text-lg font-semibold" style={{ color: "#3E31FA" }}>
                              {event.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(event.dateOfEvent).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

// New component to handle image loading with fallback
function ImageWithFallback({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc('/placeholder.svg'); // Replace with your placeholder image path
      }}
      unoptimized
    />
  );
}