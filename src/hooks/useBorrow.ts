import { useState, useCallback } from 'react';
import { getBorrowings, borrowBook, returnBookRequest, getMyFines } from '../services/borrow.service';
import type { Borrowing } from '../types';

export const useBorrow = () => {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [userFines, setUserFines] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBorrowings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getBorrowings();
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
            const data = await getMyFines();
            setUserFines(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const requestBorrow = async (bookId: number) => {
        try {
            await borrowBook(bookId);
            fetchBorrowings();
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to request borrow';
            alert(message);
            return false;
        }
    };

    const requestReturn = async (borrowingId: number) => {
        try {
            await returnBookRequest(borrowingId);
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
        requestReturn
    };
};
