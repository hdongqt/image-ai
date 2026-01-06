import apiClient from './axios';

export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        username: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
}

export const authApi = {
    login: (data: LoginDto) => apiClient.post<AuthResponse>('/auth/login', data),
    register: (data: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
};
