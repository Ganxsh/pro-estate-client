
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  user?: AuthUser;
}

export interface AuthErrorResponse {
  error?: string | Record<string, unknown>;
  message?: string;
}
