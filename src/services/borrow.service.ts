import { API_URL, getHeaders, handleResponse } from './api';
import type { Borrowing, EligibilityResponse } from '../types';

class BorrowService {
    async getBorrowings(): Promise<Borrowing[]> {
        const response = await fetch(`${API_URL}/borrow`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }

    async getMyFines(): Promise<Borrowing[]> {
        const response = await fetch(`${API_URL}/borrow/my-fines`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }

    async checkEligibility(): Promise<EligibilityResponse> {
        const response = await fetch(`${API_URL}/borrow/check-eligibility`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }

    async borrowBook(bookId: number): Promise<Borrowing> {
        const response = await fetch(`${API_URL}/borrow`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ bookId }),
        });
        return handleResponse(response);
    }

    async returnBookRequest(borrowingId: number): Promise<Borrowing> {
        const response = await fetch(`${API_URL}/borrow/${borrowingId}/return`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
}

export const borrowService = new BorrowService();
