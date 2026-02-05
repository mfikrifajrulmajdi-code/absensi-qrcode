# 🚀 Panduan Setup Sistem Absensi QR Code

---

## ⚡ Quick Setup (5 Menit)

### Step 1: Setup Google Sheets & Apps Script
1. Buka Google Sheets baru → Beri nama "Absensi"
2. Klik **Extensions → Apps Script**
3. Hapus kode default, paste isi `scripts/CodeV2.gs`
4. Save

### Step 2: Deploy Apps Script
1. Klik **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me** | Access: **Anyone**
4. Klik **Deploy** → **COPY URL yang muncul!**

### Step 3: Generate Config (PALING MUDAH!)

🎯 **Buka file `tools/setup-wizard.html` di browser**

1. Isi URL dari Step 2
2. (Opsional) Isi nama perusahaan
3. Klik **Generate Config**
4. **Download** atau **Copy** hasilnya
5. Replace isi file `config.js` dengan hasil generate

### Step 4: Upload ke Hosting
- GitHub Pages, Netlify, Vercel, atau hosting lain
- Atau jalankan lokal dengan Live Server

---

## ✅ Selesai!

### URL Sistem:
- **Absensi**: `/index.html`
- **Admin**: `/admin/admin.html`
- **QR Generator**: `/tools/qr-generator.html`

---

## � Struktur File

```
📁 sistem-absensi/
├── config.js          ← EDIT PAKAI WIZARD
├── index.html         ← Halaman absensi
├── app.js
├── style.css
├── 📁 admin/          ← Dashboard admin
├── 📁 src/            ← Form izin
├── 📁 scripts/        ← Backend (copy ke Apps Script)
├── 📁 tools/
│   ├── setup-wizard.html  ← ⭐ BUKA INI DULU
│   └── qr-generator.html
└── SETUP_GUIDE.md     ← File ini
```

---

## ⚠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Permission denied | Access = **Anyone** di Apps Script |
| Data tidak masuk | Cek URL di config.js benar |
| CORS Error | URL harus `/exec`, bukan `/dev` |

---

**v2.0 | 2026-02-05**
