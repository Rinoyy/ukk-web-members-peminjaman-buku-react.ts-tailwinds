import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-5xl shadow-lg mb-4">
                        👤
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                    <span className="inline-block px-4 py-1 bg-green-500/20 border border-green-400 text-green-300 rounded-full text-sm font-medium">
                        ✓ Member Aktif
                    </span>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                    <p className="text-center text-gray-600 text-sm font-medium mb-4">
                        📱 Scan untuk Check-in Perpustakaan
                    </p>
                    {user.qrCode ? (
                        <img
                            src={user.qrCode}
                            alt="Member QR Code"
                            className="mx-auto w-64 h-64 rounded-xl"
                        />
                    ) : (
                        <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            QR Not Available
                        </div>
                    )}
                    <p className="text-center text-gray-500 text-xs mt-4">
                        ID: {user.id} • {user.role}
                    </p>
                </div>

                {/* Member Info */}
                <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-white/80 text-sm">
                        <span>Member sejak</span>
                        <span className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Instruction */}
                <p className="text-center text-white/60 text-sm mt-6">
                    Tunjukkan QR Code ini ke petugas saat berkunjung ke perpustakaan
                </p>
            </div>
        </div>
    );
};

export default Profile;
