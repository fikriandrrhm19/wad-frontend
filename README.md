# WAD Task Management Platform - Frontend Client

[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO_4.x-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)

Aplikasi *Single Page Application* (SPA) dari React dan Vite untuk manajemen task. Terintegrasi dengan RESTful API backend, support autentikasi dengan JWT, proteksi rute, operasi CRUD, serta sinkronisasi data dan notifikasi secara real-time.

Proyek ini merupakan implementasi frontend yang dikerjakan sebagai bagian dari praktikum **Unit 2** mata kuliah **Web Advanced Development 2 (WADV2)** pada Program Studi S1 Sistem Informasi dan Teknologi, Fakultas Ilmu Komputer, Universitas Cakrawala.

## Features

Frontend ini membuat seluruh komponen menjadi satu kesatuan aplikasi dengan fitur utama sebagai berikut:

* **Vite Tooling & Proxy Configuration**.
* **Global Authentication & Token Rotation**.
* **Rute yang Terproteksi**.
* **Abstraksi Service Layer & Full CRUD Tasks**.
* **Real-Time WebSocket Integration**.
* **Reactive Toast Notifications**.
* **Live Connection Status Indicator**.

## Architecture & Core Tech Stack

Client ini memisahkan manajemen state global, pengelolaan komponen secara modular, dan layer komunikasi data guna menyelaraskan konsistensi kode.

### Tech Stack

| Category          | Technology             | Tujuan                               |
| ----------------- | ---------------------- | ------------------------------------ |
| Build Tool        | Vite                   | Bundler dan server lokal development  |
| UI Library        | React 18               | Pengembangan komponen deklaratif     |
| Routing           | React Router v6        | Navigasi halaman dan proteksi rute   |
| Form Management   | React Hook Form        | Penanganan input state dan validasi form |
| HTTP Client       | Axios                  | Komunikasi data asinkronus ke API    |
| Real-Time Engine  | Socket.IO Client 4.x   | WebSockets                           |
| State Management  | Context API            | Manajemen sesi autentikasi global     |

### Project Structure

```text
wad-frontend
├─ public/                                      # Aset statis global browser
├─ src/
│  ├─ components/                               # Komponen interface atomik
│  │  ├─ Navbar.jsx                             # Menu navigasi global terproteksi
│  │  ├─ ProtectedRoute.jsx                     # Komponen pelindung rute otorisasi
│  │  ├─ TaskCard.jsx                           # Komponen presentasional task card
│  │  └─ TaskForm.jsx                           # Form modal untuk dialog Create & Edit
│  │  └─ ToastContainer.jsx                     # Container presenter antrean floating toast notification
│  ├─ contexts/
│  │  └─ AuthContext.jsx                        # Penyedia state sesi login dan refresh token
│  │  ├─ NotifContext.jsx                       # Penyedia state stack toast alerts global
│  │  └─ SocketContext.jsx                      # Pengelola lifecycle koneksi socket dan token refresh sync
│  ├─ hooks/
│  │  └─ useRealTimeTasks.js                    # Custom hook pemetaan listeners event Socket IO ke state UI
│  ├─ lib/
│  │  ├─ axios.js                               # Client Axios dengan interceptor JWT
│  │  └─ tokenStore.js                          # Utility penyimpanan token di storage
│  ├─ pages/                                    # Komponen halaman utama aplikasi
│  │  ├─ LoginPage.jsx                          # Halaman masuk akun
│  │  ├─ ProfilePage.jsx                        # Halaman detail metadata profil user
│  │  ├─ RegisterPage.jsx                       # Halaman registrasi akun baru
│  │  └─ TasksPage.jsx                          # Dashboard CRUD task
│  ├─ services/
│  │  └─ task.service.js                        # Abstraksi endpoint API layer data tugas
│  ├─ index.css                                 # Global style stylesheet aplikasi
│  └─ main.jsx                                  # Entry point aplikasi React
```

## Getting Started

### Prerequisites

* Node.js v20 atau lebih baru
* Aplikasi backend **WAD Capstone** telah berjalan di `http://localhost:3000`

### Installation

Masuk ke direktori frontend, lalu install seluruh dependency yang diperlukan:

```bash
cd wad-frontend
npm install
```

### Run the Application

Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Secara default aplikasi frontend bisa diakses via browser pada alamat:

```text
http://localhost:5173
```

## Akun Pengujian (Seed Users)

Gunakan kredensial akun default hasil *seeding* database backend berikut untuk pengujian:

* **Akun Pengguna Biasa (USER)**:
  * Email: `budi@example.com`
  * Password: `password_budi_123`

* **Akun Administrator (ADMIN)**:
  * Email: `admin@example.com`
  * Password: `password_admin_123`