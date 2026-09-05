import { Router } from 'express';
import { rutController } from '../controllers/rut.controller';
import { validateRutParam } from '../middlewares/validate.middleware';

const router = Router();

/**
 * GET /person/:rut
 * Endpoint para obtener el nombre y datos de una persona consultando NombreRutYFirma.
 */
router.get('/person/:rut', validateRutParam, (req, res, next) => {
  rutController.getPersonByRut(req, res, next);
});

export default router;
