import { Router } from 'express';
import authRoutes from './auth.routes';
import scoreRoutes from './score.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ProntoPaga Score API', timestamp: new Date().toISOString() });
});

// Rutas de autenticación y score
router.use('/', authRoutes);
router.use('/', scoreRoutes);

export default router;
