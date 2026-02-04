# 📋 Walkthrough: Sistem Absensi QR Code V2 Update

**Tanggal:** 2026-02-04  
**Project:** `d:\ai\percobaan\absensi-qrcode`  
**Backend:** Google Apps Script  
**Frontend:** GitHub Pages  

---

## ✅ Fitur & Perbaikan yang Dikerjakan

### 1. Fix Admin Dashboard Summary Counting
- **Masalah:** Summary MASUK/PULANG/BELUM ABSEN tidak akurat
- **Perbaikan:** Hapus duplicate `getSummaryHariIni` function, fix date parsing

### 2. Fix Data Absensi Empty Display
- **Masalah:** Baris kosong di sheet muncul sebagai "-"
- **Perbaikan:** Tambah validasi skip baris tanpa timestamp/nama di `getDataAbsensi`

### 3. Sistem Pengajuan Izin/Sakit/Cuti
- **Fitur:** Tombol "Ajukan Izin/Sakit" di halaman utama
- **Files:** `src/izin.html`, `src/izin.js`, `src/izin.css`
- **Backend:** `handleSubmitIzin()` di `CodeV2.gs`
- **Sheet:** "Izin" dengan kolom: Timestamp, Nama, Jenis, Tanggal, Alasan, Lampiran, Status, Updated At, Durasi

### 4. Admin Approval System
- **Fitur:** Panel "Pending Approval" di admin dashboard
- **Backend:** `getIzinPending()`, `approveIzin()`
- **Fix:** Off-by-one error di row ID (sekarang pakai `actualRow = i + 1`)

### 5. Auto-detect Izin Setengah Hari
- **Logika:** Jika sudah MASUK hari ini, durasi otomatis = `SETENGAH_HARI`
- **Frontend:** Cek API `checkStatus` saat form izin dibuka
- **Fix:** Field mismatch `sudahMasuk` → `hasMasuk`

### 6. Auto-generate PULANG saat Izin Disetujui
- **Logika:** Jika entry terakhir adalah MASUK, auto-generate PULANG
- **Catatan:** Record dengan `deviceType: "System"`, `os: "Auto"`, `browser: "Izin [jenis]"`
- **Fix:** Sekarang cek entry TERAKHIR, bukan sekadar ada/tidaknya MASUK/PULANG

### 7. Validasi Duplikat Izin
- **Logika:** 1 orang hanya boleh 1 izin per tanggal
- **Cek:** Jika sudah ada izin dengan status PENDING/APPROVED untuk nama+tanggal sama → tolak

### 8. Fungsi checkAbsensiHariIni
- **Ditambahkan:** Fungsi yang hilang untuk cek status MASUK/PULANG hari ini
- **Return:** `{ hasMasuk: boolean, hasPulang: boolean }`

---

## 📁 Files yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `scripts/CodeV2.gs` | Semua backend logic |
| `admin/admin.js` | Improved timestamp parsing |
| `index.html` | Tombol "Ajukan Izin/Sakit" |
| `app.js` | `openIzinPage()` function |
| `style.css` | Styling tombol izin |
| `src/izin.html` | Form izin dengan info banner |
| `src/izin.js` | Submit izin, cek status MASUK |
| `src/izin.css` | Styling form dan banner |

---

## 🔧 Yang Masih Perlu Dikerjakan

1. **Test komprehensif** semua flow izin setelah redeploy
2. **Notifikasi** ke admin saat ada izin baru (opsional)
3. **Riwayat izin** di halaman karyawan (opsional)
4. **Filter izin** di admin dashboard by status/tanggal (opsional)

---

## 📌 Catatan Penting

- **Apps Script URL:** `https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec`
- **Deployment:** Setiap perubahan backend HARUS redeploy Apps Script dengan **New version**
- **Sheet Izin:** Kolom ke-9 adalah "Durasi" (perlu tambah header manual jika belum ada)
