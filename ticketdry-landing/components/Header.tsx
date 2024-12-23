"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FC } from 'react'

interface HeaderProps {
  isLanding: boolean;
}


const Header: FC<HeaderProps> = ({isLanding}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${isLanding ? 'bg-[#3E31FA]': 'bg-white'}`}>
      <div className="flex h-16 items-center justify-between px-4">
        <Link className="flex items-center space-x-2" href="/">
          <Image
            src="/logo_letrasblancas_transp.png"
            alt="TicketDRY Logo"
            className={` ${isLanding ? '' : 'invert'}`}
            width={150}
            height={40}
            priority
            unoptimized
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link className="text-white hover:text-yellow-400 transition-colors" href="/search?content=">
            Todos los eventos
          </Link>
          <Link className="text-white hover:text-yellow-400 transition-colors" href="/faq">
            FAQ
          </Link>
          <Link className="text-white hover:text-yellow-400 transition-colors" href="/contact">
            Contacto
          </Link>
        </nav>
        <Button className="md:hidden" variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center space-y-4 py-4 bg-[#3E31FA]">
            <Link className="text-white hover:text-[#3E31FA] transition-colors" href="/">
              FAQ
            </Link>
            <Link className="text-white hover:text-[#3E31FA] transition-colors" href="/">
              Contacto
            </Link>
            <Link className="text-white hover:text-[#3E31FA] transition-colors" href="/">
              Vende con nosotros
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header