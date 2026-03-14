import { API_URL, getHeaders, handleResponse } from './api';

export interface Category {
    id: number;
    name: string;
    description?: string;
}

class CategoryService {
    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${API_URL}/categories`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
}

export const categoryService = new CategoryService();
