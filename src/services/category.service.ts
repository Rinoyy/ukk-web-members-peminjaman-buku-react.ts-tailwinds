import api from './api';

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export const getCategories = async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};
