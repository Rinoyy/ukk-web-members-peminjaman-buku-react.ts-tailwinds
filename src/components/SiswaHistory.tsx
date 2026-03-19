import { useEffect } from 'react';
import { useBorrow } from '../hooks/useBorrow';
import { Package } from 'lucide-react';

const SiswaHistory = () => {
    const { borrowings, loading, fetchBorrowings, requestReturn } = useBorrow();

    useEffect(() => {
        fetchBorrowings();
    }, [fetchBorrowings]);

    const handleReturn = async (borrowingId: number) => {
        if (confirm('Return this book?')) {
            await requestReturn(borrowingId);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-bold">My Borrowing History</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Book</th>
                            <th className="p-3 border-b">Author</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Date</th>
                            <th className="p-3 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-medium">{b.bookCopy?.book?.title ?? b.book?.title}</td>
                                <td className="p-3 border-b">{b.bookCopy?.book?.author ?? b.book?.author}</td>
                                <td className="p-3 border-b">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${b.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : b.status === 'BORROWED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : b.status === 'RETURN_PENDING'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : b.status === 'RETURNED'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {b.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    {new Date(b.borrowDate).toLocaleDateString()}
                                </td>
                                <td className="p-3 border-b">
                                    {b.status === 'BORROWED' && !b.isPickedUp && (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-orange-600 flex items-center gap-1"><Package className="w-4 h-4" /> Ambil bukumu!</span>
                                            <span className="text-xs text-gray-500">Buku menunggu di perpustakaan</span>
                                        </div>
                                    )}
                                    {b.status === 'BORROWED' && b.isPickedUp && (
                                        <button
                                            onClick={() => handleReturn(b.id)}
                                            className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 cursor-pointer"
                                        >
                                            Kembalikan
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SiswaHistory;
