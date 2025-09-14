export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
