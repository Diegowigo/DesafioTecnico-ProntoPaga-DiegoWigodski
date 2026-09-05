# Desafío Técnico - Consulta de Riesgo Financiero (Fintech ProntoPaga / YOL1)

Solución al desafío técnico para el proceso de selección de **ProntoPaga / YOL1**. Este sistema implementa un MVP seguro para la Consulta de Score Crediticio según RUT chileno, con autenticación basada en JWT y control de acceso basado en roles (`admin` y `user`).

---

## 🛠 Tecnologías Utilizadas

- **Backend**: Node.js, Express, TypeScript.
- **Seguridad**: JSON Web Tokens (`jsonwebtoken`), Helmet, CORS, Hashing criptográfico (`crypto`).
- **Validación**: Algoritmo Módulo 11 oficial para RUT chileno, tipado estricto con TypeScript.
- **Testing**: Jest, Supertest, ts-jest (26 tests unitarios y de integración).

---

## 📁 Estructura del Proyecto

```
Desafío Técnico - ProntoPaga/
├── backend/
│   ├── src/
│   │   ├── config/env.ts              # Variables de entorno tipadas
│   │   ├── controllers/               # Controladores HTTP (Auth y Score)
│   │   ├── data/mockUsers.ts          # Datos mockeados de usuarios y admin
│   │   ├── middlewares/               # Middlewares (Auth JWT, Roles, Validador RUT, Errores)
│   │   ├── routes/                    # Definición de rutas (/login, /score/:rut, /health)
│   │   ├── services/                  # Lógica de negocio (JWT condicional y Score determinista)
│   │   ├── types/index.ts             # Tipos e interfaces TypeScript
│   │   ├── utils/                     # Algoritmo Módulo 11 y cálculo SHA-256 de score
│   │   ├── app.ts                     # Configuración de Express
│   │   └── server.ts                  # Inicialización del servidor HTTP
│   ├── tests/                         # Suite de pruebas automatizadas
│   │   ├── auth.test.ts
│   │   ├── score.test.ts
│   │   ├── scoreCalculator.test.ts
│   │   └── rut.test.ts
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/                          # Aplicación Frontend (Next.js / React)
├── README.md                          # Instrucciones del proyecto
├── ai_interactions.md                 # Registro de transparencia de IA
└── Desafío TécnicoV3.pdf             # Enunciado original del desafío
```

---

## 🚀 Puesta en Marcha en Local

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x

### 1. Backend

```bash
# 1. Navegar al directorio del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Se incluye un archivo .env listo para desarrollo, o puedes copiarlo de .env.example:
cp .env.example .env

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Compilar para producción
npm run build

# 6. Iniciar en producción
npm start
```

El servidor iniciará en: `http://localhost:4000`

---

## 🧪 Ejecución de Pruebas Automatizadas

El backend cuenta con una suite completa de pruebas unitarias y de integración que cubren el 100% de los flujos críticos exigidos:

```bash
cd backend
npm test
```

### Escenarios evaluados (26 tests pasando):
1. **Cálculo Determinista de Score (`scoreCalculator.test.ts`)**:
   - Mismo RUT devuelve el mismo score a lo largo de cientos de llamadas.
   - Variabilidad de scores en el rango $[0, 100]$ para diferentes RUTs.
   - Invarianza ante formatos con o sin puntos, guiones o espacios.
2. **Validación de RUT Chileno (`rut.test.ts`)**:
   - Verificación de dígito verificador mediante algoritmo oficial Módulo 11.
   - Soporte para RUTs terminados en dígito verificador `K` / `k`.
   - Detección de RUTs inválidos o mal formados.
3. **Autenticación (`auth.test.ts`)**:
   - `POST /login` con credenciales de usuario: Retorna JWT con `sub`, `role: 'user'` y `rut`.
   - `POST /login` con credenciales de administrador: Retorna JWT con `sub` y `role: 'admin'` (excluye `rut` del payload según requerimiento).
   - Manejo de credenciales inválidas y respuestas con código 401.
4. **Control de Acceso y Score (`score.test.ts`)**:
   - Rechazo de peticiones sin token (401) o con token corrupto / expirado (401).
   - Rol `user`: Solo puede consultar su propio RUT (200 OK); cualquier intento de consultar otro RUT es denegado (403 Forbidden).
   - Rol `admin`: Puede consultar el score de cualquier RUT válido (200 OK).
   - Validación sintáctica de RUT en parámetro de ruta (400 Bad Request si el DV es incorrecto).

---

## 👥 Credenciales de Prueba (Mock Users)

| Rol | Nombre | RUT | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User** | Juan Pérez | `11.111.111-1` | - | `password123` | Consulta solo su RUT (`11.111.111-1`) |
| **User** | María González | `22.222.222-2` | - | `password123` | Consulta solo su RUT (`22.222.222-2`) |
| **User** | Carlos Silva | `12.345.678-5` | - | `password123` | Consulta solo su RUT (`12.345.678-5`) |
| **Admin** | Administrador Fintech | `99.999.999-9` | `admin-001` | `admin123` | Consulta **cualquier** RUT |

---

## 📡 Documentación de Endpoints

### 1. `POST /login`
Inicia sesión con credenciales mock o con **cualquier RUT chileno válido**. Si el RUT no está en la base mock, consulta en tiempo real `https://www.nombrerutyfirma.com/rut` para extraer su nombre real, reordenándolo automáticamente al formato **`Nombre ApellidoPaterno ApellidoMaterno`**.

**Request Body (JSON):**
```json
{
  "rut": "17.702.728-6",
  "password": "password123"
}
```

**Respuesta Exitosa (200 OK) - Rol User:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-177027286",
    "name": "Diego Wigodski Carafi",
    "role": "user",
    "rut": "17.702.728-6"
  }
}
```

> **Payload decodificado del JWT (User):**
> ```json
> {
>   "sub": "user-177027286",
>   "role": "user",
>   "rut": "17.702.728-6",
>   "iat": 1741200000,
>   "exp": 1741203600
> }
> ```

---

### 2. `GET /score/:rut`
Retorna el score crediticio determinista para el RUT consultado.

**Headers requeridos:**
`Authorization: Bearer <token_jwt>`

**Respuesta Exitosa (200 OK):**
```json
{
  "rut": "17.702.728-6",
  "score": 64,
  "fecha": "2026-09-05T22:20:00.000Z"
}
```

**Respuestas de Error:**
- `400 Bad Request`: Si el RUT en la URL no es válido o su dígito verificador es incorrecto.
- `401 Unauthorized`: Si el token no se envió, es inválido o ha expirado.
- `403 Forbidden`: Si un usuario con rol `user` intenta consultar un RUT que no le pertenece.

---

### 3. `GET /person/:rut`
Consulta pública de datos personales asociados al RUT mediante la integración de **NombreRutYFirma**.

**Parámetros:**
- `:rut` (ej: `17.702.728-6` o `17702728-6`)

**Respuesta Exitosa (200 OK):**
```json
{
  "rut": "17.702.728-6",
  "name": "Diego Wigodski Carafi",
  "rawName": "Wigodski Carafi Diego",
  "sex": "VAR",
  "address": "Sin Datos",
  "city": "Plaza ñuñoa",
  "found": true,
  "source": "nombrerutyfirma.com"
}
```

