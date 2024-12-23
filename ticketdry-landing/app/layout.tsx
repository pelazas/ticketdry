import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Analytics } from "@vercel/analytics/react"
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "TicketDRY",
  description: "Encuentra y compra entradas para tus eventos favoritos de forma rápida y fácil con TicketDRY. Comparte tus entradas con amigos y explora eventos destacados.",
  openGraph: {
    title: "TicketDRY",
    description: "Encuentra y compra entradas para tus eventos favoritos de forma rápida y fácil con TicketDRY. Comparte tus entradas con amigos y explora eventos destacados.",
    url: "https://www.ticketdry.com",
    siteName: "TicketDRY",
    images: [
      {
        url: "/favicon.ico",
        width: 630,
        height: 630,
        alt: "TicketDRY logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <ToastContainer />
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
