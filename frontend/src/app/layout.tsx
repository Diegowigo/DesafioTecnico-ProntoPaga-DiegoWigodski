import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ProntoPaga — Consulta de Score Financiero',
  description:
    'Plataforma de consulta de riesgo financiero con autenticación JWT y control de acceso por roles. Desafío Técnico ProntoPaga.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
