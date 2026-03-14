import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/book.service';
import { borrowService } from '../services/borrow.service';
import { useAuth } from '../hooks/useAuth';
import type { Book } from '../types';
import { BookOpen, AlertTriangle, X } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [eligibility, setEligibility] = useState<{ canBorrow: boolean, reason: string | null } | null>(null);
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [borrowLoading, setBorrowLoading] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await bookService.getBookById(Number(id));
                setBook(data);

                if (user) {
                    const eligibilityData = await borrowService.checkEligibility();
                    setEligibility(eligibilityData);
                }
            } catch (err) {
                console.error('Failed to load book:', err);
                setError('Buku tidak ditemukan');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, user]);

    const handleBorrow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (eligibility && !eligibility.canBorrow) {
            alert(eligibility.reason);
            return;
        }

        if (!book) return;
        setShowBorrowModal(true);
    };

    const confirmBorrow = async () => {
        if (!book) return;
        setBorrowLoading(true);
        try {
            await borrowService.borrowBook(book.id);
            setShowBorrowModal(false);
            alert('Permintaan peminjaman berhasil dikirim! Silakan ambil buku di perpustakaan.');
            navigate('/history');
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Gagal meminjam buku');
        } finally {
            setBorrowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Memuat detail buku...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <span className="text-6xl mb-4 block">📭</span>
                    <p className="text-gray-500 mb-4">{error || 'Buku tidak ditemukan'}</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Daftar Buku
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/books')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
                <span>←</span>
                <span>Kembali ke Daftar Buku</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header with Cover Image */}
                <div className="h-64 relative overflow-hidden">
                    {book.image ? (
                        <img
                            src={`${API_BASE}${book.image}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
                            <span className="text-8xl">📖</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Title & Category */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                                {book.category?.name || 'Umum'}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${book.stock > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {book.stock > 0 ? `${book.stock} Tersedia` : 'Stok Habis'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                        <p className="text-lg text-gray-600">✍️ {book.author}</p>
                    </div>

                    {/* Synopsis */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📝</span>
                            <span>Sinopsis</span>
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6">
                            {book.description ? (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {book.description}
                                </p>
                            ) : (
                                <p className="italic text-gray-400 text-center py-8">
                                    Belum ada sinopsis untuk buku ini.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Book Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <span className="text-2xl mb-2 block">📚</span>
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Kategori</span>
                            <span className="text-sm font-medium text-gray-700">{book.category?.name || 'Umum'}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <span className="text-2xl mb-2 block">✍️</span>
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Penulis</span>
                            <span className="text-sm font-medium text-gray-700">{book.author}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <span className="text-2xl mb-2 block">📦</span>
                            <span className="text-xs text-gray-400 uppercase font-semibold block">Stok</span>
                            <span className={`text-sm font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {book.stock} Tersedia
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <span className="text-2xl mb-2 block">🆔</span>
                            <span className="text-xs text-gray-400 uppercase font-semibold block">ID Buku</span>
                            <span className="text-sm font-medium text-gray-700">#{book.id}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 pt-6 border-t">
                        <button
                            onClick={() => navigate('/books')}
                            className="w-full py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                        >
                            ← Kembali
                        </button>

                        <button
                            onClick={handleBorrow}
                            disabled={book.stock < 1 || (eligibility !== null && !eligibility.canBorrow)}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2
                                ${book.stock > 0 && (!eligibility || eligibility.canBorrow)
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            <BookOpen className="w-6 h-6" />
                            {book.stock < 1 ? 'Stok Habis' :
                                eligibility && !eligibility.canBorrow ? 'Tidak Dapat Meminjam' :
                                    'Pinjam Buku Sekarang'}
                        </button>

                        {eligibility && !eligibility.canBorrow && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-800 text-sm">Peminjaman Dibatasi</p>
                                    <p className="text-sm text-red-600 mt-1">{eligibility.reason}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Borrow Confirmation Modal */}
            {showBorrowModal && book && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Modal Header with Book Image */}
                        <div className="h-32 relative overflow-hidden">
                            {book.image ? (
                                <img
                                    src={`${API_BASE}${book.image}`}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-5xl">📖</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowBorrowModal(false)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Pinjam Buku Ini?</h3>
                                <p className="text-gray-600 font-medium">{book.title}</p>
                                <p className="text-sm text-gray-400">oleh {book.author}</p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-3 mb-6">
                                <p className="text-sm text-blue-700 text-center">
                                    📋 Permintaan peminjaman akan dikirim ke petugas untuk disetujui.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBorrowModal(false)}
                                    className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmBorrow}
                                    disabled={borrowLoading}
                                    className="flex-1 py-3 px-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    {borrowLoading ? 'Loading...' : 'Ya, Pinjam'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
