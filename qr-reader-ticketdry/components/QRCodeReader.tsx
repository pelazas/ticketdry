'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getToken } from '@/utils/auth';
import axios from 'axios';

const QRCodeReader: React.FC = () => {
  const [scannedUrl, setScannedUrl] = useState('No result');
  const [scanTicket, setScanTicket] = useState<String>('');
  const [scanStatus, setScanStatus] = useState<'success' | 'error' | 'already_scanned' | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const successBeep = useRef<HTMLAudioElement | null>(null);
  const errorBeep = useRef<HTMLAudioElement | null>(null);

  const [isScannerActive, setIsScannerActive] = useState(true);

  useEffect(() => {
    if (isScannerActive) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 1, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      scannerRef.current?.clear();
    };
  }, [isScannerActive]);

  const onScanSuccess = async (decodedText: string) => {
    if (!isScannerActive) return;

    setIsScannerActive(false); // Disable scanner
    try {
      const token = await getToken();

      setScannedUrl(decodedText);
      const response = await axios.get(decodedText,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data)
      setScanTicket(response.status.toString());
      
      if (response.status === 200) {
        setScanStatus('success');
        const { name } = response.data.attendee;
        setClientName(name);
        successBeep.current?.play();
      } else if (response.status === 208) {
        setScanStatus('already_scanned');
        const message = response.data.message
        setClientName(message);
        errorBeep.current?.play();
      } else {
        setScanStatus('error');
      }
      // Reset scan status and re-enable scanner after 5 seconds
      setTimeout(() => {
        setScanStatus(null);
        setClientName('');
        setIsScannerActive(true); // Re-enable scanner
      }, 3000);
    } catch (error) {
      console.log("Error status", error.request.status)
      setScanStatus('error');
      errorBeep.current?.play();
      setTimeout(() => {
        setScanStatus(null);
        setIsScannerActive(true); // Re-enable scanner
      }, 3000);
    }
  };

  const onScanFailure = (error: string) => {
    console.warn(`QR code scan error: ${error}`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
      scanStatus === 'success' ? 'bg-green-100 border-green-500' :
      scanStatus === 'error' ? 'bg-red-100 border-red-500' : 'bg-white border-transparent'
    } border-8`}>
      <div id="reader" className="w-full max-w-md mb-4"></div>
      {scanStatus && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className={`text-center p-6 rounded-lg ${
            scanStatus === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}>
            {scanStatus === 'success' &&(
              <p className="text-xl font-bold">
                Ticket escaneado correctamente para {clientName}
              </p>
            )}
            {scanStatus === 'error' && (
              <p className="text-xl font-bold">Ticket inválido</p>
            )}
            {scanStatus === 'already_scanned' && (
              <p className="text-xl font-bold">{clientName}</p>
            )}
          </div>
        </div>
      )}
      <audio ref={successBeep} src="/beep.mp3" />
      <audio ref={errorBeep} src="/beep.mp3" />
    </div>
  );
};

export default QRCodeReader;