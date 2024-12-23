
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// add metadata
export const metadata: Metadata = {
  title: 'TicketDRY Admin',
  description: 'TicketDry Saas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
