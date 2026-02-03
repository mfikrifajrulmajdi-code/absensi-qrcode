# 📋 Sistem Absensi QR Code

## Deskripsi Project

Sistem absensi karyawan berbasis QR Code yang simpel dan gratis. Setiap karyawan memiliki QR Code unik di mejanya. Saat scan, halaman web akan menampilkan informasi karyawan dan opsi untuk melakukan absensi masuk/pulang.

## Tujuan

- Menyediakan sistem absensi yang **mudah digunakan** tanpa perlu install aplikasi
- **Gratis** menggunakan Google Sheets sebagai penyimpanan data
- **Otomatis** mencatat waktu dan lokasi GPS
- **Tanpa login** - identitas sudah tertanam di QR Code

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Scan QR Code** | Karyawan scan QR di meja untuk buka halaman absensi |
| **Auto-detect Info** | Nama dari QR, lokasi GPS, waktu otomatis |
| **Pilih Masuk/Pulang** | Satu tap untuk absen masuk atau pulang |
| **Data ke Sheets** | Semua data tersimpan di Google Sheets |

## Alur Penggunaan

```
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────┐
│  Karyawan scan  │ --> │  Halaman Web muncul  │ --> │ Tap MASUK     │
│  QR Code meja   │     │  (nama, lokasi, jam) │     │ atau PULANG   │
└─────────────────┘     └──────────────────────┘     └───────────────┘
                                                            │
                                                            v
                                                    ┌───────────────┐
                                                    │ Data masuk ke │
                                                    │ Google Sheets │
                                                    └───────────────┘
```

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐    ┌──────────────────────────────────────────┐  │
│  │  QR Code  │───>│  HTML Page (index.html)                  │  │
│  │  (URL)    │    │  - Baca parameter nama dari URL          │  │
│  └───────────┘    │  - Ambil lokasi GPS (Geolocation API)    │  │
│                   │  - Tampilkan waktu realtime              │  │
│                   │  - Tombol MASUK / PULANG                 │  │
│                   └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST (fetch)
                                    v
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER SIDE (Google)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌─────────────────────────────┐    │
│  │  Google Apps Script  │───>│  Google Sheets              │    │
│  │  (Web App endpoint)  │    │  - Sheet: Data Absensi      │    │
│  │  - Terima POST data  │    │  - Kolom: Timestamp, Nama,  │    │
│  │  - Validasi data     │    │    Meja, Tipe, Lat, Long    │    │
│  │  - Simpan ke Sheet   │    └─────────────────────────────┘    │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Keunggulan Solusi Ini

1. **Zero Installation** - Tidak perlu install aplikasi apapun
2. **Zero Login** - Tidak ada proses login/logout
3. **100% Gratis** - Menggunakan layanan gratis (GitHub Pages + Google Sheets)
4. **Cross Platform** - Jalan di semua smartphone dengan browser
5. **Real GPS Location** - Lokasi tercatat otomatis
6. **Easy Setup** - Setup cepat < 30 menit
