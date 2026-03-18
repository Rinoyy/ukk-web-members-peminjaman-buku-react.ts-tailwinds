import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router';

const Home = () => {
    const { user } = useAuth();

    const features = [
        { icon: '📚', title: 'Jelajahi Buku', desc: 'Temukan koleksi buku terlengkap', link: '/books' },
        { icon: '📋', title: 'Riwayat Pinjam', desc: 'Lihat status peminjaman Anda', link: '/history' },
        { icon: '👤', title: 'Profil Saya', desc: 'Lihat QR Code untuk check-in', link: '/profile' },
    ];

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.username}! 👋</h2>
                <p className="opacity-90">Jelajahi koleksi buku dan mulai pinjam hari ini.</p>
            </div>

            {/* Quick Actions */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Menu Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {features.map((f, idx) => (
                    <Link
                        key={idx}
                        to={f.link}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                    >
                        <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                            {f.icon}
                        </span>
                        <h4 className="font-bold text-gray-800 mb-1">{f.title}</h4>
                        <p className="text-sm text-gray-500">{f.desc}</p>
                    </Link>
                ))}
            </div>

            {/* QR Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                    {user?.qrCode && (
                        <img
                            src={user.qrCode}
                            alt="QR"
                            className="w-24 h-24 rounded-lg border-2 border-gray-200"
                        />
                    )}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">QR Code Anda</h4>
                        <p className="text-sm text-gray-500 mb-3">
                            Tunjukkan QR ini saat berkunjung ke perpustakaan
                        </p>
                        <Link
                            to="/profile"
                            className="text-sm text-blue-600 font-medium hover:underline"
                        >
                            Lihat QR lebih besar →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
