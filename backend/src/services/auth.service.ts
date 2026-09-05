import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { MOCK_USERS } from '../data/mockUsers';
import { LoginRequestBody, LoginResponse, JWTPayload, User } from '../types';
import { cleanRut, formatRut, validateRut } from '../utils/rut.util';
import { AppError } from '../middlewares/error.middleware';
import { nombrerutyfirmaService } from './nombrerutyfirma.service';

export class AuthService {
  /**
   * Autentica un usuario según RUT o nombre de usuario.
   * Si el RUT no existe en el mock pero es un RUT válido, consulta NombreRutYFirma
   * para obtener su nombre real y permitir acceso dinámico.
   */
  public async login(credentials: LoginRequestBody): Promise<LoginResponse> {
    const { rut, username, password } = credentials;

    let user: User | undefined;

    // 1. Buscar en usuarios mock preconfigurados
    const existingMock = MOCK_USERS.find((u) => {
      if (rut && cleanRut(u.rut) === cleanRut(rut)) {
        return true;
      }
      if (username && (u.id === username || u.name.toLowerCase().includes(username.toLowerCase()))) {
        return true;
      }
      return false;
    });

    if (existingMock) {
      if (existingMock.password !== password) {
        throw new AppError('Credenciales inválidas. Verifique RUT/usuario y contraseña', 401);
      }
      user = existingMock;
    } else if (rut && validateRut(rut)) {
      // 2. Si no es un usuario mock pero es un RUT chileno válido, consultar NombreRutYFirma
      const formatted = formatRut(rut);
      const cleaned = cleanRut(rut);
      const personData = await nombrerutyfirmaService.fetchPersonByRut(rut);

      user = {
        id: `user-${cleaned}`,
        name: personData?.name || `Usuario ${formatted}`,
        rut: formatted,
        role: 'user'
      };
    }

    if (!user) {
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
