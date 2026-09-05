import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { cleanRut } from '../utils/rut.util';
import { AppError } from './error.middleware';

/**
 * Middleware de Autenticación:
 * Valida la existencia, firma y expiración del JWT en la cabecera Authorization.
 */
export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autenticación no proporcionado o formato inválido', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('El token de autenticación ha expirado', 401);
    }
    throw new AppError('Token de autenticación inválido', 401);
  }
}

/**
 * Middleware de Autorización para Score:
 * - Rol 'admin': Puede consultar cualquier RUT.
 * - Rol 'user': Solo puede consultar su propio RUT (debe coincidir con el RUT de su token).
 */
export function authorizeScoreAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const user = req.user;

  if (!user) {
    throw new AppError('No autenticado', 401);
  }

  if (user.role === 'admin') {
    // Admin tiene acceso total
    return next();
  }

  if (user.role === 'user') {
    const requestedRut = req.params.rut;
    const userRut = user.rut;

    if (!userRut) {
      throw new AppError('Token no contiene RUT asociado al usuario', 403);
    }

    const cleanRequested = cleanRut(requestedRut);
    const cleanUserRut = cleanRut(userRut);

    if (cleanRequested !== cleanUserRut) {
      throw new AppError(
        'Acceso denegado: Un usuario con rol "user" solo puede consultar su propio score',
        403
      );
    }

    return next();
  }

  throw new AppError('Rol de usuario no autorizado', 403);
}
