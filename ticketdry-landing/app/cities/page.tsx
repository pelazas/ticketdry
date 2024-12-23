'use client'
import { FC, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import { toast } from 'react-toastify'
import Footer from '@/components/Footer'

interface pageProps {
  
}

interface City {
  _id: string;
  name: string;
  municipality: string;
  photo: string;
  isFeatured: boolean;
}

const page: FC<pageProps> = ({}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCities, setFeaturedCities] = useState<City[]>([]);
  const [notFeaturedCities, setNotFeaturedCities] = useState<City[]>([]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/images`);
      const data = await response.json();
      console.log(data);
      setNotFeaturedCities(data);
      for (const city of data) {
        
        if (city.isFeatured) {
          setFeaturedCities((prevCities) => {
            const exists = prevCities.some(c => c.name === city.name);
            if (!exists) {
              return [...prevCities, city];
            }
            return prevCities;
          });
        } else {
          setNotFeaturedCities((prevCities) => {
            const exists = prevCities.some(c => c.name === city.name);
            if (!exists) {
              return [...prevCities, city];
            }
            return prevCities;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Error cargando las ciudades');
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const filteredNotFeaturedCities = notFeaturedCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.municipality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
        <Header isLanding={true}/>
      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-8 py-8">
        {/* Cities Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-[#3E31FA]" />
            <h2 className="text-xl font-semibold">Ciudades</h2>
          </div>
          <Input
            className="max-w-xs"
            placeholder="Busca tu ciudad"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Featured Cities */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold">Destacadas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCities.map((city) => (
              <Link
                key={city._id}
                className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                href={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Image
                  alt={`${city.name} map`}
                  className="mb-4 rounded-full bg-[#3E31FA] p-1 object-cover aspect-square"
                  height={80}
                  src={city.photo}
                  width={80}
                />
                <h3 className="text-lg font-semibold">{city.name}</h3>
                <p className="text-sm text-muted-foreground">{city.municipality}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* All Cities */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold">Todas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotFeaturedCities.map((city) => (
              <Link
                key={city._id}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                href={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Image
                  alt={`${city.name} map`}
                  className="rounded-full bg-[#3E31FA] p-0.5 object-cover aspect-square"
                  height={40}
                  src={city.photo}
                  width={40}
                />
                <div>
                  <h3 className="font-semibold">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.municipality}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default page