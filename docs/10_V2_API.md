# 🔌 V2 API Documentation

## Overview

Dokumentasi lengkap API Sistem Absensi QR Code V2. API dibangun menggunakan Google Apps Script.

---

## Base URL

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Ganti `YOUR_SCRIPT_ID` dengan script ID dari deployment Google Apps Script Anda.

---

## Authentication

V2 tidak menggunakan autentikasi (security through obscurity).
> **Note:** V3 akan menambahkan autentikasi berbasis token/API key.

---

## API Endpoints

### 1. GET Request - Endpoints

#### 1.1 Check Status Absensi

Cek status absensi karyawan hari ini.

**Endpoint:**
```
GET /?action=checkStatus&nama={NAMA}
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| action | string | Yes | Nilai: `checkStatus` |
| nama | string | Yes | Nama karyawan (URL encoded) |

**Response:**
```json
{
    "hasMasuk": true,
    "hasPulang": false,
    "jamMasuk": "08:15",
    "jamPulang": ""
}
```

**Field Response:**

| Field | Type | Deskripsi |
|-------|------|-----------|
| hasMasuk | boolean | Sudah absen MASUK hari ini |
| hasPulang | boolean | Sudah absen PULANG hari ini |
| jamMasuk | string | Jam MASUK (format HH:MM) |
| jamPulang | string | Jam PULANG (format HH:MM) |

**Example:**
```javascript
fetch(`https://script.google.com/.../exec?action=checkStatus&nama=Budi%20Santoso`)
    .then(res => res.json())
    .then(data => console.log(data));
```

---

#### 1.2 Get Riwayat Absensi

Ambil riwayat absensi karyawan berdasarkan bulan & tahun.

**Endpoint:**
```
GET /?action=getRiwayat&nama={NAMA}&bulan={BULAN}&tahun={TAHUN}
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| action | string | Yes | Nilai: `getRiwayat` |
| nama | string | Yes | Nama karyawan (URL encoded) |
| bulan | number | Yes | Bulan (1-12) |
| tahun | number | Yes | Tahun (mis: 2026) |

**Response:**
```json
[
    {
        "tanggal": "03 Feb 2026",
        "jam": "08:15",
        "tipe": "MASUK",
        "isAuto": false
    },
    {
        "tanggal": "03 Feb 2026",
        "jam": "17:00",
        "tipe": "PULANG",
        "isAuto": false
    },
    {
        "tanggal": "02 Feb 2026",
        "jam": "16:00",
        "tipe": "PULANG",
        "isAuto": true
    }
]
```

**Field Response:**

| Field | Type | Deskripsi |
|-------|------|-----------|
| tanggal | string | Tanggal (format: DD MMM YYYY) |
| jam | string | Jam (format: HH:MM) |
| tipe | string | `MASUK` atau `PULANG` |
| isAuto | boolean | true jika auto-fix (lupa absen) |

**Example:**
```javascript
fetch(`https://script.google.com/.../exec?action=getRiwayat&nama=Budi%20Santoso&bulan=2&tahun=2026`)
    .then(res => res.json())
    .then(data => console.log(data));
```

---

#### 1.3 Get Summary Hari Ini

Ambil summary absensi untuk dashboard admin.

**Endpoint:**
```
GET /?action=summary
```

**Response:**
```json
{
    "masuk": 25,
    "pulang": 20,
    "belum": 5,
    "totalKaryawan": 30
}
```

**Field Response:**

| Field | Type | Deskripsi |
|-------|------|-----------|
| masuk | number | Total absensi MASUK hari ini |
| pulang | number | Total absensi PULANG hari ini |
| belum | number | Total karyawan belum absen |
| totalKaryawan | number | Total karyawan terdaftar |

---

#### 1.4 Get Data Absensi (Filter)

Ambil data absensi dengan filter untuk dashboard.

**Endpoint:**
```
GET /?action=getData&dateFrom={DATE}&dateTo={DATE}&nama={NAMA}&tipe={TIPE}
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| action | string | Yes | Nilai: `getData` |
| dateFrom | string | No | Tanggal awal (YYYY-MM-DD) |
| dateTo | string | No | Tanggal akhir (YYYY-MM-DD) |
| nama | string | No | Filter nama karyawan |
| tipe | string | No | Filter tipe: `MASUK` / `PULANG` |

**Response:**
```json
[
    {
        "timestamp": "2026-02-03 08:15:22",
        "nama": "Budi Santoso",
        "tipe": "MASUK",
        "latitude": -6.123456,
        "longitude": 106.765432,
        "deviceType": "Mobile",
        "os": "Android",
        "browser": "Chrome",
        "foto": "https://i.ibb.co/xxx/foto.jpg"
    }
]
```

---

#### 1.5 Export Data

Export data absensi ke format CSV/Excel.

**Endpoint:**
```
GET /?action=export&dateFrom={DATE}&dateTo={DATE}&format={FORMAT}
```

**Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| action | string | Yes | Nilai: `export` |
| dateFrom | string | No | Tanggal awal (YYYY-MM-DD) |
| dateTo | string | No | Tanggal akhir (YYYY-MM-DD) |
| format | string | No | Format: `csv` / `xlsx` (default: csv) |

**Response:**
```
Timestamp,Nama,Tipe,Latitude,Longitude,Device,OS,Browser,Foto
2026-02-03 08:15:22,Budi Santoso,MASUK,-6.123456,106.765432,Mobile,Android,Chrome,https://...
2026-02-03 17:00:45,Budi Santoso,PULANG,-6.123456,106.765432,Mobile,Android,Chrome,https://...
```

---

#### 1.6 Get Izin Pending

Ambil list pengajuan izin yang statusnya PENDING.

**Endpoint:**
```
GET /?action=getIzinPending
```

**Response:**
```json
[
    {
        "id": "row_123",
        "nama": "Budi Santoso",
        "jenis": "Sakit",
        "tanggal": "2026-02-03",
        "alasan": "Demam tinggi",
        "lampiran": "https://...",
        "status": "PENDING",
        "submittedAt": "2026-02-03 07:30:00"
    }
]
```

---

### 2. POST Request - Endpoints

#### 2.1 Submit Absensi

Kirim data absensi (MASUK/PULANG) dengan foto dan device info.

**Endpoint:**
```
POST /
Content-Type: application/json
```

**Request Body:**
```json
{
    "nama": "Budi Santoso",
    "tipe": "MASUK",
    "latitude": -6.123456,
    "longitude": 106.765432,
    "deviceType": "Mobile",
    "os": "Android",
    "browser": "Chrome",
    "userAgent": "Mozilla/5.0...",
    "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Request Parameters:**

| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| nama | string | Yes | Nama karyawan |
| tipe | string | Yes | `MASUK` atau `PULANG` |
| latitude | number | No | Koordinat latitude |
| longitude | number | No | Koordinat longitude |
| deviceType | string | Yes | `Mobile` / `Tablet` / `Desktop` |
| os | string | Yes | `Android` / `iOS` / `Windows` / dll |
| browser | string | Yes | `Chrome` / `Safari` / dll |
| userAgent | string | Yes | Full user agent string |
| photo | string | Yes | Base64 image data |

**Response:**
```json
{
    "status": "success",
    "message": "Absensi MASUK berhasil dicatat",
    "timestamp": "2026-02-03 08:15:22",
    "data": {
        "nama": "Budi Santoso",
        "tipe": "MASUK",
        "photoUrl": "https://i.ibb.co/xxx/abc123.jpg"
    }
}
```

**Error Response:**
```json
{
    "status": "error",
    "message": "Sudah absen MASUK hari ini"
}
```

**Example:**
```javascript
fetch('https://script.google.com/.../exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nama: 'Budi Santoso',
        tipe: 'MASUK',
        latitude: -6.123456,
        longitude: 106.765432,
        deviceType: 'Mobile',
        os: 'Android',
        browser: 'Chrome',
        userAgent: navigator.userAgent,
        photo: base64ImageData
    })
})
.then(() => {
    // Success (no-cors tidak bisa baca response)
    showNotification('Absensi berhasil!');
});
```

---

#### 2.2 Submit Izin

Kirim pengajuan izin/sakit/cuti.

**Endpoint:**
```
POST /?action=submitIzin
Content-Type: application/json
```

**Request Body:**
```json
{
    "nama": "Budi Santoso",
    "jenis": "Sakit",
    "tanggal": "2026-02-03",
    "alasan": "Demam tinggi",
    "lampiran": "https://i.ibb.co/xxx/surat.jpg"
}
```

**Request Parameters:**

| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| nama | string | Yes | Nama karyawan |
| jenis | string | Yes | `Sakit` / `Izin` / `Cuti` |
| tanggal | string | Yes | Tanggal izin (YYYY-MM-DD) |
| alasan | string | Yes | Alasan izin |
| lampiran | string | No | URL lampiran (foto/dokumen) |

**Response:**
```json
{
    "status": "success",
    "message": "Pengajuan izin berhasil dikirim",
    "id": "row_123"
}
```

---

#### 2.3 Approve/Reject Izin

Approve atau reject pengajuan izin.

**Endpoint:**
```
POST /?action=approveIzin
Content-Type: application/json
```

**Request Body:**
```json
{
    "id": "row_123",
    "status": "APPROVED",
    "admin": "Admin"
}
```

**Request Parameters:**

| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| id | string | Yes | Row ID izin |
| status | string | Yes | `APPROVED` atau `REJECTED` |
| admin | string | No | Nama admin |

**Response:**
```json
{
    "status": "success",
    "message": "Izin telah disetujui"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Parameter tidak valid |
| 405 | Method Not Allowed - Method HTTP salah |
| 500 | Internal Server Error - Error server |

**Error Response Format:**
```json
{
    "status": "error",
    "message": "Error description here"
}
```

---

## Rate Limiting

Tidak ada rate limiting di V2.
> **Warning:** V3 akan menambahkan rate limiting untuk mencegah spam.

---

## CORS Configuration

API menggunakan mode `no-cors` untuk request POST dari browser.

**Frontend Configuration:**
```javascript
fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',  // Required
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

---

## Testing API

### Using cURL

**Test Check Status:**
```bash
curl "https://script.google.com/macros/s/YOUR_ID/exec?action=checkStatus&nama=Budi%20Santoso"
```

**Test Submit Absensi:**
```bash
curl -X POST "https://script.google.com/macros/s/YOUR_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Santoso",
    "tipe": "MASUK",
    "latitude": -6.123456,
    "longitude": 106.765432,
    "deviceType": "Mobile",
    "os": "Android",
    "browser": "Chrome",
    "userAgent": "Test",
    "photo": "data:image/jpeg;base64,..."
  }'
```

---

## Changelog

### V2.0 (Current)
- Added photo upload endpoint
- Added validation & auto-fix logic
- Added riwayat endpoint
- Added izin & approval endpoints
- Added export endpoint

### V1.0
- Basic absensi endpoints
- Device detection

---

## Related Documents

- [08_V2_FEATURES.md](./08_V2_FEATURES.md) - Overview fitur V2
- [09_V2_IMPLEMENTATION.md](./09_V2_IMPLEMENTATION.md) - Panduan implementasi
- [11_V2_DATABASE.md](./11_V2_DATABASE.md) - Skema database

---

**Version:** 2.0
**Last Updated:** 3 Februari 2026
**Status:** DRAFT
