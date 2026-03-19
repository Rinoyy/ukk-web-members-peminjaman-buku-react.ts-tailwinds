# Web Members — Panduan Setup

Portal web **mobile-first** untuk **Siswa** mengakses layanan perpustakaan secara mandiri.

**Port:** `http://localhost:5174`
**Backend yang dibutuhkan:** `express-qr-backend` berjalan di `http://localhost:3000`

---

## Prasyarat

| Kebutuhan | Versi Minimum |
|---|---|
| Node.js | 18.x atau lebih baru |
| npm | 9.x atau lebih baru |
| Backend (`express-qr-backend`) | Sudah berjalan di port 3000 |

---

## Instalasi & Menjalankan

```bash
# 1. Masuk ke folder web-members
cd web-members

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5174`.

Untuk tampilan optimal, gunakan **DevTools → Toggle device toolbar** (Ctrl+Shift+M / Cmd+Shift+M) dan pilih ukuran layar mobile (375px–428px).

---

## Koneksi ke Backend

Semua request HTTP diarahkan ke `http://localhost:3000/api`. Konfigurasi ini ada di:

```typescript
// src/lib/api.ts
const BASE_URL = 'http://localhost:3000/api'
```

Token JWT dari `localStorage` secara otomatis disisipkan di setiap request. Jika backend berjalan di port berbeda, ubah `BASE_URL` di file tersebut.

---

## Registrasi & Login Siswa

Siswa tidak bisa login tanpa akun. Alur pertama kali:

1. Buka `http://localhost:5174/register`
2. Isi **username**, **NISN**, dan **password**
3. NISN harus sudah terdaftar di whitelist sekolah (Admin yang menambahkan via Dashboard)
4. Setelah berhasil, login di `http://localhost:5174/login`

> Untuk testing, minta Admin menambahkan NISN ke tabel `StudentNISN` via Dashboard atau langsung via database seed.

---

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan dev server di port 5174 |
| `npm run build` | Build untuk production (`tsc -b && vite build`) |
| `npm run preview` | Preview hasil build secara lokal |
| `npm run lint` | Jalankan ESLint |

---

## Struktur Folder

```
web-members/
├── src/
│   ├── App.tsx                      # Root component, mounting router
│   ├── main.tsx                     # Entry point React
│   │
│   ├── routes/
│   │   ├── index.tsx                # Definisi semua route
│   │   ├── ProtectedRoute.tsx       # Guard: redirect ke /login jika belum auth
│   │   └── RootRedirect.tsx         # Redirect / berdasarkan status login
│   │
│   ├── pages/                       # Halaman utama (satu per fitur)
│   │   ├── Login.tsx                # Login siswa (NISN + password)
│   │   ├── Register.tsx             # Registrasi siswa baru
│   │   ├── Home.tsx                 # Beranda + status peminjaman aktif
│   │   ├── Books.tsx                # Katalog buku + pencarian + filter
│   │   ├── BookDetail.tsx           # Detail buku + tombol pinjam
│   │   ├── History.tsx              # Riwayat peminjaman + denda
│   │   └── Profile.tsx              # Profil siswa + QR Code
│   │
│   ├── components/                  # Komponen UI reusable
│   │   ├── Layout.tsx               # Wrapper: top bar + bottom nav
│   │   ├── SiswaBooks.tsx           # List buku
│   │   ├── SiswaHistory.tsx         # List riwayat peminjaman
│   │   └── NotificationBell.tsx     # Bell icon + dropdown notifikasi
│   │
│   ├── hooks/                       # Custom hooks (state + logika)
│   │   ├── useAuth.ts               # Autentikasi siswa
│   │   ├── useBooks.ts              # Fetch & filter buku
│   │   └── useBorrow.ts             # Logic peminjaman & pengembalian
│   │
│   ├── services/                    # HTTP calls ke backend API
│   │   ├── authService.ts           # register, login
│   │   ├── bookService.ts           # get books, get detail
│   │   ├── borrowService.ts         # borrow, cancel, return request
│   │   ├── categoryService.ts       # get categories
│   │   └── notificationService.ts   # get & mark-read notifications
│   │
│   ├── lib/
│   │   └── api.ts                   # Fetch wrapper (base URL + auth header)
│   │
│   └── types/
│       └── index.ts                 # TypeScript interfaces
│
├── package.json
├── vite.config.ts                   # Port: 5174
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | ^19.1.0 | UI Framework |
| TypeScript | ~5.8.3 | Type safety |
| Vite | ^6.3.5 | Build tool & dev server |
| TailwindCSS | ^4.1.18 | Styling (mobile-first) |
| PostCSS | ^8.5.6 | CSS processing |
| React Router | ^7.13.0 | Client-side routing |
| Lucide React | ^0.563.0 | Icon library |

> `lib/api.ts` menggunakan native `fetch` API — tidak ada dependency eksternal untuk HTTP.

---

## Navigasi Aplikasi

| URL | Halaman | Akses |
|---|---|---|
| `/` | — | Redirect otomatis ke `/login` atau `/home` |
| `/login` | Login | Publik |
| `/register` | Registrasi | Publik |
| `/home` | Beranda | Harus login |
| `/books` | Katalog Buku | Harus login |
| `/books/:id` | Detail Buku | Harus login |
| `/history` | Riwayat Peminjaman | Harus login |
| `/profile` | Profil + QR Code | Harus login |

Halaman yang membutuhkan login dijaga oleh `ProtectedRoute` — jika tidak ada token di `localStorage`, otomatis diarahkan ke `/login`.

---

## Troubleshooting

**Port 5174 sudah dipakai:**
```bash
lsof -ti:5174 | xargs kill
npm run dev
```

**`npm install` gagal:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tidak bisa registrasi (NISN tidak valid):**
- NISN harus ada di tabel `StudentNISN` di database
- Minta Admin menambahkan NISN via Dashboard, atau jalankan seed di backend

**API error setelah login:**
- Pastikan backend berjalan di port 3000
- Cek `src/lib/api.ts` — `BASE_URL` harus `http://localhost:3000/api`
- Buka DevTools → Network tab untuk melihat response error dari backend

**Token expired (401):**
- Token JWT berlaku 1 jam. Logout dan login kembali.
- Aplikasi otomatis menghapus token dan memicu `auth:logout` event jika menerima 401.
