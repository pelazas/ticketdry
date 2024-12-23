'use client';

import Navbar from "@/components/Navbar";
import QRCodeReader from "@/components/QRCodeReader";

function LectorQR() {
  return (
    <div>
      <Navbar />
      <main>
        <QRCodeReader />
      </main>
    </div>
  );
}

export default LectorQR;