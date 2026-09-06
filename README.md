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

### Configurar Variables de Entorno (Primera vez)
Copiar los archivos `.env.example` en cada módulo:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

---

### Opción A: Iniciar Todo en Una Sola Terminal (Recomendado)

Desde la raíz del monorepo:

```bash
# 1. Instalar dependencias de todo el proyecto (raíz, backend y frontend)
npm run install:all

# 2. Iniciar Backend (:4000) y Frontend (:3000) simultáneamente
npm run dev
```

---

### Opción B: Iniciar en Terminales Separadas

**Terminal 1 — Backend (Puerto 4000):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend (Puerto 3000):**
```bash
cd frontend
npm install
npm run dev
```

Una vez iniciados, abre **http://localhost:3000** en tu navegador.

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
│   │   ├── data/               # Base de datos de usuarios mock
│   │   ├── middlewares/        # JWT auth, roles, validación RUT, errores
│   │   ├── routes/             # /login, /score/:rut, /person/:rut, /health
│   │   ├── services/           # AuthService, ScoreService
│   │   ├── types/              # Tipos e interfaces TypeScript
│   │   └── utils/              # Módulo 11, SHA-256
│   └── tests/                  # Tests unitarios e integración
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
| **user** | Diego Wigodski | `17.702.728-6` | `password123` | Solo su propio RUT |
| **admin** | Administrador | `99.999.999-9` | `admin123` | Cualquier RUT |

---

## 📡 Endpoints de la API

### `POST /login`

Autentica con credenciales de la base de usuarios mock.

```json
// Request
{ "rut": "11.111.111-1", "password": "password123" }

// Response 200 OK
{
  "token": "eyJhbGci...",
  "user": { "id": "user-001", "name": "Juan Pérez", "role": "user", "rut": "11.111.111-1" }
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

Consulta pública de datos del titular (nombre, rol) desde la base de usuarios mock. No requiere autenticación.

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

Tests unitarios e integración en suites Jest cubriendo: validación de RUT (Módulo 11), determinismo del score (SHA-256), autenticación JWT, autorización por roles y consulta de personas en base mock.

---

## 🔐 Variables de Entorno

Ambos proyectos requieren un archivo de variables de entorno para su correcto funcionamiento. Las plantillas y credenciales de configuración por defecto se encuentran documentadas en sus respectivos archivos `.env.example`:

### Backend (`backend/.env`)
Copiar desde `backend/.env.example`:
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=jl3J84zMXWa050MixkrXSWowx98Hrdq0
JWT_EXPIRES_IN=1h
```

### Frontend (`frontend/.env.local` o `frontend/.env`)
Copiar desde `frontend/.env.example`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🤖 Uso de Inteligencia Artificial

Se utilizaron herramientas de IA como apoyo en el desarrollo. Detalle completo en [`ai_interactions.md`](./ai_interactions.md), incluyendo qué herramientas se usaron y qué partes del código asistieron, según lo solicitado en las bases del desafío.
