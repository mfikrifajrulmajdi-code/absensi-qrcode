# 🚀 Panduan Setup Sistem Absensi QR Code

Panduan untuk deploy sistem ini di organisasi Anda.

---

## ⚡ Quick Setup (5 Menit)

### Step 1: Copy Google Sheets
1. Buka Google Sheets baru
2. Beri nama: "Absensi [Nama Perusahaan]"
3. Sheet akan auto-create saat pertama kali digunakan

### Step 2: Setup Apps Script
1. Di Google Sheets, klik **Extensions → Apps Script**
2. Hapus semua kode default
3. Copy-paste isi file `scripts/CodeV2.gs`
4. Klik **💾 Save**

### Step 3: Deploy Apps Script
1. Klik **Deploy → New deployment**
2. Pilih type: **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**
5. **COPY URL yang muncul!**

### Step 4: Edit config.js (1 FILE SAJA!)
1. Buka file `config.js` di root folder
2. Ganti baris ini:
```javascript
APPS_SCRIPT_URL: 'PASTE_URL_DARI_STEP_3_DISINI',
```
3. (Opsional) Ganti nama perusahaan:
```javascript
COMPANY_NAME: 'PT Nama Perusahaan Anda',
```
4. Save file

### Step 5: Enable GitHub Pages
1. Push ke GitHub
2. Settings → Pages → Deploy from branch: main
3. Tunggu 1-2 menit

### Step 6: Generate QR Code
Buka: `https://[username].github.io/[repo]/tools/qr-generator.html`

---

## ✅ Selesai!

URL sistem:
- **Absensi**: `https://[username].github.io/[repo]/`
- **Admin**: `https://[username].github.io/[repo]/admin/admin.html`

---

## 📋 Checklist

- [ ] Google Sheets dibuat
- [ ] Apps Script di-deploy
- [ ] URL di-paste ke `config.js`
- [ ] Push ke GitHub
- [ ] GitHub Pages aktif
- [ ] QR Code di-generate
- [ ] Test OK

---

## ⚠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Permission denied" | Pastikan "Who has access" = **Anyone** |
| Data tidak masuk | Cek URL di config.js benar |
| CORS Error | URL harus berakhir `/exec`, bukan `/dev` |

---

**Version:** 2.0  
**Updated:** 2026-02-05
