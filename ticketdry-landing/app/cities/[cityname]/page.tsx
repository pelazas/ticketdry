'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useParams } from 'next/dist/client/components/navigation';
import { Building2Icon } from 'lucide-react';

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
    const {cityname} = useParams();
    const [organizers, setOrganizers] = useState([]);

    const fetchOrganizers = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/${cityname}`);
            const data = await response.json();
            console.log(data);
            setOrganizers(data);
        } catch (error) {
            console.error('Error fetching organizers:', error);
        }
    }, [cityname]);

    useEffect(() => {
        fetchOrganizers();
    }, [fetchOrganizers]);

    return (
        <div className="min-h-screen bg-background">
            <Header isLanding={true}/>
            <main className="container mx-auto max-w-6xl px-8 py-8">
            <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2Icon className="h-5 w-5 text-[#3E31FA]" />
            <h2 className="text-xl font-semibold">Organizadores</h2>
          </div>
        </div>
            </main>
            <Footer />
        </div>
    )
}

export default page