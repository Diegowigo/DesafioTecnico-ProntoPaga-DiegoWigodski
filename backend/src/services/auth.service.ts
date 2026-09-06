import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { MOCK_USERS } from '../data/mockUsers';
import { LoginRequestBody, LoginResponse, JWTPayload, User } from '../types';
import { cleanRut } from '../utils/rut.util';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  /**
   * Autentica un usuario según RUT o nombre de usuario contra la base de usuarios mock.
   */
  public async login(credentials: LoginRequestBody): Promise<LoginResponse> {
    const { rut, username, password } = credentials;

    // Buscar en usuarios mock preconfigurados
    const user = MOCK_USERS.find((u) => {
      if (rut && cleanRut(u.rut) === cleanRut(rut)) {
        return true;
      }
      if (username && (u.id === username || u.name.toLowerCase().includes(username.toLowerCase()))) {
        return true;
      }
      return false;
    });

    if (!user || user.password !== password) {
      throw new AppError('Credenciales inválidas. Verifique RUT/usuario y contraseña', 401);
    }

    // Construcción del payload del JWT según los requerimientos del desafío
    const payload: JWTPayload = {
      sub: user.id,
      role: user.role
    };

    // 'rut' se incluye en el payload ÚNICAMENTE si el rol es 'user'
    if (user.role === 'user') {
      payload.rut = user.rut;
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn']
    };

    const token = jwt.sign(payload, config.jwt.secret, signOptions);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        ...(user.role === 'user' ? { rut: user.rut } : {})
      }
    };
  }
}

export const authService = new AuthService();
