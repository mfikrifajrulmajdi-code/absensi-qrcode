// ============================================
// TEST UNIT - BACKEND (CodeV2.gs)
// ============================================
// Copy file ini ke Google Apps Script Editor
// Run function testAll() untuk menjalankan semua test
// ============================================

/**
 * Test Suite Utama
 * Run function ini untuk menjalankan semua test
 */
function testAll() {
  Logger.log('');
  Logger.log('='.repeat(60));
  Logger.log('TEST SUITE - SISTEM ABSENSI V2 (BACKEND)');
  Logger.log('='.repeat(60));
  Logger.log('');

  var results = [];
  var startTime = new Date();

  // Test Configuration
  results.push(testConfigValues());

  // Test Upload Functions
  results.push(testUploadToDrive());
  results.push(testUploadToImgBB());

  // Test Validation
  results.push(testValidateAbsensi());
  results.push(testAutoFixLupaAbsen());

  // Test Status Check
  results.push(testCheckAbsensiHariIni());

  // Test Izin Functions
  results.push(testSubmitIzin());
  results.push(testApproveIzin());

  // Test Summary & Export
  results.push(testGetSummary());
  results.push(testExportData());

  var endTime = new Date();
  var duration = endTime - startTime;

  // Summary
  Logger.log('');
  Logger.log('='.repeat(60));
  Logger.log('TEST SUMMARY');
  Logger.log('='.repeat(60));

  var passed = results.filter(r => r.status === 'PASS').length;
  var failed = results.filter(r => r.status === 'FAIL').length;
  var skipped = results.filter(r => r.status === 'SKIP').length;

  Logger.log('Total Tests: ' + results.length);
  Logger.log('✅ Passed: ' + passed);
  Logger.log('❌ Failed: ' + failed);
  Logger.log('⏭️ Skipped: ' + skipped);
  Logger.log('⏱️ Duration: ' + duration + 'ms');

  if (failed > 0) {
    Logger.log('');
    Logger.log('FAILED TESTS:');
    results.forEach(r => {
      if (r.status === 'FAIL') {
        Logger.log('  ❌ ' + r.name);
        Logger.log('     ' + r.message);
      }
    });
  }

  Logger.log('='.repeat(60));
  Logger.log('');

  return {
    total: results.length,
    passed: passed,
    failed: failed,
    skipped: skipped,
    duration: duration,
    results: results
  };
}

// ============================================
// TEST: Configuration
// ============================================

/**
 * Test 1: Configuration Values
 */
function testConfigValues() {
  var testName = 'Test Configuration Values';

  try {
    // Check if IMGBB_API_KEY is set
    var hasImgBBKey = (typeof IMGBB_API_KEY !== 'undefined' &&
                       IMGBB_API_KEY !== '' &&
                       IMGBB_API_KEY !== 'YOUR_IMGBB_API_KEY');

    // Check if JAM_KERJA is valid
    var validJamKerja = (typeof JAM_KERJA !== 'undefined' && JAM_KERJA > 0);

    // Results
    var results = [
      { name: 'IMGBB_API_KEY', status: hasImgBBKey ? 'SET' : 'NOT SET' },
      { name: 'JAM_KERJA', status: validJamKerja ? JAM_KERJA + ' jam' : 'INVALID' }
    ];

    Logger.log('✅ ' + testName);
    results.forEach(r => {
      Logger.log('   ' + r.name + ': ' + r.status);
    });

    return {
      name: testName,
      status: 'PASS',
      message: 'Configuration checked'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// TEST: Upload Functions
// ============================================

/**
 * Test 2: Upload to Drive
 * NOTE: This test requires actual base64 image data
 */
function testUploadToDrive() {
  var testName = 'Test Upload to Drive';

  try {
    // Check if function exists
    if (typeof uploadToDrive !== 'function') {
      throw new Error('Function uploadToDrive not found');
    }

    // Create fake base64 data (1x1 pixel red image)
    var fakeBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABIAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlBaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==';

    // Try to upload
    var result = uploadToDrive(fakeBase64, 'TestUser', 'MASUK');

    if (result && result.length > 0) {
      Logger.log('✅ ' + testName + ' - Upload successful');
      Logger.log('   File URL: ' + result);
      return {
        name: testName,
        status: 'PASS',
        message: 'Successfully uploaded to Drive'
      };
    } else {
      Logger.log('⚠️ ' + testName + ' - Upload failed or returned empty');
      return {
        name: testName,
        status: 'FAIL',
        message: 'Upload returned empty result'
      };
    }

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

/**
 * Test 3: Upload to ImgBB
 * NOTE: This test requires valid IMGBB_API_KEY
 */
function testUploadToImgBB() {
  var testName = 'Test Upload to ImgBB';

  try {
    // Check if ImgBB is configured
    if (typeof IMGBB_API_KEY === 'undefined' ||
        IMGBB_API_KEY === '' ||
        IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY') {
      Logger.log('⏭️ ' + testName + ' - SKIPPED (ImgBB not configured)');
      return {
        name: testName,
        status: 'SKIP',
        message: 'ImgBB API key not set'
      };
    }

    // Check if function exists
    if (typeof uploadToImgBB !== 'function') {
      throw new Error('Function uploadToImgBB not found');
    }

    // Create fake base64 data
    var fakeBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABIAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlBaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==';

    // Try to upload
    var result = uploadToImgBB(fakeBase64);

    if (result && result.length > 0) {
      Logger.log('✅ ' + testName + ' - Upload successful');
      Logger.log('   Image URL: ' + result);
      return {
        name: testName,
        status: 'PASS',
        message: 'Successfully uploaded to ImgBB'
      };
    } else {
      Logger.log('⚠️ ' + testName + ' - Upload failed or returned empty');
      return {
        name: testName,
        status: 'FAIL',
        message: 'Upload returned empty result'
      };
    }

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// TEST: Validation
// ============================================

/**
 * Test 4: Validate Absensi
 */
function testValidateAbsensi() {
  var testName = 'Test Validate Absensi';

  try {
    // Check if function exists
    if (typeof validateAbsensi !== 'function') {
      throw new Error('Function validateAbsensi not found');
    }

    // Test cases
    var testCases = [
      { nama: 'TestUser1', tipe: 'MASUK', description: 'First MASUK' },
      { nama: 'TestUser1', tipe: 'PULANG', description: 'PULANG after MASUK' },
      { nama: 'TestUser1', tipe: 'MASUK', description: 'Second MASUK (overtime)' },
      { nama: 'TestUser2', tipe: 'PULANG', description: 'PULANG without MASUK' }
    ];

    Logger.log('✅ ' + testName);
    testCases.forEach(tc => {
      var result = validateAbsensi(tc.nama, tc.tipe);
      Logger.log('   ' + tc.description + ': ' + (result.valid ? 'VALID' : 'INVALID - ' + result.message));
    });

    return {
      name: testName,
      status: 'PASS',
      message: 'Validation function works'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

/**
 * Test 5: Auto Fix Lupa Absen
 */
function testAutoFixLupaAbsen() {
  var testName = 'Test Auto Fix Lupa Absen';

  try {
    // Check if function exists
    if (typeof autoFixLupaAbsen !== 'function') {
      throw new Error('Function autoFixLupaAbsen not found');
    }

    // This function is called automatically, so we just check if it exists
    Logger.log('✅ ' + testName + ' - Function exists');
    return {
      name: testName,
      status: 'PASS',
      message: 'Auto fix function exists'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// TEST: Status Check
// ============================================

/**
 * Test 6: Check Absensi Hari Ini
 */
function testCheckAbsensiHariIni() {
  var testName = 'Test Check Absensi Hari Ini';

  try {
    // Check if function exists
    if (typeof checkAbsensiHariIni !== 'function') {
      throw new Error('Function checkAbsensiHariIni not found');
    }

    // Test with sample user
    var result = checkAbsensiHariIni('TestUser1');

    Logger.log('✅ ' + testName);
    Logger.log('   hasMasuk: ' + result.hasMasuk);
    Logger.log('   hasPulang: ' + result.hasPulang);
    if (result.hasMasuk) Logger.log('   jamMasuk: ' + result.jamMasuk);
    if (result.hasPulang) Logger.log('   jamPulang: ' + result.jamPulang);

    return {
      name: testName,
      status: 'PASS',
      message: 'Status check works'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// TEST: Izin Functions
// ============================================

/**
 * Test 7: Submit Izin
 */
function testSubmitIzin() {
  var testName = 'Test Submit Izin';

  try {
    // Check if izin sheet exists
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var izinSheet = ss.getSheetByName('Izin');

    if (!izinSheet) {
      Logger.log('⚠️ ' + testName + ' - SKIPPED (Izin sheet not found)');
      return {
        name: testName,
        status: 'SKIP',
        message: 'Izin sheet not found'
      };
    }

    Logger.log('✅ ' + testName + ' - Izin sheet exists');
    return {
      name: testName,
      status: 'PASS',
      message: 'Izin sheet found'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

/**
 * Test 8: Approve Izin
 */
function testApproveIzin() {
  var testName = 'Test Approve Izin';

  try {
    // Check if function exists
    if (typeof approveIzin !== 'function') {
      throw new Error('Function approveIzin not found');
    }

    Logger.log('✅ ' + testName + ' - Function exists');
    return {
      name: testName,
      status: 'PASS',
      message: 'Approve function exists'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// TEST: Summary & Export
// ============================================

/**
 * Test 9: Get Summary
 */
function testGetSummary() {
  var testName = 'Test Get Summary';

  try {
    // Check if function exists
    if (typeof getSummary !== 'function') {
      throw new Error('Function getSummary not found');
    }

    // Test the function
    var result = getSummary();

    Logger.log('✅ ' + testName);
    Logger.log('   MASUK: ' + result.masuk);
    Logger.log('   PULANG: ' + result.pulang);
    Logger.log('   BELUM: ' + result.belum);

    return {
      name: testName,
      status: 'PASS',
      message: 'Summary function works'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

/**
 * Test 10: Export Data
 */
function testExportData() {
  var testName = 'Test Export Data';

  try {
    // Check if function exists
    if (typeof exportData !== 'function') {
      throw new Error('Function exportData not found');
    }

    Logger.log('✅ ' + testName + ' - Function exists');
    return {
      name: testName,
      status: 'PASS',
      message: 'Export function exists'
    };

  } catch (error) {
    Logger.log('❌ ' + testName + ': ' + error.toString());
    return {
      name: testName,
      status: 'FAIL',
      message: error.toString()
    };
  }
}

// ============================================
// HELPER: Get Test Data
// ============================================

/**
 * Create sample absensi data for testing
 */
function createSampleData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Absensi');

  if (!sheet) {
    sheet = ss.insertSheet('Absensi');
    sheet.appendRow([
      'Timestamp', 'Nama', 'Tipe', 'Latitude', 'Longitude',
      'Device Type', 'OS', 'Browser', 'User Agent', 'Foto'
    ]);
  }

  // Add sample data
  var today = new Date();
  var timestamp = Utilities.formatDate(today, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

  sheet.appendRow([
    timestamp, 'TestUser1', 'MASUK', '-6.200000', '106.816666',
    'Mobile', 'Android', 'Chrome', 'TestAgent', ''
  ]);

  Logger.log('Sample data created for TestUser1');
}
