'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Loading logo */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="rgba(59,130,246,0.3)" strokeWidth="3" />
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#loadGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="138"
            strokeDashoffset="100"
            style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center' }}
          />
          <defs>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando...</p>
      </div>
    </div>
  );
}
