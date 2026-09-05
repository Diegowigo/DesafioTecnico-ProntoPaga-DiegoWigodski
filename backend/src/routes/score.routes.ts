import { Router } from 'express';
import { scoreController } from '../controllers/score.controller';
import { authenticateJWT, authorizeScoreAccess } from '../middlewares/auth.middleware';
import { validateRutParam } from '../middlewares/validate.middleware';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /score/:rut
 * Cadena de middlewares requeridos:
 * 1. authenticateJWT: Valida firma y expiración del token JWT.
 * 2. validateRutParam: Valida formato y dígito verificador del RUT según Módulo 11.
 * 3. authorizeScoreAccess: Valida permisos por rol (admin o user sobre su propio RUT).
 * 4. scoreController: Ejecuta cálculo determinista y entrega JSON de respuesta.
 */
router.get(
  '/score/:rut',
  authenticateJWT,
  validateRutParam,
  authorizeScoreAccess,
  (req, res, next) => {
    scoreController.getScore(req as AuthenticatedRequest, res, next);
  }
);

export default router;
