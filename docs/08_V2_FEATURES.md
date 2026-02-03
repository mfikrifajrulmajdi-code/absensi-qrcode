# 🚀 V2 Features Overview

## Overview

Versi 2 dari Sistem Absensi QR Code membawa peningkatan signifikan dengan fokus pada validasi, monitoring, dan pengalaman pengguna yang lebih baik.

---

## 📊 Comparison: V1 vs V2

| Fitur | V1 | V2 |
|-------|----|----|
| Absensi MASUK/PULANG | ✅ | ✅ |
| Device Detection | ✅ | ✅ |
| Company Branding | ✅ | ✅ |
| GPS Location | ✅ | ✅ |
| **Foto saat absen** | ❌ | ✅ **BARU** |
| **Validasi 1x MASUK/PULANG** | ❌ | ✅ **BARU** |
| **Auto-fix lupa absen** | ❌ | ✅ **BARU** |
| **Lembur tracking** | ❌ | ✅ **BARU** |
| **Dashboard Admin** | ❌ | ✅ **BARU** |
| **Export Data** | ❌ | ✅ **BARU** |
| **Riwayat Absensi** | ❌ | ✅ **BARU** |
| **Form Izin/Sakit** | ❌ | ✅ **BARU** |
| **Approval System** | ❌ | ✅ **BARU** |

---

## 🎯 Fitur Baru V2

### 1. 📸 Foto saat Absen (Anti-Cheat)

**Deskripsi:** Karyawan wajib mengambil foto selfie saat melakukan absensi.

**Flow:**
```
1. Karyawan buka halaman absensi
2. Klik tombol "📷 Ambil Foto"
3. Kamera terbuka, ambil foto
4. Preview muncul
5. Klik MASUK/PULANG → Foto terupload
```

**Penyimpanan Foto:**

| Opsi | Status | Kapasitas | Kelebihan | Kekurangan |
|------|--------|----------|-----------|------------|
| **ImgBB** | 🟡 Recommended | Unlimited | Paling simpel, REST API mudah | Public URL |
| **Firebase** | 🟡 Alternative | 5GB | Balance simpel & private | Perlu setup project |
| **Google Drive** | ⚪ Advanced | 15GB | Private, terintegrasi | OAuth agak kompleks |

**Keputusan:** (akan ditentukan setelah diskusi)

**Technical Details:**
- Foto dikompres agar tidak terlalu besar (max 500KB)
- Format: JPEG
- Upload setelah tombol MASUK/PULANG diklik
- URL foto disimpan di Google Sheets kolom "Foto"

---

### 2. ✅ Validasi 1x MASUK/PULANG per Hari

**Deskripsi:** Mencegah double absensi dan memvalidasi urutan absensi.

**Rules:**

| Kondisi | Hasil |
|---------|-------|
| Sudah MASUK hari ini, klik MASUK lagi | ❌ Block: "Sudah absen masuk hari ini" |
| Belum MASUK, klik PULANG | ❌ Block: "Belum absen masuk hari ini" |
| Sudah PULANG hari ini, klik PULANG lagi | ❌ Block: "Sudah absen pulang hari ini" |
| MASUK 2x dalam sehari (lembur) | ✅ Allow: Catat sebagai MASUK ke-2 |

**Tampilan Tombol:**
```
Status: Belum absen hari ini
[🟢 MASUK]  [🔴 PULANG disabled]

↓ Setelah MASUK

Status: Sudah MASUK hari ini (08:15)
[🟢 MASUK disabled]  [🔴 PULANG]
```

---

### 3. 🔄 Auto-Fix Lupa Absen

**Deskripsi:** Jika karyawan lupa absen pulang hari sebelumnya, sistem akan otomatis mencatat PULANG (MASUK + 8 jam).

**Scenario:**

```
HARI 1:
08:00 - MASUK
-- lupa absen pulang --

HARI 2:
08:05 - MASUK
→ System deteksi: Kemarin lupa pulang!
→ Auto: Catat PULANG kemarin jam 16:00 (8 jam kerja)
→ MASUK hari ini berhasil
```

**Logic:**
```javascript
// Cek absensi terakhir
const lastAbsensi = getLastAbsensi(nama);

// Jika kemarin MASUK tapi tidak PULANG
if (lastAbsensi.tipe === 'MASUK' && lastAbsensi.date === yesterday) {
    // Auto PULANG = MASUK + 8 jam
    const autoPulangTime = lastAbsensi.time + 8 hours;
    // Catat ke Sheets sebagai PULANG (auto)
}
```

**Notifikasi ke User:**
```
⚠️ Terdeteksi Anda lupa absen pulang kemain.
   PULANG otomatis dicatat: 01/02/2026 16:00
```

---

### 4. 💼 Lembur Tracking

**Deskripsi:** Sistem mengizinkan 2x MASUK dan 2x PULANG dalam sehari untuk tracking lembur.

**Scenario Lembur:**

```
JAM KERJA REGULAR:
08:00 - MASUK (regular)
17:00 - PULANG (regular)

LEMBUR:
19:00 - MASUK (lembur)
22:00 - PULANG (lembur)
```

**Tipe Data:**
| Opsi | Implementasi | Keputusan |
|------|--------------|-----------|
| A. Tipe tetap MASUK/PULANG | 2x MASUK, 2x PULANG per hari (boleh) | ✅ **Dipilih** |
| B. Tipe baru LEMBUR | MASUK_LEMBUR, PULANG_LEMBUR | ❌ Terlalu kompleks |

**Keputusan:** Opsi A - Tipe tetap MASUK/PULANG, yang membedakan adalah jamnya:
- MASUK sebelum 17:00 = Regular
- MASUK setelah 17:00 = Lembur

---

### 5. 📊 Dashboard Admin Sederhana

**Deskripsi:** Halaman monitoring untuk melihat absensi real-time tanpa autentikasi (security through obscurity).

**URL:** `/admin.html`

**Fitur:**

| Widget | Deskripsi |
|--------|-----------|
| **Summary Cards** | Total MASUK, PULANG, Belum absen hari ini |
| **Live Table** | List absensi real-time (auto-refresh 30s) |
| **Filter** | Filter by nama, tanggal, tipe absensi |
| **Pending Approval** | List izin yang menunggu approval (dari fitur #7) |

**Tampilan:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 Dashboard Absensi - Real-time Monitoring            │
├─────────────────────────────────────────────────────────┤
│  Summary Hari Ini: 3 Februari 2026                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   25 MASUK   │ │   20 PULANG  │ │    5 BLUM    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  🔍 Filter:                                             │
│  Tanggal: [01/02/2026 - 03/02/2026]                    │
│  Nama: [Cari nama karyawan...]                          │
│  Tipe: [Semua ▼]                                        │
│                                                          │
│  📋 Data Absensi:                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Nama          │ Tipe  │ Jam   │ Device   │ Foto │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Budi Santoso  │ MASUK │ 08:15 │ Android  │ 📷   │  │
│  │ Siti Aminah   │ PULANG│ 17:30 │ iOS     │ 📷   │  │
│  │ Rudi Hartono  │ MASUK │ 08:20 │ Windows │ -    │  │
│  │ ...          │ ...   │ ...   │ ...     │ ...  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Auto-refresh: 30 detik                                 │
└─────────────────────────────────────────────────────────┘
```

**Security Note:**
- Tidak ada password di V2
- Di V3 akan ditambahkan autentikasi
- URL dipublish hanya ke admin yang berkepentingan

---

### 6. 📥 Export Data dengan Filter

**Deskripsi:** Admin bisa export data absensi ke Excel/CSV dengan filter kustom.

**Tampilan di Dashboard:**
```
┌─────────────────────────────────────────┐
│  📥 Export Data                          │
├─────────────────────────────────────────┤
│  Rentang Waktu:                          │
│  Dari: [01/02/2026]                      │
│  Sampai: [03/02/2026]                    │
│                                          │
│  Centang data yang di-export:            │
│  ☑ Timestamp                             │
│  ☑ Nama                                  │
│  ☑ Tipe (MASUK/PULANG)                   │
│  ☑ Koordinat GPS                         │
│  ☑ Device Info                           │
│  ☑ Foto (URL)                            │
│                                          │
│  Format Output:                          │
│  [ Excel (.xlsx) ▼ ]                     │
│                                          │
│  [📥 Export Data]                        │
└─────────────────────────────────────────┘
```

**Output:**
- File Excel/CSV yang di-download
- Berisi data sesuai filter
- Bisa dibuka di Excel/Google Sheets

**Technical:**
- Backend: Google Apps Script `doGet()` dengan parameter export
- Frontend: Fetch data → Generate CSV → Trigger download

---

### 7. 👤 Riwayat Absensi Pribadi

**Deskripsi:** Karyawan bisa melihat riwayat absensi 3 bulan terakhir.

**Akses:** Tombol "📋 Lihat Riwayat" di halaman depan (`index.html`)

**Flow:**
```
1. Karyawan buka halaman absensi
2. Klik tombol "📋 Lihat Riwayat"
3. Modal muncul berisi riwayat 3 bulan terakhir
4. Bisa filter per bulan
5. Tutup modal untuk kembali
```

**Tampilan Tombol:**
```
┌─────────────────────────────────────┐
│  Nama: Budi Santoso                 │
│  Perusahaan: PT. Maju               │
├─────────────────────────────────────┤
│  📍 Koordinat: -6.123, 106.765      │
│  🕐 Waktu: 08:15:22                  │
│  📅 Tanggal: 3 Februari 2026        │
│                                     │
│  [📋 Lihat Riwayat]  ← TOMBOL BARU  │
│                                     │
│  [🟢 MASUK]  [🔴 PULANG]            │
└─────────────────────────────────────┘
```

**Tampilan Modal:**
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
│                                     │
│  Menampilkan 3 bulan terakhir       │
└─────────────────────────────────────┘
```

**Technical:**
- Fetch data dari Google Apps Script API
- Filter by nama karyawan
- Limit 3 bulan terakhir
- Render di modal/overlay

---

### 8. 📝 Form Izin/Sakit dengan Approval

**Deskripsi:** Karyawan bisa mengajukan izin/sakit/cuti dan admin bisa approve/reject.

**Flow:**
```
Karyawan → Submit Izin → PENDING → Admin Approve/Reject → Status Update
```

**Akses:** Halaman `izin.html` (buka via QR terpisah atau tombol)

**Tampilan Form:**
```
┌─────────────────────────────────────┐
│  📝 Form Pengajuan Izin             │
├─────────────────────────────────────┤
│  Nama: [Auto dari URL]              │
│                                     │
│  Jenis Izin:                        │
│  [🤒 Sakit] [📋 Izin] [🏖️ Cuti]      │
│                                     │
│  Tanggal: [2026-02-03]              │
│                                     │
│  Alasan:                            │
│  ┌─────────────────────────────┐   │
│  │ Demam tinggi, tidak bisa    │   │
│  │ ke kantor...                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Lampiran (Opsional):               │
│  [📎 Upload Surat Dokter/Foto]      │
│                                     │
│  [📤 Kirim Pengajuan]               │
└─────────────────────────────────────┘
```

**Tampilan Admin di Dashboard:**
```
┌─────────────────────────────────────┐
│  ⏳ Pending Approval (2)            │
├─────────────────────────────────────┤
│  📋 Budi Santoso                    │
│  Jenis: 🤒 Sakit                     │
│  Tanggal: 03/02/2026                 │
│  Alasan: Demam tinggi               │
│  Lampiran: 📎 surat_dokter.pdf       │
│                                     │
│  [✅ Approve]  [❌ Reject]           │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📋 Siti Aminah                     │
│  Jenis: 📋 Izin                      │
│  Tanggal: 03/02/2026                 │
│  Alasan: Acara keluarga             │
│  Lampiran: -                         │
│                                     │
│  [✅ Approve]  [❌ Reject]           │
└─────────────────────────────────────┘
```

**Status Pengajuan:**

| Status | Deskripsi | Warna |
|--------|-----------|-------|
| ⏳ PENDING | Menunggu approval admin | Kuning |
| ✅ APPROVED | Disetujui | Hijau |
| ❌ REJECTED | Ditolak | Merah |

**Pengaruh ke Statistik:**
```
Summary Kehadiran - 3 Februari 2026:
┌─────────────────────────────────────┐
│  Total Karyawan: 30                 │
│  ✅ Hadir: 25 (83%)                 │
│  🤒 Sakit: 2 (7%)   ← dari Izin    │
│  📋 Izin: 1 (3%)    ← dari Izin    │
│  ❌ Alpha: 2 (7%)                   │
└─────────────────────────────────────┘
```

**Database:**
- Sheet baru: "Izin"
- Kolom: Timestamp, Nama, Jenis, Tanggal, Alasan, Lampiran, Status

---

## 📁 Struktur Project V2

```
absensi-qrcode/
├── docs/
│   ├── 08_V2_FEATURES.md           ← (file ini)
│   ├── 09_V2_IMPLEMENTATION.md
│   ├── 10_V2_API.md
│   ├── 11_V2_DATABASE.md
│   └── 12_V2_USER_GUIDE.md
│
├── src/
│   ├── index.html                  ← Update: tombol riwayat, kamera
│   ├── style.css                   ← Update: style baru
│   ├── app.js                      ← Update: logic V2
│   ├── riwayat.html                ← BARU: modal riwayat
│   └── izin.html                   ← BARU: form izin
│
├── admin/
│   └── admin.html                  ← BARU: dashboard admin
│
├── scripts/
│   └── CodeV2.gs                   ← Update: logic V2
│
└── tools/
    └── qr-generator.html           ← Update: generate QR untuk riwayat & izin
```

---

## 🗓️ Timeline Implementasi

| Phase | Fitur | Estimasi |
|-------|-------|----------|
| **Phase 1** | Database & Backend setup | 1 hari |
| **Phase 2** | Foto absen + upload | 1-2 hari |
| **Phase 3** | Validasi + Auto-fix | 1 hari |
| **Phase 4** | Dashboard admin | 2 hari |
| **Phase 5** | Export data | 1 hari |
| **Phase 6** | Riwayat absensi | 1 hari |
| **Phase 7** | Form Izin + Approval | 2 hari |
| **Phase 8** | Testing & Bug fix | 2 hari |
| **Total** | | **~11-13 hari** |

---

## 🎯 Keputusan yang Diperlukan

Sebelum implementasi dimulai, beberapa keputusan perlu ditentukan:

### 1. Penyimpanan Foto

| Pilihan | Vote | Notes |
|---------|------|-------|
| ImgBB | ⬜ | Paling simpel, public URL |
| Firebase | ⬜ | Balance simpel & private |
| Google Drive | ⬜ | Private, OAuth agak kompleks |

### 2. Tipe Lembur

| Pilihan | Vote | Notes |
|---------|------|-------|
| A. 2x MASUK/PULANG biasa | ⬜ | Simpel, bedakan dari jam |
| B. Tipe baru LEMBUR | ⬜ | Lebih kompleks |

---

## 📚 Related Documents

- [09_V2_IMPLEMENTATION.md](./09_V2_IMPLEMENTATION.md) - Panduan implementasi teknis
- [10_V2_API.md](./10_V2_API.md) - Dokumentasi API V2
- [11_V2_DATABASE.md](./11_V2_DATABASE.md) - Skema database V2
- [12_V2_USER_GUIDE.md](./12_V2_USER_GUIDE.md) - Panduan pengguna

---

**Version:** 2.0
**Last Updated:** 3 Februari 2026
**Status:** DRAFT - Menunggu keputusan final
