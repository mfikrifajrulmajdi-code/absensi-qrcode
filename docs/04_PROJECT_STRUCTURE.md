# 📁 Project Structure

## Folder Structure

```
absensi-qrcode/
├── 📁 docs/                          # Dokumentasi project
│   ├── 01_PROJECT_OVERVIEW.md        # Deskripsi project
│   ├── 02_REQUIREMENTS.md            # Kebutuhan sistem
│   ├── 03_TECH_STACK.md              # Teknologi yang digunakan
│   ├── 04_PROJECT_STRUCTURE.md       # Struktur folder (file ini)
│   ├── 05_GOOGLE_APPS_SCRIPT_SETUP.md # Panduan setup Google
│   ├── 06_IMPLEMENTATION_GUIDE.md    # Panduan implementasi
│   └── 07_TESTING_STRATEGY.md        # Strategi testing
│
├── 📁 src/                           # Source code
│   ├── index.html                    # Halaman utama absensi
│   ├── style.css                     # Styling
│   └── app.js                        # Logic aplikasi
│
├── 📁 scripts/                       # Script utilities
│   └── Code.gs                       # Google Apps Script code
│
├── 📁 tools/                         # Tools tambahan
│   └── qr-generator.html             # Generator QR Code
│
├── 📁 assets/                        # Assets (icons, images)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── README.md                         # Quick start guide
└── .gitignore                        # Git ignore file
```

---

## File Descriptions

### `/docs/` - Documentation

| File | Deskripsi |
|------|-----------|
| `01_PROJECT_OVERVIEW.md` | Gambaran umum project dan arsitektur |
| `02_REQUIREMENTS.md` | Daftar kebutuhan fungsional & non-fungsional |
| `03_TECH_STACK.md` | Teknologi yang digunakan |
| `04_PROJECT_STRUCTURE.md` | Struktur folder dan file |
| `05_GOOGLE_APPS_SCRIPT_SETUP.md` | Step-by-step setup Google Sheets & Apps Script |
| `06_IMPLEMENTATION_GUIDE.md` | Panduan implementasi lengkap |
| `07_TESTING_STRATEGY.md` | Strategi dan panduan testing |

### `/src/` - Source Code

| File | Deskripsi |
|------|-----------|
| `index.html` | Halaman utama yang dibuka saat scan QR |
| `style.css` | Styling dengan modern design (dark mode, glassmorphism) |
| `app.js` | JavaScript logic untuk GPS, form, dan API calls |

### `/scripts/` - Google Apps Script

| File | Deskripsi |
|------|-----------|
| `Code.gs` | Kode Google Apps Script (copy ke Google Sheets) |

### `/tools/` - Additional Tools

| File | Deskripsi |
|------|-----------|
| `qr-generator.html` | Tool untuk generate QR Code batch |

---

## File Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        QR CODE                                   │
│                           │                                      │
│                           v                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  index.html                                              │    │
│  │  ├── loads: style.css (styling)                          │    │
│  │  └── loads: app.js (logic)                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           │ POST request                         │
│                           v                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Google Apps Script (Code.gs)                            │    │
│  │  └── writes to: Google Sheets                            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Environment Requirements

### Local Development
```bash
# Option 1: Python (sudah terinstall di Windows)
python -m http.server 8000

# Option 2: VS Code Live Server Extension
# Install extension, lalu klik "Go Live"

# Option 3: Node.js
npx serve src
```

### Production
- GitHub Pages (gratis)
- Netlify (gratis)
- Any static hosting
