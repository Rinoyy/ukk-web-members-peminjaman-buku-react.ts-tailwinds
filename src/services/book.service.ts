import api from './api';
import type { Book } from '../types';

export const getBooks = async (params?: { search?: string; category?: string }) => {
    const response = await api.get<Book[]>('/books', { params });
    return response.data;
};

export const getBookById = async (id: number) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
};
