import { API_URL, forceLogout } from './api';

export interface Category {
    id: number;
    name: string;
    description?: string;
}

class CategoryService {
    async getCategories(): Promise<Category[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (response.status === 401) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal mengambil data kategori');
        }

        return response.json();
    }
}

export const categoryService = new CategoryService();
