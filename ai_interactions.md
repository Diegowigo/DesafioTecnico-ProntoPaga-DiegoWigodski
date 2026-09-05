# Registro de Uso de Inteligencia Artificial (Transparencia)

En cumplimiento de lo solicitado en el desafío técnico, se documenta el uso de herramientas de IA en el desarrollo de este proyecto, incluyendo las herramientas utilizadas y las partes del código en que participaron.

---

## 🤖 Herramientas Utilizadas

| Herramienta | Descripción |
| :--- | :--- |
| **Antigravity IDE (Google DeepMind)** — Gemini Flash | Asistente agentic principal para desarrollo del backend |
| **Claude (Anthropic)** — Claude Sonnet (Thinking) | Asistente para desarrollo del frontend Next.js |

> **Nota metodológica**: El desarrollador actuó como director técnico en todo momento: tomando las decisiones de diseño, definiendo los requisitos de cada componente, revisando el código generado, corrigiendo errores de compilación y pruebas, y validando el comportamiento esperado de cada endpoint y flujo de UI. La IA fue una herramienta de aceleración, no un sustituto del criterio técnico propio.

---

## 📋 Partes del Código con Apoyo de IA

### Backend (`/backend`)

| Archivo / Módulo | Aporte de la IA |
| :--- | :--- |
| `src/utils/rut.ts` | Implementación del algoritmo Módulo 11 para validación del dígito verificador del RUT chileno |
| `src/utils/scoreCalculator.ts` | Función hash SHA-256 para generar un score determinista en rango [0, 100] |
| `src/services/auth.service.ts` | Lógica de autenticación con credenciales mock y generación de JWT con payload condicional (`rut` solo en rol `user`) |
| `src/middlewares/auth.middleware.ts` | Middleware de validación de firma y expiración del JWT |
| `src/middlewares/role.middleware.ts` | Middleware de autorización por rol (user solo consulta su propio RUT, admin consulta cualquiera) |
| `src/services/nombrerutyfirma.service.ts` | Integración HTTP con NombreRutYFirma: FormData, parseo de tabla HTML, reordenamiento de nombre al formato `Nombre ApellidoPaterno ApellidoMaterno` |
| `tests/*.test.ts` | Suite completa de 32 tests unitarios e integración con Jest y Supertest |
| `README.md` | Estructura base de la documentación |

### Frontend (`/frontend`)

| Archivo / Módulo | Aporte de la IA |
| :--- | :--- |
| `src/app/globals.css` | Design system completo: CSS variables (tokens), glassmorphism, animaciones, paleta de colores fintech |
| `src/app/login/page.tsx` | Pantalla de login con validación RUT en tiempo real y accesos rápidos de demostración |
| `src/app/dashboard/page.tsx` | Dashboard con vistas diferenciadas por rol: usuario ve su propio score, admin tiene buscador por RUT |
| `src/components/ScoreGauge.tsx` | Velocímetro SVG animado con colores según nivel de riesgo crediticio |
| `src/components/Navbar.tsx` | Barra de navegación con avatar, badge de rol y botón de logout |
| `src/components/Toast.tsx` | Sistema de notificaciones con auto-dismiss para errores, éxitos y advertencias |
| `src/context/AuthContext.tsx` | Contexto de autenticación con persistencia JWT en localStorage |
| `src/services/api.service.ts` | Cliente HTTP centralizado con inyección de token Bearer |
| `src/utils/rut.ts` | Utilidades de formateo y validación de RUT para el frontend |

---

## ⚖️ Nota Legal — Uso de NombreRutYFirma

La integración con `nombrerutyfirma.com` fue implementada para este desafío técnico con los siguientes alcances:

- El RUT y el nombre asociado son datos de carácter público según el Registro Civil de Chile.
- El uso es **exclusivamente demostrativo**: no se almacenan ni comercializan los datos obtenidos.
- En un entorno productivo real, se utilizarían fuentes de datos oficiales y autorizadas (API del Registro Civil, SII, Equifax, CMF).
