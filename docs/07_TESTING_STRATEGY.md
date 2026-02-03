# 🧪 Testing Strategy

## Overview

Strategi testing untuk memastikan sistem absensi berjalan dengan benar.

---

## Testing Levels

### Level 1: Unit Testing (Manual)

| Test ID | Komponen | Test Case | Expected Result |
|---------|----------|-----------|-----------------|
| UT-01 | URL Parser | Parse `?nama=Budi&meja=A01` | `{nama: "Budi", meja: "A01"}` |
| UT-02 | URL Parser | Parse URL tanpa parameter | `{nama: "Unknown", meja: "-"}` |
| UT-03 | URL Parser | Parse nama dengan spasi `Budi%20Santoso` | `{nama: "Budi Santoso"}` |
| UT-04 | Clock | Update setiap detik | Waktu berubah setiap detik |
| UT-05 | GPS | Request location | Koordinat didapat atau error message |

---

### Level 2: Integration Testing

| Test ID | Flow | Steps | Expected Result |
|---------|------|-------|-----------------|
| IT-01 | Submit MASUK | 1. Buka halaman<br>2. Izinkan GPS<br>3. Klik MASUK | Data masuk ke Sheets dengan tipe "MASUK" |
| IT-02 | Submit PULANG | 1. Buka halaman<br>2. Izinkan GPS<br>3. Klik PULANG | Data masuk ke Sheets dengan tipe "PULANG" |
| IT-03 | Submit tanpa GPS | 1. Buka halaman<br>2. Block GPS<br>3. Klik MASUK | Data masuk dengan lat/long kosong |
| IT-04 | Offline Submit | 1. Disconnect internet<br>2. Klik MASUK | Error message tampil |

---

### Level 3: End-to-End Testing

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| E2E-01 | Full Flow | 1. Generate QR Code<br>2. Scan dengan HP<br>3. Izinkan lokasi<br>4. Klik MASUK<br>5. Cek Google Sheets | Data lengkap tercatat |
| E2E-02 | Multi User | 5 user scan QR masing-masing<br>Semua klik MASUK | 5 row data tercatat dengan benar |
| E2E-03 | Masuk & Pulang | 1. User scan, klik MASUK<br>2. Beberapa jam kemudian<br>3. User scan, klik PULANG | 2 record (MASUK & PULANG) |

---

## Test Execution Guide

### Pre-requisites
- [ ] Local server running (`python -m http.server 8000`)
- [ ] Google Sheets & Apps Script setup complete
- [ ] Browser with DevTools

### Test Environment

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | `http://localhost:8000/index.html` | Development testing |
| Production | `https://yoursite.github.io/absensi/` | Final testing |

---

## Manual Test Procedure

### Test 1: Basic Page Load
```
1. Buka http://localhost:8000/index.html?nama=Test&meja=A01
2. Verify:
   ✓ Nama "Test" tampil
   ✓ Meja "A01" tampil
   ✓ Jam berjalan realtime
   ✓ Tombol MASUK dan PULANG visible
```

### Test 2: GPS Permission
```
1. Buka halaman
2. Browser akan minta izin lokasi
3. Klik "Allow"
4. Verify:
   ✓ Koordinat GPS tampil
   ✓ Format: -6.xxxx, 106.xxxx
```

### Test 3: Submit Absensi
```
1. Buka halaman dengan parameter lengkap
2. Tunggu GPS terdeteksi
3. Klik tombol MASUK
4. Verify:
   ✓ Loading indicator muncul
   ✓ Success message tampil
   ✓ Cek Google Sheets - data masuk
```

### Test 4: QR Code Generator
```
1. Buka tools/qr-generator.html
2. Input: Nama = "Budi", Meja = "A01"
3. Klik Generate
4. Verify:
   ✓ QR Code muncul
   ✓ URL di QR benar
   ✓ Scan dengan HP - halaman terbuka
```

---

## Browser Compatibility Testing

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome (Desktop) | Latest | 🟡 To Test | |
| Chrome (Android) | Latest | 🟡 To Test | Primary target |
| Safari (iOS) | Latest | 🟡 To Test | Primary target |
| Firefox | Latest | 🟡 To Test | |
| Samsung Internet | Latest | 🟡 To Test | |

---

## Error Scenarios

| Scenario | Test Steps | Expected Behavior |
|----------|------------|-------------------|
| GPS Denied | Block permission saat prompt | Tampil pesan "Lokasi tidak tersedia" |
| GPS Timeout | Test di area GPS lemah | Tampil pesan timeout |
| Network Error | Disconnect internet | Tampil error message |
| Invalid URL | Buka tanpa parameter | Nama default, sistem tetap jalan |

---

## Verification Checklist

### Before Deployment
- [ ] Semua test case PASS
- [ ] Tested di Chrome Mobile
- [ ] Tested di Safari iOS
- [ ] Google Sheets menerima data dengan benar
- [ ] Error handling bekerja

### After Deployment
- [ ] URL production bisa diakses
- [ ] HTTPS aktif (untuk GPS di production)
- [ ] QR Code mengarah ke URL yang benar
- [ ] Real device test (scan actual QR)

---

## Test Data Template

Untuk testing, gunakan data berikut:

| Nama | Meja | Test URL |
|------|------|----------|
| Test User 1 | A01 | `?nama=Test%20User%201&meja=A01` |
| Test User 2 | A02 | `?nama=Test%20User%202&meja=A02` |
| Test User 3 | B01 | `?nama=Test%20User%203&meja=B01` |
