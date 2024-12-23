"use client";

import { useState } from "react";
import FeaturedEvents from "../components/FeaturedEvents";
import Header from "../components/Header";
import UpcomingEvents from "../components/UpcomingEvents";
import SubscribeForm from "../components/SubscribeForm";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <section className="w-full pb-6 md:pb-8 lg:pb-10 pt-5 md:pt-7 lg:pt-9 bg-[#3E31FA] text-white">
          <div className= " px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Tus eventos favoritos a un paso
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                Compra y comparte entradas para tus eventos favoritos
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-2">
                <form className="flex flex-row space-y-0 sm:space-x-2">
                  <Input
                    className="flex-1 bg-white text-gray-900 placeholder-gray-500 md:h-12"
                    placeholder="Busca eventos, artistas o lugares"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Link href={`/search?content=${searchQuery}`} className="mt-0">
                  <Button type="submit" className="bg-yellow-400 text-[#3E31FA] hover:bg-yellow-300 md:h-12">
                    <Search className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Buscar</span>
                    </Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
        <FeaturedEvents />
        <UpcomingEvents />
        <SubscribeForm />
      </main>
      <Footer />
    </div>
  );
}
