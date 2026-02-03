# 🎯 Sistem Absensi QR Code

Sistem absensi karyawan berbasis QR Code dengan penyimpanan data di Google Sheets. **100% Gratis!**

## ✨ Fitur

- 📱 **Scan QR Code** - Buka halaman absensi dengan scan
- 👤 **Auto Nama** - Nama karyawan dari QR Code
- 📍 **Auto GPS** - Lokasi tercatat otomatis
- 🕐 **Auto Waktu** - Timestamp otomatis
- ☁️ **Google Sheets** - Data tersimpan di cloud

## 🚀 Quick Start

### 1. Setup Google Sheets (5 menit)
Ikuti panduan di [docs/05_GOOGLE_APPS_SCRIPT_SETUP.md](docs/05_GOOGLE_APPS_SCRIPT_SETUP.md)

### 2. Jalankan Lokal
```bash
cd src
python -m http.server 8000
```

### 3. Test
Buka: `http://localhost:8000/index.html?nama=Test%20User&meja=A01`

## 📁 Struktur Project

```
absensi-qrcode/
├── docs/           # Dokumentasi lengkap
├── src/            # Source code (HTML, CSS, JS)
├── scripts/        # Google Apps Script
└── tools/          # QR Code generator
```

## 📚 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| [01_PROJECT_OVERVIEW](docs/01_PROJECT_OVERVIEW.md) | Gambaran umum project |
| [02_REQUIREMENTS](docs/02_REQUIREMENTS.md) | Kebutuhan sistem |
| [03_TECH_STACK](docs/03_TECH_STACK.md) | Teknologi yang digunakan |
| [04_PROJECT_STRUCTURE](docs/04_PROJECT_STRUCTURE.md) | Struktur folder |
| [05_GOOGLE_APPS_SCRIPT_SETUP](docs/05_GOOGLE_APPS_SCRIPT_SETUP.md) | **Setup Google Sheets** |
| [06_IMPLEMENTATION_GUIDE](docs/06_IMPLEMENTATION_GUIDE.md) | Panduan implementasi |
| [07_TESTING_STRATEGY](docs/07_TESTING_STRATEGY.md) | Strategi testing |

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Google Apps Script (gratis)
- **Database**: Google Sheets (gratis)
- **Hosting**: GitHub Pages (gratis)

## 📄 License

MIT License
