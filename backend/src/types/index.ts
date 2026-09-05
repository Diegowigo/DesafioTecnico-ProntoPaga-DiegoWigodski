import { Request } from 'express';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  rut: string;
  password?: string;
  role: UserRole;
}

export interface JWTPayload {
  sub: string;
  role: UserRole;
  rut?: string;
  iat?: number;
  exp?: number;
}

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}

export interface LoginRequestBody {
  rut?: string;
  username?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
    rut?: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
