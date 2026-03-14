import { API_URL, forceLogout, isUnauthorized } from './api';

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
}

class NotificationService {
    async getNotifications(): Promise<NotificationResponse> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/notifications`, {
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
            throw new Error(errorData.message || 'Gagal mengambil notifikasi');
        }

        return response.json();
    }

    async markAsRead(id: number): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/notifications/${id}/read`, {
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
            throw new Error('Gagal menandai notifikasi');
        }
    }

    async markAllAsRead(): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/notifications/read-all`, {
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
            throw new Error('Gagal menandai semua notifikasi');
        }
    }
}

export const notificationService = new NotificationService();
