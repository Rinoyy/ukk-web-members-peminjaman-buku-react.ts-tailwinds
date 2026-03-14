import { API_URL, forceLogout, isUnauthorized } from './api';
import type { Borrowing, EligibilityResponse } from '../types';

class BorrowService {
    async getBorrowings(): Promise<Borrowing[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal mengambil data peminjaman');
        }

        return response.json();
    }

    async getMyFines(): Promise<Borrowing[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow/my-fines`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal mengambil data denda');
        }

        return response.json();
    }

    async checkEligibility(): Promise<EligibilityResponse> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow/check-eligibility`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal cek kelayakan');
        }

        return response.json();
    }

    async borrowBook(bookId: number): Promise<Borrowing> {
        if (!bookId || bookId <= 0) {
            throw new Error('ID buku tidak valid');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ bookId }),
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal meminjam buku');
        }

        return response.json();
    }

    async returnBookRequest(borrowingId: number): Promise<Borrowing> {
        if (!borrowingId || borrowingId <= 0) {
            throw new Error('ID peminjaman tidak valid');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow/${borrowingId}/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal request pengembalian');
        }

        return response.json();
    }

    async cancelBorrow(borrowingId: number): Promise<void> {
        if (!borrowingId || borrowingId <= 0) {
            throw new Error('ID peminjaman tidak valid');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/borrow/${borrowingId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (isUnauthorized(response.status)) {
            forceLogout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal membatalkan peminjaman');
        }
    }
}

export const borrowService = new BorrowService();
