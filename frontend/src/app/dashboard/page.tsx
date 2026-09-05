'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiService, ApiError } from '@/services/api.service';
import { ScoreData, PersonData } from '@/types';
import Navbar from '@/components/Navbar';
import ScoreGauge from '@/components/ScoreGauge';
import Toast, { useToast } from '@/components/Toast';
import { validateRut, formatRutInput, formatRut } from '@/utils/rut';
import { getScoreCategory } from '@/utils/scoreCategory';
import styles from './page.module.css';

type View = 'idle' | 'loading' | 'score' | 'error';

interface ScoreResult {
  score: ScoreData;
  person?: PersonData;
}

export default function DashboardPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toasts, addToast, dismiss } = useToast();

  const [view, setView] = useState<View>('idle');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [searchRut, setSearchRut] = useState('');
  const [searchRutValid, setSearchRutValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-load score for 'user' role on mount
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'user' && user.rut && token) {
      fetchScore(user.rut);
    }
  }, [isLoading, isAuthenticated, user, token]);

  const fetchScore = useCallback(
    async (rut: string) => {
      if (!token) return;
      setView('loading');
      setErrorMsg('');
      setResult(null);

      try {
        const [scoreData, personData] = await Promise.allSettled([
          apiService.getScore(rut, token),
          apiService.getPerson(rut),
        ]);

        const score =
          scoreData.status === 'fulfilled' ? scoreData.value : null;
        const person =
          personData.status === 'fulfilled' ? personData.value : undefined;

        if (!score) {
          throw new Error('No se pudo obtener el score.');
        }

        setResult({ score, person });
        setView('score');
      } catch (err) {
        const isApiErr = err instanceof ApiError;
        const msg = isApiErr ? (err as ApiError).message : 'Error de conexión con el servidor.';
        const status = isApiErr ? (err as ApiError).status : 0;

        if (status === 401) {
          addToast('error', 'Sesión expirada', 'Tu token ha vencido. Por favor inicia sesión nuevamente.');
        } else if (status === 403) {
          addToast('error', 'Acceso denegado', 'Solo puedes consultar tu propio RUT.');
        } else if (status === 400) {
          addToast('warning', 'RUT inválido', msg);
        } else {
          addToast('error', 'Error al obtener score', msg);
        }

        setErrorMsg(msg);
        setView('error');
      }
    },
    [token, addToast]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRutInput(e.target.value);
    setSearchRut(formatted);
    if (formatted.length > 3) {
      setSearchRutValid(validateRut(formatted));
    } else {
      setSearchRutValid(null);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRut) return;
    if (!searchRutValid) {
      addToast('warning', 'RUT inválido', 'Verifica el dígito verificador antes de consultar.');
      return;
    }
    await fetchScore(formatRut(searchRut));
  };

  if (isLoading || !user) {
    return (
      <div className="center-page">
        <div className={styles.loadingState}>
          <div className={styles.loadSpinner} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  const category = result ? getScoreCategory(result.score.score) : null;

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismiss} />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader + ' animate-fade-in'}>
            <div>
              <h1 className={styles.pageTitle}>
                {user.role === 'admin' ? '⚡ Panel Administrativo' : '📊 Tu Score Financiero'}
              </h1>
              <p className={styles.pageDesc}>
                {user.role === 'admin'
                  ? 'Consulta el score de riesgo de cualquier RUT registrado en el sistema.'
                  : 'Visualiza tu perfil de riesgo financiero actual.'}
              </p>
            </div>
            {user.rut && (
              <div className={styles.rutChip}>
                <span className={styles.rutLabel}>RUT</span>
                <span className={styles.rutValue}>{user.rut}</span>
              </div>
            )}
          </div>

          {/* Admin Search Panel */}
          {user.role === 'admin' && (
            <div className={`glass-card ${styles.searchCard} animate-slide-in`}>
              <div className={styles.searchHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className={styles.searchTitle}>Consultar Score por RUT</span>
              </div>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="admin-rut-search"
                      type="text"
                      className={`form-input ${
                        searchRutValid === null ? '' : searchRutValid ? 'valid' : 'error'
                      }`}
                      placeholder="Ej: 11.111.111-1"
                      value={searchRut}
                      onChange={handleSearchChange}
                      maxLength={12}
                      autoComplete="off"
                      aria-label="RUT a consultar"
                    />
                    {searchRutValid !== null && (
                      <span style={{
                        position: 'absolute',
                        right: 12,
                        fontSize: 15,
                        fontWeight: 700,
                        color: searchRutValid ? 'var(--accent-green)' : 'var(--accent-coral)',
                        pointerEvents: 'none',
                      }}>
                        {searchRutValid ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  id="admin-search-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={view === 'loading' || !searchRut || searchRutValid === false}
                >
                  {view === 'loading' ? (
                    <>
                      <span className="btn-spinner" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Consultar
                    </>
                  )}
                </button>
              </form>

              {/* Quick RUT buttons for admin */}
              <div className={styles.quickRuts}>
                <span className="section-title" style={{ marginBottom: 0 }}>RUTs de prueba →</span>
                {['11.111.111-1', '22.222.222-2', '12.345.678-5', '17.702.728-6'].map((rut) => (
                  <button
                    key={rut}
                    className={`btn btn-ghost btn-sm`}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                    onClick={() => {
                      setSearchRut(rut);
                      setSearchRutValid(true);
                    }}
                    disabled={view === 'loading'}
                  >
                    {rut}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {view === 'loading' && (
            <div className={`glass-card ${styles.stateCard}`}>
              <div className={styles.loadingState}>
                <div className={styles.loadSpinner} />
                <p style={{ color: 'var(--text-secondary)' }}>Calculando score financiero...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Consultando base de datos de riesgo</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {view === 'error' && (
            <div className={`glass-card ${styles.stateCard} ${styles.errorCard}`}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No se pudo obtener el score</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{errorMsg}</p>
              </div>
              {user.role === 'admin' && (
                <button className="btn btn-ghost" onClick={() => setView('idle')}>
                  Intentar otra búsqueda
                </button>
              )}
            </div>
          )}

          {/* Score Result */}
          {view === 'score' && result && category && (
            <div className={styles.scoreLayout + ' animate-fade-in'}>
              {/* Score Gauge Card */}
              <div className={`glass-card-elevated ${styles.gaugeCard} animate-pulse-glow`}>
                <div className={styles.gaugeHeader}>
                  <span className={styles.sectionLabel}>SCORE DE RIESGO</span>
                  <span className={styles.fechaText}>
                    {new Date(result.score.fecha).toLocaleString('es-CL', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <ScoreGauge score={result.score.score} animated />
                <div className={styles.scoreRaw}>
                  <div className={styles.scoreBar}>
                    <div
                      className={styles.scoreBarFill}
                      style={{
                        width: `${result.score.score}%`,
                        background: `linear-gradient(90deg, ${category.color}80, ${category.color})`,
                      }}
                    />
                  </div>
                  <div className={styles.scoreBarLabels}>
                    <span style={{ color: 'var(--accent-coral)' }}>0 · Crítico</span>
                    <span style={{ color: 'var(--accent-green)' }}>100 · Excelente</span>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className={styles.infoColumn}>
                {/* Person / RUT Info */}
                <div className={`glass-card ${styles.infoCard}`}>
                  <span className="section-title">
                    {result.person?.found ? 'Datos del Titular' : 'Datos del RUT'}
                  </span>
                  <div>
                    <div className="info-row">
                      <span className="info-key">RUT</span>
                      <code className="info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {result.score.rut}
                      </code>
                    </div>
                    {result.person?.name && (
                      <div className="info-row">
                        <span className="info-key">Nombre</span>
                        <span className="info-value">{result.person.name}</span>
                      </div>
                    )}
                    {result.person?.sex && result.person.sex !== 'Sin Datos' && (
                      <div className="info-row">
                        <span className="info-key">Sexo</span>
                        <span className="info-value">
                          {result.person.sex === 'VAR' ? 'Masculino' : result.person.sex === 'MUJ' ? 'Femenino' : result.person.sex}
                        </span>
                      </div>
                    )}
                    {result.person?.city && result.person.city !== 'Sin Datos' && (
                      <div className="info-row">
                        <span className="info-key">Comuna</span>
                        <span className="info-value">{result.person.city}</span>
                      </div>
                    )}
                    {result.person?.address && result.person.address !== 'Sin Datos' && (
                      <div className="info-row">
                        <span className="info-key">Dirección</span>
                        <span className="info-value">{result.person.address}</span>
                      </div>
                    )}
                    {result.person?.source && (
                      <div className="info-row">
                        <span className="info-key">Fuente</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {result.person.source}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Analysis Card */}
                <div className={`glass-card ${styles.infoCard}`}>
                  <span className="section-title">Análisis de Riesgo</span>
                  <div>
                    <div className="info-row">
                      <span className="info-key">Score</span>
                      <span className="info-value" style={{ color: category.color, fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800 }}>
                        {result.score.score}/100
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Categoría</span>
                      <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}
                        style={{ background: category.bgColor, color: category.color, borderColor: `${category.color}40` }}>
                        {category.label}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Rango</span>
                      <span className="info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {category.min} – {category.max} pts
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
                    {category.description}
                  </p>
                </div>

                {/* Actions */}
                {user.role === 'admin' && (
                  <button
                    className="btn btn-ghost btn-full"
                    onClick={() => { setView('idle'); setResult(null); setSearchRut(''); setSearchRutValid(null); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                    Nueva consulta
                  </button>
                )}
                {user.role === 'user' && (
                  <button
                    className="btn btn-ghost btn-full"
                    onClick={() => user.rut && fetchScore(user.rut)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="23,4 23,10 17,10" />
                      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                    </svg>
                    Actualizar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Idle state for admin */}
          {view === 'idle' && user.role === 'admin' && (
            <div className={`glass-card ${styles.stateCard} ${styles.idleCard}`}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Listo para consultar</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Ingresa un RUT chileno válido en el buscador de arriba para ver el score financiero del usuario.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
