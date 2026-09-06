import { LoginCredentials, LoginResponse, ScoreData, PersonData } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      data?.message ||
      `Error ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export const apiService = {
  /** POST /login - Authenticate with RUT/username and password */
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /** GET /score/:rut - Get financial risk score (requires auth token) */
  getScore: (rut: string, token: string): Promise<ScoreData> =>
    request<ScoreData>(`/score/${encodeURIComponent(rut)}`, {}, token),

  /** GET /person/:rut - Get public personal data from mock database */
  getPerson: (rut: string): Promise<PersonData> =>
    request<PersonData>(`/person/${encodeURIComponent(rut)}`),

  /** GET /health - Health check */
  health: (): Promise<{ status: string; service: string; timestamp: string }> =>
    request('/health'),
};
