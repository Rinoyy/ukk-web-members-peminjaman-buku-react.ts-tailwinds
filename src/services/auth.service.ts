import api from './api';
import type { LoginResponse, User } from '../types';

export const login = async (credentials: { username: string; password: string }) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (username: string, password: string, role: string) => {
    const response = await api.post<{ message: string; user: User }>('/auth/register', { username, password, role });
    return response.data;
};
