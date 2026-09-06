'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo} aria-label="Ir a Inicio - ProntoPaga">
          <Image
            src="/logotipo-prontopaga.svg"
            alt="ProntoPaga"
            width={130}
            height={26}
            priority
            className={styles.brandLogo}
          />
          <span className={styles.logoSub}>Score</span>
        </Link>

        {/* Right side */}
        <div className={styles.right}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.name}</span>
                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'} ${styles.roleBadge}`}>
                  {user.role === 'admin' ? '⚡ Admin' : '👤 Usuario'}
                </span>
              </div>
            </div>
          )}
          <button
            id="logout-btn"
            onClick={logout}
            className="btn btn-ghost btn-sm"
            aria-label="Cerrar sesión"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
