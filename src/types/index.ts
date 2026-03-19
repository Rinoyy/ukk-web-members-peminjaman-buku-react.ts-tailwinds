export interface User {
    id: number;
    username: string;
    nisn?: string;
    name?: string;
    role: 'ADMIN' | 'SISWA';
    qrCode?: string;
    createdAt: string;
}

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

export interface Borrowing {
    id: number;
    userId: number;
    bookId: number; // For backward compatibility if needed, but should use bookCopyId
    status: 'PENDING' | 'BORROWED' | 'RETURN_PENDING' | 'RETURNED' | 'REJECTED' | 'CANCELLED';
    borrowDate: string;
    dueDate?: string;
    actualReturnDate?: string;
    condition?: 'GOOD' | 'DAMAGED' | 'LOST';
    rejectReason?: string;
    lateFee: number;
    damageFee: number;
    totalFine: number;
    isPickedUp: boolean;
    isPaid: boolean;
    createdAt: string;
    book?: Book;
    user?: User;
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
