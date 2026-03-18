# Web Members (Portal Siswa) — Alur Bisnis

---

## Gambaran Umum

**Web Members** adalah aplikasi web yang digunakan oleh **Siswa (Member)** perpustakaan. Siswa dapat mendaftar, mencari dan meminjam buku, memantau status peminjaman, melihat denda, serta melakukan check-in kunjungan menggunakan QR Code pribadi mereka.

Aplikasi ini dirancang **mobile-first** — tampilannya dioptimalkan untuk diakses melalui smartphone.

---

## Alur Bisnis Per Fitur

### 1. Registrasi Akun Siswa

**Tujuan:** Siswa mendapatkan akun yang memberikan akses ke seluruh fitur perpustakaan digital beserta QR Code pribadi.

**Alur:**
```
Siswa buka halaman Register
        ↓
Isi form: Nama, NIS, Email, Password
        ↓
Submit → Sistem membuat akun + generate QR Code unik
        ↓
Siswa diarahkan ke halaman Login
        ↓
Login → Siswa masuk ke halaman Home
```

**Aturan:**
- NIS harus unik, tidak boleh sama dengan siswa lain
- QR Code dibuat otomatis oleh sistem saat registrasi
- Satu akun per siswa

---

### 2. Login

**Tujuan:** Autentikasi siswa agar bisa mengakses fitur yang dilindungi.

**Alur:**
```
Siswa buka halaman Login
        ↓
Masukkan NIS / Email + Password
        ↓
Sistem verifikasi → Berikan token sesi (JWT)
        ↓
Diarahkan ke halaman Home
```

---

### 3. Halaman Beranda (Home)

**Tujuan:** Memberikan ringkasan cepat dan akses ke fitur utama.

**Informasi yang ditampilkan:**
- Sambutan dengan nama siswa
- Preview QR Code (klik untuk buka full screen)
- Shortcut ke halaman Buku dan Riwayat
- Status peminjaman aktif (jika ada)

---

### 4. Pencarian & Penjelajahan Buku

**Tujuan:** Siswa dapat menemukan buku yang ingin dipinjam.

**Alur:**
```
Buka halaman Books
        ↓
Melihat daftar semua buku yang tersedia
        ↓
Gunakan fitur:
  - Pencarian teks (judul / pengarang)
  - Filter berdasarkan Kategori
        ↓
Klik buku untuk melihat detail
```

**Aturan:**
- Hanya buku yang memiliki salinan `AVAILABLE` yang bisa dipinjam
- Buku dengan semua salinan `BORROWED/DAMAGED/LOST` ditampilkan tapi tombol pinjam dinonaktifkan

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
  ✓ Tidak ada denda yang belum dibayar
        ↓
[Jika syarat terpenuhi]
Sistem membuat permintaan peminjaman → Status: PENDING
BookCopy berubah → RESERVED
        ↓
Siswa menunggu persetujuan Admin
        ↓
[Admin Approve] → Notifikasi diterima, ambil buku dalam 2 hari
[Admin Reject]  → Notifikasi ditolak, bisa pinjam buku lain
```

**Aturan:**
- Siswa hanya bisa meminjam **1 buku per waktu** (tidak bisa pinjam jika masih ada yang dipinjam)
- Jika masih punya **denda belum dibayar**, tidak bisa mengajukan peminjaman baru
- Setelah disetujui, batas pengambilan buku: **2 hari**

---

### 6. Riwayat Peminjaman

**Tujuan:** Siswa dapat memantau semua riwayat dan status peminjaman mereka.

**Informasi yang ditampilkan:**
- Judul buku
- Tanggal pinjam
- Tanggal jatuh tempo
- Status saat ini: Menunggu / Dipinjam / Menunggu Pengembalian / Dikembalikan / Ditolak / Dibatalkan
- Jumlah denda (jika ada)
- Status pembayaran denda

**Alur Pengajuan Pengembalian:**
```
Siswa lihat buku yang sedang dipinjam (status: BORROWED)
        ↓
Klik tombol "Kembalikan"
        ↓
Status berubah → RETURN_PENDING
        ↓
Siswa bawa buku ke perpustakaan
        ↓
Admin verifikasi kondisi dan proses pengembalian
```

---

### 7. QR Code Pribadi & Check-In Kunjungan

**Tujuan:** Siswa menggunakan QR Code untuk check-in saat mengunjungi perpustakaan.

**Alur:**
```
Siswa tiba di perpustakaan
        ↓
Buka halaman Profile di aplikasi
        ↓
Tampilkan QR Code di layar HP
        ↓
Petugas/Scanner membaca QR Code di pintu masuk
        ↓
Sistem merekam kunjungan (nama siswa + waktu masuk)
        ↓
Siswa mendapat konfirmasi check-in berhasil
```

**Aturan:**
- QR Code bersifat unik dan permanen per siswa
- Setiap scan merekam 1 data kunjungan
- Kunjungan dapat dipantau Admin di Dashboard

---

### 8. Notifikasi

**Tujuan:** Siswa mendapat pemberitahuan real-time terkait status peminjaman mereka.

**Jenis Notifikasi:**
| Jenis | Kapan Dikirim |
|---|---|
| Peminjaman Disetujui | Admin approve request peminjaman |
| Peminjaman Ditolak | Admin reject request peminjaman |
| Pengingat Pengambilan | Menjelang batas waktu pengambilan buku |
| Umum | Pengumuman dari perpustakaan |

**Cara Akses:**
- Icon lonceng di pojok kanan atas
- Titik merah menandakan ada notifikasi belum dibaca
- Klik untuk melihat semua notifikasi

---

### 9. Profil Siswa

**Tujuan:** Menampilkan informasi akun dan QR Code siswa.

**Informasi yang ditampilkan:**
- Nama lengkap
- NIS
- Email
- QR Code (ukuran penuh untuk kemudahan scan)
- Tombol Logout

---

## Ringkasan Navigasi

Aplikasi menggunakan **bottom navigation** (navigasi bawah) khas aplikasi mobile:

| Tab | Ikon | Halaman |
|---|---|---|
| Home | 🏠 | Beranda |
| Books | 📚 | Daftar buku |
| History | 📋 | Riwayat peminjaman |
| Profile | 👤 | Profil & QR Code |
