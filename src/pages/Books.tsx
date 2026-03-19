import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBooks } from '../hooks/useBooks';
import { useBorrow } from '../hooks/useBorrow';
import { useCategories } from '../hooks/useCategories';
import type { Book, BookFilterParams } from '../types';
import { BookOpen, BookMarked, X, Search, Inbox, PenLine } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

const Books = () => {
    const { books, loading, fetchBooks } = useBooks();
    const { requestBorrow } = useBorrow();
    const { categories } = useCategories();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [borrowModal, setBorrowModal] = useState<Book | null>(null);
    const [borrowLoading, setBorrowLoading] = useState(false);

    useEffect(() => {
        const params: BookFilterParams = { search };
        if (categoryId) params.category = categoryId;
        fetchBooks(params);
    }, [search, categoryId, fetchBooks]);

    const handleBorrow = async () => {
        if (!borrowModal) return;
        setBorrowLoading(true);
        const success = await requestBorrow(borrowModal.id);
        setBorrowLoading(false);
        if (success) {
            setBorrowModal(null);
            alert('Permintaan peminjaman berhasil dikirim!');
        }
    };

    const handleViewDetail = (bookId: number) => {
        navigate(`/books/${bookId}`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><BookMarked className="w-6 h-6" /> Koleksi Buku</h2>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari buku..."
                            style={{ paddingLeft: '2.25rem' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 bg-white cursor-pointer"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Book Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : books.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Inbox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    Tidak ada buku ditemukan
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book: Book) => (
                        <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">
                            <div
                                className="h-48 relative cursor-pointer group overflow-hidden"
                                onClick={() => handleViewDetail(book.id)}
                            >
                                {book.image ? (
                                    <img
                                        src={`${API_BASE}${book.image}`}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-white/70 group-hover:scale-110 transition-transform" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Lihat Detail</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3
                                        className="font-bold text-gray-800 line-clamp-2 text-lg hover:text-gray-600 cursor-pointer"
                                        onClick={() => handleViewDetail(book.id)}
                                    >
                                        {book.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><PenLine className="w-3 h-3" /> {book.author}</p>
                                {book.category?.name && (
                                    <span className="inline-block w-fit px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full mb-3">
                                        {book.category.name}
                                    </span>
                                )}

                                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase font-semibold">Stok</span>
                                        <span className={`text-sm font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {book.stock} Available
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setBorrowModal(book)}
                                        disabled={book.stock <= 0}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${book.stock > 0
                                            ? 'bg-gray-900 text-white hover:bg-gray-700 shadow-gray-200 shadow-md cursor-pointer'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Pinjam Buku
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Borrow Confirmation Modal */}
            {borrowModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-32 relative overflow-hidden">
                            {borrowModal.image ? (
                                <img
                                    src={`${API_BASE}${borrowModal.image}`}
                                    alt={borrowModal.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                                    <BookOpen className="w-14 h-14 text-white/70" />
                                </div>
                            )}
                            <button
                                onClick={() => setBorrowModal(null)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 cursor-pointer transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Pinjam Buku Ini?</h3>
                                <p className="text-gray-600 font-medium">{borrowModal.title}</p>
                                <p className="text-sm text-gray-400">oleh {borrowModal.author}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 mb-6">
                                <p className="text-sm text-gray-700 text-center">
                                    Permintaan peminjaman akan dikirim ke petugas untuk disetujui.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setBorrowModal(null)}
                                    className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleBorrow}
                                    disabled={borrowLoading}
                                    className="flex-1 py-3 px-4 text-white bg-gray-900 rounded-xl hover:bg-gray-700 cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default Books;
