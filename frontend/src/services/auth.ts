import apiClient from '@/lib/axios';
import { ApiResponse, User } from '@/types';

export interface SignupData {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'nickname'>;
}

export const signup = (data: SignupData) =>
  apiClient
    .post<ApiResponse<AuthResponse>>('/api/auth/signup', data)
    .then((res) => res.data);

export const login = (data: LoginData) =>
  apiClient
    .post<ApiResponse<AuthResponse>>('/api/auth/login', data)
    .then((res) => res.data);
