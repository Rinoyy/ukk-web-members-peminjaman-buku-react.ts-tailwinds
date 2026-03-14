import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useBorrow } from '../hooks/useBorrow';
import { categoryService, type Category } from '../services/category.service';
import type { Book } from '../types';

const Books = () => {
    const { books, loading, fetchBooks } = useBooks();
    const { requestBorrow } = useBorrow();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const params: any = { search };
        if (categoryId) params.categoryId = categoryId;
        fetchBooks(params);
    }, [search, categoryId, fetchBooks]);

    const handleBorrow = async (bookId: number) => {
        const success = await requestBorrow(bookId);
        if (success) {
            alert('Permintaan peminjaman berhasil dikirim!');
        }
    };

    const handleViewDetail = (bookId: number) => {
        navigate(`/books/${bookId}`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Koleksi Buku</h2>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="🔍 Cari buku..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
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
                    <span className="text-4xl mb-2 block">📭</span>
                    Tidak ada buku ditemukan
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book: Book) => (
                        <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">
                            {/* Book Cover Placeholder */}
                            <div
                                className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative cursor-pointer group"
                                onClick={() => handleViewDetail(book.id)}
                            >
                                <span className="text-6xl group-hover:scale-110 transition-transform">📖</span>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Lihat Detail</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3
                                        className="font-bold text-gray-800 line-clamp-2 text-lg hover:text-blue-600 cursor-pointer"
                                        onClick={() => handleViewDetail(book.id)}
                                    >
                                        {book.title}
                                    </h3>
                                    {book.qrCode && (
                                        <img src={book.qrCode} alt="QR" className="w-10 h-10 rounded shadow-sm" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-3">✍️ {book.author}</p>

                                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase font-semibold">Stok</span>
                                        <span className={`text-sm font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {book.stock} Available
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleBorrow(book.id)}
                                        disabled={book.stock <= 0}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${book.stock > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-md'
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
        </div>
    );
};

export default Books;
