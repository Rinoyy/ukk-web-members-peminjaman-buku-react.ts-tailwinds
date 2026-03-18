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

    const login = async (username: string, password: string) => {
        try {
            const data = await authService.login({ username, password });
            if (data.user.role !== 'SISWA') {
                alert('Access Denied: Only Siswa can login here.');
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

    const register = async (username: string, password: string) => {
        try {
            await authService.register(username, password, 'SISWA');
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
