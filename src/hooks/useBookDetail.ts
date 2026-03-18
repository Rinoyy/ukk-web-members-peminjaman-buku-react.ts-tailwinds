import { useState, useCallback } from 'react';
import { bookService } from '../services/bookService';
import { borrowService } from '../services/borrowService';
import type { Book, EligibilityResponse } from '../types';

export const useBookDetail = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [borrowLoading, setBorrowLoading] = useState(false);

    const fetchBook = useCallback(async (id: number) => {
        setLoading(true);
        setError('');
        try {
            const data = await bookService.getBookById(id);
            setBook(data);
        } catch {
            setError('Buku tidak ditemukan');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEligibility = useCallback(async () => {
        try {
            const data = await borrowService.checkEligibility();
            setEligibility(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const borrowBook = async (bookId: number): Promise<{ success: boolean; error?: string }> => {
        setBorrowLoading(true);
        try {
            await borrowService.borrowBook(bookId);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Gagal meminjam buku' };
        } finally {
            setBorrowLoading(false);
        }
    };

    return { book, eligibility, loading, error, borrowLoading, fetchBook, fetchEligibility, borrowBook };
};
