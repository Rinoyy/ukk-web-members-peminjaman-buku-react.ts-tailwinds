import { useEffect, useState } from 'react';
import { useBorrow } from '../hooks/useBorrow';
import { AlertCircle, X } from 'lucide-react';

const History = () => {
    const { borrowings, loading, fetchBorrowings, requestReturn, cancelBorrow, userFines, fetchMyFines } = useBorrow();
    const [cancelModal, setCancelModal] = useState<number | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        fetchBorrowings();
        fetchMyFines();
    }, []);

    const handleReturn = async (borrowingId: number) => {
        if (!confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) return;

        const success = await requestReturn(borrowingId);
        if (success) {
            alert('Permintaan pengembalian berhasil! Silakan bawa buku ke petugas untuk diverifikasi.');
            fetchBorrowings();
        }
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setCancelLoading(true);
        const success = await cancelBorrow(cancelModal);
        setCancelLoading(false);
        if (success) {
            setCancelModal(null);
            fetchBorrowings();
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            BORROWED: 'bg-blue-100 text-blue-700',
            RETURN_PENDING: 'bg-orange-100 text-orange-700',
            RETURNED: 'bg-green-100 text-green-700',
            REJECTED: 'bg-red-100 text-red-700',
            CANCELLED: 'bg-gray-100 text-gray-600',
        };
        const labels: Record<string, string> = {
            PENDING: '⏳ Menunggu Persetujuan',
            BORROWED: '📖 Sedang Dipinjam',
            RETURN_PENDING: '🔄 Menunggu Verifikasi',
            RETURNED: '✓ Selesai',
            REJECTED: '✕ Ditolak',
            CANCELLED: '🚫 Dibatalkan',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📋</span> Riwayat Peminjaman
            </h2>

            {/* Fines Alert */}
            {userFines.length > 0 && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-800 mb-2">Anda Memiliki Denda Belum Lunas!</h3>
                            <p className="text-red-600 mb-4">
                                Harap segera lunasi denda Anda di petugas perpustakaan untuk dapat meminjam buku kembali.
                            </p>
                            <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
                                {userFines.map((fine) => (
                                    <div key={fine.id} className="p-4 border-b last:border-0 hover:bg-red-50/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-800">{fine.book?.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    Dikembalikan: {new Date(fine.actualReturnDate!).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <p className="font-bold text-red-600">Rp {fine.totalFine.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-20">
                    <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Memuat riwayat...</p>
                </div>
            ) : borrowings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Riwayat</h3>
                    <p className="text-gray-500">Anda belum pernah melakukan peminjaman buku.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {borrowings.map((b) => (
                        <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-start gap-4 mobile:flex-col">
                                {b.book?.qrCode && (
                                    <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                                        <img src={b.book.qrCode} alt="Book QR" className="w-full h-full object-contain" />
                                    </div>
                                )}

                                <div className="flex-1 w-full">
                                    <div className="flex justify-between w-full mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{b.book?.title}</h3>
                                            <p className="text-sm text-gray-500">✍️ {b.book?.author}</p>
                                        </div>
                                        <div className="shrink-0">
                                            {getStatusBadge(b.status)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 my-4 bg-gray-50 p-3 rounded-xl text-sm">
                                        <div>
                                            <p className="text-gray-400 text-xs mb-1">Tanggal Pinjam</p>
                                            <p className="font-medium text-gray-700">
                                                {b.borrowDate ? new Date(b.borrowDate).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                }) : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            {b.status === 'BORROWED' && b.dueDate && (
                                                <>
                                                    <p className="text-gray-400 text-xs mb-1">Jatuh Tempo</p>
                                                    <p className={`font-medium ${new Date() > new Date(b.dueDate) ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {new Date(b.dueDate).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </>
                                            )}
                                            {b.status === 'RETURNED' && b.actualReturnDate && (
                                                <>
                                                    <p className="text-gray-400 text-xs mb-1">Dikembalikan</p>
                                                    <p className="font-medium text-green-600">
                                                        {new Date(b.actualReturnDate).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reject Reason */}
                                    {b.status === 'REJECTED' && b.rejectReason && (
                                        <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                                            <span className="font-semibold">Alasan penolakan:</span> {b.rejectReason}
                                        </div>
                                    )}

                                    {/* Footer Actions/Info */}
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            {b.totalFine > 0 && (
                                                <div className={`text-xs font-bold px-2 py-1 rounded border ${b.isPaid
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {b.isPaid ? 'Lunas' : 'Belum Lunas'} • Denda: Rp {b.totalFine.toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {b.status === 'PENDING' && (
                                                <button
                                                    onClick={() => setCancelModal(b.id)}
                                                    className="px-4 py-2 text-red-600 border border-red-200 text-sm font-medium rounded-xl hover:bg-red-50 cursor-pointer transition-colors"
                                                >
                                                    Batalkan
                                                </button>
                                            )}
                                            {b.status === 'BORROWED' && !b.isPickedUp && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
                                                    <span className="text-lg">📦</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-orange-600">Ambil Buku!</span>
                                                        <span className="text-xs text-orange-400">Menunggu di perpustakaan</span>
                                                    </div>
                                                </div>
                                            )}
                                            {b.status === 'BORROWED' && b.isPickedUp && (
                                                <button
                                                    onClick={() => handleReturn(b.id)}
                                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-xl hover:shadow-lg shadow-orange-200 cursor-pointer transition-all active:scale-95"
                                                >
                                                    Kembalikan Buku
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Batalkan Peminjaman?</h3>
                            <button onClick={() => setCancelModal(null)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin membatalkan peminjaman ini? Buku akan dikembalikan ke stok tersedia.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelModal(null)}
                                className="flex-1 py-2.5 px-4 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer font-medium transition-colors"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelLoading}
                                className="flex-1 py-2.5 px-4 text-white bg-red-600 rounded-xl hover:bg-red-700 cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelLoading ? 'Loading...' : 'Ya, Batalkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
