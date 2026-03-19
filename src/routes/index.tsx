import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute, ProfileRoute } from './ProtectedRoute';
import RootRedirect from './RootRedirect';

const Login      = lazy(() => import('../pages/Login'));
const Register   = lazy(() => import('../pages/Register'));
const Home       = lazy(() => import('../pages/Home'));
const Books      = lazy(() => import('../pages/Books'));
const BookDetail = lazy(() => import('../pages/BookDetail'));
const History    = lazy(() => import('../pages/History'));
const Profile    = lazy(() => import('../pages/Profile'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
    </div>
);

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Suspense fallback={<PageLoader />}><Login /></Suspense>,
    },
    {
        path: '/register',
        element: <Suspense fallback={<PageLoader />}><Register /></Suspense>,
    },

    {
        element: <ProfileRoute />,
        children: [
            {
                path: '/profile',
                element: <Suspense fallback={<PageLoader />}><Profile /></Suspense>,
            },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <Suspense fallback={<PageLoader />}><Home /></Suspense>,
            },
            {
                path: '/books',
                element: <Suspense fallback={<PageLoader />}><Books /></Suspense>,
            },
            {
                path: '/books/:id',
                element: <Suspense fallback={<PageLoader />}><BookDetail /></Suspense>,
            },
            {
                path: '/history',
                element: <Suspense fallback={<PageLoader />}><History /></Suspense>,
            },
        ],
    },

    { path: '/', element: <RootRedirect /> },
    { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
