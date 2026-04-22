import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useBookDetail } from '../hooks/useBookDetail';
import { BookOpen, ChevronLeft, Calendar, AlertTriangle, PenLine } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
};

const getDefaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
};

const BorrowForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { book, eligibility, loading, error, borrowLoading, fetchBook, fetchEligibility, borrowBook } = useBookDetail();
    const [returnDate, setReturnDate] = useState(getDefaultReturnDate());

    useEffect(() => {
        if (!id) return;
        fetchBook(Number(id));
        if (user) fetchEligibility();
    }, [id, user, fetchBook, fetchEligibility]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book || !returnDate) return;

        const result = await borrowBook(book.id, returnDate);
        if (result.success) {
            alert('Permintaan peminjaman berhasil dikirim! Silakan ambil buku di perpustakaan.');
            navigate('/history');
        } else {
            alert(result.error || 'Gagal meminjam buku');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">{error || 'Buku tidak ditemukan'}</p>
            </div>
        );
    }

    const cannotBorrow = eligibility !== null && !eligibility.canBorrow;

    return (
        <div className="max-w-lg mx-auto">
            <button
                onClick={() => navigate(`/books/${id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 cursor-pointer transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Detail Buku</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Book header */}
                <div className="h-40 relative overflow-hidden">
                    {book.image ? (
                        <img
                            src={`${API_BASE}${book.image}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white/80" />
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900">{book.title}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <PenLine className="w-3.5 h-3.5" /> {book.author}
                        </p>
                    </div>

                    {cannotBorrow ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-800 text-sm">Peminjaman Dibatasi</p>
                                <p className="text-sm text-red-600 mt-1">{eligibility.reason}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Tanggal Pengembalian
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    min={getTomorrowDate()}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Pilih tanggal kapan buku akan dikembalikan. Petugas dapat menyesuaikan saat menyetujui.
                                </p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-sm text-blue-700 text-center">
                                    Permintaan akan dikirim ke petugas untuk disetujui.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/books/${id}`)}
                                    className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={borrowLoading || !returnDate}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    {borrowLoading ? 'Memproses...' : 'Kirim Permintaan'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowForm;
