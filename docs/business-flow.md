# Web Members (Portal Siswa) — Alur Bisnis

---

## Gambaran Umum

**Web Members** adalah aplikasi web untuk **Siswa (Member)** perpustakaan. Siswa dapat mendaftar, mencari dan meminjam buku, memantau status peminjaman, melihat denda, serta melakukan check-in kunjungan menggunakan QR Code pribadi mereka.

Aplikasi ini dirancang **mobile-first** — tampilannya dioptimalkan untuk diakses melalui smartphone.

**Port development:** `http://localhost:5174`

---

## Status Peminjaman (Referensi Cepat)

| Status | Tampilan di UI | Aksi Tersedia |
|---|---|---|
| `PENDING` | Menunggu Persetujuan | Batalkan |
| `BORROWED` | Sedang Dipinjam | Kembalikan |
| `RETURN_PENDING` | Menunggu Verifikasi | — (tunggu admin) |
| `RETURNED` | Sudah Dikembalikan | — |
| `REJECTED` | Ditolak | — |
| `CANCELLED` | Dibatalkan | — |

---

## Alur Bisnis Per Fitur

### 1. Registrasi Akun Siswa

**Tujuan:** Siswa mendapatkan akun + QR Code pribadi untuk mengakses seluruh layanan perpustakaan digital.

**Alur:**
```
Siswa buka halaman Register
     ↓
Isi form: username, NISN, password
     ↓
Submit → Backend validasi NISN di tabel StudentNISN
     ↓
[NISN valid] → Buat akun + generate QR Code unik
     ↓
Siswa diarahkan ke halaman Login
```

**Aturan:**
- NISN wajib terdaftar di whitelist sekolah (Admin yang mengisi)
- NISN hanya bisa digunakan untuk satu akun
- QR Code dibuat otomatis oleh sistem saat registrasi

---

### 2. Login

**Tujuan:** Autentikasi siswa untuk mengakses fitur yang dilindungi.

**Alur:**
```
Siswa buka halaman Login
     ↓
Masukkan NISN + Password
     ↓
Sistem verifikasi → Berikan token JWT (berlaku 1 jam)
     ↓
Diarahkan ke halaman Home
```

---

### 3. Halaman Beranda (Home)

**Informasi yang ditampilkan:**
- Sambutan dengan nama/username siswa
- Preview QR Code (klik untuk full screen)
- Shortcut ke halaman Buku dan Riwayat
- Status peminjaman aktif (jika ada)

---

### 4. Pencarian & Penjelajahan Buku

**Tujuan:** Siswa menemukan buku yang ingin dipinjam dari katalog perpustakaan.

**Alur:**
```
Buka halaman Books
     ↓
Melihat daftar semua buku beserta stok AVAILABLE
     ↓
Gunakan fitur:
  - Pencarian teks (judul atau pengarang)
  - Filter berdasarkan Kategori
     ↓
Klik buku untuk melihat detail + semua copy dan statusnya
```

**Aturan:**
- Hanya buku dengan setidaknya 1 copy `AVAILABLE` yang bisa dipinjam
- Buku dengan semua copy `BORROWED/DAMAGED/LOST` ditampilkan tapi tombol pinjam dinonaktifkan
- Field `stock` = jumlah copy yang saat ini berstatus `AVAILABLE`

---

### 5. Meminjam Buku

**Tujuan:** Siswa mengajukan permintaan peminjaman buku.

**Alur:**
```
Siswa buka halaman detail buku
     ↓
Klik tombol "Pinjam"
     ↓
[Sistem cek syarat peminjaman]
  ✓ Tidak ada buku aktif yang belum dikembalikan
  ✓ Tidak ada denda yang belum dilunasi
     ↓
[Jika syarat TIDAK terpenuhi]
  → Tampilkan pesan error + alasan
     ↓
[Jika syarat terpenuhi]
  → Sistem cari copy AVAILABLE otomatis
  → Buat Borrowing: status PENDING
  → BookCopy: RESERVED (tidak bisa dipinjam siswa lain)
     ↓
Siswa tunggu persetujuan Admin
     ↓
[Admin Approve] → Notifikasi diterima, ambil buku dalam 2 hari
[Admin Reject]  → Notifikasi ditolak + alasan, bisa pinjam buku lain
```

**Aturan:**
- Siswa hanya bisa meminjam **1 buku per waktu**
- Jika ada **denda belum dibayar**, tidak bisa mengajukan peminjaman baru
- Setelah disetujui, batas pengambilan buku: **2 hari**
- Jika tidak diambil dalam 2 hari, permintaan otomatis dibatalkan sistem

---

### 6. Riwayat Peminjaman

**Tujuan:** Siswa memantau semua status peminjaman dan denda mereka.

**Informasi yang ditampilkan per item:**
- Judul buku + nomor copy
- Status saat ini (dengan badge warna)
- Tanggal pinjam
- Tanggal jatuh tempo
- Jumlah denda (jika ada)
- Status pembayaran denda

**Alur Pengajuan Pengembalian:**
```
Siswa lihat item dengan status BORROWED (dan isPickedUp = true)
     ↓
Klik tombol "Kembalikan"
     ↓
Status berubah → RETURN_PENDING
     ↓
Siswa bawa buku ke perpustakaan
     ↓
Admin verifikasi kondisi dan proses pengembalian
```

> Tombol "Kembalikan" hanya muncul jika `status = BORROWED` dan `isPickedUp = true`.

---

### 7. QR Code Pribadi & Check-In Kunjungan

**Tujuan:** QR Code siswa digunakan untuk check-in saat mengunjungi perpustakaan.

**Alur:**
```
Siswa tiba di perpustakaan
     ↓
Buka halaman Profile di aplikasi
     ↓
Tampilkan QR Code di layar HP
     ↓
Petugas scan QR Code siswa dengan scanner/kamera
     ↓
Sistem merekam kunjungan (userId + waktu masuk)
     ↓
(saat keluar, petugas scan lagi untuk check-out)
```

**Aturan:**
- QR Code bersifat unik dan permanen per siswa
- Setiap scan masuk merekam 1 data kunjungan (visitDate)
- Scan keluar mengisi checkoutDate
- Kunjungan dapat dipantau Admin di Dashboard

---

### 8. Notifikasi

**Tujuan:** Siswa mendapat pemberitahuan terkait status peminjaman mereka.

**Jenis Notifikasi:**
| Jenis | Kapan Dikirim |
|---|---|
| `BORROW_APPROVED` | Admin approve permintaan peminjaman |
| `BORROW_REJECTED` | Admin reject permintaan + alasan |
| `PICKUP_REMINDER` | Mendekati batas waktu pengambilan buku |
| `GENERAL` | Pengumuman dari perpustakaan |

**Cara Akses:**
- Icon lonceng di pojok kanan atas halaman
- Titik merah menandakan ada notifikasi belum dibaca
- Klik untuk melihat semua notifikasi
- Notifikasi bisa ditandai sudah dibaca satu per satu atau sekaligus

---

### 9. Profil Siswa

**Informasi yang ditampilkan:**
- Username
- NISN
- QR Code (ukuran penuh untuk kemudahan scan)
- Tombol Logout

---

## Ringkasan Navigasi

Aplikasi menggunakan **bottom navigation** khas aplikasi mobile:

| Tab | Halaman | Konten |
|---|---|---|
| Home | `/home` | Beranda + status aktif |
| Books | `/books` | Katalog buku + pencarian |
| History | `/history` | Riwayat peminjaman |
| Profile | `/profile` | Profil + QR Code |

---

## Aturan Eligibilitas Pinjam

| Kondisi Siswa | Bisa Pinjam? | Pesan |
|---|---|---|
| Tidak ada tanggungan | ✓ Ya | Tombol pinjam aktif |
| Ada PENDING/BORROWED/RETURN_PENDING | ✗ Tidak | "Masih ada buku yang belum dikembalikan" |
| Ada denda belum lunas | ✗ Tidak | "Masih ada denda yang belum dibayar" |
| Stok buku habis (semua copy tidak AVAILABLE) | ✗ Tidak | Tombol pinjam disabled |
