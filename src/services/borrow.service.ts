import api from './api';
import type { Borrowing, EligibilityResponse } from '../types';

export const getBorrowings = async () => {
    const response = await api.get<Borrowing[]>('/borrow');
    return response.data;
};

export const getMyFines = async () => {
    const response = await api.get<Borrowing[]>('/borrow/my-fines');
    return response.data;
};

export const checkEligibility = async () => {
    const response = await api.get<EligibilityResponse>('/borrow/check-eligibility');
    return response.data;
};

export const borrowBook = async (bookId: number) => {
    const response = await api.post<Borrowing>('/borrow', { bookId });
    return response.data;
};

export const returnBookRequest = async (borrowingId: number) => {
    const response = await api.post<Borrowing>(`/borrow/${borrowingId}/return`);
    return response.data;
};
