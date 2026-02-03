# 🛠️ Tech Stack

## Overview

Sistem ini menggunakan teknologi yang **100% gratis** dan **mudah di-setup**.

## Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **HTML5** | - | Struktur halaman |
| **CSS3** | - | Styling dengan modern design |
| **JavaScript (Vanilla)** | ES6+ | Logic aplikasi |
| **Geolocation API** | Web API | Mendapatkan koordinat GPS |

### Library Frontend (CDN)

| Library | Kegunaan | CDN |
|---------|----------|-----|
| **QRCode.js** | Generate QR Code | `https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js` |

> [!TIP]
> Tidak menggunakan framework (React/Vue) agar tetap simpel dan cepat load.

---

## Backend

| Teknologi | Kegunaan |
|-----------|----------|
| **Google Apps Script** | Web endpoint untuk menerima data |
| **Google Sheets** | Database penyimpanan absensi |

### Mengapa Google Apps Script?

```
✅ Gratis tanpa batas waktu
✅ Tidak perlu server sendiri
✅ Tidak perlu API key yang rumit
✅ Langsung terintegrasi dengan Google Sheets
✅ Deploy sebagai Web App dalam 1 klik
```

---

## Hosting

| Opsi | Biaya | Kegunaan |
|------|-------|----------|
| **Localhost** | Gratis | Development & Testing |
| **GitHub Pages** | Gratis | Production deployment |
| **Netlify** | Gratis | Alternatif production |

---

## Development Tools

| Tool | Kegunaan |
|------|----------|
| **VS Code** | Code editor |
| **Live Server** | Local development server |
| **Python http.server** | Alternatif local server |
| **Browser DevTools** | Debugging |

---

## Diagram Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      USER DEVICE                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Modern Browser                         │    │
│  │   ┌─────────┐  ┌─────────┐  ┌──────────────────┐    │    │
│  │   │  HTML5  │  │  CSS3   │  │  JavaScript ES6  │    │    │
│  │   └─────────┘  └─────────┘  └──────────────────┘    │    │
│  │                                    │                 │    │
│  │                        ┌───────────┴───────────┐     │    │
│  │                        │   Geolocation API     │     │    │
│  │                        └───────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS POST
                              v
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD (Free Tier)                  │
│  ┌──────────────────────┐      ┌────────────────────────┐   │
│  │  Google Apps Script  │─────>│     Google Sheets      │   │
│  │  (Web App Endpoint)  │      │   (Database Storage)   │   │
│  └──────────────────────┘      └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Browser Compatibility

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 60+ | ✅ Supported |
| Safari | 11+ | ✅ Supported |
| Firefox | 55+ | ✅ Supported |
| Edge | 79+ | ✅ Supported |
| Samsung Internet | 8+ | ✅ Supported |

---

## API Reference

### Geolocation API
```javascript
navigator.geolocation.getCurrentPosition(success, error, options);
```
- **Requirement**: HTTPS untuk production, HTTP OK untuk localhost
- **Permission**: User harus izinkan akses lokasi

### Google Apps Script Web App
```javascript
fetch(APPS_SCRIPT_URL, {
  method: 'POST',
  body: JSON.stringify(data)
});
```
- **Method**: POST
- **Format**: JSON
- **Response**: JSON with status
