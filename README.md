# Portal Anggota — Perpustakaan Digital

Aplikasi web **mobile-first** untuk **Siswa** mengakses layanan perpustakaan secara mandiri.

**Port development:** `http://localhost:5174`

---

## Teknologi

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | ~5.x | Type safety |
| Vite | ~6.x | Build tool |
| TailwindCSS | ~3.x | Styling (mobile-first) |
| React Router | v7 | Routing |
| Fetch API | native | HTTP client |
| Lucide React | — | Icon library |

---

## Status Peminjaman (Tampil di Riwayat)

| Status | Tampilan |
|---|---|
| `PENDING` | Menunggu Persetujuan — tombol "Batalkan" |
| `BORROWED` | Sedang Dipinjam — tombol "Kembalikan" (jika sudah diambil) |
| `RETURN_PENDING` | Menunggu Verifikasi Admin |
| `RETURNED` | Sudah Dikembalikan |
| `REJECTED` | Ditolak Admin |
| `CANCELLED` | Dibatalkan |

---

## Fitur Utama

### Akses Mandiri
- Registrasi dengan NISN (wajib terdaftar di whitelist sekolah)
- Login menggunakan NISN + password
- QR Code pribadi otomatis di-generate saat registrasi

### E-Katalog Buku
- Jelajahi semua koleksi buku
- Cari berdasarkan judul atau pengarang
- Filter berdasarkan kategori
- Lihat stok AVAILABLE secara real-time
- Detail buku + status tiap salinan fisik (BookCopy)

### Peminjaman Buku
- Ajukan peminjaman dari halaman detail buku
- Sistem otomatis mencari salinan (BookCopy) yang AVAILABLE
- Lihat status real-time: PENDING → BORROWED → RETURN_PENDING → RETURNED
- Batalkan permintaan selama masih PENDING
- Ajukan pengembalian saat buku sudah diambil

**Syarat bisa meminjam:**
- Tidak ada buku aktif yang belum dikembalikan
- Tidak ada denda yang belum dilunasi

### Riwayat & Denda
- Semua riwayat peminjaman dengan status dan tanggal
- Informasi denda: jumlah, status pembayaran

### QR Code & Check-In Kunjungan
- QR Code pribadi tampil di halaman Profile
- Scan QR untuk check-in saat masuk perpustakaan

### Notifikasi
- Pemberitahuan saat peminjaman disetujui/ditolak
- Pengingat batas pengambilan buku
- Badge merah di ikon lonceng jika ada yang belum dibaca

---

## Menjalankan

```bash
npm install
npm run dev
```

Pastikan backend (`express-qr-backend`) sudah berjalan di port 3000.

---

## Navigasi (Bottom Navigation)

| Tab | Halaman | Fungsi |
|---|---|---|
| Home | `/home` | Beranda + status aktif |
| Books | `/books` | Katalog buku |
| History | `/history` | Riwayat peminjaman |
| Profile | `/profile` | Profil + QR Code |

---

## Dokumentasi Lengkap

| File | Isi |
|---|---|
| [docs/business-flow.md](./docs/business-flow.md) | Alur bisnis per fitur |
| [docs/technical-flow.md](./docs/technical-flow.md) | Detail teknis, routing, types |
