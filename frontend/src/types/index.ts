export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  rut?: string;
  role: UserRole;
}

export interface JWTPayload {
  sub: string;
  role: UserRole;
  rut?: string;
  iat?: number;
  exp?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  rut?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ScoreData {
  rut: string;
  score: number;
  fecha: string;
}

export interface PersonData {
  rut: string;
  name: string;
  rawName?: string;
  sex?: string;
  address?: string;
  city?: string;
  found: boolean;
  source?: string;
}

export type ScoreLevel = 'excelente' | 'bueno' | 'moderado' | 'alto' | 'critico';

export interface ScoreCategory {
  level: ScoreLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  min: number;
  max: number;
}
