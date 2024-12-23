'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from "@/components/SignIn";
import { getToken } from '@/utils/auth';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useLocalStorage('role', '');

  const redirectToHome = () => {
    console.log('role', role);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  }

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        redirectToHome();
      }
    }
    fetchToken();
  }, [router]);

  const handleLoginSuccess = () => {
    redirectToHome();
  };

  return <SignIn onLoginSuccess={handleLoginSuccess} />;
}