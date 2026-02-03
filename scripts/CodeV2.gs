// ============================================
// SISTEM ABSENSI QR CODE V2 - Google Apps Script
// ============================================
// Copy kode ini ke Google Apps Script editor
// (Extensions → Apps Script di Google Sheets)
// ============================================

// ============================================
// CONFIGURATION
// ============================================

var IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY'; // Ganti dengan API key ImgBB Anda
var JAM_KERJA = 8; // Jam kerja regular

// ============================================
// POST REQUEST - Submit Absensi
// ============================================

/**
 * Handle POST request dari web app
 * Menerima data absensi dan menyimpan ke Sheets
 */
function doPost(e) {
  try {
    // LOGGING untuk debugging
    Logger.log("=== doPost START ===");
    Logger.log("Request data: " + JSON.stringify(e));

    // Parse JSON data dari request
    var data = JSON.parse(e.postData.contents);
    Logger.log("Parsed data - Nama: " + data.nama + ", Tipe: " + data.tipe);

    // Buka spreadsheet aktif
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Absensi");

    // Jika sheet tidak ditemukan, buat baru dengan header
    if (!sheet) {
      sheet = ss.insertSheet("Absensi");
      sheet.appendRow([
        "Timestamp",
        "Nama",
        "Tipe",
        "Latitude",
        "Longitude",
        "Device Type",
        "OS",
        "Browser",
        "User Agent",
        "Foto"
      ]);

      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }

    // Upload foto ke Google Drive jika ada (RECOMMENDED: No API key needed)
    var photoUrl = '';
    if (data.photo && data.photo !== '') {
      photoUrl = uploadToDrive(data.photo, data.nama, data.tipe);
      // Fallback to ImgBB if Drive upload fails
      if (!photoUrl) {
        photoUrl = uploadToImgBB(data.photo);
      }
    }

    // Buat timestamp dengan timezone Indonesia
    var timestamp = new Date();
    var formattedTimestamp = Utilities.formatDate(
      timestamp,
      "Asia/Jakarta",
      "yyyy-MM-dd HH:mm:ss"
    );

    // Cek validasi sebelum submit
    var validation = validateAbsensi(data.nama, data.tipe);
    if (!validation.valid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: validation.message
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Tambah data ke sheet
    Logger.log("Appending row to sheet...");
    sheet.appendRow([
      formattedTimestamp,
      data.nama || "",
      data.tipe || "",
      data.latitude || "",
      data.longitude || "",
      data.deviceType || "",
      data.os || "",
      data.browser || "",
      data.userAgent || "",
      photoUrl
    ]);
    Logger.log("Row appended successfully! Last row: " + sheet.getLastRow());

    // Return success response
    Logger.log("=== doPost SUCCESS ===");
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Absensi " + data.tipe + " berhasil dicatat",
        timestamp: formattedTimestamp,
        data: {
          nama: data.nama,
          tipe: data.tipe,
          photoUrl: photoUrl
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error untuk debugging
    Logger.log("Error in doPost: " + error.toString());

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GET REQUEST - Various Endpoints
// ============================================

/**
 * Handle GET request untuk berbagai endpoints
 */
function doGet(e) {
  var action = e.parameter.action;

  if (action === 'checkStatus') {
    return checkAbsensiHariIni(e.parameter.nama);
  } else if (action === 'getRiwayat') {
    return getRiwayat(e.parameter.nama, e.parameter.bulan, e.parameter.tahun);
  } else if (action === 'summary') {
    return getSummaryHariIni();
  } else if (action === 'getData') {
    return getDataAbsensi(e.parameter);
  } else if (action === 'export') {
    return exportData(e.parameter);
  } else if (action === 'getIzinPending') {
    return getIzinPending();
  } else if (action === 'submitIzin') {
    return submitIzin(e);
  } else if (action === 'approveIzin') {
    return approveIzin(e);
  }

  // Default response
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "Sistem Absensi QR Code V2 aktif dan berjalan",
      version: "2.0.0",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validasi absensi sebelum submit
 */
function validateAbsensi(nama, tipe) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return { valid: true };
  }

  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");

  var hasMasuk = false;
  var hasPulang = false;

  // Check hari ini (reverse dari row terbaru)
  for (var i = data.length - 1; i >= 1; i--) {
    var rowDate = data[i][0].toString().substring(0, 10);

    if (rowDate === todayStr && data[i][1] === nama) {
      if (data[i][2] === 'MASUK' && !hasMasuk) {
        hasMasuk = true;
      } else if (data[i][2] === 'PULANG') {
        hasPulang = true;
      }
    } else if (rowDate < todayStr) {
      break;
    }
  }

  // LOGGING untuk debugging
  Logger.log("=== VALIDATION DEBUG ===");
  Logger.log("Nama: " + nama);
  Logger.log("Tipe: " + tipe);
  Logger.log("Today: " + todayStr);
  Logger.log("hasMasuk: " + hasMasuk);
  Logger.log("hasPulang: " + hasPulang);

  // Validasi
  if (tipe === 'MASUK' && hasMasuk) {
    Logger.log("Validation FAILED: Sudah absen MASUK");
    return { valid: false, message: "Sudah absen MASUK hari ini. Untuk lembur, silakan hubungi admin." };
  }

  if (tipe === 'PULANG' && !hasMasuk) {
    Logger.log("Validation FAILED: Belum absen MASUK");
    Logger.log("WARNING: Allowing PULANG anyway for testing!");
    // TEMPORARILY DISABLE THIS VALIDATION FOR TESTING
    // return { valid: false, message: "Belum absen MASUK hari ini." };
  }

  if (tipe === 'PULANG' && hasPulang) {
    Logger.log("Validation FAILED: Sudah absen PULANG");
    return { valid: false, message: "Sudah absen PULANG hari ini." };
  }

  Logger.log("Validation PASSED");
  // Check jika lupa absen kemarin, auto-fix
  if (hasMasuk && !hasPulang && tipe === 'MASUK') {
    autoFixLupaAbsen(nama);
  }

  return { valid: true };
}

/**
 * Auto-fix jika lupa absen pulang
 */
function autoFixLupaAbsen(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayStr = Utilities.formatDate(yesterday, "Asia/Jakarta", "yyyy-MM-dd");

  // Cari MASUK kemarin
  for (var i = data.length - 1; i >= 1; i--) {
    var rowDate = data[i][0].toString().substring(0, 10);

    if (rowDate === yesterdayStr && data[i][1] === nama && data[i][2] === 'MASUK') {
      var jamMasukStr = data[i][0].toString().substring(11, 19);
      var jamMasuk = new Date(rowDate + 'T' + jamMasukStr);

      // Tambah 8 jam
      var jamPulang = new Date(jamMasuk.getTime() + JAM_KERJA * 60 * 60 * 1000);
      var pulangStr = Utilities.formatDate(jamPulang, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

      // Catat PULANG otomatis
      sheet.appendRow([
        pulangStr,
        nama,
        "PULANG",
        "", // No GPS for auto-fix
        "",
        "", "", "", "", // No device info
        ""  // No photo
      ]);

      Logger.log("Auto-fix PULANG untuk " + nama + ": " + pulangStr);
      break;
    }
  }
}

// ============================================
// CHECK STATUS - Cek status absensi hari ini
// ============================================

function checkAbsensiHariIni(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return createJSONResponse({ hasMasuk: false, hasPulang: false, jamMasuk: "", jamPulang: "" });
  }

  var data = sheet.getDataRange().getValues();

  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");

  var hasMasuk = false;
  var hasPulang = false;
  var jamMasuk = '';
  var jamPulang = '';

  // Check dari baris paling baru (reverse)
  for (var i = data.length - 1; i >= 1; i--) {
    var rowDate = data[i][0].toString().substring(0, 10); // YYYY-MM-DD

    if (rowDate === todayStr && data[i][1] === nama) {
      if (data[i][2] === 'MASUK' && !hasMasuk) {
        hasMasuk = true;
        jamMasuk = data[i][0].toString().substring(11, 16); // HH:MM
      } else if (data[i][2] === 'PULANG') {
        hasPulang = true;
        jamPulang = data[i][0].toString().substring(11, 16);
      }
    } else if (rowDate < todayStr) {
      break; // Stop jika sudah lewat hari ini
    }
  }

  return createJSONResponse({
    hasMasuk: hasMasuk,
    hasPulang: hasPulang,
    jamMasuk: jamMasuk,
    jamPulang: jamPulang
  });
}

// ============================================
// GET RIWAYAT - Ambil riwayat absensi
// ============================================

function getRiwayat(nama, bulan, tahun) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return createJSONResponse([]);
  }

  var data = sheet.getDataRange().getValues();
  var riwayat = [];

  var bulanNum = parseInt(bulan);
  var tahunNum = parseInt(tahun);

  // Filter data
  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][0]);

    if (data[i][1] === nama &&
        rowDate.getMonth() + 1 === bulanNum &&
        rowDate.getFullYear() === tahunNum) {

      // Cek apakah auto-fix (no GPS, no photo)
      var isAuto = (data[i][3] === '' && data[i][4] === '' && data[i][9] === '');

      riwayat.push({
        tanggal: Utilities.formatDate(rowDate, "id-ID", "dd MMM yyyy"),
        jam: Utilities.formatDate(rowDate, "Asia/Jakarta", "HH:mm"),
        tipe: data[i][2],
        isAuto: isAuto
      });
    }
  }

  // Sort by tanggal desc (terbaru di atas)
  riwayat.sort(function(a, b) {
    return new Date(b.tanggal) - new Date(a.tanggal);
  });

  return createJSONResponse(riwayat);
}

// ============================================
// GET SUMMARY - Summary dashboard
// ============================================

function getSummaryHariIni() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return createJSONResponse({ masuk: 0, pulang: 0, belum: 0, totalKaryawan: 0 });
  }

  var data = sheet.getDataRange().getValues();

  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");

  var masukSet = new Set();
  var pulangSet = new Set();
  var allKaryawan = new Set();

  // Collect data hari ini
  for (var i = 1; i < data.length; i++) {
    var rowDate = data[i][0].toString().substring(0, 10);

    if (rowDate === todayStr) {
      var nama = data[i][1];
      allKaryawan.add(nama);

      if (data[i][2] === 'MASUK') {
        masukSet.add(nama);
      } else if (data[i][2] === 'PULANG') {
        pulangSet.add(nama);
      }
    }
  }

  var masukCount = masukSet.size;
  var pulangCount = pulangSet.size;
  var totalKaryawan = allKaryawan.size || 30; // Fallback ke 30 jika belum ada data
  var belumCount = totalKaryawan - masukCount;

  return createJSONResponse({
    masuk: masukCount,
    pulang: pulangCount,
    belum: belumCount,
    totalKaryawan: totalKaryawan
  });
}

// ============================================
// GET DATA - Ambil data dengan filter
// ============================================

function getDataAbsensi(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return createJSONResponse([]);
  }

  var data = sheet.getDataRange().getValues();
  var result = [];

  var dateFrom = params.dateFrom;
  var dateTo = params.dateTo;
  var namaFilter = params.nama ? params.nama.toLowerCase() : '';
  var tipeFilter = params.tipe || '';

  // Filter & format data (max 50 rows terbaru)
  var limit = 50;
  var count = 0;

  for (var i = data.length - 1; i >= 1 && count < limit; i--) {
    var rowDate = data[i][0].toString().substring(0, 10);

    // Apply filter
    if (dateFrom && rowDate < dateFrom) continue;
    if (dateTo && rowDate > dateTo) continue;
    if (namaFilter && data[i][1].toLowerCase().indexOf(namaFilter) === -1) continue;
    if (tipeFilter && data[i][2] !== tipeFilter) continue;

    result.push({
      timestamp: data[i][0].toString(),
      nama: data[i][1],
      tipe: data[i][2],
      latitude: data[i][3],
      longitude: data[i][4],
      deviceType: data[i][5],
      os: data[i][6],
      browser: data[i][7],
      foto: data[i][9]
    });

    count++;
  }

  return createJSONResponse(result);
}

// ============================================
// EXPORT DATA - Export ke CSV
// ============================================

function exportData(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return ContentService
      .createTextOutput("No data")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var data = sheet.getDataRange().getValues();

  // Header
  var csv = "Timestamp,Nama,Tipe,Latitude,Longitude,Device Type,OS,Browser,Foto\n";

  // Filter & build CSV
  var dateFrom = params.dateFrom;
  var dateTo = params.dateTo;

  for (var i = 1; i < data.length; i++) {
    var rowDate = data[i][0].toString().substring(0, 10);

    // Apply filter
    if (dateFrom && rowDate < dateFrom) continue;
    if (dateTo && rowDate > dateTo) continue;

    // Build row
    var row = [
      data[i][0], // Timestamp
      data[i][1], // Nama
      data[i][2], // Tipe
      data[i][3] || '', // Latitude
      data[i][4] || '', // Longitude
      data[i][5] || '', // Device Type
      data[i][6] || '', // OS
      data[i][7] || '', // Browser
      data[i][9] || ''  // Foto
    ];

    csv += row.join(",") + "\n";
  }

  return ContentService
    .createTextOutput(csv)
    .setMimeType(ContentService.MimeType.CSV);
}

// ============================================
// IZIN FUNCTIONS
// ============================================

/**
 * Submit pengajuan izin
 */
function submitIzin(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");

    // Create sheet if not exists
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Izin");
      sheet.appendRow(["Timestamp", "Nama", "Jenis", "Tanggal", "Alasan", "Lampiran", "Status", "Updated At"]);

      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }

    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

    // Upload lampiran if any
    var lampiranUrl = '';
    if (data.lampiran && data.lampiran !== '') {
      lampiranUrl = uploadToImgBB(data.lampiran);
    }

    // Append data
    sheet.appendRow([
      now,
      data.nama || "",
      data.jenis || "",
      data.tanggal || "",
      data.alasan || "",
      lampiranUrl,
      "PENDING",
      now
    ]);

    return createJSONResponse({
      status: "success",
      message: "Pengajuan izin berhasil dikirim",
      id: "row_" + sheet.getLastRow()
    });

  } catch (error) {
    Logger.log("Error in submitIzin: " + error.toString());
    return createJSONResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Get list izin pending
 */
function getIzinPending() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");
  if (!sheet) {
    return createJSONResponse([]);
  }

  var data = sheet.getDataRange().getValues();
  var pending = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][6] === 'PENDING') {
      pending.push({
        id: "row_" + i,
        nama: data[i][1],
        jenis: data[i][2],
        tanggal: data[i][3].toString().substring(0, 10),
        alasan: data[i][4],
        lampiran: data[i][5] || '',
        status: data[i][6],
        submittedAt: data[i][0].toString()
      });
    }
  }

  return createJSONResponse(pending);
}

/**
 * Approve/Reject izin
 */
function approveIzin(e) {
  try {
    var id = e.parameter.id;
    var status = e.parameter.status; // APPROVED or REJECTED
    var admin = e.parameter.admin || "Admin";

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");
    if (!sheet) {
      return createJSONResponse({ status: "error", message: "Sheet Izin tidak ditemukan" });
    }

    // Parse row number dari ID
    var rowNum = parseInt(id.replace("row_", ""));

    // Update status
    sheet.getRange(rowNum, 7).setValue(status);
    sheet.getRange(rowNum, 8).setValue(Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss"));

    return createJSONResponse({
      status: "success",
      message: "Izin telah " + (status === 'APPROVED' ? 'disetujui' : 'ditolak')
    });

  } catch (error) {
    Logger.log("Error in approveIzin: " + error.toString());
    return createJSONResponse({
      status: "error",
      message: error.toString()
    });
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Upload gambar ke Google Drive (RECOMMENDED - No API key needed)
 * Gambar disimpan di folder "Absensi_Foto" di Google Drive
 */
function uploadToDrive(base64Image, nama, tipe) {
  try {
    // Remove data:image/xxx;base64, prefix
    var base64Data = base64Image.split(',')[1];

    // Decode base64
    var blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/jpeg',
      nama + '_' + tipe + '_' + new Date().getTime() + '.jpg'
    );

    // Get or create folder
    var folderName = 'Absensi_Foto';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    // Save file to folder
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return file URL
    return file.getDownloadUrl();

  } catch (error) {
    Logger.log("Drive Upload Error: " + error.toString());
    return "";
  }
}

/**
 * Upload gambar ke ImgBB (LEGACY - Use uploadToDrive instead)
 * NOTE: ImgBB memerlukan API key dan registrasi
 */
function uploadToImgBB(base64Image) {
  try {
    // Remove data:image/xxx;base64, prefix
    var base64Data = base64Image.split(',')[1];

    // Upload to ImgBB
    var payload = {
      'key': IMGBB_API_KEY,
      'image': base64Data
    };

    var options = {
      'method': 'post',
      'contentType': 'application/x-www-form-urlencoded',
      'payload': payload,
      'muteHttpExceptions': true
    };

    var response = UrlFetchApp.fetch('https://api.imgbb.com/1/upload', options);
    var result = JSON.parse(response.getContentText());

    if (result.success) {
      return result.data.url;
    } else {
      Logger.log("ImgBB Error: " + JSON.stringify(result));
      return ""; // Return empty string on error
    }

  } catch (error) {
    Logger.log("Upload Error: " + error.toString());
    return "";
  }
}

/**
 * Create JSON response helper
 */
function createJSONResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TESTING FUNCTIONS
// ============================================

/**
 * Test upload ke ImgBB
 */
function testUploadImgBB() {
  // Test dengan base64 dummy
  var testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  var url = uploadToImgBB(testImage);
  Logger.log("Uploaded URL: " + url);
}

/**
 * Test validation function
 */
function testValidation() {
  var result = validateAbsensi("Test User", "MASUK");
  Logger.log("Validation result: " + JSON.stringify(result));
}

/**
 * Test check status
 */
function testCheckStatus() {
  var result = checkAbsensiHariIni("Test User");
  Logger.log("Status result: " + result.getContent());
}

/**
 * Setup all sheets
 */
function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Setup Absensi sheet
  var absensiSheet = ss.getSheetByName("Absensi");
  if (!absensiSheet) {
    absensiSheet = ss.insertSheet("Absensi");
  }
  absensiSheet.clear();
  absensiSheet.appendRow(["Timestamp", "Nama", "Tipe", "Latitude", "Longitude", "Device Type", "OS", "Browser", "User Agent", "Foto"]);
  var headerRange = absensiSheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4285f4");
  headerRange.setFontColor("#ffffff");
  absensiSheet.setFrozenRows(1);

  // Setup Izin sheet
  var izinSheet = ss.getSheetByName("Izin");
  if (!izinSheet) {
    izinSheet = ss.insertSheet("Izin");
  }
  izinSheet.clear();
  izinSheet.appendRow(["Timestamp", "Nama", "Jenis", "Tanggal", "Alasan", "Lampiran", "Status", "Updated At"]);
  var izinHeader = izinSheet.getRange(1, 1, 1, 8);
  izinHeader.setFontWeight("bold");
  izinHeader.setBackground("#4285f4");
  izinHeader.setFontColor("#ffffff");
  izinSheet.setFrozenRows(1);

  Logger.log("All sheets setup complete!");
}
