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
| Fetch API | native | HTTP client |
| Lucide React | — | Icon library |

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
│   │   ├── ProtectedRoute.tsx       # Guard: redirect ke /login jika belum auth
│   │   └── RootRedirect.tsx         # Redirect / berdasarkan status login
│   │
│   ├── pages/
│   │   ├── Login.tsx                # Login siswa (NISN + password)
│   │   ├── Register.tsx             # Registrasi siswa baru
│   │   ├── Home.tsx                 # Beranda siswa
│   │   ├── Books.tsx                # Daftar & pencarian buku
│   │   ├── BookDetail.tsx           # Detail buku + tombol pinjam
│   │   ├── History.tsx              # Riwayat peminjaman
│   │   └── Profile.tsx              # Profil siswa + QR Code
│   │
│   ├── components/
│   │   ├── Layout.tsx               # Wrapper: top nav + content + bottom nav
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
│   │   ├── authService.ts           # API: register, login
│   │   ├── bookService.ts           # API: get books, get detail
│   │   ├── borrowService.ts         # API: borrow, cancel, return request
│   │   ├── categoryService.ts       # API: get categories (untuk filter)
│   │   └── notificationService.ts   # API: get & mark-read notifications
│   │
│   ├── lib/
│   │   └── api.ts                   # Fetch wrapper (base URL + auth header + 401 handler)
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
    │
    ├─(1) Siswa isi form: username, nisn, password
    │
    ├─(2) Panggil authService.register()
    │        └── POST /api/auth/register
    │              Body: { username, nisn, password }
    │
    ├─(3) Response: { message, user }
    │
    └─(4) Redirect ke /login
```

### Login Flow

```
[Login.tsx]
    │
    ├─(1) Siswa isi form: NISN + password
    │
    ├─(2) Panggil authService.login()
    │        └── POST /api/auth/login
    │              Body: { nisn, password }
    │
    ├─(3) Response: { token, user: { id, username, role: 'SISWA', qrCode, ... } }
    │
    ├─(4) Simpan token + user ke localStorage
    │
    └─(5) Redirect ke /home
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

### Fetch Wrapper (`lib/api.ts`)

```typescript
// lib/api.ts
const BASE_URL = 'http://localhost:3000/api'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// Token otomatis disisipkan di setiap request
// Error 401 otomatis hapus token + trigger auth:logout event
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth:logout'))
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
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

`Layout.tsx` membungkus semua halaman terautentikasi:
- **Top Bar:** Judul halaman + NotificationBell
- **Content Area:** Konten halaman aktif (`<Outlet />`)
- **Bottom Navigation:** Home | Books | History | Profile

```typescript
// Layout.tsx (simplified)
const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <main className="flex-1 pb-16">   {/* pb-16 agar tidak tertutup bottom nav */}
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
    │
    ├─(1) Mount: fetch detail buku + semua copy
    │        └── GET /api/books/:id
    │
    ├─(2) Tampilkan info buku, jumlah stok AVAILABLE, status tiap copy
    │
    ├─(3) User klik "Pinjam"
    │
    ├─(4) useBorrow.requestBorrow(bookId)
    │        └── POST /api/borrow
    │              Body: { bookId }
    │
    ├─(5) Backend cek syarat:
    │       - Tidak ada borrowing aktif (PENDING/BORROWED/RETURN_PENDING)
    │       - Tidak ada fine belum dibayar
    │       - Ada copy AVAILABLE → dipilih otomatis, di-RESERVED
    │
    ├─(6a) SUCCESS → alert "Permintaan berhasil, tunggu persetujuan admin"
    └─(6b) FAIL    → tampilkan error message dari API
```

---

## Alur Teknis: Pengembalian Buku

```
[History.tsx / SiswaHistory.tsx]
    │
    ├─(1) Mount: fetch riwayat peminjaman siswa
    │        └── GET /api/borrow
    │
    ├─(2) Tampilkan daftar dengan status + badge warna
    │
    ├─(3) User klik "Kembalikan" (muncul jika status=BORROWED dan isPickedUp=true)
    │
    ├─(4) useBorrow.requestReturn(borrowingId)
    │        └── PATCH /api/borrow/:id/return
    │
    ├─(5) Status berubah → RETURN_PENDING
    │
    └─(6) UI diupdate: tombol "Kembalikan" diganti dengan label "Menunggu Verifikasi"
```

---

## Alur Teknis: Notifikasi

```
[NotificationBell.tsx]
    │
    ├─(1) Mount + interval polling
    │        └── GET /api/notifications
    │
    ├─(2) Hitung notif yang belum dibaca (isRead: false)
    │
    ├─(3) Tampilkan badge merah jika ada yang belum dibaca
    │
    ├─(4) User klik bell → tampilkan dropdown list notifikasi
    │
    └─(5) User klik notifikasi → mark as read
             └── PATCH /api/notifications/:id/read
```

---

## Alur Teknis: QR Code

```
[Profile.tsx]
    │
    ├─(1) Mount: ambil data user dari localStorage / auth state
    │
    ├─(2) Tampilkan qrCode sebagai gambar:
    │        <img src={user.qrCode} alt="QR Code" />
    │        (qrCode = base64 PNG dari backend)
    │
    └─(3) User tap/klik untuk memperbesar QR Code (fullscreen modal)
```

**QR Code dihasilkan oleh Backend saat registrasi** menggunakan library `qrcode`, encode dari `userId`, disimpan sebagai base64 di field `User.qrCode`.

---

## Service Layer

```typescript
// services/authService.ts
const authService = {
  register: (data: { username: string; nisn: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),

  login: (data: { nisn: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
}

// services/borrowService.ts
const borrowService = {
  // Siswa ajukan peminjaman — hanya kirim bookId, copy dipilih otomatis
  create: (bookId: number) =>
    api.post('/borrow', { bookId }).then(r => r.data),

  // Batalkan permintaan PENDING
  cancel: (id: number) =>
    api.patch(`/borrow/${id}/cancel`).then(r => r.data),

  // Siswa ajukan pengembalian
  requestReturn: (id: number) =>
    api.patch(`/borrow/${id}/return`).then(r => r.data),

  // Ambil riwayat peminjaman siswa yang login
  getMyHistory: () =>
    api.get('/borrow').then(r => r.data),

  // Cek eligibilitas pinjam
  checkEligibility: () =>
    api.get('/borrow/check-eligibility').then(r => r.data),
}

// services/notificationService.ts
const notificationService = {
  getAll: () =>
    api.get('/notifications').then(r => r.data),

  markRead: (id: number) =>
    api.patch(`/notifications/${id}/read`).then(r => r.data),

  markAllRead: () =>
    api.patch('/notifications/read-all').then(r => r.data),
}
```

---

## Endpoint yang Digunakan Web Members

| Service | Method | Endpoint | Deskripsi |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Daftar siswa baru |
| Auth | POST | `/api/auth/login` | Login siswa |
| Books | GET | `/api/books` | Daftar buku + filter + stok |
| Books | GET | `/api/books/:id` | Detail buku + semua copy |
| Categories | GET | `/api/categories` | Daftar kategori (untuk filter) |
| Borrow | POST | `/api/borrow` | Ajukan peminjaman (bookId) |
| Borrow | GET | `/api/borrow` | Riwayat peminjaman siswa |
| Borrow | PATCH | `/api/borrow/:id/cancel` | Batalkan PENDING |
| Borrow | PATCH | `/api/borrow/:id/return` | Ajukan pengembalian |
| Borrow | GET | `/api/borrow/check-eligibility` | Cek bisa pinjam |
| Notifications | GET | `/api/notifications` | Ambil notifikasi |
| Notifications | PATCH | `/api/notifications/:id/read` | Tandai sudah dibaca |
| Notifications | PATCH | `/api/notifications/read-all` | Tandai semua dibaca |

---

## TypeScript Types Utama

```typescript
// types/index.ts

interface User {
  id: number
  username: string
  nisn: string
  role: 'SISWA'
  qrCode: string
}

interface Category {
  id: number
  name: string
  description?: string
}

interface BookCopy {
  id: number
  bookId: number
  copyNumber: number
  status: 'AVAILABLE' | 'RESERVED' | 'BORROWED' | 'DAMAGED' | 'LOST'
  qrCode?: string
}

interface Book {
  id: number
  title: string
  author: string
  description?: string
  image?: string
  stock: number        // jumlah copy AVAILABLE
  totalCopies: number  // jumlah total copy
  category?: Category
  copies?: BookCopy[]
}

interface Borrowing {
  id: number
  status: 'PENDING' | 'BORROWED' | 'RETURN_PENDING' | 'RETURNED' | 'REJECTED' | 'CANCELLED'
  borrowDate?: string
  dueDate?: string
  actualReturnDate?: string
  condition?: 'GOOD' | 'DAMAGED' | 'LOST'
  lateFee: number
  damageFee: number
  totalFine: number
  isPickedUp: boolean
  isPaid: boolean
  bookCopy: BookCopy & { book: Book }
}

interface Notification {
  id: number
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

# Development server
npm run dev
# Buka: http://localhost:5174

# Build untuk production
npm run build

# Preview build hasil
npm run preview
```

### Mobile-First Design
- Layout menggunakan Flexbox + Tailwind
- Bottom navigation fixed di bawah layar
- Padding konten disesuaikan agar tidak tertutup bottom nav (`pb-16`)
- Dioptimalkan untuk viewport mobile (375px–428px)
- Icon dari Lucide React
