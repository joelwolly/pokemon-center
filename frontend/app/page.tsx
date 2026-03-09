'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('token');

    router.replace(token ? '/pokedex' : '/login');

  }, [router]);

  return null;

}