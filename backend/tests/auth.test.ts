import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { config } from '../src/config/env';
import { JWTPayload } from '../src/types';

describe('Auth Endpoints - POST /login', () => {
  describe('Login de Usuario Estándar (role: user)', () => {
    it('debe autenticar exitosamente y retornar token JWT con sub, role y rut en payload', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          rut: '11.111.111-1',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.role).toBe('user');
      expect(response.body.user.rut).toBe('11.111.111-1');

      // Validar contenido del JWT firmado
      const decoded = jwt.verify(response.body.token, config.jwt.secret) as JWTPayload;
      expect(decoded.sub).toBe('user-001');
      expect(decoded.role).toBe('user');
      expect(decoded.rut).toBe('11.111.111-1');
    });
  });

  describe('Login de Usuario Administrador (role: admin)', () => {
    it('debe autenticar exitosamente y retornar token JWT con sub y role (sin campo rut)', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          rut: '99.999.999-9',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.rut).toBeUndefined();

      // Validar contenido del JWT firmado
      const decoded = jwt.verify(response.body.token, config.jwt.secret) as JWTPayload;
      expect(decoded.sub).toBe('admin-001');
      expect(decoded.role).toBe('admin');
      // El requerimiento del desafío indica: "rut: RUT del usuario (solo si el rol es 'user')"
      expect(decoded.rut).toBeUndefined();
    });

    it('debe permitir autenticación de admin usando username', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'admin-001',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('admin');
    });
  });

  describe('Casos de Error en Autenticación', () => {
    it('debe retornar 401 para credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          rut: '11.111.111-1',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toHaveProperty('message');
    });

    it('debe retornar 400 si faltan credenciales', async () => {
      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(400);
    });

    it('debe retornar 400 si el RUT tiene formato inválido', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          rut: '12.345.678-9', // DV erróneo
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });
});
