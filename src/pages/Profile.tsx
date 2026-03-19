import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-4">
                        👤
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.name ?? user.username}</h1>
                    <p className="text-gray-500 text-sm mb-3">NISN: {user.nisn ?? '-'}</p>
                    <span className="inline-block px-4 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-medium">
                        ✓ Member Aktif
                    </span>
                </div>

                {/* QR Code */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
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
                    <p className="text-center text-gray-400 text-xs mt-4">
                        ID: {user.id} • {user.role}
                    </p>
                </div>

                {/* Member Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                        <span>Member sejak</span>
                        <span className="font-medium text-gray-800">
                            {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Instruction */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Tunjukkan QR Code ini saat berkunjung ke perpustakaan
                </p>
            </div>
        </div>
    );
};

export default Profile;
