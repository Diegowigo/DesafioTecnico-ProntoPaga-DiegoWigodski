"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateRut, formatRutInput } from "@/utils/rut";
import Toast, { useToast } from "@/components/Toast";
import styles from "./page.module.css";

interface QuickCred {
  label: string;
  rut?: string;
  username?: string;
  password: string;
  role: "user" | "admin" | "dynamic";
  description: string;
  color: string;
}

const QUICK_CREDENTIALS: QuickCred[] = [
  {
    label: "Juan Pérez",
    rut: "11.111.111-1",
    password: "password123",
    role: "user",
    description: "Usuario estándar · Rol User",
    color: "#FC2B5F",
  },
  {
    label: "María González",
    rut: "22.222.222-2",
    password: "password123",
    role: "user",
    description: "Usuario estándar · Rol User",
    color: "#8B5CF6",
  },
  {
    label: "Administrador",
    rut: "99.999.999-9",
    password: "admin123",
    role: "admin",
    description: "Acceso total · Rol Admin",
    color: "#F59E0B",
  },
  {
    label: "Diego Wigodski",
    rut: "17.702.728-6",
    password: "password123",
    role: "user",
    description: "Usuario registrado · Rol User",
    color: "#10B981",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const { toasts, addToast, dismiss } = useToast();

  const [form, setForm] = useState({ rut: "", password: "" });
  const [rutValid, setRutValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show auth error as toast
  useEffect(() => {
    if (error) {
      addToast("error", "Error de autenticación", error);
      clearError();
    }
  }, [error]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRutInput(e.target.value);
    setForm((f) => ({ ...f, rut: formatted }));
    if (formatted.length > 3) {
      setRutValid(validateRut(formatted));
    } else {
      setRutValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rut || !form.password) {
      addToast(
        "warning",
        "Campos incompletos",
        "Ingresa RUT y contraseña para continuar.",
      );
      return;
    }
    if (rutValid === false) {
      addToast(
        "error",
        "RUT inválido",
        "El dígito verificador no coincide. Revisa el formato.",
      );
      return;
    }
    setSubmitting(true);
    await login({ rut: form.rut, password: form.password });
    setSubmitting(false);
  };

  const handleQuickLogin = async (cred: QuickCred) => {
    setSubmitting(true);
    const credentials = cred.username
      ? { username: cred.username, password: cred.password }
      : { rut: cred.rut!, password: cred.password };
    await login(credentials);
    setSubmitting(false);
  };

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="center-page" style={{ background: "var(--bg-base)" }}>
        {/* Background decoration */}
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <Image
                src="/logotipo-prontopaga.svg"
                alt="ProntoPaga"
                width={170}
                height={35}
                priority
                className={styles.loginLogo}
              />
            </div>
            <p className={styles.subtitle}>Consulta de Riesgo Financiero</p>
          </div>

          {/* Card */}
          <div className={`glass-card-elevated ${styles.card} animate-fade-in`}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* RUT Field */}
              <div className="form-group">
                <label htmlFor="rut-input" className="form-label">
                  RUT
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="rut-input"
                    type="text"
                    className={`form-input ${
                      rutValid === null ? "" : rutValid ? "valid" : "error"
                    }`}
                    placeholder="Ej: 11.111.111-1"
                    value={form.rut}
                    onChange={handleRutChange}
                    autoComplete="off"
                    maxLength={12}
                    aria-label="RUT chileno"
                    aria-invalid={rutValid === false}
                  />
                  {rutValid !== null && (
                    <span
                      className={`${styles.validIcon} ${rutValid ? styles.green : styles.red}`}
                    >
                      {rutValid ? "✓" : "✗"}
                    </span>
                  )}
                </div>
                {rutValid === false && (
                  <span className="form-error">
                    ⚠ Dígito verificador inválido
                  </span>
                )}
                {rutValid === true && (
                  <span style={{ fontSize: 12, color: "var(--accent-green)" }}>
                    ✓ RUT válido
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password-input" className="form-label">
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Ingresa tu contraseña"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    autoComplete="current-password"
                    aria-label="Contraseña"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      /* Eye Off Icon */
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={submitting || isLoading}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                      <polyline points="10,17 15,12 10,7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Quick Credentials */}
            <div className={styles.quickSection}>
              <div className="divider">Acceso rápido de demostración</div>
              <div className={styles.quickGrid}>
                {QUICK_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.label}
                    id={`quick-login-${cred.label.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => handleQuickLogin(cred)}
                    className={styles.quickCard}
                    disabled={submitting}
                    style={
                      { "--cred-color": cred.color } as React.CSSProperties
                    }
                    title={`Iniciar sesión como ${cred.label}`}
                  >
                    <div
                      className={styles.quickAvatar}
                      style={{
                        background: `${cred.color}20`,
                        borderColor: `${cred.color}40`,
                        color: cred.color,
                      }}
                    >
                      {cred.label.charAt(0)}
                    </div>
                    <div className={styles.quickInfo}>
                      <span className={styles.quickName}>{cred.label}</span>
                      <span className={styles.quickDesc}>
                        {cred.description}
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className={styles.footer}>
            Desafío Técnico · Diego Wigodski · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}
