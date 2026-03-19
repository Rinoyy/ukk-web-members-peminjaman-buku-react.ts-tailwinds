import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [nisn, setNisn] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok!');
            return;
        }

        setLoading(true);
        const success = await register(nisn, password);
        setLoading(false);

        if (success) {
            navigate('/login');
        } else {
            setError('Registrasi gagal. NISN tidak terdaftar atau sudah digunakan.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-gray-800" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Member</h1>
                    <p className="text-gray-500 mt-1 text-sm">Buat akun untuk meminjam buku</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NISN</label>
                        <input
                            type="text"
                            value={nisn}
                            onChange={(e) => setNisn(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            placeholder="Masukkan NISN"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            placeholder="Buat password"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
                            placeholder="Ulangi password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        {loading ? 'Loading...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">Sudah punya akun? </span>
                    <Link to="/login" className="text-gray-900 font-medium text-sm hover:underline">
                        Masuk
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
