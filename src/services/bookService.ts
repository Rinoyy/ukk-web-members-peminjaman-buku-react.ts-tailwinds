import { API_URL, forceLogout, isUnauthorized } from './api';
import type { Book } from '../types';

class BookService {
    async getBooks(params?: { search?: string; category?: string }): Promise<Book[]> {
        const query = new URLSearchParams();
        if (params?.search) query.set('search', params.search);
        if (params?.category) query.set('category', params.category);
        const qs = query.toString();

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books${qs ? `?${qs}` : ''}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal mengambil data buku');
        }

        return response.json();
    }

    async getBookById(id: number): Promise<Book> {
        if (!id || id <= 0) {
            throw new Error('ID buku tidak valid');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal mengambil detail buku');
        }

        return response.json();
    }
}

export const bookService = new BookService();
