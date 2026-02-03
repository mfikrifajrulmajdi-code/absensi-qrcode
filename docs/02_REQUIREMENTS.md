# 📋 Requirements

## Functional Requirements

### FR-01: QR Code Scanning
| ID | Requirement |
|----|-------------|
| FR-01.1 | Sistem harus dapat dibuka melalui scan QR Code |
| FR-01.2 | QR Code berisi URL dengan parameter nama karyawan |
| FR-01.3 | QR Code dapat berisi informasi meja (opsional) |

### FR-02: Tampilan Halaman Absensi
| ID | Requirement |
|----|-------------|
| FR-02.1 | Halaman harus menampilkan nama karyawan dari URL parameter |
| FR-02.2 | Halaman harus menampilkan lokasi GPS (latitude, longitude) |
| FR-02.3 | Halaman harus menampilkan waktu realtime |
| FR-02.4 | Halaman harus memiliki tombol MASUK dan PULANG |

### FR-03: Pengiriman Data
| ID | Requirement |
|----|-------------|
| FR-03.1 | Saat tombol diklik, data harus dikirim ke Google Sheets |
| FR-03.2 | Data yang dikirim: timestamp, nama, meja, tipe (masuk/pulang), lat, long |
| FR-03.3 | Sistem harus menampilkan konfirmasi setelah data berhasil dikirim |
| FR-03.4 | Sistem harus menampilkan error jika pengiriman gagal |

### FR-04: Penyimpanan Data
| ID | Requirement |
|----|-------------|
| FR-04.1 | Data absensi disimpan di Google Sheets |
| FR-04.2 | Setiap record memiliki timestamp unik |
| FR-04.3 | Data dapat dilihat/diexport dari Google Sheets |

---

## Non-Functional Requirements

### NFR-01: Usability
| ID | Requirement |
|----|-------------|
| NFR-01.1 | Tidak memerlukan instalasi aplikasi |
| NFR-01.2 | Tidak memerlukan login/registrasi |
| NFR-01.3 | Proses absensi maksimal 2 tap (scan + pilih masuk/pulang) |
| NFR-01.4 | Tampilan responsif untuk mobile device |

### NFR-02: Performance
| ID | Requirement |
|----|-------------|
| NFR-02.1 | Halaman harus load dalam < 3 detik |
| NFR-02.2 | Pengiriman data ke Sheets < 5 detik |

### NFR-03: Compatibility
| ID | Requirement |
|----|-------------|
| NFR-03.1 | Berjalan di browser modern (Chrome, Safari, Firefox) |
| NFR-03.2 | Mendukung Android dan iOS |

### NFR-04: Cost
| ID | Requirement |
|----|-------------|
| NFR-04.1 | Semua komponen harus gratis (no paid services) |

---

## Data Requirements

### Struktur Data Absensi

| Field | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `timestamp` | DateTime | Waktu absensi | 2026-02-03 09:00:00 |
| `nama` | String | Nama karyawan | Budi Santoso |
| `meja` | String | ID meja (opsional) | A01 |
| `tipe` | Enum | MASUK atau PULANG | MASUK |
| `latitude` | Float | Koordinat GPS lat | -6.1234 |
| `longitude` | Float | Koordinat GPS long | 106.5678 |

---

## Constraints

1. **Browser Limitation**: Geolocation API memerlukan HTTPS di production (localhost OK untuk testing)
2. **Google Quota**: Google Apps Script gratis dengan limit 20.000 request/hari
3. **GPS Accuracy**: Akurasi GPS tergantung pada perangkat pengguna
