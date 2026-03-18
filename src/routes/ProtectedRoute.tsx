import { Navigate, Outlet } from 'react-router';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'SISWA') {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export const ProfileRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!user || user.role !== 'SISWA') return <Navigate to="/login" replace />;

    return <Outlet />;
};
