import { useEffect, useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useBorrow } from '../hooks/useBorrow';

const SiswaBooks = () => {
    const { books, loading, fetchBooks } = useBooks();
    const { requestBorrow } = useBorrow();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchBooks({ search, category });
    }, [search, category, fetchBooks]);

    const handleBorrow = async (bookId: number) => {
        if (confirm('Apakah Anda ingin meminjam buku ini?')) {
            const success = await requestBorrow(bookId);
            if (success) {
                alert('Permintaan peminjaman berhasil dikirim!');
                fetchBooks({ search, category }); // Refresh stock
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-bold">Buku Tersedia</h2>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Cari buku..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Semua Kategori</option>
                    {/* Unique categories could be dynamically extracted */}
                    <option value="Fiction">Fiksi</option>
                    <option value="Science">Sains</option>
                    <option value="Technology">Teknologi</option>
                </select>
            </div>

            {loading ? (
                <p>Memuat...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="p-4 border rounded hover:shadow-md">
                            <h3 className="text-lg font-bold">{book.title}</h3>
                            <p className="text-gray-600">oleh {book.author}</p>
                            <p className="text-sm text-gray-500 mb-2">{book.category}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className={`text-sm ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {book.stock > 0 ? `${book.stock} tersedia` : 'Stok Habis'}
                                </span>
                                {book.stock > 0 && (
                                    <button
                                        onClick={() => handleBorrow(book.id)}
                                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
                                    >
                                        Pinjam
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SiswaBooks;
