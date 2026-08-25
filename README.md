# Auth App (Next.js + MySQL/Laragon)

Landing page sederhana + sistem Register & Login (form sliding card) yang
terhubung ke database MySQL lewat Laragon.

## 1. Siapkan Laragon

1. Buka Laragon, klik **Start All** (Apache/Nginx boleh dimatikan, yang
   penting **MySQL** aktif).
2. Buka **HeidiSQL** dari menu Laragon (klik kanan tray icon → Database),
   atau buka phpMyAdmin.
3. Buat database dengan cara import file `database.sql` yang ada di folder
   ini (klik kanan koneksi → Load SQL file → pilih `database.sql` → jalankan).
   File ini otomatis membuat database `auth_app` dan tabel `users`.

## 2. Siapkan project Next.js

Buka terminal di folder project ini, lalu jalankan:

```bash
npm install
```

Salin file konfigurasi environment:

```bash
copy .env.local.example .env.local
```

(di Mac/Linux pakai `cp .env.local.example .env.local`)

Buka `.env.local` dan sesuaikan jika password MySQL Laragon kamu berbeda
(default Laragon biasanya user `root` tanpa password, jadi biasanya tidak
perlu diubah).

## 3. Jalankan project

```bash
npm run dev
```

Buka browser ke `http://localhost:3000`

## Struktur halaman

- `/` — Landing page
- `/auth?mode=login` — Form Login (sliding card)
- `/auth?mode=register` — Form Sign Up (sliding card, klik tombol di panel
  gelap untuk toggle antara Login/Sign Up)
- `/dashboard` — Halaman setelah berhasil login (protected, redirect ke
  login kalau belum login)

## Struktur API

- `POST /api/register` — Daftar akun baru (password di-hash pakai bcrypt)
- `POST /api/login` — Login, cek password, set cookie session (JWT)
- `POST /api/logout` — Hapus cookie session
- `GET /api/me` — Cek user yang sedang login (dipakai dashboard)

## Catatan keamanan

- Password disimpan dalam bentuk hash (bcrypt), bukan plain text.
- Session pakai JWT yang disimpan di httpOnly cookie (tidak bisa diakses
  lewat JavaScript di browser, mengurangi risiko XSS).
- Query database pakai parameterized query (`?` placeholder) untuk mencegah
  SQL Injection.
