"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function SubscribeForm() {

  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    //fetch api to send email to newsletter
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    setEmail('');
    toast.success('Te has suscrito a la newsletter');
  };

  return (
    <section className="w-full py-12 md:py-18 lg:py-24 bg-[#3E31FA] text-white">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¡SÉ EL PRIMERO EN ENTERARTE!</h2>
            <p className="mx-auto max-w-[700px] md:text-xl">
              Apúntate a nuestra newsletter y no pierdas detalle de las novedades de TicketDRY.
            </p>
          </div>
          <form className="flex w-full max-w-xl items-center space-x-2" onSubmit={handleSubmit}>
            <Input className="bg-white text-gray-900" placeholder="Enter your email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" className="bg-yellow-400 text-[#3E31FA] hover:bg-yellow-300">
              <Mail className="mr-2 h-5 w-5" /> Suscríbete
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
