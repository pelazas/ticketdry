'use client'
import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    // Check if the consent cookie exists
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookie_consent='));
    if (!consent) {
      setIsBannerVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set a cookie that expires in 365 days
    document.cookie = "cookie_consent=true; path=/; max-age=" + 60 * 60 * 24 * 365;
    setIsBannerVisible(false);
  };

  if (!isBannerVisible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white text-center p-4 z-50">
      <p>
        Utilizamos cookies esenciales para garantizar que obtenga la mejor experiencia en nuestro sitio web.
        <button
          onClick={handleAccept}
          className="ml-4 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
        >
          Aceptar
        </button>
      </p>
    </div>
  );
};

export default CookieBanner;
