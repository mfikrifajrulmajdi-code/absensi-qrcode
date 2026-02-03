# 🚀 Panduan Setup Lengkap - Sistem Absensi QR Code V2

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Setup Backend (Google Apps Script)](#setup-backend)
3. [Setup Database (Google Sheets)](#setup-database)
4. [Setup Frontend](#setup-frontend)
5. [Deploy & Testing](#deploy--testing)
6. [Troubleshooting](#troubleshooting)

---

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- ✅ Akun Google (Gmail)
- ✅ Google Chrome atau browser modern lainnya
- ✅ Koneksi internet yang stabil
- ✅ Basic knowledge tentang copy-paste kode

---

## Setup Backend

### Langkah 1: Buat Google Sheets Baru

1. **Buka Google Sheets**
   - Kunjungi: https://sheets.google.com/
   - Login dengan akun Google Anda

2. **Buat Spreadsheet Baru**
   - Klik **"Blank"** (kosong) untuk membuat spreadsheet baru
   - Beri nama spreadsheet: **"Absensi V2"**

3. **Rename Sheet Default**
   - Di bagian bawah, klik tab **"Sheet1"**
   - Rename menjadi: **"Absensi"**

4. **Buat Sheet Tambahan untuk Izin** (Opsional)
   - Klik tombol **"+"** di sebelah tab "Absensi"
   - Rename menjadi: **"Izin"**

---

### Langkah 2: Buka Google Apps Script Editor

1. **Dari Google Sheets**, klik menu:
   ```
   Extensions → Apps Script
   ```

2. **Tab baru akan terbuka** dengan editor Apps Script

---

### Langkah 3: Tambahkan Google Drive API

⚠️ **PENTING**: Langkah ini WAJIB dilakukan untuk upload foto.

1. Di editor Apps Script, lihat sidebar kiri
2. Klik tombol **"+"** di sebelah tulisan **"Services"**
3. Akan muncul popup "Add a service"
4. Pilih:
   - **Service**: Google Drive API
   - **Add**: Klik tombol **Add**

5. Hasilnya akan muncul di sidebar:
   ```
   Services
   ├─ Google Drive API (DriveApp)
   ```

---

### Langkah 4: Paste CodeV2.gs

1. **Hapus kode default**
   - Di editor, akan ada file bernama `Code.gs`
   - Hapus semua isi file tersebut

2. **Paste kode V2**
   - Buka file `scripts/CodeV2.gs` dari project ini
   - Copy seluruh isi file tersebut
   - Paste ke editor Apps Script

3. **Simpan project**
   - Tekan **Ctrl+S** atau klik icon 💾
   - Beri nama project: **"Absensi V2 Backend"**

---

### Langkah 5: Deploy sebagai Web App

1. **Klik tombol Deploy**
   - Di pojok kanan atas, klik **Deploy** → **New deployment**

2. **Konfigurasi deployment**
   - Klik icon gear ⚙️ → **Web app**
   - Isi form:
     - **Description**: `Absensi V2`
     - **Execute as**: `Me (emailanda@gmail.com)`
     - **Who has access**: `Anyone` ← PENTING!

3. **Klik Deploy**

4. **Authorize Access**
   - Akan muncul popup "Authorization Required"
   - Klik **Review permissions**
   - Pilih akun Google Anda
   - Akan muncul warning "Google hasn't verified this app"
   - Klik **Advanced** → **Go to Absensi V2 Backend (unsafe)**
   - Klik **Allow**

5. **Copy Web App URL**
   - URL akan muncul dalam format:
     ```
     https://script.google.com/macros/s/AKfycbx.../exec
     ```
   - **SIMPAN URL ini!** Anda akan membutuhkannya nanti.

---

## Setup Database

### Langkah 1: Verifikasi Sheet "Absensi"

Setelah deploy pertama, buka Google Sheets Anda. Sheet "Absensi" akan otomatis terbuat dengan header:

| Timestamp | Nama | Tipe | Latitude | Longitude | Device Type | OS | Browser | User Agent | Foto |
|-----------|------|------|----------|-----------|-------------|-----|---------|-----------|------ |

Jika belum ada, buat manual dengan baris pertama seperti di atas.

---

### Langkah 2: Verifikasi Sheet "Izin" (Opsional)

Jika Anda ingin menggunakan fitur form izin, pastikan sheet "Izin" ada dengan header:

| Timestamp | ID | Nama | Jenis | Tanggal | Alasan | Lampiran | Status | Submitted At | Approved By | Approved At |
|-----------|----|----|-------|---------|---------|----------|---------|--------------|------------|------------|

---

## Setup Frontend

### Langkah 1: Update APPS_SCRIPT_URL di semua file JavaScript

Anda perlu mengupdate URL di 3 file JavaScript:

#### 1. src/app.js
Buka file `src/app.js`, edit line 10:

**SEBELUM:**
```javascript
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

**SETELAH:**
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

#### 2. admin/admin.js
Buka file `admin/admin.js`, edit line 6:

**SEBELUM:**
```javascript
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

**SETELAH:**
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

#### 3. src/izin.js
Buka file `src/izin.js`, edit line 6:

**SEBELUM:**
```javascript
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

**SETELAH:**
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

---

### Langkah 2: Deploy Frontend

Ada beberapa cara untuk deploy frontend:

#### Opsi A: Hosting ke GitHub Pages (RECOMMENDED - Gratis)

1. **Push project ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Absensi V2"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages**
   - Buka repository di GitHub
   - Klik **Settings** → **Pages**
   - Source: Deploy from a branch
   - Branch: `main` → `/ (root)`
   - Klik **Save**

3. **Tunggu beberapa menit**, website akan live di:
   ```
   https://USERNAME.github.io/REPO/
   ```

#### Opsi B: Hosting ke Netlify (Alternatif - Gratis)

1. Kunjungi: https://www.netlify.com/
2. Drag & drop folder project ke Netlify
3. Website akan live dalam hitungan detik

---

## Deploy & Testing

### Langkah 1: Jalankan Test Unit

Sebelum menggunakan sistem, jalankan test unit untuk memastikan semuanya berfungsi:

#### 1. Test Backend

1. Buka Google Apps Script editor
2. Klik menu **Run** → pilih fungsi **testAll**
3. Klik **Run** lagi
4. Lihat hasil di **Execution log** (bagian bawah)

**Expected Result:**
```
✅ Test Configuration Values
   IMGBB_API_KEY: NOT SET (OK, karena pakai Google Drive)
   JAM_KERJA: 8 jam

✅ Test Upload to Drive - Upload successful
   File URL: https://drive.google.com/uc?id=...

✅ Test Validate Absensi
   First MASUK: VALID
   PULANG after MASUK: VALID
   ...

Total Tests: 10
✅ Passed: 10
❌ Failed: 0
⏭️ Skipped: 0
```

---

#### 2. Test Frontend

1. Buka file `tests/test-frontend.html` di browser
2. Masukkan **Apps Script URL** Anda
3. Klik **"▶️ Jalankan Semua Test"**

**Expected Result:** Semua test harus passed ✅

---

#### 3. Test Admin Dashboard

1. Buka file `tests/test-admin.html` di browser
2. Masukkan **Apps Script URL** Anda
3. Klik **"▶️ Jalankan Semua Test"**

**Expected Result:** Semua test harus passed ✅

---

#### 4. Test Form Izin

1. Buka file `tests/test-izin.html` di browser
2. Masukkan **Apps Script URL** Anda
3. Klik **"▶️ Jalankan Semua Test"**

**Expected Result:** Semua test harus passed ✅

---

#### 5. Test Koneksi Frontend-Backend

1. Buka file `tests/test-connection.html` di browser
2. Masukkan **Apps Script URL** Anda
3. Masukkan nama untuk test (contoh: "TestUser")
4. Klik **"▶️ Jalankan Semua Test"**

**Expected Result:**
```
✅ Test 1: Backend Connection
✅ Test 2: Check Status API
✅ Test 3: Summary API
✅ Test 4: Get Data API
✅ Test 5: Get Riwayat API
✅ Test 6: Get Izin Pending API

Total: 6 | Passed: 6 | Failed: 0
```

---

### Langkah 2: Generate QR Code untuk Karyawan

1. **Buka QR Generator**
   - Buka file `tools/qr-generator.html` di browser

2. **Generate QR per Karyawan**
   - Masukkan **Nama Karyawan**: Budi Santoso
   - Masukkan **Nama Perusahaan**: PT. Maju Sejahtera
   - Masukkan **URL Logo** (opsional): https://example.com/logo.png
   - Klik **"Generate QR Code"**

3. **Download QR Code**
   - Klik kanan pada QR code → Save image
   - Print QR code untuk karyawan

4. **Uji Scan QR Code**
   - Scan QR code dengan HP
   - Akan diarahkan ke halaman absensi dengan URL:
     ```
     https://websiteanda.com/?nama=Budi%20Santoso&perusahaan=PT.%20Maju%20Sejahtera
     ```

---

### Langkah 3: Test Alur Absensi Lengkap

#### Test Case 1: Absen MASUK

1. **Scan QR Code** karyawan
2. Halaman absensi terbuka
3. **Cek data karyawan** tampil dengan benar
4. **Ambil foto** dengan kamera
5. **Klik tombol "MASUK"**
6. **Tunggu notifikasi**: "✅ Absensi MASUK berhasil!"
7. **Cek Google Sheets** → Data masuk di sheet "Absensi"
8. **Cek Google Drive** → Folder "Absensi_Foto" terbuat dengan foto karyawan

---

#### Test Case 2: Absen PULANG

1. **Scan QR Code** karyawan yang sama
2. Halaman absensi terbuka
3. **Status berubah**: "✅ Sudah absen MASUK"
4. **Tombol MASUK disabled**, tombol PULANG aktif
5. **Ambil foto** lagi
6. **Klik tombol "PULANG"**
7. **Tunggu notifikasi**: "✅ Absensi PULANG berhasil!"
8. **Cek Google Sheets** → Data PULANG tercatat

---

#### Test Case 3: Cek Riwayat

1. Di halaman absensi, klik **"📋 Lihat Riwayat"**
2. Modal riwayat muncul
3. Pilih filter bulan dan tahun
4. Riwayat absensi ditampilkan

---

#### Test Case 4: Submit Izin

1. Buka halaman `src/izin.html` dengan parameter nama:
   ```
   https://websiteanda.com/izin.html?nama=Budi%20Santoso
   ```
2. Isi form izin:
   - Jenis: Sakit
   - Tanggal: 2026-02-03
   - Alasan: Demam tinggi
3. Upload lampiran (opsional)
4. Klik **"📤 Kirim Pengajuan"**
5. **Tunggu notifikasi**: "✅ Pengajuan izin berhasil dikirim!"
6. **Cek Google Sheets** (sheet "Izin") → Data izin masuk dengan status PENDING

---

#### Test Case 5: Dashboard Admin

1. Buka halaman `admin/admin.html`
2. **Summary cards** menampilkan total MASUK, PULANG, BELUM
3. **Table data** menampilkan semua absensi
4. **Filter** berfungsi (filter by nama, tanggal, tipe)
5. **Export** berfungsi
6. **Pending approvals** menampilkan izin yang menunggu approval
7. Klik **"✓ Approve"** atau **"✗ Reject"** untuk memproses izin

---

## Troubleshooting

### Problem 1: "Action is required" Error

**Cause:** Backend tidak menerima parameter `action`

**Solution:**
- Pastikan URL menggunakan query parameter: `?action=checkStatus`
- Cek APPS_SCRIPT_URL sudah benar di semua file JavaScript

---

### Problem 2: Foto tidak terupload

**Cause:** Google Drive API belum ditambahkan

**Solution:**
1. Buka Google Apps Script editor
2. Klik **"+"** di sebelah "Services"
3. Tambahkan **Google Drive API**
4. Re-deploy web app

---

### Problem 3: CORS Error

**Symptoms:** Error di browser console: "CORS policy blocked"

**Solution:**
- Pastikan deploy menggunakan mode **no-cors** (sudah di-set di kode)
- Pastikan "Who has access" di-set ke **"Anyone"**

---

### Problem 4: Authorization Error

**Symptoms:** Popup authorization tidak muncul atau error

**Solution:**
1. Buka Google Apps Script editor
2. Klik **Deploy** → **Manage deployments**
3. Hapus deployment lama
4. Buat deployment baru
5. Follow authorization steps

---

### Problem 5: Data tidak muncul di Google Sheets

**Cause:** Sheet belum dibuat atau nama salah

**Solution:**
1. Buka Google Sheets
2. Pastikan ada sheet bernama **"Absensi"**
3. Cek header sudah sesuai (Timestamp, Nama, Tipe, dst)

---

### Problem 6: Frontend tidak terupdate

**Symptoms:** Perubahan kode tidak muncul

**Solution:**
- **Browser**: Hard refresh dengan **Ctrl+F5**
- **GitHub Pages**: Tunggu 1-2 menit untuk rebuild
- **Netlify**: Deploy otomatis, tidak perlu action

---

### Problem 7: Test unit gagal

**Solution:**
- Pastikan APPS_SCRIPT_URL sudah diisi dengan benar
- Cek koneksi internet
- Cek Execution log di Apps Script untuk error detail

---

## Checklist Final

Sebelum menggunakan sistem di production, pastikan:

- [ ] Google Sheets dibuat dengan sheet "Absensi"
- [ ] Google Drive API ditambahkan ke Apps Script
- [ ] CodeV2.gs di-paste dan di-deploy
- [ ] Web App URL di-copy dan disimpan
- [ ] APPS_SCRIPT_URL diupdate di 3 file JavaScript (app.js, admin.js, izin.js)
- [ ] Frontend di-deploy ke hosting (GitHub Pages/Netlify)
- [ ] Test backend passed (testAll)
- [ ] Test frontend passed (test-frontend.html)
- [ ] Test koneksi passed (test-connection.html)
- [ ] QR code berhasil di-generate
- [ ] Test alur absensi MASUK berhasil
- [ ] Test alur absensi PULANG berhasil
- [ ] Test riwayat berhasil
- [ ] Test form izin berhasil
- [ ] Test dashboard admin berhasil

---

## File Structure Setelah Setup

```
absensi-qrcode/
├── docs/
│   ├── 13_SETUP_GUIDE.md          ← (file ini)
│   ├── 08_V2_FEATURES.md
│   ├── 09_V2_IMPLEMENTATION.md
│   └── ...
├── src/
│   ├── index.html                  ← Halaman absensi utama
│   ├── style.css
│   ├── app.js                      ← APPS_SCRIPT_URL updated ✅
│   ├── izin.html                   ← Halaman form izin
│   ├── izin.css
│   └── izin.js                     ← APPS_SCRIPT_URL updated ✅
├── admin/
│   ├── admin.html                  ← Dashboard admin
│   ├── admin.css
│   └── admin.js                    ← APPS_SCRIPT_URL updated ✅
├── tests/
│   ├── test-backend.gs             ← Test unit backend
│   ├── test-frontend.html          ← Test unit app.js
│   ├── test-admin.html             ← Test unit admin.js
│   ├── test-izin.html              ← Test unit izin.js
│   └── test-connection.html        ← Test koneksi frontend-backend
├── tools/
│   └── qr-generator.html           ← Generate QR code karyawan
└── scripts/
    └── CodeV2.gs                   ← Backend code (already deployed)
```

---

## Next Steps

Setelah setup selesai:

1. **Generate QR code** untuk semua karyawan
2. **Print QR code** dan bagikan ke karyawan
3. **Sosialisasikan** cara menggunakan sistem absensi
4. **Monitor** dashboard admin secara rutin
5. **Export data** setiap akhir bulan untuk laporan

---

## Support

Jika mengalami masalah:

1. Cek **Execution log** di Apps Script untuk error detail
2. Cek **browser console** (F12 → Console) untuk frontend error
3. Baca file dokumentasi di folder `docs/`
4. Jalankan test unit untuk diagnosa masalah

---

**Version:** 2.0
**Last Updated:** 4 Februari 2026
**Status:** PRODUCTION READY ✅
