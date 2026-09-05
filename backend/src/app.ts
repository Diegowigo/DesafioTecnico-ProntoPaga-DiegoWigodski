import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, AppError } from './middlewares/error.middleware';

export function createApp(): Application {
  const app: Application = express();

  // Middlewares de seguridad y parsing
  app.use(helmet());
  app.use(cors({
    origin: '*', // Permitir conexión desde frontend local
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Rutas principales
  app.use('/', routes);
  app.use('/api', routes); // Compatibilidad adicional con prefijo /api

  // Manejador para rutas no encontradas (404)
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
  });

  // Middleware de manejo de errores global
  app.use(errorHandler);

  return app;
}

export const app = createApp();
