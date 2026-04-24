export interface User {
    id: number;
    username: string;
    nisn?: string;
    name?: string;
    role: 'ADMIN' | 'SISWA' | 'GURU' | 'STAFF';
    qrCode?: string;
    createdAt: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface EligibilityResponse {
    canBorrow: boolean;
    reason: string | null;
    hasUnreturnedBook: boolean;
    hasUnpaidFine: boolean;
    unpaidFineAmount: number;
}
