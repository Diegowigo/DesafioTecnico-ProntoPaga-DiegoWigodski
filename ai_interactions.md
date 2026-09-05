# Registro de Uso de Inteligencia Artificial (Transparencia)

En cumplimiento de las pautas de transparencia solicitadas en el desafío técnico, a continuación se documenta el uso de herramientas de Inteligencia Artificial en el desarrollo de este proyecto.

---

## 🤖 Herramienta Utilizada

- **Modelo / Asistente**: Gemini 3.7 / Antigravity Agentic IDE.

---

## 📌 Áreas de Apoyo y Contribuciones

| Componente | Descripción del Aporte |
| :--- | :--- |
| **Arquitectura y Estructura** | Diseño de la arquitectura limpia en capas (Controladores, Servicios, Middlewares, Rutas, Utilidades y Tipado) en Node.js + TypeScript. |
| **Algoritmo de Módulo 11 Chileno** | Implementación matemática rigurosa del cálculo del dígito verificador y limpieza/formateo del RUT. |
| **Cálculo Determinista de Score** | Implementación de la función hash SHA-256 para mapeo uniforme a rango $[0, 100]$ asegurando determinismo absoluto para un mismo RUT y variabilidad entre RUTs distintos. |
| **Seguridad y Control de Acceso** | Middlewares de autenticación JWT y autorización granular por roles (`admin` vs `user`), condicionando la inclusión del claim `rut` en el payload. |
| **Suite de Pruebas Automatizadas** | Creación de 26 casos de prueba con Jest y Supertest para pruebas unitarias y de integración de todos los flujos y códigos de estado HTTP (200, 400, 401, 403, 404). |
| **Documentación** | Redacción del archivo `README.md` con instrucciones de puesta en marcha, variables de entorno y tablas de usuarios mock. |
