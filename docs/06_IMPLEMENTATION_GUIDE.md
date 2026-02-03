# 🔧 Implementation Guide

## Overview

Panduan implementasi lengkap untuk membangun sistem absensi QR Code dari awal.

---

## Phase 1: Setup Project

### 1.1 Buat Folder Project
```
absensi-qrcode/
├── docs/
├── src/
├── scripts/
├── tools/
└── assets/icons/
```

### 1.2 Buat File Utama
- `src/index.html` - Halaman absensi
- `src/style.css` - Styling
- `src/app.js` - JavaScript logic

---

## Phase 2: Implementasi Frontend

### 2.1 HTML Structure (`index.html`)

Komponen yang perlu dibuat:

| Komponen | Deskripsi |
|----------|-----------|
| **Header** | Logo/judul aplikasi |
| **Info Card** | Menampilkan nama, lokasi, waktu |
| **Action Buttons** | Tombol MASUK dan PULANG |
| **Status Message** | Notifikasi sukses/error |
| **Loading Indicator** | Saat fetching GPS/submit |

### 2.2 CSS Styling (`style.css`)

Design principles:
- **Mobile-first** responsive design
- **Dark mode** dengan gradien
- **Glassmorphism** untuk cards
- **Smooth animations** untuk interaksi
- **Large touch targets** untuk tombol

### 2.3 JavaScript Logic (`app.js`)

Fungsi yang perlu diimplementasi:

```javascript
// 1. Parse URL parameters
function getUrlParams() { }

// 2. Get GPS location
function getLocation() { }

// 3. Update time display
function updateClock() { }

// 4. Submit attendance
function submitAbsensi(tipe) { }

// 5. Show notification
function showNotification(message, isError) { }
```

---

## Phase 3: Setup Google Backend

Ikuti panduan di [05_GOOGLE_APPS_SCRIPT_SETUP.md](./05_GOOGLE_APPS_SCRIPT_SETUP.md)

Setelah selesai, dapatkan URL endpoint:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## Phase 4: Integrasi Frontend-Backend

### 4.1 Update `app.js` dengan URL endpoint

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### 4.2 Implementasi Submit Function

```javascript
async function submitAbsensi(tipe) {
  const data = {
    nama: namaKaryawan,
    meja: mejaId,
    tipe: tipe,
    latitude: currentLat,
    longitude: currentLng
  };
  
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Required untuk Google Apps Script
    body: JSON.stringify(data)
  });
}
```

> [!NOTE]
> Mode `no-cors` diperlukan karena Google Apps Script tidak mengirim CORS headers. Response tidak bisa dibaca, tapi request tetap terkirim.

---

## Phase 5: QR Code Generator

### 5.1 Buat `tools/qr-generator.html`

Tool untuk generate QR Code dengan format URL:
```
https://yoursite.github.io/absensi/?nama=NAMA&meja=MEJA_ID
```

### 5.2 Fitur Generator
- Input: Nama karyawan, ID meja
- Output: QR Code (downloadable)
- Batch generation support

---

## Phase 6: Testing Lokal

### 6.1 Jalankan Local Server

**Option A: Python**
```bash
cd absensi-qrcode/src
python -m http.server 8000
```

**Option B: VS Code Live Server**
1. Install extension "Live Server"
2. Right-click `index.html`
3. Select "Open with Live Server"

### 6.2 Test URL
```
http://localhost:8000/index.html?nama=Test%20User&meja=A01
```

### 6.3 Checklist Test

| Test | Expected Result |
|------|-----------------|
| Buka URL tanpa parameter | Nama default/kosong |
| Buka URL dengan parameter nama | Nama tampil dengan benar |
| Klik izinkan lokasi | GPS koordinat tampil |
| Klik MASUK | Data masuk ke Sheets |
| Klik PULANG | Data masuk ke Sheets |

---

## Phase 7: Deployment (Opsional)

### 7.1 GitHub Pages

1. Push code ke GitHub repository
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, folder: /src
5. Save

URL: `https://username.github.io/absensi-qrcode/`

### 7.2 Update QR Codes

Setelah deploy, update URL di QR Generator:
```
https://username.github.io/absensi-qrcode/?nama=NAMA&meja=ID
```

---

## Code Snippets

### URL Parameter Parser
```javascript
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    nama: params.get('nama') || 'Unknown',
    meja: params.get('meja') || '-'
  };
}
```

### Geolocation Handler
```javascript
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      (error) => reject(error.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
```

### Real-time Clock
```javascript
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('clock').textContent = timeStr;
}

setInterval(updateClock, 1000);
```
