export interface Book {
    id: number;
    title: string;
    author: string;
    category: {
        id: number;
        name: string;
    };
    description?: string;
    image?: string;
    stock: number;
    qrCode?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookFilterParams {
    search?: string;
    category?: string | number;
}
