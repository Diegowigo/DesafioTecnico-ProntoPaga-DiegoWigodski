import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app';

describe('Person Lookup Endpoints - GET /person/:rut', () => {
  it('debe retornar datos de la persona registrada en la base de usuarios mock (17.702.728-6)', async () => {
    const response = await request(app).get('/person/17.702.728-6');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      rut: '17.702.728-6',
      name: 'Diego Wigodski',
      role: 'user',
      found: true,
      source: 'mock'
    });
  });

  it('debe retornar datos de un usuario mock estándar (11.111.111-1)', async () => {
    const response = await request(app).get('/person/11.111.111-1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      rut: '11.111.111-1',
      name: 'Juan Pérez',
      role: 'user',
      found: true,
      source: 'mock'
    });
  });

  it('debe retornar found: false para un RUT chileno válido no registrado en el mock', async () => {
    // 19.876.543-0 es un RUT chileno válido con DV correcto (187 % 11 = 0 -> 0)
    const response = await request(app).get('/person/19.876.543-0');

    expect(response.status).toBe(200);
    expect(response.body.found).toBe(false);
    expect(response.body.rut).toBe('19.876.543-0');
    expect(response.body.name).toBe('Usuario 19.876.543-0');
    expect(response.body.source).toBe('mock');
  });

  it('debe retornar 400 Bad Request si el parámetro RUT tiene dígito verificador inválido', async () => {
    const response = await request(app).get('/person/17.702.728-9');
    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('message');
  });

  it('debe manejar RUTs sin puntos ni guión correctamente', async () => {
    const response = await request(app).get('/person/177027286');

    expect(response.status).toBe(200);
    expect(response.body.found).toBe(true);
    expect(response.body.rut).toBe('17.702.728-6');
    expect(response.body.name).toBe('Diego Wigodski');
  });
});
