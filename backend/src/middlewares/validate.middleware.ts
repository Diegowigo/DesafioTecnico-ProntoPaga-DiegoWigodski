import { Request, Response, NextFunction } from 'express';
import { validateRut } from '../utils/rut.util';
import { AppError } from './error.middleware';

/**
 * Middleware para validar el parámetro :rut en rutas como /score/:rut
 */
export function validateRutParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { rut } = req.params;

  if (!rut) {
    throw new AppError('El parámetro RUT es obligatorio', 400);
  }

  if (!validateRut(rut)) {
    throw new AppError(
      'El RUT ingresado es inválido o su dígito verificador no coincide',
      400
    );
  }

  next();
}

/**
 * Middleware para validar el cuerpo del request en el endpoint /login
 */
export function validateLoginInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { rut, username, password } = req.body;

  if ((!rut && !username) || !password) {
    throw new AppError('Debe ingresar RUT/usuario y contraseña', 400);
  }

  if (rut && !validateRut(rut)) {
    throw new AppError('El formato o dígito verificador del RUT es inválido', 400);
  }

  next();
}
