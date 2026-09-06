'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="center-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Image
          src="/logotipo-prontopaga.svg"
          alt="ProntoPaga"
          width={160}
          height={32}
          priority
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="btn-spinner" style={{ width: 16, height: 16 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cargando...</p>
        </div>
      </div>
    </div>
  );
}
