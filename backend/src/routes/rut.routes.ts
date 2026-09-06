import { Router } from 'express';
import { rutController } from '../controllers/rut.controller';
import { validateRutParam } from '../middlewares/validate.middleware';

const router = Router();

/**
 * GET /person/:rut
 * Endpoint para obtener el nombre y datos de una persona desde la base de usuarios mock.
 */
router.get('/person/:rut', validateRutParam, (req, res, next) => {
  rutController.getPersonByRut(req, res, next);
});

export default router;
