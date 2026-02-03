# 🧪 Testing Guide - Sistem Absensi QR Code V2

## 📋 Daftar Isi

1. [Persiapan Testing](#persiapan-testing)
2. [Phase 1: Verifikasi Deploy](#phase-1-verifikasi-deploy)
3. [Phase 2: Generate QR Code](#phase-2-generate-qr-code)
4. [Phase 3: Test Absen MASUK](#phase-3-test-absen-masuk)
5. [Phase 4: Test Absen PULANG](#phase-4-test-absen-pulang)
6. [Phase 5: Verifikasi Backend](#phase-5-verifikasi-backend)
7. [Phase 6: Test Riwayat](#phase-6-test-riwayat)
8. [Phase 7: Test Dashboard Admin](#phase-7-test-dashboard-admin)
9. [Phase 8: Test Form Izin](#phase-8-test-form-izin)
10. [Phase 9: Unit Test](#phase-9-unit-test)
11. [Phase 10: Multi-Device Test](#phase-10-multi-device-test)
12. [Checklist Hasil Testing](#checklist-hasil-testing)

---

## Persiapan Testing

### 🔧 Prasyarat

- ✅ Website sudah di-deploy ke GitHub Pages
- ✅ Google Apps Script sudah di-deploy
- ✅ Web App URL sudah disimpan
- ✅ Google Sheets "Absensi V2" sudah dibuat
- ✅ Koneksi internet stabil
- ✅ Browser modern (Chrome/Firefox/Edge/Safari)
- ✅ Smartphone dengan kamera (untuk test mobile)

### 📱 Tools yang Dibutuhkan

| Tool | Fungsi | Link |
|------|--------|------|
| QR Code Scanner | Scan QR untuk absensi | Play Store/App Store |
| Browser DevTools | Cek console error | F12 di browser |
| Google Sheets | Cek data backend | sheets.google.com |
| Google Drive | Cek foto yang diupload | drive.google.com |

---

## Phase 1: Verifikasi Deploy

### ✅ 1.1 Buka Website Utama

**URL:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/
```

**Expected Results:**

| Elemen | Status | Deskripsi |
|--------|--------|-----------|
| Logo Absensi | ✅ Terlihat | Logo "📋 Absensi" muncul |
| Jam Real-time | ✅ Berjalan | Jam di header update tiap detik |
| Tombol MASUK | ✅ Aktif | Bisa diklik |
| Tombol PULANG | ✅ Aktif | Bisa diklik |
| Tombol Kamera | ✅ Terlihat | "📷 Ambil Foto" |
| Tombol Riwayat | ✅ Terlihat | "📋 Lihat Riwayat" |

### ✅ 1.2 Cek Browser Console

**Langkah:**
1. Tekan **F12** (atau klik kanan → Inspect)
2. Pilih tab **Console**
3. Lihat apakah ada error

**Expected:**
- ✅ Tidak ada error merah
- ✅ Tidak ada warning kuning (atau minimal tidak blocking)

**Jika ada error:**
- Screenshot error
- Copy pesan error
- Report ke developer

---

## Phase 2: Generate QR Code

### ✅ 2.1 Buka QR Generator

**URL:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/tools/qr-generator.html
```

### ✅ 2.2 Generate QR untuk Test User

**Input:**
```
Nama Karyawan: Test User
Nama Perusahaan: PT Test Maju
Logo URL: (kosongkan)
```

**Action:**
- Klik **"Generate QR Code"**
- QR Code muncul di layar

**Verification:**
- ✅ QR Code tergenerate
- ✅ QR Code bisa di-download

### ✅ 2.3 Scan QR Code

**Dengan HP:**
1. Buka kamera HP
2. Arahkan ke QR Code
3. Atau gunakan aplikasi QR Scanner

**Expected URL setelah scan:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/?nama=Test%20User&perusahaan=PT%20Test%20Maju
```

---

## Phase 3: Test Absen MASUK

### ✅ 3.1 Verifikasi Data Karyawan

| Elemen | Expected Value | Status |
|--------|----------------|--------|
| Nama Karyawan | "Test User" | ☐ |
| Nama Perusahaan | "PT Test Maju" | ☐ |
| Jam Header | Berjalan real-time | ☐ |
| Koordinat | Terbaca atau error jelas | ☐ |
| Device Info | Terdeteksi | ☐ |

### ✅ 3.2 Ambil Foto

**Steps:**
1. Klik **"📷 Ambil Foto"**
2. Kamera/file dialog terbuka
3. Pilih atau ambil foto
4. Preview muncul

**Verification:**
- ☐ Tombol kamera berfungsi
- ☐ Preview foto muncul
- ☐ Bisa retake foto (klik "🔄 Ulangi Foto")
- ☐ Foto terlihat jelas

### ✅ 3.3 Submit Absen MASUK

**Steps:**
1. Pastikan tombol **MASUK** aktif (tidak disabled)
2. Klik tombol **MASUK**
3. Tunggu proses (2-5 detik)

**Verification:**
- ☐ Loading spinner muncul
- ☐ Tidak ada error alert

### ✅ 3.4 Verifikasi Hasil MASUK

**Expected UI Changes:**

| Elemen | Sebelum | Sesudah | Status |
|--------|--------|---------|--------|
| Status Card | "Belum absen hari ini" | "✅ Sudah absen MASUK" | ☐ |
| Jam MASUK | Kosong | "08:15" (contoh) | ☐ |
| Tombol MASUK | Aktif | Disabled (abu-abu) | ☐ |
| Tombol PULANG | Aktif | Aktif | ☐ |
| Notifikasi | - | "✅ Absensi MASUK berhasil!" | ☐ |

**Success Criteria:**
- ✅ Semua element berubah sesuai expected
- ✅ Notifikasi success muncul
- ✅ Tidak ada error di console

---

## Phase 4: Test Absen PULANG

### ✅ 4.1 Refresh/Scan Ulang

**Action:**
- Refresh halaman (F5)
- Atau scan QR code lagi

### ✅ 4.2 Verifikasi Status MASUK

| Elemen | Expected | Status |
|--------|----------|--------|
| Status Card | "✅ Sudah absen MASUK" | ☐ |
| Jam MASUK | Tertera (contoh: "08:15") | ☐ |
| Tombol MASUK | Disabled | ☐ |
| Tombol PULANG | Aktif (biru) | ☐ |

### ✅ 4.3 Submit Absen PULANG

**Steps:**
1. Ambil foto lagi
2. Klik tombol **PULANG**
3. Tunggu proses

**Verification:**
- ☐ Loading muncul
- ☐ Proses berhasil (2-5 detik)

### ✅ 4.4 Verifikasi Hasil PULANG

**Expected UI Changes:**

| Elemen | Expected | Status |
|--------|----------|--------|
| Status Card | "✅ Sudah absen MASUK dan PULANG" | ☐ |
| Jam PULANG | Tertera (contoh: "17:00") | ☐ |
| Tombol PULANG | Disabled | ☐ |
| Notifikasi | "✅ Absensi PULANG berhasil!" | ☐ |

---

## Phase 5: Verifikasi Backend

### ✅ 5.1 Cek Google Sheets

**Buka:** Google Sheets "Absensi V2" → Sheet "Absensi"

**Expected Data:**

| Timestamp | Nama | Tipe | Latitude | Longitude | Device | OS | Browser | Foto |
|-----------|------|------|----------|-----------|--------|-----|---------|------|
| 2026-02-04 08:15:23 | Test User | MASUK | -6.200... | 106.816... | Mobile | Android | Chrome | https://... |
| 2026-02-04 17:00:45 | Test User | PULANG | -6.200... | 106.816... | Mobile | Android | Chrome | https://... |

**Verification:**
- ☐ 2 baris data masuk
- ☐ Timestamp sesuai waktu submit
- ☐ Nama dan Tipe benar
- ☐ Koordinat tercatat
- ☐ Device info tercatat
- ☐ URL foto tercatat (bukan kosong)

### ✅ 5.2 Cek Google Drive

**Buka:** Google Drive → Cari folder "Absensi_Foto"

**Expected:**
- ☐ Folder "Absensi_Foto" ada
- ☐ Di dalamnya ada file foto dengan format: `Test_User_MASUK_1234567890.jpg`
- ☐ Juga ada: `Test_User_PULANG_1234567891.jpg`
- ☐ File bisa dibuka (tidak corrupt)

**Verification:**
- ☐ Buka salah satu foto
- ☐ Foto terlihat jelas
- ☐ Tidak ada error

---

## Phase 6: Test Riwayat

### ✅ 6.1 Buka Modal Riwayat

**Action:**
- Klik tombol **"📋 Lihat Riwayat"** di halaman absensi

**Expected:**
- ☐ Modal muncul
- ☐ Tidak blocking halaman belakang

### ✅ 6.2 Filter Riwayat

**Input:**
```
Bulan: Februari
Tahun: 2026
```

**Action:**
- Klik **"Tampilkan Riwayat"**

**Expected Results:**

| Tanggal | Jam | Tipe | Auto-fix | Status |
|---------|-----|------|----------|--------|
| 03/02/2026 | 08:15 | MASUK | - | ☐ |
| 03/02/2026 | 17:00 | PULANG | - | ☐ |

**Verification:**
- ☐ Tabel muncul
- ☐ Data sesuai dengan yang di-submit
- ☐ Format tanggal: DD/MM/YYYY
- ☐ Format jam: HH:MM
- ☐ Tipe MASUK warna hijau
- ☐ Tipe PULANG warna merah

---

## Phase 7: Test Dashboard Admin

### ✅ 7.1 Buka Dashboard

**URL:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/admin/admin.html
```

### ✅ 7.2 Verifikasi Summary Cards

| Card | Expected | Status |
|------|----------|--------|
| MASUK | Angka > 0 (contoh: 1) | ☐ |
| PULANG | Angka > 0 (contoh: 1) | ☐ |
| BELUM | Angka >= 0 | ☐ |

### ✅ 7.3 Verifikasi Table Data

**Expected Columns:**
- ☐ Waktu (Jam + Tanggal)
- ☐ Nama
- ☐ Tipe (MASUK/PULANG)
- ☐ Device Info
- ☐ Foto (📷 Lihat)

**Verification:**
- ☐ Data Test User muncul
- ☐ Data MASUK ada
- ☐ Data PULANG ada
- ☐ Klik "📷 Lihat" → Foto terbuka di modal
- ☐ Waktu timestamp sesuai

### ✅ 7.4 Test Filter

**Test Case:**
```
Filter by Nama: "Test User"
Filter by Tipe: "MASUK"
```

**Action:**
- Klik **"Filter"**

**Expected:**
- ☐ Hanya data MASUK yang muncul
- ☐ Hanya Test User yang muncul

**Clear Filter:**
- Klik **"Clear"**
- ☐ Semua data muncul kembali

### ✅ 7.5 Test Export

**Action:**
- Klik **"📥 Export Data"**

**Expected:**
- ☐ New tab terbuka
- ☐ File CSV terdownload otomatis
- ☐ Nama file: `Absensi_YYYYMMDD.csv`
- ☐ Isi file bisa dibuka di Excel

### ✅ 7.6 Test Auto Refresh

**Verification:**
- ☐ Countdown timer berjalan (30 → 29 → 28...)
- ☐ Setelah 30 detik, data otomatis refresh
- ☐ Summary dan table update

---

## Phase 8: Test Form Izin

### ✅ 8.1 Buka Form Izin

**URL:**
```
https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/src/izin.html?nama=Test%20User
```

### ✅ 8.2 Verifikasi Form

**Verification:**
- ☐ Nama: "Test User" muncul (auto-filled)
- ☐ Tanggal: Hari ini (auto-filled)
- ☐ Max tanggal: Hari ini (tidak bisa pilih future)

### ✅ 8.3 Submit Izin Sakit

**Input:**
```
Jenis: Sakit 🤒
Tanggal: (biarkan default)
Alasan: "Demam tinggi"
Lampiran: (opsional, skip dulu)
```

**Action:**
- Klik **"📤 Kirim Pengajuan"**

**Expected:**
- ☐ Loading muncul
- ☐ Notifikasi: "✅ Pengajuan izin berhasil dikirim! Menunggu approval admin."
- ☐ Form reset (tanggal kembali ke hari ini, alasan kosong)

### ✅ 8.4 Cek Google Sheets

**Buka:** Sheet "Izin"

**Expected Data:**

| Timestamp | ID | Nama | Jenis | Tanggal | Alasan | Status | Submitted At |
|-----------|----|----|-------|---------|---------|---------|--------------|
| ... | row_1 | Test User | Sakit | 2026-02-04 | Demam tinggi | PENDING | ... |

**Verification:**
- ☐ Data masuk di sheet Izin
- ☐ Status: PENDING
- ☐ Ada ID unik (row_1)
- ☐ Timestamp tercatat

### ✅ 8.5 Approval di Dashboard Admin

**Steps:**
1. Buka admin dashboard
2. Scroll ke **"Pending Approvals"**
3. Cari pengajuan "Test User - Sakit 🤒"

**Expected:**
- ☐ Pengajuan muncul di pending list
- ☐ Detail lengkap (jenis, tanggal, alasan)
- ☐ Tombol "✓ Approve" ada
- ☐ Tombol "✗ Reject" ada

**Action:**
- Klik **"✓ Approve"**
- Confirm dialog: OK

**Expected:**
- ☐ Alert: "Pengajuan berhasil disetujui!"
- ☐ Pengajuan hilang dari pending list
- ☐ Loading otomatis refresh

### ✅ 8.6 Verifikasi Approval di Sheets

**Cek kembali:** Sheet "Izin"

**Expected Change:**
- ☐ Status berubah: PENDING → **APPROVED**
- ☐ Approved By terisi: "Admin"
- ☐ Approved At terisi (timestamp)

---

## Phase 9: Unit Test

### ✅ 9.1 Test Connection

**Buka file lokal:**
```
D:\ai\percobaan\absensi-qrcode\tests\test-connection.html
```

**Input:**
```
Apps Script URL: https://script.google.com/macros/s/AKfycbzox4QboNOE3xnWlK3VOWJDth3PdBodNn2z-a_GIe4TDepvanfXjVmEQvnOgQ3e7FFX/exec
Nama Karyawan Test: TestUser
```

**Action:**
- Klik **"▶️ Jalankan Semua Test"**

**Expected Results:**

| Test Name | Status | Duration |
|-----------|--------|----------|
| Test 1: Backend Connection | ✅ PASS | <2000ms |
| Test 2: Check Status API | ✅ PASS | <2000ms |
| Test 3: Summary API | ✅ PASS | <2000ms |
| Test 4: Get Data API | ✅ PASS | <2000ms |
| Test 5: Get Riwayat API | ✅ PASS | <2000ms |
| Test 6: Get Izin Pending API | ✅ PASS | <2000ms |

**Success Criteria:**
- ✅ **6/6 tests passed**
- ✅ 0 failed
- ✅ Semua duration <5000ms

---

## Phase 10: Multi-Device Test

### ✅ 10.1 Desktop Test (PC/Laptop)

| Browser | Resolution | Status | Notes |
|---------|------------|--------|-------|
| Chrome | 1920x1080 | ☐ | | |
| Firefox | 1920x1080 | ☐ | | |
| Edge | 1920x1080 | ☐ | | |

**Verification:**
- ☐ Layout responsif
- ☐ Tidak ada horizontal scrollbar
- ☐ Tombol mudah diklik mouse
- ☐ Upload foto via file dialog works

### ✅ 10.2 Mobile Test (Smartphone)

| Device | OS | Browser | Status | Notes |
|--------|-----|---------|--------|-------|
| (Isi) | Android/iOS | Chrome/Safari | ☐ | | |

**Verification:**
- ☐ Layout mobile-friendly
- ☐ Tombol cukup besar untuk tap
- ☐ Kamera terbuka saat ambil foto
- ☐ GPS location terbaca (atau error jelas)
- ☐ Tidak perlu zoom untuk klik tombol

---

## Checklist Hasil Testing

### ✅ Berhasil Total

Jika SEMUA checkbox ☐ diubah menjadi ☑️, maka:
```
🎉 SELAMAT! Aplikasi SEMPURNA!
✅ Ready untuk production use
✅ Semua fitur berjalan smooth
✅ Tidak ada blocking bug
```

### ⚠️ Minor Issues Found

Jika ada beberapa checkbox yang belum ☑️ tapi tidak blocking:
```
⚠️ MINOR ISSUES DETECTED
📝 Catat issue-nya
🔧 Bisa diperbaiki nanti
✅ Masih bisa dipakai untuk production
```

### ❌ Major Issues Found

Jika ada banyak checkbox yang belum ☑️ atau error blocking:
```
❌ MAJOR ISSUES DETECTED
🚫 Tidak ready untuk production
🔧 Perlu perbaikan sebelum deploy
📋 Document semua error
📨 Report ke developer
```

---

## 📝 Report Format

Setelah testing, laporkan dengan format ini:

### ✅ Success Features
- (Daftar fitur yang berjalan sempurna)

### ⚠️ Minor Issues
- (Bug kecil yang tidak blocking)

### ❌ Major Issues
- (Error yang blocking fungsi)

### 💡 Suggestions
- (Ide improvement untuk masa depan)

### 📸 Screenshots
- (Attach screenshot jika ada error)

---

## 🎯 Success Criteria

Aplikasi dianggap **SEMPURNA** jika:

1. ✅ **Flow Lengkap**: MASUK → PULANG → Riwayat works
2. ✅ **Data Integrity**: Semua data tersimpan di Sheets & Drive
3. ✅ **UI/UX**: User experience smooth dan intuitive
4. ✅ **Cross-Device**: Works di desktop dan mobile
5. ✅ **No Bugs**: Tidak ada error di console
6. ✅ **Performance**: Response time <5 detik
7. ✅ **Admin Functions**: Dashboard, export, approval works

---

**Version:** 2.0
**Last Updated:** 4 Februari 2026
**Status:** READY FOR TESTING 🧪
