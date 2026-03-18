# Web Members (Portal Siswa) — Alur Teknis

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | ~5.x | Type safety |
| Vite | ~6.x | Build tool & dev server |
| TailwindCSS | ~3.x | Styling (mobile-first) |
| PostCSS | ~8.x | CSS processing |
| React Router | v7 | Client-side routing |
| Axios | ~1.x | HTTP client |

---

## Struktur Proyek

```
web-members/
├── src/
│   ├── App.tsx                      # Root component, mounting router
│   ├── main.tsx                     # Entry point React
│   │
│   ├── routes/
│   │   ├── index.tsx                # Definisi semua route
│   │   ├── ProtectedRoute.tsx       # Guard route untuk siswa terautentikasi
│   │   └── RootRedirect.tsx         # Redirect / berdasarkan status login
│   │
│   ├── pages/
│   │   ├── Login.tsx                # Halaman login siswa
│   │   ├── Register.tsx             # Halaman registrasi siswa baru
│   │   ├── Home.tsx                 # Beranda siswa
│   │   ├── Books.tsx                # Daftar & pencarian buku
│   │   ├── BookDetail.tsx           # Detail buku + tombol pinjam
│   │   ├── History.tsx              # Riwayat peminjaman
│   │   └── Profile.tsx             # Profil siswa + QR Code
│   │
│   ├── components/
│   │   ├── Layout.tsx               # Wrapper utama: top nav + bottom nav
│   │   ├── SiswaBooks.tsx           # Komponen list buku
│   │   ├── SiswaHistory.tsx         # Komponen riwayat peminjaman
│   │   └── NotificationBell.tsx     # Bell icon + dropdown notifikasi
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # State & logic autentikasi siswa
│   │   ├── useBooks.ts              # Fetch & filter buku
│   │   └── useBorrow.ts             # Logic peminjaman & pengembalian
│   │
│   ├── services/
│   │   ├── authService.ts           # API: register, login, logout
│   │   ├── bookService.ts           # API: get books, get detail
│   │   ├── borrowService.ts         # API: borrow, return request
│   │   ├── categoryService.ts       # API: get categories
│   │   ├── notificationService.ts   # API: get & mark-read notifications
│   │   └── api.ts                   # (Alias untuk lib/api.ts)
│   │
│   ├── lib/
│   │   └── api.ts                   # Axios instance (base URL + auth interceptor)
│   │
│   └── types/
│       └── index.ts                 # TypeScript interfaces
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## Alur Teknis: Autentikasi

### Register Flow

```
[Register.tsx]
    |
    |--(1) Siswa isi form (name, NIS, email, password)
    |
    |--(2) Panggil authService.register()
    |         └── POST /api/auth/register
    |
    |--(3) Response: { user, token }
    |
    |--(4) Simpan token ke localStorage
    |
    |--(5) Redirect ke /home
```

### Login Flow

```
[Login.tsx]
    |
    |--(1) Siswa isi form (NIS/email + password)
    |
    |--(2) Panggil authService.login()
    |         └── POST /api/auth/login
    |
    |--(3) Response: { token, user: { role: 'SISWA', ... } }
    |
    |--(4) Simpan token + user ke localStorage
    |
    |--(5) Redirect ke /home
```

### Protected Route

```typescript
// routes/ProtectedRoute.tsx
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
```

---

## Alur Teknis: Routing

```
/                     → RootRedirect → /login (atau /home jika sudah login)
/login                → Login.tsx
/register             → Register.tsx
/home                 → ProtectedRoute → Home.tsx (dalam Layout)
/books                → ProtectedRoute → Books.tsx (dalam Layout)
/books/:id            → ProtectedRoute → BookDetail.tsx (dalam Layout)
/history              → ProtectedRoute → History.tsx (dalam Layout)
/profile              → ProtectedRoute → Profile.tsx (dalam Layout)
```

### Layout Component

`Layout.tsx` membungkus semua halaman yang membutuhkan navigasi:
- **Top Bar:** Judul halaman + NotificationBell
- **Content Area:** Konten halaman aktif
- **Bottom Navigation:** Home | Books | History | Profile

```typescript
// Layout.tsx (simplified)
const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <main className="flex-1 pb-16">  {/* pb-16 untuk bottom nav */}
      <Outlet />
    </main>
    <BottomNav />
  </div>
)
```

---

## Alur Teknis: Peminjaman Buku

```
[BookDetail.tsx]
    |
    |--(1) Mount: fetch book detail
    |         └── GET /api/books/:id
    |
    |--(2) Tampilkan info buku + status salinan
    |
    |--(3) User klik "Pinjam"
    |
    |--(4) useBorrow.requestBorrow(bookId)
    |         └── POST /api/borrow
    |               Body: { bookId }
    |
    |--(5) Backend cek syarat:
    |       - User tidak punya borrowing aktif
    |       - User tidak punya fine belum bayar
    |       - Ada copy AVAILABLE
    |
    |--(6a) SUCCESS → alert "Permintaan berhasil, tunggu persetujuan admin"
    |--(6b) FAIL    → tampilkan error message dari API
```

---

## Alur Teknis: Pengembalian Buku

```
[History.tsx / SiswaHistory.tsx]
    |
    |--(1) Mount: fetch borrowing history
    |         └── GET /api/borrow/my
    |
    |--(2) Tampilkan daftar peminjaman dengan status
    |
    |--(3) User klik "Kembalikan" pada item dengan status BORROWED
    |
    |--(4) useBorrow.requestReturn(borrowingId)
    |         └── PATCH /api/borrow/:id/return
    |
    |--(5) Status berubah → RETURN_PENDING
    |
    |--(6) UI diupdate, tombol "Kembalikan" hilang
```

---

## Alur Teknis: Notifikasi Real-time

```
[NotificationBell.tsx]
    |
    |--(1) Mount + interval polling
    |         └── GET /api/notifications
    |
    |--(2) Hitung notif yang belum dibaca (isRead: false)
    |
    |--(3) Tampilkan badge merah jika ada yang belum dibaca
    |
    |--(4) User klik bell → tampilkan dropdown list
    |
    |--(5) Mark as read
    |         └── PATCH /api/notifications/:id/read
```

---

## Alur Teknis: QR Code

```
[Profile.tsx]
    |
    |--(1) Mount: ambil data user dari localStorage / auth state
    |
    |--(2) Tampilkan qrCode (base64 image atau string)
    |         └── QR Code dirender sebagai <img src={qrCode} />
    |
    |--(3) User bisa tap/klik untuk memperbesar QR Code
```

**QR Code dihasilkan oleh Backend saat registrasi** menggunakan library `qrcode` dan disimpan di field `qrCode` pada tabel `User`.

---

## Service Layer

```typescript
// services/borrowService.ts
const borrowService = {
  // Siswa ajukan peminjaman
  create: (bookId: string) =>
    api.post('/borrow', { bookId }).then(r => r.data),

  // Siswa request pengembalian
  requestReturn: (id: string) =>
    api.patch(`/borrow/${id}/return`).then(r => r.data),

  // Ambil riwayat peminjaman siswa yang login
  getMyHistory: () =>
    api.get('/borrow/my').then(r => r.data),
}

// services/notificationService.ts
const notificationService = {
  getAll: () =>
    api.get('/notifications').then(r => r.data),

  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then(r => r.data),
}
```

---

## Endpoint yang Digunakan Web Members

| Service | Method | Endpoint | Deskripsi |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Daftar siswa baru |
| Auth | POST | `/api/auth/login` | Login siswa |
| Books | GET | `/api/books` | Daftar buku + filter |
| Books | GET | `/api/books/:id` | Detail buku |
| Categories | GET | `/api/categories` | Daftar kategori (untuk filter) |
| Borrow | POST | `/api/borrow` | Ajukan peminjaman |
| Borrow | GET | `/api/borrow/my` | Riwayat peminjaman siswa |
| Borrow | PATCH | `/api/borrow/:id/return` | Request pengembalian |
| Notifications | GET | `/api/notifications` | Ambil notifikasi |
| Notifications | PATCH | `/api/notifications/:id/read` | Tandai sudah dibaca |
| Visits | POST | `/api/visits/check-in` | Check-in kunjungan via QR |

---

## TypeScript Types Utama

```typescript
// types/index.ts

interface User {
  id: string
  name: string
  nis: string
  email: string
  role: 'SISWA'
  qrCode: string
}

interface Book {
  id: string
  title: string
  author: string
  description: string
  image?: string
  category: Category
  copies: BookCopy[]
}

interface Borrowing {
  id: string
  status: 'PENDING' | 'BORROWED' | 'RETURN_PENDING' | 'RETURNED' | 'REJECTED' | 'CANCELLED'
  borrowDate: string
  dueDate: string
  actualReturnDate?: string
  totalFine: number
  isPaid: boolean
  bookCopy: BookCopy & { book: Book }
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'BORROW_APPROVED' | 'BORROW_REJECTED' | 'PICKUP_REMINDER' | 'GENERAL'
  isRead: boolean
  createdAt: string
}
```

---

## Build & Development

```bash
# Install dependencies
npm install

# Development server (port 5173 by default)
npm run dev

# Build untuk production
npm run build

# Preview build hasil
npm run preview
```

### Environment
- Dev server berjalan di `http://localhost:5173`
- API base URL dikonfigurasi di `src/lib/api.ts`
- Target backend: `http://localhost:3000`

### Mobile-First Design
- Layout menggunakan Flexbox + Tailwind
- Bottom navigation fixed di bawah layar
- Padding konten disesuaikan agar tidak tertutup bottom nav (`pb-16`)
- Dioptimalkan untuk viewport mobile (375px–428px)
