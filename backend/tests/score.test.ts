import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { config } from '../src/config/env';

describe('Score Endpoints - GET /score/:rut (Autenticación y Autorización por Roles)', () => {
  let userToken: string;
  let anotherUserToken: string;
  let adminToken: string;

  const USER_RUT = '11.111.111-1';
  const OTHER_USER_RUT = '22.222.222-2';
  const THIRD_RUT = '12.345.678-5';

  beforeAll(async () => {
    // Generar tokens para pruebas
    const userLogin = await request(app)
      .post('/login')
      .send({ rut: USER_RUT, password: 'password123' });
    userToken = userLogin.body.token;

    const otherUserLogin = await request(app)
      .post('/login')
      .send({ rut: OTHER_USER_RUT, password: 'password123' });
    anotherUserToken = otherUserLogin.body.token;

    const adminLogin = await request(app)
      .post('/login')
      .send({ rut: '99.999.999-9', password: 'admin123' });
    adminToken = adminLogin.body.token;
  });

  describe('Autenticación (Validación de Token JWT)', () => {
    it('debe retornar 401 si no se envía el header Authorization', async () => {
      const response = await request(app).get(`/score/${USER_RUT}`);
      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('Token de autenticación no proporcionado');
    });

    it('debe retornar 401 si el token es falso o está corrupto', async () => {
      const response = await request(app)
        .get(`/score/${USER_RUT}`)
        .set('Authorization', 'Bearer token_invalido_123');

      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('Token de autenticación inválido');
    });

    it('debe retornar 401 si el token ha expirado', async () => {
      // Generar token expirado
      const expiredToken = jwt.sign(
        { sub: 'user-001', role: 'user', rut: USER_RUT },
        config.jwt.secret,
        { expiresIn: '-1s' }
      );

      const response = await request(app)
        .get(`/score/${USER_RUT}`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('ha expirado');
    });
  });

  describe('Validación de Parámetro RUT', () => {
    it('debe retornar 400 si el RUT consultado tiene dígito verificador inválido', async () => {
      const response = await request(app)
        .get('/score/12.345.678-9') // 9 es incorrecto (correcto es 5)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('inválido');
    });

    it('debe retornar 400 si el RUT contiene caracteres inválidos', async () => {
      const response = await request(app)
        .get('/score/rut-invalido')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('Control de Acceso (Autorización por Rol)', () => {
    describe('Rol "user"', () => {
      it('debe permitir consultar su propio RUT exitosamente (200 OK)', async () => {
        const response = await request(app)
          .get(`/score/${USER_RUT}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rut', USER_RUT);
        expect(response.body).toHaveProperty('score');
        expect(response.body).toHaveProperty('fecha');
        expect(typeof response.body.score).toBe('number');
        expect(response.body.score).toBeGreaterThanOrEqual(0);
        expect(response.body.score).toBeLessThanOrEqual(100);
      });

      it('debe permitir consultar su propio RUT sin puntos o sin guión', async () => {
        const cleanOwnRut = '111111111';
        const response = await request(app)
          .get(`/score/${cleanOwnRut}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.rut).toBe(USER_RUT);
      });

      it('debe denegar con 403 Forbidden cuando intenta consultar el RUT de otro usuario', async () => {
        const response = await request(app)
          .get(`/score/${OTHER_USER_RUT}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.error.message).toContain('solo puede consultar su propio score');
      });
    });

    describe('Rol "admin"', () => {
      it('debe permitir a un admin consultar el RUT de cualquier usuario', async () => {
        const responseUser1 = await request(app)
          .get(`/score/${USER_RUT}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(responseUser1.status).toBe(200);
        expect(responseUser1.body.rut).toBe(USER_RUT);

        const responseUser2 = await request(app)
          .get(`/score/${OTHER_USER_RUT}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(responseUser2.status).toBe(200);
        expect(responseUser2.body.rut).toBe(OTHER_USER_RUT);

        const responseUser3 = await request(app)
          .get(`/score/${THIRD_RUT}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(responseUser3.status).toBe(200);
        expect(responseUser3.body.rut).toBe(THIRD_RUT);
      });
    });
  });

  describe('Formato de Respuesta de Score', () => {
    it('debe coincidir exactamente con la estructura JSON especificada en el desafío', async () => {
      const response = await request(app)
        .get(`/score/${USER_RUT}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      const keys = Object.keys(response.body);
      expect(keys).toContain('rut');
      expect(keys).toContain('score');
      expect(keys).toContain('fecha');

      // Validar formato ISO 8601 de la fecha
      const date = new Date(response.body.fecha);
      expect(date.toISOString()).toBe(response.body.fecha);
    });
  });
});
