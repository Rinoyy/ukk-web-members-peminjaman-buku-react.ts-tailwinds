import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types';
import { useNavigate } from 'react-router';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        const handleForceLogout = () => {
            setUser(null);
            navigate('/login');
        };
        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, [navigate]);

    const login = async (nisn: string, password: string) => {
        try {
            const data = await authService.login({ nisn, password });
            if (!['SISWA', 'GURU', 'STAFF'].includes(data.user.role)) {
                alert('Akses ditolak: Halaman ini tidak tersedia untuk akun ini.');
                return false;
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/dashboard');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (nisn: string, password: string) => {
        try {
            await authService.register(nisn, password);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return { user, login, register, logout, loading };
};
