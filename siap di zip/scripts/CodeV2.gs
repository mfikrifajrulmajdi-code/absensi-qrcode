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
 * Menerima data absensi atau izin dan menyimpan ke Sheets
 */
function doPost(e) {
  try {
    // Parse JSON data dari request
    var data = JSON.parse(e.postData.contents);
    
    // Check if this is an izin submission
    if (data.action === 'submitIzin') {
      return handleSubmitIzin(data);
    }

    // Otherwise, process as absensi
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

    // Return success response
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
// CHECK STATUS FUNCTIONS
// ============================================

/**
 * Cek status absensi hari ini untuk karyawan tertentu
 * Digunakan oleh halaman absensi dan form izin
 */
function checkAbsensiHariIni(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return createJSONResponse({ sudahMasuk: false, sudahPulang: false });
  }

  var data = sheet.getDataRange().getValues();
  var today = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  var sudahMasuk = false;
  var sudahPulang = false;

  for (var i = 1; i < data.length; i++) {
    var rowTimestamp = data[i][0];
    var rowNama = data[i][1];
    var rowTipe = data[i][2];

    if (!rowTimestamp || !rowNama) continue;

    var rowDate = "";
    if (rowTimestamp instanceof Date) {
      rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
    } else if (typeof rowTimestamp === 'string') {
      rowDate = rowTimestamp.substring(0, 10);
    }

    if (rowDate === today && rowNama === nama) {
      if (rowTipe === 'MASUK') sudahMasuk = true;
      if (rowTipe === 'PULANG') sudahPulang = true;
    }
  }

  Logger.log("checkAbsensiHariIni: nama=" + nama + ", sudahMasuk=" + sudahMasuk + ", sudahPulang=" + sudahPulang);

  return createJSONResponse({
    sudahMasuk: sudahMasuk,
    sudahPulang: sudahPulang
  });
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validasi absensi sebelum submit
 * Support lembur: izinkan multiple MASUK/PULANG dalam sehari
 * Validasi: MASUK → PULANG → MASUK → PULANG → ...
 */
function validateAbsensi(nama, tipe) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    return { valid: true };
  }

  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");

  // Cari entry TERAKHIR hari ini untuk nama ini
  var lastEntryType = null; // null = belum ada entry, 'MASUK', atau 'PULANG'
  
  for (var i = data.length - 1; i >= 1; i--) {
    var rowTimestamp = data[i][0];
    var rowNama = data[i][1];
    var rowTipe = data[i][2];
    
    // Handle both Date object and string timestamp
    var rowDate;
    if (rowTimestamp instanceof Date) {
      rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
    } else if (typeof rowTimestamp === 'string') {
      rowDate = rowTimestamp.substring(0, 10);
    } else {
      continue;
    }
    
    if (rowDate === todayStr && rowNama === nama) {
      // Ini entry terakhir untuk hari ini (karena loop dari belakang)
      lastEntryType = rowTipe;
      break;
    } else if (rowDate < todayStr) {
      break; // Sudah lewat hari ini, tidak ada entry
    }
  }

  Logger.log("Validate - Nama: " + nama + ", Tipe: " + tipe + ", LastEntry: " + lastEntryType);

  // Validasi berdasarkan entry terakhir
  if (tipe === 'MASUK') {
    if (lastEntryType === 'MASUK') {
      // Sudah MASUK, belum PULANG
      return { valid: false, message: "Anda sudah MASUK dan belum PULANG. Silakan absen PULANG dulu." };
    }
    // lastEntryType null (belum absen) atau 'PULANG' → bisa MASUK
  }

  if (tipe === 'PULANG') {
    if (lastEntryType === null) {
      // Belum ada entry sama sekali
      return { valid: false, message: "Belum absen MASUK hari ini." };
    }
    if (lastEntryType === 'PULANG') {
      // Terakhir PULANG, belum MASUK lagi
      return { valid: false, message: "Anda sudah PULANG. Silakan absen MASUK dulu untuk sesi berikutnya." };
    }
    // lastEntryType 'MASUK' → bisa PULANG
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
// Support lembur: return status sesi terakhir
// ============================================

function checkAbsensiHariIni(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    Logger.log("Sheet 'Absensi' tidak ditemukan");
    return createJSONResponse({ hasMasuk: false, hasPulang: false, jamMasuk: "", jamPulang: "", sesiKe: 0 });
  }

  var data = sheet.getDataRange().getValues();
  Logger.log("Total rows: " + data.length);
  Logger.log("Looking for nama: " + nama);

  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");
  Logger.log("Today string: " + todayStr);

  // Kumpulkan semua entry hari ini untuk user ini
  var todayEntries = [];
  
  for (var i = data.length - 1; i >= 1; i--) {
    var rowTimestamp = data[i][0];
    var rowNama = data[i][1];
    var rowTipe = data[i][2];
    
    // Handle both Date object and string timestamp
    var rowDate;
    var rowTime;
    
    if (rowTimestamp instanceof Date) {
      rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
      rowTime = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "HH:mm");
    } else if (typeof rowTimestamp === 'string') {
      rowDate = rowTimestamp.substring(0, 10);
      var timePart = rowTimestamp.substring(11).trim();
      var timeParts = timePart.split(':');
      if (timeParts.length >= 2) {
        var hour = timeParts[0].padStart(2, '0');
        var minute = timeParts[1].padStart(2, '0');
        rowTime = hour + ':' + minute;
      } else {
        rowTime = timePart;
      }
    } else {
      continue;
    }

    if (rowDate === todayStr && rowNama === nama) {
      todayEntries.push({ tipe: rowTipe, jam: rowTime });
    } else if (rowDate < todayStr) {
      break;
    }
  }

  // Reverse untuk urutan kronologis (entry pertama = paling awal)
  todayEntries.reverse();
  
  Logger.log("Today entries: " + JSON.stringify(todayEntries));

  // Hitung sesi (1 sesi = 1 pair MASUK-PULANG)
  var sesiCount = 0;
  var lastType = null;
  var lastMasukJam = '';
  var lastPulangJam = '';
  
  for (var j = 0; j < todayEntries.length; j++) {
    var entry = todayEntries[j];
    if (entry.tipe === 'MASUK') {
      sesiCount++;
      lastMasukJam = entry.jam;
      lastPulangJam = ''; // Reset pulang untuk sesi baru
      lastType = 'MASUK';
    } else if (entry.tipe === 'PULANG') {
      lastPulangJam = entry.jam;
      lastType = 'PULANG';
    }
  }

  // Tentukan status berdasarkan entry terakhir
  var hasMasuk = (lastType === 'MASUK'); // Ada sesi aktif (belum pulang)
  var hasPulang = (lastType === 'PULANG'); // Sudah pulang (sesi selesai)
  
  // Jika belum ada entry sama sekali
  if (todayEntries.length === 0) {
    hasMasuk = false;
    hasPulang = false;
  }

  var result = {
    hasMasuk: hasMasuk,
    hasPulang: hasPulang,
    jamMasuk: lastMasukJam,
    jamPulang: lastPulangJam,
    sesiKe: sesiCount,
    totalEntry: todayEntries.length
  };
  Logger.log("Final result: " + JSON.stringify(result));
  
  return createJSONResponse(result);
}

// ============================================
// GET SUMMARY - Ringkasan absensi hari ini untuk dashboard
// ============================================

function getSummaryHariIni() {
  Logger.log("=== getSummaryHariIni START ===");
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
  if (!sheet) {
    Logger.log("Sheet Absensi tidak ditemukan!");
    return createJSONResponse({ masuk: 0, pulang: 0, belum: 0 });
  }

  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var todayStr = Utilities.formatDate(today, "Asia/Jakarta", "yyyy-MM-dd");
  
  Logger.log("Today: " + todayStr);
  Logger.log("Total rows: " + data.length);

  // Kumpulkan status per karyawan hari ini
  var karyawanStatus = {}; // { nama: { hasMasuk: bool, hasPulang: bool } }
  var debugCount = 0;

  for (var i = 1; i < data.length; i++) {
    var rowTimestamp = data[i][0];
    var rowNama = data[i][1];
    var rowTipe = data[i][2];

    // Handle both Date object and string timestamp
    var rowDate = "";
    
    if (rowTimestamp instanceof Date) {
      rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
    } else if (typeof rowTimestamp === 'string' && rowTimestamp.length >= 10) {
      rowDate = rowTimestamp.substring(0, 10);
    } else {
      // Log format tidak dikenal
      if (debugCount < 3) {
        Logger.log("Row " + i + " - Unknown timestamp format: " + typeof rowTimestamp + " = " + rowTimestamp);
        debugCount++;
      }
      continue;
    }

    // Log beberapa row untuk debug
    if (i <= 5 || rowDate === todayStr) {
      Logger.log("Row " + i + ": date=" + rowDate + ", nama=" + rowNama + ", tipe=" + rowTipe + ", match=" + (rowDate === todayStr));
    }

    if (rowDate === todayStr && rowNama) {
      if (!karyawanStatus[rowNama]) {
        karyawanStatus[rowNama] = { hasMasuk: false, hasPulang: false };
      }
      if (rowTipe === 'MASUK') {
        karyawanStatus[rowNama].hasMasuk = true;
      } else if (rowTipe === 'PULANG') {
        karyawanStatus[rowNama].hasPulang = true;
      }
    }
  }

  Logger.log("Karyawan ditemukan hari ini: " + JSON.stringify(karyawanStatus));

  // Hitung total
  var totalMasuk = 0;
  var totalPulang = 0;

  for (var nama in karyawanStatus) {
    var status = karyawanStatus[nama];
    if (status.hasMasuk) totalMasuk++;
    if (status.hasPulang) totalPulang++;
  }

  // Untuk saat ini, belum = 0 (karena user tidak butuh sheet Karyawan)
  var totalBelum = 0;

  Logger.log("Result: masuk=" + totalMasuk + ", pulang=" + totalPulang + ", belum=" + totalBelum);
  Logger.log("=== getSummaryHariIni END ===");
  
  return createJSONResponse({
    masuk: totalMasuk,
    pulang: totalPulang,
    belum: totalBelum
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
    var rowTimestamp = data[i][0];
    var rowNama = data[i][1];
    var rowDate;
    var formattedTimestamp;
    
    // Skip baris kosong (tidak ada timestamp atau nama)
    if (!rowTimestamp || !rowNama) {
      continue;
    }
    
    // Handle Date object or string
    if (rowTimestamp instanceof Date) {
      rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
      formattedTimestamp = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    } else if (typeof rowTimestamp === 'string' && rowTimestamp.length >= 10) {
      rowDate = rowTimestamp.substring(0, 10);
      formattedTimestamp = rowTimestamp;
    } else {
      continue;
    }

    // Apply filter
    if (dateFrom && rowDate < dateFrom) continue;
    if (dateTo && rowDate > dateTo) continue;
    if (namaFilter && rowNama.toString().toLowerCase().indexOf(namaFilter) === -1) continue;
    if (tipeFilter && data[i][2] !== tipeFilter) continue;

    result.push({
      timestamp: formattedTimestamp,
      nama: rowNama || '',
      tipe: data[i][2] || '',
      latitude: data[i][3] || '',
      longitude: data[i][4] || '',
      deviceType: data[i][5] || '',
      os: data[i][6] || '',
      browser: data[i][7] || '',
      foto: data[i][9] || ''
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
 * Handle submit izin - dipanggil dari doPost dengan data yang sudah di-parse
 * Kolom sheet Izin: Timestamp, Nama, Jenis, Tanggal, Alasan, Lampiran, Status, Updated At, Durasi
 */
function handleSubmitIzin(data) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");

    // Create sheet if not exists
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Izin");
      sheet.appendRow(["Timestamp", "Nama", "Jenis", "Tanggal", "Alasan", "Lampiran", "Status", "Updated At", "Durasi"]);

      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }

    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

    // ==========================================
    // VALIDASI DUPLIKAT: Cek apakah sudah ada izin untuk nama + tanggal ini
    // ==========================================
    var existingData = sheet.getDataRange().getValues();
    var targetNama = data.nama || "";
    var targetTanggal = data.tanggal || "";
    
    for (var i = 1; i < existingData.length; i++) {
      var rowNama = existingData[i][1];
      var rowTanggal = existingData[i][3];
      var rowStatus = existingData[i][6];
      
      // Format tanggal untuk perbandingan (handle Date object)
      var rowTanggalStr = "";
      if (rowTanggal instanceof Date) {
        rowTanggalStr = Utilities.formatDate(rowTanggal, "Asia/Jakarta", "yyyy-MM-dd");
      } else if (typeof rowTanggal === 'string') {
        rowTanggalStr = rowTanggal.substring(0, 10);
      }
      
      // Cek duplikat: sama nama + tanggal + status PENDING atau APPROVED
      if (rowNama === targetNama && rowTanggalStr === targetTanggal) {
        if (rowStatus === 'PENDING' || rowStatus === 'APPROVED') {
          Logger.log("Duplikat izin terdeteksi: " + targetNama + " pada " + targetTanggal);
          return createJSONResponse({
            status: "error",
            message: "Anda sudah memiliki pengajuan izin untuk tanggal " + targetTanggal + " (Status: " + rowStatus + ")"
          });
        }
      }
    }

    // Upload lampiran if any
    var lampiranUrl = '';
    if (data.lampiran && data.lampiran !== '') {
      lampiranUrl = uploadToImgBB(data.lampiran);
    }

    // Durasi: SEHARI_PENUH atau SETENGAH_HARI (default SEHARI_PENUH)
    var durasi = data.durasi || "SEHARI_PENUH";

    // Append data to Izin sheet
    sheet.appendRow([
      now,
      data.nama || "",
      data.jenis || "",
      data.tanggal || "",
      data.alasan || "",
      lampiranUrl,
      "PENDING",
      now,
      durasi
    ]);

    Logger.log("Izin submitted: " + data.nama + " - " + data.jenis + " - " + durasi);

    return createJSONResponse({
      status: "success",
      message: "Pengajuan izin berhasil dikirim",
      id: "row_" + sheet.getLastRow(),
      durasi: durasi
    });

  } catch (error) {
    Logger.log("Error in handleSubmitIzin: " + error.toString());
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
      // i+1 karena: i adalah index array (dimulai 1 untuk skip header)
      // tapi sheet row adalah 1-indexed, jadi data[1] = row 2, data[2] = row 3, dst
      var actualRow = i + 1;
      pending.push({
        id: "row_" + actualRow,
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
 * Jika approved dan karyawan sudah MASUK hari ini, auto-generate PULANG
 */
function approveIzin(e) {
  try {
    var id = e.parameter.id;
    var status = e.parameter.status; // APPROVED or REJECTED
    var admin = e.parameter.admin || "Admin";

    var izinSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");
    if (!izinSheet) {
      return createJSONResponse({ status: "error", message: "Sheet Izin tidak ditemukan" });
    }

    // Parse row number dari ID
    var rowNum = parseInt(id.replace("row_", ""));

    // Ambil data izin dari row
    var rowData = izinSheet.getRange(rowNum, 1, 1, 9).getValues()[0];
    var izinNama = rowData[1];
    var izinJenis = rowData[2];
    var izinTanggal = rowData[3];
    var izinDurasi = rowData[8] || "SEHARI_PENUH";

    // Update status di sheet Izin
    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    izinSheet.getRange(rowNum, 7).setValue(status);
    izinSheet.getRange(rowNum, 8).setValue(now);

    var autoGeneratedPulang = false;

    // Jika APPROVED, cek apakah perlu auto-generate PULANG
    if (status === 'APPROVED') {
      // Cek apakah karyawan sudah MASUK hari ini
      var absensiSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
      if (absensiSheet) {
        var today = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
        var absensiData = absensiSheet.getDataRange().getValues();
        var sudahMasuk = false;
        var sudahPulang = false;

        for (var i = 1; i < absensiData.length; i++) {
          var rowTimestamp = absensiData[i][0];
          var rowNama = absensiData[i][1];
          var rowTipe = absensiData[i][2];
          
          if (!rowTimestamp || !rowNama) continue;
          
          var rowDate = "";
          if (rowTimestamp instanceof Date) {
            rowDate = Utilities.formatDate(rowTimestamp, "Asia/Jakarta", "yyyy-MM-dd");
          } else if (typeof rowTimestamp === 'string') {
            rowDate = rowTimestamp.substring(0, 10);
          }
          
          // Track entry terakhir untuk nama ini hari ini
          if (rowDate === today && rowNama === izinNama) {
            if (rowTipe === 'MASUK' || rowTipe === 'PULANG') {
              // Entry terakhir adalah tipe ini
              sudahMasuk = (rowTipe === 'MASUK');
              sudahPulang = (rowTipe === 'PULANG');
            }
          }
        }

        // Jika entry TERAKHIR adalah MASUK (bukan PULANG), auto-generate PULANG
        // Ini handle kasus lembur: MASUK → PULANG → MASUK → (auto) PULANG
        if (sudahMasuk && !sudahPulang) {
          absensiSheet.appendRow([
            now,
            izinNama,
            "PULANG",
            "", // latitude
            "", // longitude
            "System", // deviceType
            "Auto", // os
            "Izin " + izinJenis, // browser (digunakan sebagai catatan)
            "Auto-generated from approved izin", // user agent
            "" // foto
          ]);
          autoGeneratedPulang = true;
          Logger.log("Auto-generated PULANG for: " + izinNama + " (Izin " + izinJenis + ")");
        }
      }
    }

    var message = "Izin telah " + (status === 'APPROVED' ? 'disetujui' : 'ditolak');
    if (autoGeneratedPulang) {
      message += ". Absen PULANG otomatis tercatat.";
    }

    return createJSONResponse({
      status: "success",
      message: message,
      autoGeneratedPulang: autoGeneratedPulang
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

    // Format waktu untuk nama file: 2026-02-04_04-49-30
    var timestamp = new Date();
    var waktuStr = Utilities.formatDate(timestamp, "Asia/Jakarta", "yyyy-MM-dd_HH-mm-ss");
    
    // Format: waktu_status_nama.jpg
    var filename = waktuStr + '_' + tipe + '_' + nama + '.jpg';

    // Decode base64
    var blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/jpeg',
      filename
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
