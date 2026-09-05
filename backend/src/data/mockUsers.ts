import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Juan Pérez',
    rut: '11.111.111-1',
    password: 'password123',
    role: 'user'
  },
  {
    id: 'user-002',
    name: 'María González',
    rut: '22.222.222-2',
    password: 'password123',
    role: 'user'
  },
  {
    id: 'user-003',
    name: 'Carlos Silva',
    rut: '12.345.678-5',
    password: 'password123',
    role: 'user'
  },
  {
    id: 'admin-001',
    name: 'Administrador Fintech',
    rut: '99.999.999-9',
    password: 'admin123',
    role: 'admin'
  }
];
