// ============================================
// SISTEM ABSENSI QR CODE - Google Apps Script
// ============================================
// Copy kode ini ke Google Apps Script editor
// (Extensions → Apps Script di Google Sheets)
// ============================================

/**
 * Handle POST request dari web app
 * Menerima data absensi dan menyimpan ke Sheets
 */
function doPost(e) {
  try {
    // Parse JSON data dari request
    var data = JSON.parse(e.postData.contents);
    
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
        "User Agent"
      ]);

      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("#ffffff");
    }
    
    // Buat timestamp dengan timezone Indonesia
    var timestamp = new Date();
    var formattedTimestamp = Utilities.formatDate(
      timestamp, 
      "Asia/Jakarta", 
      "yyyy-MM-dd HH:mm:ss"
    );
    
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
      data.userAgent || ""
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Absensi berhasil dicatat",
        timestamp: formattedTimestamp,
        data: {
          nama: data.nama,
          tipe: data.tipe
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

/**
 * Handle GET request (untuk testing endpoint)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "Sistem Absensi QR Code aktif dan berjalan",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi untuk testing manual di Apps Script editor
 * Pilih fungsi ini dan klik Run untuk test
 */
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        nama: "Test User",
        tipe: "MASUK",
        latitude: -6.1234567,
        longitude: 106.7654321,
        deviceType: "Mobile",
        os: "Android",
        browser: "Chrome",
        userAgent: "Mozilla/5.0 (Linux; Android 10)..."
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}

/**
 * Fungsi untuk membuat sheet dengan struktur awal
 * Jalankan sekali untuk setup
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Absensi");
  
  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = ss.insertSheet("Absensi");
  } else {
    // Clear existing content
    sheet.clear();
  }
  
  // Set headers
  var headers = [
    "Timestamp",
    "Nama",
    "Tipe",
    "Latitude",
    "Longitude",
    "Device Type",
    "OS",
    "Browser",
    "User Agent"
  ];

  sheet.appendRow(headers);

  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4285f4");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");

  // Set column widths
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 200); // Nama
  sheet.setColumnWidth(3, 80);  // Tipe
  sheet.setColumnWidth(4, 120); // Latitude
  sheet.setColumnWidth(5, 120); // Longitude
  sheet.setColumnWidth(6, 100); // Device Type
  sheet.setColumnWidth(7, 100); // OS
  sheet.setColumnWidth(8, 100); // Browser
  sheet.setColumnWidth(9, 200); // User Agent
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  Logger.log("Sheet 'Absensi' berhasil di-setup!");
}

/**
 * Fungsi untuk menghitung statistik absensi
 * Bisa digunakan untuk dashboard
 */
function getStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Absensi");
  
  if (!sheet) {
    return { error: "Sheet 'Absensi' tidak ditemukan" };
  }
  
  var data = sheet.getDataRange().getValues();
  var totalRecords = data.length - 1; // minus header
  
  var masukCount = 0;
  var pulangCount = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === "MASUK") masukCount++;
    if (data[i][2] === "PULANG") pulangCount++;
  }
  
  var stats = {
    totalRecords: totalRecords,
    masukCount: masukCount,
    pulangCount: pulangCount
  };
  
  Logger.log(stats);
  return stats;
}
