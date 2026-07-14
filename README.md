# WAD Task Management Platform - Frontend

Single Page Application (SPA) berbasis React dan Vite untuk platform manajemen tugas. Aplikasi ini terintegrasi dengan RESTful API backend, mendukung autentikasi JWT, komunikasi *real-time* menggunakan Socket.IO, dan modul **Milestone** untuk melacak progres proyek.

Proyek ini dikembangkan sebagai penugasan **Ujian Akhir Semester (UAS)** mata kuliah **Web Advanced Development 2 (WADV2)**, Program Studi S1 Sistem Informasi, Fakultas Ilmu Komputer, Universitas Cakrawala.

Implementasi mencakup materi praktikum **Week 8-9**, meliputi React SPA, autentikasi JWT, komunikasi *real-time* menggunakan WebSocket, dan integrasi penuh dengan backend yang telah di-*deploy* ke VPS.

## Project Links

- **Frontend Repository:** https://github.com/fikriandrrhm19/wad-frontend
- **Backend Repository:** https://github.com/fikriandrrhm19/wad-capstone
- **Live Application:** https://wad.fai.my.id
- **API Documentation (Swagger UI):** https://wad-api.fai.my.id/api/docs

## Struktur Proyek

```text
wad-frontend
├── public/              # Aset statis
├── src/
│   ├── assets/          # Gambar dan asset aplikasi
│   ├── components/      # Reusable UI components
│   ├── contexts/        # Global state dengan Context API
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Axios instance dan token management
│   ├── pages/           # Halaman utama aplikasi
│   ├── services/        # Service layer untuk komunikasi API
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
````

## Fitur Utama Aplikasi

1. **Authentication & Authorization**

   * Login dan registrasi user
   * Protected Route
   * JWT Access Token dan Refresh Token
   * Automatic token refresh menggunakan Axios Interceptors

2. **Task Management**

   * Full CRUD Task
   * Pagination, filtering, dan sorting
   * Integrasi penuh dengan REST API backend

3. **Milestone Module**

   * Manajemen Milestone
   * Detail Milestone beserta relasi Task
   * *Progress bar* berdasarkan status Task

4. **Real-Time Communication**

   * Socket.IO Client
   * Sinkronisasi Task dan Milestone secara *real-time*
   * Online presence
   * Toast notification
   * Automatic reconnection setelah *refresh token*

5. **React Architecture**

   * React 18 + Vite
   * React Router
   * Context API
   * React Hook Form
   * Service Layer Pattern

## Tech Stack

* React 18
* Vite
* React Router
* Axios
* Socket.IO Client
* React Hook Form
* Context API

## Local Development Setup

Ikuti langkah berikut untuk menjalankan frontend pada environment *development*.

### Prasyarat

Pastikan perangkat telah memenuhi kebutuhan berikut:

* Node.js **v20** atau lebih baru
* Git
* npm
* Backend (`wad-capstone`) telah berjalan pada `http://localhost:3000`

### 1. Clone Repository

```bash
git clone https://github.com/fikriandrrhm19/wad-frontend.git
cd wad-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Aplikasi

```bash
npm run dev
```

Secara default aplikasi frontend tersedia pada: `http://localhost:5173`

> Vite akan meneruskan request API ke backend melalui konfigurasi proxy pada `vite.config.js`.

## Akun Pengujian

Gunakan akun hasil *database seeding* berikut untuk pengujian aplikasi.

* **User**

  * Email: `budi@example.com`
  * Password: `password_budi_123`

* **Admin**

  * Email: `admin@example.com`
  * Password: `password_admin_123`

## License

Proyek ini menggunakan lisensi **MIT License**. Lihat file [`LICENSE`](./LICENSE) untuk informasi selengkapnya.