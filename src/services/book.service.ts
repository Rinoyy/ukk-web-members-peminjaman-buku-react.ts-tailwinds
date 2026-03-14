import { API_URL, getHeaders, handleResponse } from './api';
import type { Book } from '../types';

class BookService {
    async getBooks(params?: { search?: string; category?: string }): Promise<Book[]> {
        const query = new URLSearchParams();
        if (params?.search) query.set('search', params.search);
        if (params?.category) query.set('category', params.category);
        const qs = query.toString();

        const response = await fetch(`${API_URL}/books${qs ? `?${qs}` : ''}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }

    async getBookById(id: number): Promise<Book> {
        if (!id || id <= 0) {
            throw new Error('ID buku tidak valid');
        }

        const response = await fetch(`${API_URL}/books/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
}

export const bookService = new BookService();
