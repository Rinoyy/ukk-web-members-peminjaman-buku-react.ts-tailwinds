import { useState, useCallback } from 'react';
import { getBooks } from '../services/book.service';
import type { Book } from '../types';

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBooks = useCallback(async (params?: any) => {
        setLoading(true);
        try {
            const data = await getBooks(params);
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { books, loading, fetchBooks };
};
