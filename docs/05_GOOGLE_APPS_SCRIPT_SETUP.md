# ⚙️ Google Apps Script Setup Guide

## Overview

Panduan langkah demi langkah untuk setup Google Sheets dan Google Apps Script sebagai backend sistem absensi.

> [!TIP]
> Setup ini hanya perlu dilakukan **SEKALI**. Setelah selesai, sistem akan berjalan otomatis.

---

## Step 1: Buat Google Sheets Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **Blank** untuk buat spreadsheet baru
3. Rename spreadsheet menjadi: `Data Absensi`
4. Rename Sheet1 menjadi: `Absensi`
5. Buat header di baris pertama:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Timestamp | Nama | Meja | Tipe | Latitude | Longitude |

6. **Format kolom A** sebagai DateTime:
   - Select kolom A
   - Format → Number → Date time

---

## Step 2: Buka Apps Script Editor

1. Di Google Sheets, klik menu **Extensions**
2. Pilih **Apps Script**
3. Editor akan terbuka di tab baru
4. Hapus semua kode default di `Code.gs`

---

## Step 3: Copy Paste Kode Apps Script

Copy kode di bawah ini dan paste ke editor:

```javascript
// ============================================
// SISTEM ABSENSI QR CODE - Google Apps Script
// ============================================

// Fungsi untuk handle POST request dari web
function doPost(e) {
  try {
    // Parse JSON data dari request
    var data = JSON.parse(e.postData.contents);
    
    // Buka spreadsheet aktif
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
    
    // Jika sheet tidak ditemukan, buat baru
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Absensi");
      sheet.appendRow(["Timestamp", "Nama", "Meja", "Tipe", "Latitude", "Longitude"]);
    }
    
    // Buat timestamp
    var timestamp = new Date();
    var formattedTimestamp = Utilities.formatDate(timestamp, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    
    // Tambah data ke sheet
    sheet.appendRow([
      formattedTimestamp,
      data.nama || "",
      data.meja || "",
      data.tipe || "",
      data.latitude || "",
      data.longitude || ""
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Absensi berhasil dicatat",
        timestamp: formattedTimestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk handle GET request (untuk testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "Sistem Absensi QR Code aktif"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk testing manual
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        nama: "Test User",
        meja: "A01",
        tipe: "MASUK",
        latitude: -6.1234,
        longitude: 106.5678
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

---

## Step 4: Deploy sebagai Web App

1. Klik tombol **Deploy** (pojok kanan atas)
2. Pilih **New deployment**
3. Klik ikon ⚙️ (gear) di sebelah "Select type"
4. Pilih **Web app**
5. Isi konfigurasi:

| Setting | Value |
|---------|-------|
| Description | Absensi QR Code v1 |
| Execute as | **Me** |
| Who has access | **Anyone** |

6. Klik **Deploy**
7. Klik **Authorize access** jika diminta
8. Pilih akun Google Anda
9. Klik **Advanced** → **Go to [project name] (unsafe)**
10. Klik **Allow**

---

## Step 5: Copy URL Web App

Setelah deploy berhasil, akan muncul URL seperti ini:

```
https://script.google.com/macros/s/AKfycbw.../exec
```

> [!IMPORTANT]
> **SIMPAN URL INI!** URL ini akan digunakan di file `app.js`

---

## Step 6: Test Endpoint

### Test via Browser
Buka URL Web App di browser, harusnya muncul:
```json
{
  "status": "ok",
  "message": "Sistem Absensi QR Code aktif"
}
```

### Test via Apps Script
1. Di editor, pilih fungsi `testDoPost` dari dropdown
2. Klik **Run**
3. Cek Google Sheets, seharusnya ada 1 row data test

---

## Troubleshooting

### Error: "Authorization required"
- Pastikan sudah klik **Authorize access** saat deploy
- Jika stuck, hapus deployment dan buat baru

### Error: "Script function not found"
- Pastikan nama fungsi `doPost` dan `doGet` benar (case-sensitive)

### Data tidak masuk ke Sheets
- Pastikan nama sheet adalah `Absensi` (persis)
- Cek Execution Log di Apps Script (View → Executions)

### Update Deployment
Jika ada perubahan kode:
1. Deploy → **Manage deployments**
2. Klik ✏️ (edit) pada deployment
3. Pilih **New version**
4. Klik **Deploy**

---

## Hasil Akhir

Setelah setup selesai:

| Komponen | Status |
|----------|--------|
| Google Sheets | ✅ Ready dengan struktur tabel |
| Apps Script | ✅ Deployed sebagai Web App |
| Endpoint URL | ✅ Siap menerima data |
