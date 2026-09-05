import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateLoginInput } from '../middlewares/validate.middleware';

const router = Router();

router.post('/login', validateLoginInput, (req, res, next) => {
  authController.login(req, res, next);
});

export default router;
