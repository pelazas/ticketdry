import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage after component mounts (client-side only)
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {isAdmin && (
            <Link href="/admin" className="text-white hover:text-gray-300" onClick={() => localStorage.setItem('organizerId', '')}>
              Administrar Organizadores
            </Link>
          )}
          {!isAdmin && (
            <Link href="/" className="text-white hover:text-gray-300">
              Ver eventos
            </Link>
          )}
          <Link href="/lector-qr" className="text-white hover:text-gray-300">
            Lector QR
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-300"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;