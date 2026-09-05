import { Router } from 'express';
import authRoutes from './auth.routes';
import scoreRoutes from './score.routes';
import rutRoutes from './rut.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ProntoPaga Score API', timestamp: new Date().toISOString() });
});

// Rutas de autenticación, score y consulta de personas
router.use('/', authRoutes);
router.use('/', scoreRoutes);
router.use('/', rutRoutes);

export default router;
