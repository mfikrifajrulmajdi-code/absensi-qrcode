# 📖 V2 User Guide

## Overview

Panduan penggunaan Sistem Absensi QR Code V2 untuk **Karyawan** dan **Admin**.

---

## 👥 User Roles

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Karyawan** | Pengguna sistem untuk absensi | Halaman absensi, riwayat, form izin |
| **Admin** | Mengelola dan memonitor sistem | Dashboard admin, approval izin |

---

# 👤 PANDUAN KARYAWAN

---

## 1. 📱 Absensi MASUK / PULANG

### 1.1 Melakukan Absensi

**Langkah-langkah:**

1. **Scan QR Code**
   - Buka kamera HP
   - Scan QR Code yang ada di meja/kantor
   - Halaman absensi akan terbuka

2. **Allow Location Access**
   - Browser akan meminta izin lokasi
   - Klik **"Allow"** atau **"Izinkan"**

3. **Ambil Foto**
   - Klik tombol **📷 Ambil Foto**
   - Ambil foto selfie
   - Preview akan muncul
   - Jika salah, klik **🔄 Ulangi Foto**

4. **Klik Tombol Absensi**
   - Klik **🟢 MASUK** saat datang
   - Klik **🔴 PULANG** saat pulang

5. **Tunggu Notifikasi**
   - Tunggu pesan "✅ Absensi berhasil"
   - Data tersimpan otomatis

### 1.2 Tampilan Halaman Absensi

```
┌─────────────────────────────────────┐
│  📸 [LOGO]                           │
│  PT. MAJU SEJAHTERA                  │
├─────────────────────────────────────┤
│  08:15:23                            │
│  3 Februari 2026                     │
├─────────────────────────────────────┤
│  Nama Karyawan:                      │
│  Budi Santoso                        │
│                                     │
│  📍 Koordinat:                       │
│  -6.123456, 106.765432              │
│                                     │
│  📷 [Preview Foto]                   │
│  [🔄 Ulangi Foto]                    │
│                                     │
│  [📋 Lihat Riwayat]                  │
│                                     │
│  [🟢 MASUK]  [🔴 PULANG]            │
└─────────────────────────────────────┘
```

### 1.3 Pesan Notifikasi

| Pesan | Artinya |
|-------|---------|
| ✅ Absensi MASUK berhasil! | Absen masuk sukses |
| ✅ Absensi PULANG berhasil! | Absen pulang sukses |
| ⚠️ Sudah absen MASUK hari ini | Tidak bisa absen masuk 2x |
| ⚠️ Belum absen MASUK hari ini | Harus absen masuk dulu |
| ⚠️ Lupa absen kemain! Auto PULANG dicatat | Sistem auto-fix |
| ❌ Gagal mengirim data | Cek koneksi internet |

---

## 2. 👤 Melihat Riwayat Absensi

### 2.1 Buka Riwayat

**Dari halaman absensi:**
1. Klik tombol **📋 Lihat Riwayat**
2. Modal riwayat akan muncul

### 2.2 Filter Riwayat

**Pilih Bulan & Tahun:**
- Bulan: Januari - Desember
- Tahun: 2025, 2026, dst.

**Default:** Bulan & tahun sekarang

### 2.3 Tampilan Riwayat

```
┌─────────────────────────────────────┐
│  ❌ [X]                              │
│  📋 Riwayat Absensi                  │
│  Budi Santoso - PT. Maju            │
├─────────────────────────────────────┤
│  Filter: [Februari ▼] [2026 ▼]      │
│                                     │
│  📅 Februari 2026 (3 hari)           │
│  • 03 Feb: 08:15 MASUK ✅          │
│  • 03 Feb: 17:00 PULANG ✅         │
│  • 02 Feb: 08:10 MASUK ✅          │
│  • 02 Feb: 17:05 PULANG ✅         │
│  • 01 Feb: 08:00 MASUK ✅          │
│  • 01 Feb: --:-- PULANG ❌         │
│    (Auto: 16:00)                    │
│                                     │
│  📅 Januari 2026 (22 hari)           │
│  [Lihat semua]                      │
└─────────────────────────────────────┘
```

### Legend:

| Simbol | Arti |
|--------|------|
| ✅ | Absensi normal |
| ❌ | Lupa absen (auto-fix) |
| (Auto: 16:00) | PULANG otomatis (8 jam setelah MASUK) |

---

## 3. 📝 Mengajukan Izin / Sakit / Cuti

### 3.1 Buka Form Izin

**Cara 1: Via QR Code**
- Scan QR Code khusus untuk izin

**Cara 2: Via Link**
- Buka link: `izin.html?nama=Budi%20Santoso`

### 3.2 Isi Form Izin

```
┌─────────────────────────────────────┐
│  📝 Form Pengajuan Izin             │
├─────────────────────────────────────┤
│  Nama:                               │
│  Budi Santoso (auto)                 │
│                                     │
│  Jenis Izin:                         │
│  ○ 🤒 Sakit                           │
│  ○ 📋 Izin                            │
│  ○ 🏖️ Cuti                            │
│                                     │
│  Tanggal: [2026-02-03 📅]            │
│                                     │
│  Alasan:                             │
│  ┌─────────────────────────────┐   │
│  │ Demam tinggi, tidak bisa    │   │
│  │ ke kantor...                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Lampiran: [📎 Pilih File...]       │
│  (Opsional - Surat dokter, dll)     │
│                                     │
│  [📤 Kirim Pengajuan]               │
└─────────────────────────────────────┘
```

### 3.3 Status Pengajuan

| Status | Arti | Warna |
|--------|------|-------|
| ⏳ PENDING | Menunggu approval admin | Kuning |
| ✅ APPROVED | Disetujui | Hijau |
| ❌ REJECTED | Ditolak | Merah |

**Cek Status:**
- Status akan di-update oleh admin
- Karyawan bisa cek di dashboard (jika ada)

---

## 4. 💡 Tips & FAQ untuk Karyawan

### Q: Lupa absen pulang, gimana?

**A:** Jangan khawatir! Sistem akan auto-fix:
- Besok saat absen MASUK, sistem otomatis catat PULANG kemain (jam MASUK + 8 jam)

### Q: Bisa absen 2x MASUK dalam sehari?

**A:** Bisa! Untuk lembur:
- MASUK 1: 08:00 (regular)
- PULANG 1: 17:00 (regular)
- MASUK 2: 19:00 (lembur)
- PULANG 2: 22:00 (lembur)

### Q: GPS tidak muncul?

**A:** Pastikan:
- Location access sudah di-allow
- GPS sudah aktif di HP
- Tidak di dalam gedung tertutup

### Q: Foto gagal upload?

**A:** Cek:
- Ukuran foto max 5MB
- Koneksi internet stabil
- Coba ulangi foto

### Q: Riwayat cuma 3 bulan?

**A:** Ya, riwayat ditampilkan 3 bulan terakhir untuk performa. Data lama tetap tersimpan.

### Q: Izin ditolang, gimana?

**A:** Hubungi admin untuk info lebih lanjut. Status REJECTED berarti izin tidak disetujui.

---

# 🔧 PANDUAN ADMIN

---

## 5. 📊 Menggunakan Dashboard Admin

### 5.1 Buka Dashboard

**URL:** `https://yourdomain.com/admin/admin.html`

**Tidak ada password di V2** (akan ditambahkan di V3)

### 5.2 Tampilan Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  📊 Dashboard Absensi - Real-time Monitoring            │
│  Update: 3 Februari 2026, 08:30                         │
├─────────────────────────────────────────────────────────┤
│  Summary Hari Ini: 3 Februari 2026                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   25 MASUK   │ │   20 PULANG  │ │    5 BLUM    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  🔍 Filter Data                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Dari: [01/02/2026]  Sampai: [03/02/2026]       │   │
│  │ Nama: [Cari...]  Tipe: [Semua ▼]               │   │
│  │ [Apply Filter]                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  📋 Data Absensi (Last 50 rows)                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Time       │ Nama    │ Tipe  │ Device │ Foto    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 08:15     │ Budi    │ MASUK │ HP-1   │ 📷 Lihat│  │
│  │ 08:20     │ Siti    │ MASUK │ HP-2   │ 📷 Lihat│  │
│  │ ...       │ ...     │ ...   │ ...    │ ...     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  📥 [Export Data]                                       │
│                                                          │
│  ⏳ Pending Approval (2)                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Budi - Sakit - Demam                [✓] [✗]     │  │
│  │ Siti - Izin - Acara keluarga        [✓] [✗]     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Auto-refresh: 30 detik                                 │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Membaca Summary

| Card | Arti |
|------|------|
| **25 MASUK** | 25 orang sudah absen masuk hari ini |
| **20 PULANG** | 20 orang sudah absen pulang |
| **5 BLUM** | 5 orang belum absen sama sekali |

### 5.4 Filter Data

**Filter by Tanggal:**
- Dari: Tanggal awal
- Sampai: Tanggal akhir
- Kosongkan untuk semua data

**Filter by Nama:**
- Ketik nama karyawan
- Case-insensitive

**Filter by Tipe:**
- Semua / MASUK / PULANG

**Klik "Apply Filter"** untuk menerapkan filter

---

## 6. 📥 Export Data

### 6.1 Export ke Excel

**Langkah:**

1. Atur filter (opsional)
2. Klik **📥 Export Data**
3. Pilih format: **Excel (.xlsx)**
4. File akan otomatis ter-download

### 6.2 Format Output

**CSV Format:**
```csv
Timestamp,Nama,Tipe,Latitude,Longitude,Device,OS,Browser,Foto
2026-02-03 08:15:22,Budi Santoso,MASUK,-6.123456,106.765432,Mobile,Android,Chrome,https://...
```

**Bisa dibuka di:**
- Microsoft Excel
- Google Sheets
- Numbers (Mac)

---

## 7. ✅ Menyetujui/Menolak Izin

### 7.1 Review Pengajuan

**Di Dashboard → Section "Pending Approval":**

```
⏳ Pending Approval (2)

📋 Budi Santoso
Jenis: 🤒 Sakit
Tanggal: 03/02/2026
Alasan: Demam tinggi
Lampiran: 📎 surat_dokter.pdf

[✅ Approve]  [❌ Reject]
```

### 7.2 Approve / Reject

**Untuk Approve:**
1. Klik tombol **✅ Approve**
2. Status berubah menjadi **APPROVED**
3. Karyawan akan dihitung sebagai "Sakit"

**Untuk Reject:**
1. Klik tombol **❌ Reject**
2. Status berubah menjadi **REJECTED**
3. Karyawan dianggap "Alpha" (jika tidak absen)

### 7.3 View Lampiran

Klik **📎** untuk melihat lampiran (surat dokter, dll)

---

## 8. 📈 Membaca Statistik

### 8.1 Kehadiran Hari Ini

**Dashboard menunjukkan:**

| Status | Jumlah | Persentase |
|--------|--------|------------|
| ✅ Hadir | 25 | 83% |
| 🤒 Sakit | 2 | 7% |
| 📋 Izin | 1 | 3% |
| ❌ Alpha | 2 | 7% |

**Total Karyawan:** 30

### 8.2 Trends

**Untuk melihat trends:**
- Export data ke Excel
- Buat grafik/pivot table
- Analisis kehadiran per bulan

---

## 9. 🛠️ Troubleshooting untuk Admin

### Q: Dashboard tidak update real-time?

**A:**
- Dashboard auto-refresh setiap 30 detik
- Klik tombol refresh browser untuk force update
- Cek koneksi internet

### Q: Data tidak muncul?

**A:**
- Pastikan filter sudah benar
- Cek apakah tanggal sudah sesuai
- Refresh browser (Ctrl+F5)

### Q: Export tidak berfungsi?

**A:**
- Pastikan data tersedia
- Cek koneksi internet
- Coba filter yang lebih kecil (per hari, bukan per bulan)

### Q: Ada data strange/duplikat?

**A:**
- Cek riwayat karyawan di sheet "Absensi"
- Manual delete jika ada duplikat
- Hubungi karyawan untuk konfirmasi

---

## 10. 📱 Quick Reference Card

### Untuk Karyawan:

| Aktivitas | Cara |
|-----------|------|
| Absen MASUK | Scan QR → Ambil foto → Klik 🟢 MASUK |
| Absen PULANG | Scan QR → Ambil foto → Klik 🔴 PULANG |
| Lihat riwayat | Klik 📋 Lihat Riwayat |
| Ajukan izin | Scan QR izin → Isi form → Kirim |

### Untuk Admin:

| Aktivitas | Cara |
|-----------|------|
| Monitoring | Buka admin.html |
| Export data | Filter → Export |
| Approve izin | Dashboard → Pending → ✓ Approve |
| Cek statistik | Lihat summary card |

---

## 11. 📞 Support & Contact

**Masalah teknis?**

Hubungi:
- **Email:** support@perusahaan.com
- **WhatsApp:** +62 812-3456-7890
- **Telegram:** @absensi_support

**Jam operasional:**
- Senin - Jumat: 08:00 - 17:00
- Sabtu - Minggu: Closed

---

## 📚 Related Documents

- [08_V2_FEATURES.md](./08_V2_FEATURES.md) - Overview fitur V2
- [09_V2_IMPLEMENTATION.md](./09_V2_IMPLEMENTATION.md) - Panduan teknis
- [10_V2_API.md](./10_V2_API.md) - Dokumentasi API

---

**Version:** 2.0
**Last Updated:** 3 Februari 2026
**Status:** DRAFT
