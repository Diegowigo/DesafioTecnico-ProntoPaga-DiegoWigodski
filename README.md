# Desafío Técnico — Consulta de Riesgo Financiero (ProntoPaga / YOL1)

Solución al desafío técnico para el proceso de selección de **ProntoPaga / YOL1**. Implementa un MVP completo de **Consulta de Score Crediticio** por RUT chileno, con autenticación JWT y control de acceso basado en roles (`admin` / `user`).

---

## 🛠 Tecnologías Utilizadas

| Capa | Stack |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript |
| **Seguridad** | JSON Web Tokens (jsonwebtoken), Helmet, CORS, SHA-256 (crypto) |
| **Validación** | Algoritmo Módulo 11 (RUT chileno), tipado estricto TypeScript |
| **Testing** | Jest, Supertest, ts-jest — 32 tests (100% pasando) |
| **Frontend** | Next.js (React) + TypeScript, App Router |
| **Estilos** | Vanilla CSS + CSS Modules, design system propio |

---

## 🚀 Puesta en Marcha en Local

### Prerrequisitos
- Node.js >= 18.x · npm >= 9.x

### Backend (Puerto 4000)

```bash
cd backend
npm install
npm run dev
```

### Frontend (Puerto 3000)

```bash
cd frontend
npm install
npm run dev
```

Luego abre **http://localhost:3000** en el navegador. El frontend se conecta al backend en `http://localhost:4000` (configurable en `frontend/.env.local`).

---

## 📁 Estructura del Proyecto

```
Desafío Técnico - ProntoPaga/  (monorepo)
├── .gitignore
├── README.md
├── ai_interactions.md          # Registro de transparencia IA
│
├── backend/
│   ├── src/
│   │   ├── config/             # Variables de entorno tipadas
│   │   ├── controllers/        # Controladores HTTP
│   │   ├── data/               # Usuarios mock
│   │   ├── middlewares/        # JWT auth, roles, validación RUT, errores
│   │   ├── routes/             # /login, /score/:rut, /person/:rut, /health
│   │   ├── services/           # AuthService, ScoreService, NombreRutYFirmaService
│   │   ├── types/              # Tipos e interfaces TypeScript
│   │   └── utils/              # Módulo 11, SHA-256
│   └── tests/                  # 32 tests unitarios e integración
│
└── frontend/
    └── src/
        ├── app/
        │   ├── login/          # Pantalla de login
        │   ├── dashboard/      # Consulta de score con gauge animado
        │   └── globals.css     # Design system fintech
        ├── components/         # Navbar, ScoreGauge, Toast
        ├── context/            # AuthContext (JWT + localStorage)
        ├── services/           # Cliente HTTP para la API
        └── utils/              # Validación y formateo de RUT
```

---

## 👥 Credenciales de Prueba

| Rol | Nombre | RUT | Contraseña | Acceso |
| :--- | :--- | :--- | :--- | :--- |
| **user** | Juan Pérez | `11.111.111-1` | `password123` | Solo su propio RUT |
| **user** | María González | `22.222.222-2` | `password123` | Solo su propio RUT |
| **user** | Carlos Silva | `12.345.678-5` | `password123` | Solo su propio RUT |
| **admin** | Administrador | `99.999.999-9` | `admin123` | Cualquier RUT |
| **user dinámico** | Cualquier RUT chileno válido | Ej: `17.702.728-6` | Cualquier password | Su propio RUT (nombre extraído de NombreRutYFirma) |

---

## 📡 Endpoints de la API

### `POST /login`

Autentica con credenciales mock o **cualquier RUT chileno válido**. Si el RUT no existe en el mock, consulta `NombreRutYFirma` para obtener el nombre del titular.

```json
// Request
{ "rut": "11.111.111-1", "password": "password123" }

// Response 200 OK
{
  "token": "eyJhbGci...",
  "user": { "id": "user-111111111", "name": "Juan Pérez", "role": "user", "rut": "11.111.111-1" }
}
```

**JWT payload (rol `user`):** `{ sub, role, rut, iat, exp }`
**JWT payload (rol `admin`):** `{ sub, role, iat, exp }` — sin `rut` por diseño.

---

### `GET /score/:rut`

Retorna el score crediticio determinista del RUT. Requiere JWT.

```
Authorization: Bearer <token>
```

```json
// Response 200 OK
{ "rut": "11.111.111-1", "score": 72, "fecha": "2026-09-05T22:20:00.000Z" }
```

| Código | Motivo |
| :--- | :--- |
| `400` | RUT con dígito verificador inválido |
| `401` | Token ausente, inválido o expirado |
| `403` | Usuario `user` intentando consultar un RUT ajeno |

---

### `GET /person/:rut`

Consulta pública de datos del titular (nombre, comuna, etc.) desde NombreRutYFirma. No requiere autenticación.

---

### `GET /health`

```json
{ "status": "ok", "service": "ProntoPaga Score API", "timestamp": "..." }
```

---

## 🧪 Pruebas Automatizadas

```bash
cd backend
npm test
```

32 tests en 5 suites cubriendo: validación de RUT (Módulo 11), determinismo del score (SHA-256), autenticación JWT, autorización por roles y parseo de datos externos.

---

## 🔐 Variables de Entorno

Archivo `backend/.env` (copia de `backend/.env.example`):

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=jl3J84zMXWa050MixkrXSWowx98Hrdq0
JWT_EXPIRES_IN=1h
```

Archivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🤖 Uso de Inteligencia Artificial

Se utilizaron herramientas de IA como apoyo en el desarrollo. Detalle completo en [`ai_interactions.md`](./ai_interactions.md), incluyendo qué herramientas se usaron y qué partes del código asistieron, según lo solicitado en las bases del desafío.
