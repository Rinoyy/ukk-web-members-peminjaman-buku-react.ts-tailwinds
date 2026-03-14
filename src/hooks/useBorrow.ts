import { useState, useCallback } from 'react';
import { borrowService } from '../services/borrow.service';
import type { Borrowing } from '../types';

export const useBorrow = () => {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [userFines, setUserFines] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBorrowings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await borrowService.getBorrowings();
            setBorrowings(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch borrowings');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyFines = useCallback(async () => {
        try {
            const data = await borrowService.getMyFines();
            setUserFines(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const requestBorrow = async (bookId: number) => {
        try {
            await borrowService.borrowBook(bookId);
            fetchBorrowings();
            return true;
        } catch (err: any) {
            const message = err.message || 'Gagal meminjam buku';
            alert(message);
            return false;
        }
    };

    const cancelBorrow = async (borrowingId: number) => {
        try {
            await borrowService.cancelBorrow(borrowingId);
            fetchBorrowings();
            return true;
        } catch (err: any) {
            const message = err.message || 'Gagal membatalkan peminjaman';
            alert(message);
            return false;
        }
    };

    const requestReturn = async (borrowingId: number) => {
        try {
            await borrowService.returnBookRequest(borrowingId);
            fetchBorrowings();
            return true;
        } catch (err) {
            console.error(err);
            alert('Failed to request return');
            return false;
        }
    };

    return {
        borrowings,
        userFines,
        loading,
        error,
        fetchBorrowings,
        fetchMyFines,
        requestBorrow,
        cancelBorrow,
        requestReturn
    };
};

