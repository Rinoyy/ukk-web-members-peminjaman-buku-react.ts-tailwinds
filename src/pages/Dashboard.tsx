import { useState } from 'react';
import SiswaBooks from '../components/SiswaBooks';
import SiswaHistory from '../components/SiswaHistory';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'browse' | 'history'>('browse');

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="px-6 py-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Library</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Hi, {user?.username}</span>
                        {user?.qrCode && (
                            <img src={user.qrCode} alt="My QR" className="w-10 h-10 border rounded" title="My Member QR" />
                        )}
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="p-6">
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex gap-6">
                        <button
                            onClick={() => setActiveTab('browse')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'browse'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Browse Books
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'history'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My History
                        </button>
                    </nav>
                </div>

                {activeTab === 'browse' ? <SiswaBooks /> : <SiswaHistory />}
            </div>
        </div>
    );
};

export default Dashboard;
