import type { Book } from './book';
import type { User } from './user';

export type BorrowStatus = 'PENDING' | 'BORROWED' | 'RETURN_PENDING' | 'RETURNED' | 'REJECTED' | 'CANCELLED';

export type ReturnCondition = 'GOOD' | 'DAMAGED' | 'LOST';

export interface Borrowing {
    id: number;
    userId: number;
    bookId: number;
    status: BorrowStatus;
    borrowDate: string;
    dueDate?: string;
    actualReturnDate?: string;
    condition?: ReturnCondition;
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
