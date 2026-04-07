import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../types';

export default function MemberHome() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div className="p-8">Memuat...</div>;

    return (
        <div className="min-h-screen bg-white">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Area Member ({user.role})</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer transition"
                >
                    Keluar
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Halo, {user.username}!</h2>
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <p className="text-gray-700 mb-2 text-center font-medium">Gunakan QR code ini untuk akses perpustakaan</p>
                        {user.qrCode ? (
                            <img src={user.qrCode} alt="Member QR Code" className="w-64 h-64 border-2 border-white rounded shadow mx-auto" />
                        ) : (
                            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-gray-500">Kode QR belum dibuat</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Profil Saya</h3>
                        <ul className="text-gray-600">
                            <li><strong>ID Member:</strong> {user.id}</li>
                            <li><strong>Bergabung:</strong> {new Date(user.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
