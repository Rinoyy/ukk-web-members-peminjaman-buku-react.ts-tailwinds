import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MemberHome() {
    const [user, setUser] = useState<any>(null);
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

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-green-50">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Member Area ({user.role})</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Hello, {user.username}!</h2>
                    <div className="mb-6 p-4 bg-green-100 rounded-lg">
                        <p className="text-green-800 mb-2 text-center font-medium">Use this QR code for library access</p>
                        {user.qrCode ? (
                            <img src={user.qrCode} alt="Member QR Code" className="w-64 h-64 border-2 border-white rounded shadow mx-auto" />
                        ) : (
                            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-gray-500">No QR Code generated</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">My Profile</h3>
                        <ul className="text-gray-600">
                            <li><strong>Member ID:</strong> {user.id}</li>
                            <li><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
