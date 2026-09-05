import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { config } from '../src/config/env';
import { JWTPayload } from '../src/types';
import {
  parseNombrerutyfirmaHtml,
  reorderChileanName
} from '../src/services/nombrerutyfirma.service';

const sampleHtml = `
<!DOCTYPE html>
<html lang="es-CL">
<body>
  <div class="container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>RUT</th>
          <th>Sexo</th>
          <th>Dirección</th>
          <th>Ciudad/Comuna</th>
        </tr>    
      </thead>
      <tbody>
        <tr tabindex="1">
          <td>Wigodski Carafi Diego</td>
          <td style="white-space: nowrap;">17.702.728-6</td>
          <td>VAR</td>
          <td>Sin Datos</td>
          <td>Plaza ñuñoa</td>
        </tr>	
      </tbody>
    </table>
  </div>
</body>
</html>
`;

describe('NombreRutYFirma Service - Parseo y Reordenamiento de Nombres', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(sampleHtml)
      } as Response)
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('reorderChileanName', () => {
    it('debe reordenar correctamente formato "ApellidoPaterno ApellidoMaterno Nombres" a "Nombres ApellidoPaterno ApellidoMaterno"', () => {
      // Caso 3 partes: Wigodski (paterno) Carafi (materno) Diego (nombre)
      expect(reorderChileanName('Wigodski Carafi Diego')).toBe('Diego Wigodski Carafi');

      // Caso 4 partes: Pérez (paterno) González (materno) Juan Carlos (nombres)
      expect(reorderChileanName('Pérez González Juan Carlos')).toBe('Juan Carlos Pérez González');

      // Caso 2 partes: Silva Juan
      expect(reorderChileanName('Silva Juan')).toBe('Juan Silva');

      // Caso 1 parte
      expect(reorderChileanName('Diego')).toBe('Diego');

      // Caso vacío
      expect(reorderChileanName('')).toBe('');
    });
  });

  describe('parseNombrerutyfirmaHtml', () => {
    it('debe parsear la tabla HTML de NombreRutYFirma y extraer nombre reordenado, rut, comuna', () => {
      const result = parseNombrerutyfirmaHtml(sampleHtml);
      expect(result).not.toBeNull();
      expect(result?.rawName).toBe('Wigodski Carafi Diego');
      expect(result?.name).toBe('Diego Wigodski Carafi');
      expect(result?.rut).toBe('17.702.728-6');
      expect(result?.sex).toBe('VAR');
      expect(result?.city).toBe('Plaza ñuñoa');
    });

    it('debe retornar null para HTML sin tabla o sin resultados', () => {
      const emptyHtml = '<html><body><p>No se encontraron resultados</p></body></html>';
      expect(parseNombrerutyfirmaHtml(emptyHtml)).toBeNull();
    });
  });

  describe('Login Dinámico con RUT no incluido en Mock (ej: 17.702.728-6)', () => {
    it('debe autenticar cualquier RUT chileno válido y retornar nombre con formato Nombre Apellido', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          rut: '17.702.728-6',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.rut).toBe('17.702.728-6');
      expect(response.body.user.role).toBe('user');
      expect(response.body.user.name).toBe('Diego Wigodski Carafi');

      // Validar que el token emitido sea válido para consultar su propio score
      const decoded = jwt.verify(response.body.token, config.jwt.secret) as JWTPayload;
      expect(decoded.role).toBe('user');
      expect(decoded.rut).toBe('17.702.728-6');

      // Consulta de score propio con el token emitido
      const scoreResponse = await request(app)
        .get('/score/17.702.728-6')
        .set('Authorization', `Bearer ${response.body.token}`);

      expect(scoreResponse.status).toBe(200);
      expect(scoreResponse.body.rut).toBe('17.702.728-6');
      expect(typeof scoreResponse.body.score).toBe('number');

      // Si intenta consultar el RUT de otro usuario, debe denegar con 403
      const forbiddenResponse = await request(app)
        .get('/score/11.111.111-1')
        .set('Authorization', `Bearer ${response.body.token}`);

      expect(forbiddenResponse.status).toBe(403);
    });
  });

  describe('GET /person/:rut', () => {
    it('debe retornar datos de la persona para un RUT chileno válido', async () => {
      const response = await request(app).get('/person/17.702.728-6');

      expect(response.status).toBe(200);
      expect(response.body.rut).toBe('17.702.728-6');
      expect(response.body.name).toBe('Diego Wigodski Carafi');
    });

    it('debe retornar 400 si el RUT en /person/:rut es inválido', async () => {
      const response = await request(app).get('/person/17.702.728-9');
      expect(response.status).toBe(400);
    });
  });
});
