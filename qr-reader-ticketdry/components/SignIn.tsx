'use client';

import { useState } from 'react';
import { login } from '@/utils/auth';
import { Input } from './ui/input';
import { Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

interface SignInProps {
  onLoginSuccess: () => void;
}

export default function SignIn({ onLoginSuccess }: SignInProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#202020] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md lg:max-w-lg xl:max-w-xl p-10 space-y-10">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logoTDLanding.png"
              alt="TicketDRY Logo"
              width={200}
              height={70}
              priority
              unoptimized
            />
          </div>
          <h2 className="text-3xl font-bold text-[#202020]">Accede a tu cuenta</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <Input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-300 text-[#202020] placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-300 text-[#202020] placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full bg-[#3E31FA] hover:bg-[#3E31FA]/90 text-white">
            Iniciar sesión
          </Button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
