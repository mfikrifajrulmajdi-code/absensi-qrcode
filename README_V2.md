# 📋 Sistem Absensi QR Code V2

Sistem absensi karyawan berbasis QR Code dengan fitur lengkap: foto absen, validasi, auto-fix, dashboard admin, dan approval system.

---

## ✨ Fitur Utama

### V2 Features (Latest)

| Fitur | Deskripsi | Status |
|-------|----------|--------|
| 📸 **Foto Absen** | Anti-cheat dengan bukti foto | ✅ Active |
| 🔒 **Validasi 1x MASUK/PULANG** | Mencegah double absen | ✅ Active |
| 🤖 **Auto-fix Lupa Absen** | Otomatis catat PULANG jika lupa | ✅ Active |
| ⏰ **Lembur Tracking** | Hitung jam kerja & lembur | ✅ Active |
| 📊 **Dashboard Admin** | Monitor real-time semua absensi | ✅ Active |
| 📥 **Export Data** | Download laporan ke CSV/Excel | ✅ Active |
| 📋 **Riwayat Absensi** | Lihat riwayat per bulan | ✅ Active |
| 📝 **Form Izin/Sakit** | Pengajuan dengan approval system | ✅ Active |

---

## 🚀 Demo & Live Deployment

### 🌐 Production URL

```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/
```

### 🔗 Akses Modul

| Modul | URL |
|-------|-----|
| **Halaman Absensi** | [absensi-qrcode/](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/) |
| **Dashboard Admin** | [admin/admin.html](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/admin/admin.html) |
| **Form Izin** | [src/izin.html](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/src/izin.html) |
| **QR Generator** | [tools/qr-generator.html](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/tools/qr-generator.html) |

---

## 🏗️ Teknologi

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling dengan gradient modern
- **Vanilla JavaScript** - Logic (no framework)
- **Responsive Design** - Mobile-first approach

### Backend
- **Google Apps Script** - REST API serverless
- **Google Sheets** - Database (Absensi & Izin)
- **Google Drive** - File storage (folder "Absensi_Foto")

### Third-party Integration
- **ImgBB API** - Image hosting (optional, fallback)
- **QR Code.js** - Generate QR code untuk karyawan

---

## 📦 Quick Start

### Untuk Karyawan (End User)

1. **Scan QR Code** yang diberikan perusahaan
2. **Izinkan akses** lokasi dan kamera
3. **Ambil foto** selfie
4. **Klik MASUK** saat datang
5. **Klik PULANG** saat pulang
6. **Selesai!** Data otomatis tersimpan

### Untuk Admin

1. **Buka Dashboard Admin**
2. **Monitor** absensi real-time
3. **Filter** by nama, tanggal, tipe
4. **Export** data untuk laporan
5. **Approve/Reject** izin & sakit

---

## 🔧 Setup & Installation

### Prasyarat

- ✅ Akun Google (Gmail)
- ✅ Koneksi internet
- ✅ Browser modern (Chrome/Firefox/Safari/Edge)

### Step-by-Step Setup

#### 1. Setup Backend (Google Apps Script)

```bash
# Buat Google Sheets baru
1. Kunjungi: https://sheets.google.com/
2. Buat spreadsheet bernama "Absensi V2"
3. Rename sheet: "Sheet1" → "Absensi"
4. Buat sheet baru: "Izin" (opsional)

# Buka Apps Script
1. Di Sheets, klik: Extensions → Apps Script
2. Tambah service: "+" → Google Drive API → Add
3. Paste kode dari: scripts/CodeV2.gs
4. Deploy: Deploy → New deployment → Web app
5. Execute as: Me
6. Who has access: Anyone
7. Copy Web App URL!
```

#### 2. Setup Frontend

```bash
# Clone atau download repository
git clone https://github.com/mfikrifajrulmajdi-code/absensi-qrcode.git
cd absensi-qrcode

# Update Apps Script URL di 3 file:
# - src/app.js (line 10)
# - admin/admin.js (line 6)
# - src/izin.js (line 6)

# Ganti dengan:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

#### 3. Deploy ke GitHub Pages

```bash
# Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/absensi-qrcode.git
git push -u origin main

# Aktifkan GitHub Pages
1. Buka repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main → / (root)
4. Save → Tunggu 1-2 menit
5. Website live di: https://USERNAME.github.io/absensi-qrcode/
```

---

## 📱 Penggunaan

### Generate QR Code untuk Karyawan

1. Buka: `tools/qr-generator.html`
2. Input data karyawan:
   - Nama: Budi Santoso
   - Perusahaan: PT. Maju Sejahtera
   - Logo URL: (opsional)
3. Klik "Generate QR Code"
4. Download dan print QR code

### Alur Absensi Karyawan

```
Scan QR Code
    ↓
Halaman Absensi Terbuka
    ↓
Ambil Foto Selfie
    ↓
Klik MASUK (pagi) / PULANG (sore)
    ↓
Data Tersimpan ke Google Sheets & Drive
    ↓
Selesai ✅
```

### Monitoring Admin

```
Buka Dashboard Admin
    ↓
Lihat Summary (MASUK/PULANG/BELUM)
    ↓
Filter Data (by nama/tanggal/tipe)
    ↓
Export Laporan (CSV)
    ↓
Approve Izin/Sakit (jika ada)
```

---

## 🧪 Testing

### Run Test Suite

```bash
# Test Backend
1. Buka Google Apps Script editor
2. Run function: testAll()
3. Lihat Execution log untuk hasil

# Test Frontend
Buka file: tests/test-frontend.html

# Test Admin
Buka file: tests/test-admin.html

# Test Koneksi
Buka file: tests/test-connection.html
```

### Test Checklist

Lihat file **TESTING_GUIDE.md** untuk panduan testing lengkap.

---

## 📂 Struktur Project

```
absensi-qrcode/
├── docs/                          # Dokumentasi
│   ├── 13_SETUP_GUIDE.md          # Panduan setup lengkap
│   ├── 08_V2_FEATURES.md          # Daftar fitur V2
│   └── ...
├── src/                           # Frontend - Halaman Absensi
│   ├── index.html                 # Halaman utama absensi
│   ├── style.css                  # Styles
│   ├── app.js                     # Logic & API calls
│   ├── izin.html                  # Form izin/sakit
│   ├── izin.css
│   └── izin.js
├── admin/                         # Frontend - Dashboard Admin
│   ├── admin.html                 # Dashboard page
│   ├── admin.css
│   └── admin.js
├── tools/                         # Utilities
│   └── qr-generator.html          # Generate QR code karyawan
├── tests/                         # Test Suite
│   ├── test-backend.gs            # Test backend functions
│   ├── test-frontend.html         # Test frontend logic
│   ├── test-admin.html            # Test admin dashboard
│   ├── test-izin.html             # Test form izin
│   └── test-connection.html       # Test koneksi frontend-backend
├── scripts/                       # Backend Code
│   └── CodeV2.gs                  # Google Apps Script backend
├── index.html                     # Entry point (root)
├── style.css                      # Global styles
├── app.js                         # Global scripts
├── TESTING_GUIDE.md               # Panduan testing
└── README.md                      # File ini
```

---

## 🔐 Keamanan

### Data Privacy

- ✅ **Foto absen** disimpan di Google Drive (private)
- ✅ **Data absensi** di Google Sheets (hanya admin akses)
- ✅ **Tidak ada pihak ketiga** selain Google
- ✅ **No tracking** atau analytics

### Security Best Practices

- ✅ Apps Script di-deploy dengan akses "Anyone" (read-only)
- ✅ Tidak ada password hard-coded
- ✅ Input validation di frontend & backend
- ✅ Base64 encoding untuk file upload

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solusi |
|-------|--------|
| "Action is required" | Cek APPS_SCRIPT_URL sudah benar |
| Foto tidak upload | Tambahkan Google Drive API di Apps Script |
| CORS error | Pastikan "Who has access" = "Anyone" |
| Data tidak muncul | Cek nama sheet = "Absensi" |
| QR code tidak scan | Generate ulang QR code |

### Debug Mode

Untuk debug, buka browser console (F12):

```javascript
// Cek Apps Script URL
console.log(APPS_SCRIPT_URL);

// Cek koneksi
fetch(APPS_SCRIPT_URL + '?action=checkStatus&nama=Test')
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 API Documentation

### Endpoint List

| Action | Method | Deskripsi |
|--------|--------|-----------|
| `checkStatus` | GET | Cek status absensi hari ini |
| `submitAbsensi` | POST | Submit absen MASUK/PULANG |
| `getRiwayat` | GET | Ambil riwayat bulanan |
| `summary` | GET | Data summary (MASUK/PULANG/BELUM) |
| `getData` | GET | Ambil semua data absensi |
| `export` | GET | Download CSV |
| `submitIzin` | POST | Submit pengajuan izin |
| `getIzinPending` | GET | Ambil izin pending |
| `approveIzin` | GET | Approve/reject izin |

### API Documentation Lengkap

Lihat file: `docs/10_V2_API.md`

---

## 🔄 Version History

### V2.0 (Current Release)
- ✅ Foto absen dengan upload ke Google Drive
- ✅ Validasi 1x MASUK/PULANG per hari
- ✅ Auto-fix lupa absen (auto PULANG)
- ✅ Dashboard admin real-time
- ✅ Export data ke CSV
- ✅ Riwayat absensi per bulan
- ✅ Form izin dengan approval system
- ✅ Test suite lengkap

### V1.0 (Legacy)
- ✅ Basic QR code absensi
- ✅ Simpan data ke Google Sheets
- ✅ Tanpa foto, tanpa validasi

---

## 🤝 Contributing

Contributions are welcome!

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available for personal and commercial use.

---

## 👥 Author

**M Fikri Fajrul Majdi**
- GitHub: [@mfikrifajrulmajdi-code](https://github.com/mfikrifajrulmajdi-code)
- Project: Sistem Absensi QR Code V2

---

## 📞 Support

Jika ada pertanyaan atau issues:

1. Cek dokumentasi di folder `docs/`
2. Baca `TESTING_GUIDE.md` untuk troubleshooting
3. Open issue di GitHub repository

---

## 🎉 Acknowledgments

- Google Apps Script Documentation
- QR Code.js library
- All contributors and testers

---

**Status:** Production Ready ✅
**Version:** 2.0
**Last Updated:** 4 Februari 2026

---

<div align="center">

**⭐ Jika bermanfaat, silakan star repository ini! ⭐**

Made with ❤️ by M Fikri Fajrul Majdi

</div>
