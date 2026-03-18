import { createBrowserRouter, Navigate } from 'react-router';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Books from '../pages/Books';
import BookDetail from '../pages/BookDetail';
import History from '../pages/History';
import Profile from '../pages/Profile';
import { ProtectedRoute, ProfileRoute } from './ProtectedRoute';
import RootRedirect from './RootRedirect';

const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },

    {
        element: <ProfileRoute />,
        children: [
            { path: '/profile', element: <Profile /> },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <Home /> },
            { path: '/books', element: <Books /> },
            { path: '/books/:id', element: <BookDetail /> },
            { path: '/history', element: <History /> },
        ],
    },

    { path: '/', element: <RootRedirect /> },
    { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
