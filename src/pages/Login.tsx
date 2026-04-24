import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogIn } from 'lucide-react';

const Login = () => {
    const [nisn, setNisn] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(nisn, password);
        setLoading(false);

        if (!success) {
            setError('Login gagal. Periksa NISN dan password.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-gray-800" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Perpustakaan</h1>
                    <p className="text-gray-500 mt-1 text-sm">Login ke akun Anda</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NISN / Username</label>
                        <input
                            type="text"
                            value={nisn}
                            onChange={(e) => setNisn(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            placeholder="NISN (siswa) atau username (guru/staff)"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                    >
                        <LogIn className="w-4 h-4" />
                        {loading ? 'Memuat...' : 'Masuk'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">Belum punya akun? </span>
                    <Link to="/register" className="text-gray-900 font-medium text-sm hover:underline">
                        Daftar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
