import { API_URL, getHeaders, handleResponse } from './api';
import type { LoginResponse, User } from '../types';

class AuthService {
    async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
        if (!credentials.username || !credentials.username.trim()) {
            throw new Error('Username wajib diisi');
        }
        if (!credentials.password || !credentials.password.trim()) {
            throw new Error('Password wajib diisi');
        }

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    }

    async register(username: string, password: string, role: string): Promise<{ message: string; user: User }> {
        if (!username || !username.trim()) {
            throw new Error('Username wajib diisi');
        }
        if (!password || !password.trim()) {
            throw new Error('Password wajib diisi');
        }
        if (!role || !role.trim()) {
            throw new Error('Role wajib diisi');
        }

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password, role }),
        });
        return handleResponse(response);
    }
}

export const authService = new AuthService();
