import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, X, CheckCheck } from 'lucide-react';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'BORROW_APPROVED': return '✅';
            case 'BORROW_REJECTED': return '❌';
            case 'PICKUP_REMINDER': return '⏰';
            default: return '🔔';
        }
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes}m lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}j lalu`;
        const days = Math.floor(hours / 24);
        return `${days}h lalu`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/20 transition-colors"
            >
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifikasi
                        </h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Tandai semua
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <span className="text-3xl block mb-2">🔕</span>
                                Belum ada notifikasi
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.isRead && markAsRead(n.id)}
                                    className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${n.isRead ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl mt-0.5">{getTypeIcon(n.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-sm font-bold truncate ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {n.title}
                                                </h4>
                                                {!n.isRead && (
                                                    <span className="shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2" />
                                                )}
                                            </div>
                                            <p className={`text-sm whitespace-pre-line ${n.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
