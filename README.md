# 🎯 Sistem Absensi QR Code V2

Sistem absensi karyawan berbasis QR Code dengan fitur lengkap: foto absen, validasi, dashboard admin, dan approval system. **100% Gratis!**

> **🎉 V2 RELEASED!** Lihat fitur baru di bawah dan mulai testing dengan [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🌐 Live Demo

**Production URL:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/
```

**Quick Links:**
- 🏢 [Halaman Absensi](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/)
- 📊 [Dashboard Admin](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/admin/admin.html)
- 📝 [Form Izin](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/src/izin.html)
- 🎨 [QR Generator](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/tools/qr-generator.html)

---

## ✨ Fitur V2 (Terbaru)

| Fitur | V1 | V2 |
|-------|----|----|
| 📸 Foto saat absen | ❌ | ✅ **BARU** |
| 🔒 Validasi 1x MASUK/PULANG | ❌ | ✅ **BARU** |
| 🤖 Auto-fix lupa absen | ❌ | ✅ **BARU** |
| ⏰ Lembur tracking | ❌ | ✅ **BARU** |
| 📊 Dashboard Admin real-time | ❌ | ✅ **BARU** |
| 📥 Export data ke CSV | ❌ | ✅ **BARU** |
| 📋 Riwayat absensi | ❌ | ✅ **BARU** |
| 📝 Form izin/sakit + approval | ❌ | ✅ **BARU** |

---

## 🚀 Quick Start

### Opsi 1: Gunakan Live Demo (Langsung Pakai)

1. **Buka**: https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/
2. **Generate QR** untuk karyawan di: [QR Generator](https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/tools/qr-generator.html)
3. **Scan QR** dengan HP
4. **Mulai absen!**

### Opsi 2: Setup Sendiri (Custom)

Lihat panduan lengkap di: **[docs/13_SETUP_GUIDE.md](docs/13_SETUP_GUIDE.md)**

**Ringkasan:**
```bash
# 1. Setup Backend (Google Apps Script)
- Buat Google Sheets "Absensi V2"
- Extensions → Apps Script
- Tambah Google Drive API
- Paste scripts/CodeV2.gs
- Deploy sebagai Web App
- Copy URL Web App

# 2. Setup Frontend
- Update APPS_SCRIPT_URL di 3 file (app.js, admin.js, izin.js)
- Deploy ke GitHub Pages / Netlify

# 3. Generate QR Code
- Buka tools/qr-generator.html
- Generate QR untuk tiap karyawan

# 4. Selesai!
```

## 📁 Struktur Project

```
absensi-qrcode/
├── docs/                          # 📚 Dokumentasi lengkap
│   ├── 13_SETUP_GUIDE.md          # Panduan setup V2
│   ├── 08_V2_FEATURES.md          # Fitur-fitur V2
│   └── ...
├── src/                           # 🎨 Frontend - Halaman Absensi
│   ├── index.html                 # Halaman utama
│   ├── style.css                  # Styles
│   ├── app.js                     # Logic
│   ├── izin.html                  # Form izin
│   ├── izin.css
│   └── izin.js
├── admin/                         # 📊 Dashboard Admin
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
├── tools/                         # 🔧 Utilities
│   └── qr-generator.html          # Generate QR code
├── tests/                         # 🧪 Test Suite
│   ├── test-backend.gs            # Test backend
│   ├── test-frontend.html         # Test frontend
│   ├── test-admin.html            # Test admin
│   ├── test-izin.html             # Test form izin
│   └── test-connection.html       # Test koneksi
├── scripts/                       # ⚙️ Backend
│   └── CodeV2.gs                  # Google Apps Script
├── index.html                     # Entry point
├── style.css                      # Global styles
├── app.js                         # Global scripts
├── TESTING_GUIDE.md               # 🧪 Panduan testing
└── README.md                      # 📖 File ini
```

---

## 📚 Dokumentasi Lengkap

| Dokumen | Deskripsi |
|---------|-----------|
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | 🧪 **Panduan Testing Lengkap** |
| **[docs/13_SETUP_GUIDE.md](docs/13_SETUP_GUIDE.md)** | 🚀 **Panduan Setup V2** |
| [docs/08_V2_FEATURES.md](docs/08_V2_FEATURES.md) | Daftar fitur V2 |
| [docs/09_V2_IMPLEMENTATION.md](docs/09_V2_IMPLEMENTATION.md) | Detail implementasi V2 |
| [docs/10_V2_API.md](docs/10_V2_API.md) | API documentation |
| [docs/11_V2_DATABASE.md](docs/11_V2_DATABASE.md) | Struktur database |
| [docs/12_V2_USER_GUIDE.md](docs/12_V2_USER_GUIDE.md) | Panduan pengguna |

---

## 🧪 Mulai Testing

Siap untuk test? Buka **[TESTING_GUIDE.md](TESTING_GUIDE.md)** dan ikuti checklist dari Phase 1-10!

**Quick Test:**
1. Buka: https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/?nama=TestUser&perusahaan=PT%20Test
2. Cek apakah halaman muncul dengan benar
3. Cek console (F12) untuk error

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Google Apps Script (gratis)
- **Database**: Google Sheets (gratis)
- **Hosting**: GitHub Pages (gratis)

## 📄 License

MIT License
