import { API_URL, forceLogout, isUnauthorized } from './api';
import type { LoginResponse, User } from '../types';

class AuthService {
    async login(credentials: { nisn: string; password: string }): Promise<LoginResponse> {
        if (!credentials.nisn || !credentials.nisn.trim()) {
            throw new Error('NISN/NIP wajib diisi');
        }
        if (!credentials.password || !credentials.password.trim()) {
            throw new Error('Password wajib diisi');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(credentials),
        });

        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login gagal');
        }

        return response.json();
    }

    async register(nisn: string, password: string): Promise<{ message: string; user: User }> {
        if (!nisn || !nisn.trim()) {
            throw new Error('NISN wajib diisi');
        }
        if (!password || !password.trim()) {
            throw new Error('Password wajib diisi');
        }

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nisn, password }),
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Registrasi gagal');
        }

        return response.json();
    }
}

export const authService = new AuthService();
