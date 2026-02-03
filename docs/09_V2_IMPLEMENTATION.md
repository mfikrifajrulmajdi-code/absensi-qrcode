# 🔧 V2 Implementation Guide

## Overview

Panduan teknis implementasi fitur-fitur V2 Sistem Absensi QR Code.

---

## 📋 Prerequisites

Sebelum memulai implementasi V2, pastikan:

- [ ] V1 sudah berjalan dengan baik
- [ ] Google Sheets sudah berisi data
- [ ] Google Apps Script sudah di-deploy
- [ ] QR Code sudah bisa di-scan dan absensi berfungsi

---

## 🗂️ Struktur File V2

```
absensi-qrcode/
├── docs/
│   └── (documentation files)
│
├── src/
│   ├── index.html              ← UPDATE: tambah kamera & tombol riwayat
│   ├── style.css               ← UPDATE: style untuk elemen baru
│   ├── app.js                  ← UPDATE: logic V2
│   ├── riwayat.html            ← BARU: modal riwayat
│   ├── riwayat.css             ← BARU: style modal
│   ├── riwayat.js              ← BARU: logic riwayat
│   ├── izin.html               ← BARU: form izin
│   ├── izin.css                ← BARU: style form izin
│   └── izin.js                 ← BARU: logic form izin
│
├── admin/
│   ├── admin.html              ← BARU: dashboard
│   ├── admin.css               ← BARU: style dashboard
│   └── admin.js                ← BARU: logic dashboard
│
├── scripts/
│   └── CodeV2.gs               ← UPDATE: backend V2
│
└── tools/
    └── qr-generator.html       ← UPDATE: generate QR baru
```

---

## 🚀 Phase 1: Database & Backend Setup

### 1.1 Update Google Sheets Structure

**Buka Google Sheets dan tambahkan sheet baru:**

| Sheet Name | Kolom | Deskripsi |
|------------|-------|-----------|
| **Absensi** | (existing) | Data absensi V1 + update V2 |
| **Izin** | (baru) | Data pengajuan izin |
| **Config** | (baru) | Konfigurasi sistem |

**Sheet "Izin" - Kolom:**

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Nama | Jenis | Tanggal | Alasan | Lampiran | Status | Updated At |

**Sheet "Config" - Kolom:**

| A | B |
|---|---|
| Key | Value |
| jam_kerja | 8 |
| max_lembur | 2 |

---

### 1.2 Update Google Apps Script (CodeV2.gs)

**Copy file `scripts/CodeV2.gs`:**

**Fungsi baru yang ditambahkan:**

| Fungsi | Deskripsi |
|--------|-----------|
| `doPost(e)` | Update: handle data V2 (foto, device info, dll) |
| `doGet(e)` | Update: endpoint untuk export data |
| `checkAbsensiHariIni(nama)` | Cek status absensi hari ini |
| `autoFixLupaAbsen(nama)` | Auto-fix jika lupa absen |
| `getRiwayat(nama, bulan, tahun)` | Ambil riwayat absensi |
| `submitIzin(data)` | Submit pengajuan izin |
| `getIzinPending()` | Ambil list izin pending |
| `approveIzin(id, status)` | Approve/reject izin |
| `getSummaryHariIni()` | Get summary dashboard |
| `exportData(filter)` | Export data dengan filter |

**Full implementation:** Lihat `scripts/CodeV2.gs`

---

## 📸 Phase 2: Foto Absen + Upload

### 2.1 Update `index.html`

**Tambahkan elemen kamera:**

```html
<!-- Sebelum tombol MASUK/PULANG -->
<div class="camera-section">
    <button class="btn-camera" id="btnCamera" onclick="openCamera()">
        📷 Ambil Foto
    </button>

    <!-- Preview foto -->
    <div class="photo-preview" id="photoPreview" style="display: none;">
        <img id="capturedPhoto" src="" alt="Foto absen">
        <button class="btn-retake" onclick="retakePhoto()">
            🔄 Ulangi Foto
        </button>
    </div>

    <!-- Hidden input untuk file -->
    <input type="file" id="cameraInput" accept="image/*" capture="user" style="display: none;">
</div>
```

**Update tombol absen:**

```html
<!-- Tambahkan class untuk disable state -->
<button class="btn btn-masuk" id="btnMasuk" onclick="submitAbsensi('MASUK')">
    <span class="btn-icon">🟢</span>
    <span class="btn-text">MASUK</span>
</button>

<button class="btn btn-pulang" id="btnPulang" onclick="submitAbsensi('PULANG')">
    <span class="btn-icon">🔴</span>
    <span class="btn-text">PULANG</span>
</button>

<!-- Status message -->
<div class="absen-status" id="absenStatus"></div>
```

---

### 2.2 Update `style.css`

**Tambahkan style untuk kamera:**

```css
/* Camera Section */
.camera-section {
    margin-bottom: 20px;
}

.btn-camera {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.photo-preview {
    margin-top: 15px;
    text-align: center;
}

.photo-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 12px;
    border: 2px solid var(--accent-blue);
}

.btn-retake {
    margin-top: 10px;
    padding: 10px 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    cursor: pointer;
}

/* Absen Status */
.absen-status {
    margin-top: 15px;
    padding: 12px;
    background: var(--bg-card);
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
}

.absen-status.info {
    border-left: 4px solid var(--accent-blue);
}

.absen-status.warning {
    border-left: 4px solid #ff9800;
}

/* Disabled button state */
.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
```

---

### 2.3 Update `app.js`

**Tambahkan variabel global:**

```javascript
let photoData = null;  // Base64 image data
```

**Tambahkan fungsi kamera:**

```javascript
function openCamera() {
    const input = document.getElementById('cameraInput');
    input.click();
}

// Handle file input change
document.addEventListener('DOMContentLoaded', () => {
    const cameraInput = document.getElementById('cameraInput');
    cameraInput.addEventListener('change', handleCameraCapture);
});

function handleCameraCapture(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('❌ Ukuran foto maksimal 5MB', true);
        return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        photoData = e.target.result;

        // Show preview
        document.getElementById('capturedPhoto').src = photoData;
        document.getElementById('photoPreview').style.display = 'block';
        document.getElementById('btnCamera').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function retakePhoto() {
    photoData = null;
    document.getElementById('cameraInput').value = '';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('btnCamera').style.display = 'flex';
}
```

**Update `submitAbsensi()`:**

```javascript
async function submitAbsensi(tipe) {
    // ... existing validation ...

    // Validate photo (required)
    if (!photoData) {
        showNotification('❌ Silakan ambil foto terlebih dahulu!', true);
        return;
    }

    // Get device info
    const deviceInfo = getDeviceInfo();

    // Prepare data
    const data = {
        nama: employeeData.nama,
        tipe: tipe,
        latitude: locationData.latitude || '',
        longitude: locationData.longitude || '',
        deviceType: deviceInfo.deviceType,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        userAgent: deviceInfo.userAgent,
        photo: photoData  // Base64 image
    };

    // ... send to backend ...
}
```

---

### 2.4 Update Backend untuk Upload Foto

**Terima dan upload foto di `CodeV2.gs`:**

```javascript
function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);

        // ... existing code ...

        // Upload foto ke ImgBB
        var photoUrl = '';
        if (data.photo) {
            photoUrl = uploadToImgBB(data.photo);
        }

        // Simpan ke Sheets dengan URL foto
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
            photoUrl  // URL foto
        ]);

        // ... rest of code ...
    } catch (error) {
        // ... error handling ...
    }
}

function uploadToImgBB(base64Image) {
    // Remove data:image/xxx;base64, prefix
    var base64Data = base64Image.split(',')[1];

    // Upload to ImgBB
    var payload = {
        'key': 'YOUR_IMGBB_API_KEY',
        'image': base64Data
    };

    var options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        'payload': payload
    };

    var response = UrlFetchApp.fetch('https://api.imgbb.com/1/upload', options);
    var result = JSON.parse(response.getContentText());

    return result.data.url;
}
```

---

## ✅ Phase 3: Validasi & Auto-Fix

### 3.1 Frontend - Check Status on Load

**Update `initApp()` di `app.js`:**

```javascript
async function initApp() {
    // 1. Parse URL parameters
    parseUrlParams();

    // 2. Display employee info
    displayEmployeeInfo();

    // 3. Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // 4. Get GPS location
    getLocation();

    // 5. Check absensi status hari ini (NEW)
    await checkAbsensiStatus();
}
```

**Tambahkan fungsi `checkAbsensiStatus()`:**

```javascript
async function checkAbsensiStatus() {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=checkStatus&nama=${employeeData.nama}`);
        const result = await response.json();

        updateAbsensiStatus(result);
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

function updateAbsensiStatus(status) {
    const btnMasuk = document.getElementById('btnMasuk');
    const btnPulang = document.getElementById('btnPulang');
    const statusDiv = document.getElementById('absenStatus');

    if (status.hasMasuk && status.hasPulang) {
        // Sudah lengkap
        btnMasuk.disabled = true;
        btnPulang.disabled = true;
        statusDiv.innerHTML = '✅ <strong>Sudah absen lengkap hari ini</strong><br>MASUK: ' + status.jamMasuk + ' | PULANG: ' + status.jamPulang;
        statusDiv.className = 'absen-status info';
    } else if (status.hasMasuk) {
        // Sudah MASUK, belum PULANG
        btnMasuk.disabled = true;
        btnPulang.disabled = false;
        statusDiv.innerHTML = '✅ <strong>Sudah absen MASUK</strong><br>Jam: ' + status.jamMasuk + '<br>Silakan absen PULANG.';
        statusDiv.className = 'absen-status info';
    } else {
        // Belum absen sama sekali
        btnMasuk.disabled = false;
        btnPulang.disabled = true;
        statusDiv.innerHTML = '⏳ <strong>Belum absen hari ini</strong><br>Silakan absen MASUK.';
        statusDiv.className = 'absen-status warning';
    }
}
```

---

### 3.2 Backend - Check Status Function

**Tambahkan di `CodeV2.gs`:**

```javascript
function doGet(e) {
    var action = e.parameter.action;

    if (action === 'checkStatus') {
        return checkAbsensiHariIni(e.parameter.nama);
    } else if (action === 'getRiwayat') {
        return getRiwayat(e.parameter.nama, e.parameter.bulan, e.parameter.tahun);
    } else if (action === 'export') {
        return exportData(e.parameter);
    }

    // Default response
    return ContentService
        .createTextOutput(JSON.stringify({
            status: "ok",
            message: "Sistem Absensi QR Code V2 aktif"
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

function checkAbsensiHariIni(nama) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
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

        if (rowDate === todayStr) {
            if (data[i][1] === nama) {
                if (data[i][2] === 'MASUK' && !hasMasuk) {
                    hasMasuk = true;
                    jamMasuk = data[i][0].toString().substring(11, 16); // HH:MM
                } else if (data[i][2] === 'PULANG') {
                    hasPulang = true;
                    jamPulang = data[i][0].toString().substring(11, 16);
                }
            }
        } else if (rowDate < todayStr) {
            break; // Stop jika sudah lewat hari ini
        }
    }

    // Auto-fix jika lupa absen
    if (hasMasuk && !hasPulang) {
        autoFixLupaAbsen(nama);
    }

    return ContentService
        .createTextOutput(JSON.stringify({
            hasMasuk: hasMasuk,
            hasPulang: hasPulang,
            jamMasuk: jamMasuk,
            jamPulang: jamPulang
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

function autoFixLupaAbsen(nama) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Absensi");
    var data = sheet.getDataRange().getValues();

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = Utilities.formatDate(yesterday, "Asia/Jakarta", "yyyy-MM-dd");

    // Cari MASUK kemarin
    for (var i = data.length - 1; i >= 1; i--) {
        var rowDate = data[i][0].toString().substring(0, 10);

        if (rowDate === yesterdayStr && data[i][1] === nama && data[i][2] === 'MASUK') {
            var jamMasukStr = data[i][0].toString().substring(11, 19);
            var jamMasuk = new Date(yesterdayStr + 'T' + jamMasukStr);

            // Tambah 8 jam
            var jamPulang = new Date(jamMasuk.getTime() + 8 * 60 * 60 * 1000);
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
```

---

## 📊 Phase 4: Dashboard Admin

### 4.1 Buat `admin/admin.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Absensi</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Dashboard Absensi</h1>
            <p class="subtitle">Real-time Monitoring</p>
        </header>

        <!-- Summary Cards -->
        <div class="summary-section">
            <div class="card summary-card masuk">
                <div class="card-icon">🟢</div>
                <div class="card-value" id="totalMasuk">0</div>
                <div class="card-label">MASUK</div>
            </div>
            <div class="card summary-card pulang">
                <div class="card-icon">🔴</div>
                <div class="card-value" id="totalPulang">0</div>
                <div class="card-label">PULANG</div>
            </div>
            <div class="card summary-card belum">
                <div class="card-icon">⏳</div>
                <div class="card-value" id="totalBelum">0</div>
                <div class="card-label">BELUM</div>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="filter-section">
            <h3>🔍 Filter Data</h3>
            <div class="filter-row">
                <input type="date" id="filterDateFrom">
                <span>s/d</span>
                <input type="date" id="filterDateTo">
            </div>
            <div class="filter-row">
                <input type="text" id="filterName" placeholder="Cari nama...">
                <select id="filterType">
                    <option value="">Semua Tipe</option>
                    <option value="MASUK">MASUK</option>
                    <option value="PULANG">PULANG</option>
                </select>
            </div>
            <button class="btn" onclick="applyFilter()">Apply Filter</button>
        </div>

        <!-- Data Table -->
        <div class="table-section">
            <h3>📋 Data Absensi</h3>
            <div class="table-wrapper">
                <table id="absensiTable">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Nama</th>
                            <th>Tipe</th>
                            <th>Device</th>
                            <th>Foto</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <!-- Data akan di-render di sini -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Export Section -->
        <div class="export-section">
            <h3>📥 Export Data</h3>
            <button class="btn btn-export" onclick="exportData()">Export Excel</button>
        </div>

        <!-- Auto-refresh indicator -->
        <div class="refresh-indicator">
            Auto-refresh: <span id="countdown">30</span>s
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>
```

---

### 4.2 Buat `admin/admin.css`

```css
/* Admin Dashboard Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    min-height: 100vh;
    padding: 20px;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

header h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.subtitle {
    opacity: 0.8;
}

/* Summary Cards */
.summary-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.summary-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.card-icon {
    font-size: 2rem;
    margin-bottom: 10px;
}

.card-value {
    font-size: 2.5rem;
    font-weight: 700;
}

.card-label {
    color: #666;
    font-size: 0.9rem;
}

.summary-card.masuk .card-value { color: #00d26a; }
.summary-card.pulang .card-value { color: #ff4757; }
.summary-card.belum .card-value { color: #ffa502; }

/* Sections */
.card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.card h3 {
    margin-bottom: 15px;
    color: #1e3c72;
}

/* Filter */
.filter-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

input, select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    flex: 1;
}

.btn {
    padding: 10px 20px;
    background: #1e3c72;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn:hover { background: #2a5298; }

/* Table */
.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background: #f8f9fa;
    font-weight: 600;
}

/* Refresh indicator */
.refresh-indicator {
    text-align: center;
    color: white;
    opacity: 0.7;
    margin-top: 20px;
}
```

---

### 4.3 Buat `admin/admin.js`

```javascript
let refreshInterval;

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    startAutoRefresh();
});

async function loadDashboard() {
    // Load summary
    await loadSummary();

    // Load table data
    await loadTableData();
}

async function loadSummary() {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=summary`);
        const data = await response.json();

        document.getElementById('totalMasuk').textContent = data.masuk || 0;
        document.getElementById('totalPulang').textContent = data.pulang || 0;
        document.getElementById('totalBelum').textContent = data.belum || 0;
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

async function loadTableData() {
    // ... implementasi fetch data ...
}

function applyFilter() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const name = document.getElementById('filterName').value;
    const type = document.getElementById('filterType').value;

    // ... implementasi filter ...
}

function startAutoRefresh() {
    let countdown = 30;

    refreshInterval = setInterval(() => {
        countdown--;

        if (countdown <= 0) {
            countdown = 30;
            loadDashboard();
        }

        document.getElementById('countdown').textContent = countdown;
    }, 1000);
}
```

---

## 📋 Phase 5: Riwayat Absensi

### 5.1 Update `index.html` - Tombol Riwayat

```html
<!-- Setelah section GPS/Waktu -->
<div class="riwayat-section">
    <button class="btn-riwayat" onclick="openRiwayatModal()">
        📋 Lihat Riwayat
    </button>
</div>

<!-- Modal Riwayat -->
<div class="modal" id="riwayatModal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2>📋 Riwayat Absensi</h2>
            <button class="modal-close" onclick="closeRiwayatModal()">✕</button>
        </div>
        <div class="modal-body">
            <div class="riwayat-filter">
                <select id="filterBulan" onchange="loadRiwayat()">
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <!-- ... dll ... -->
                </select>
                <select id="filterTahun" onchange="loadRiwayat()">
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                </select>
            </div>
            <div class="riwayat-list" id="riwayatList">
                <!-- Data riwayat akan dirender di sini -->
            </div>
        </div>
    </div>
</div>
```

### 5.2 Update `style.css` - Modal Styles

```css
/* Tombol Riwayat */
.btn-riwayat {
    width: 100%;
    padding: 14px;
    background: var(--bg-card);
    border: 1px solid var(--accent-blue);
    border-radius: 8px;
    color: var(--accent-blue);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--bg-secondary);
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 80px);
}

/* Riwayat Filter */
.riwayat-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.riwayat-filter select {
    flex: 1;
    padding: 10px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
}

/* Riwayat List */
.riwayat-item {
    padding: 12px;
    background: var(--bg-card);
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.riwayat-date {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.riwayat-time {
    font-weight: 600;
    color: var(--accent-green);
}

.riwayat-time.pulang {
    color: var(--accent-red);
}

.riwayat-time.auto {
    color: #ffa502;
    font-size: 0.8rem;
}
```

### 5.3 Tambahkan di `app.js`

```javascript
function openRiwayatModal() {
    document.getElementById('riwayatModal').style.display = 'flex';

    // Set default filter (bulan & tahun sekarang)
    const now = new Date();
    document.getElementById('filterBulan').value = now.getMonth() + 1;
    document.getElementById('filterTahun').value = now.getFullYear();

    // Load riwayat
    loadRiwayat();
}

function closeRiwayatModal() {
    document.getElementById('riwayatModal').style.display = 'none';
}

async function loadRiwayat() {
    const bulan = document.getElementById('filterBulan').value;
    const tahun = document.getElementById('filterTahun').value;
    const nama = encodeURIComponent(employeeData.nama);

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getRiwayat&nama=${nama}&bulan=${bulan}&tahun=${tahun}`);
        const data = await response.json();

        renderRiwayat(data);
    } catch (error) {
        console.error('Error loading riwayat:', error);
    }
}

function renderRiwayat(data) {
    const container = document.getElementById('riwayatList');

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Tidak ada data riwayat</p>';
        return;
    }

    let html = '';
    data.forEach(item => {
        const isAuto = item.isAuto ? ' (auto)' : '';
        const timeClass = item.isAuto ? 'auto' : (item.tipe === 'PULANG' ? 'pulang' : '');

        html += `
            <div class="riwayat-item">
                <div class="riwayat-date">${item.tanggal}</div>
                <div class="riwayat-time ${timeClass}">${item.jam} ${item.tipe}${isAuto}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}
```

---

## 📝 Phase 6: Form Izin & Approval

### 6.1 Buat `izin.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Pengajuan Izin</title>
    <link rel="stylesheet" href="izin.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📝 Form Pengajuan Izin</h1>
        </header>

        <form id="izinForm" onsubmit="submitIzin(event)">
            <div class="form-group">
                <label>Nama</label>
                <input type="text" id="nama" readonly>
            </div>

            <div class="form-group">
                <label>Jenis Izin</label>
                <div class="radio-group">
                    <label><input type="radio" name="jenis" value="Sakit" checked> 🤒 Sakit</label>
                    <label><input type="radio" name="jenis" value="Izin"> 📋 Izin</label>
                    <label><input type="radio" name="jenis" value="Cuti"> 🏖️ Cuti</label>
                </div>
            </div>

            <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="tanggal" required>
            </div>

            <div class="form-group">
                <label>Alasan</label>
                <textarea id="alasan" rows="4" required placeholder="Jelaskan alasan izin..."></textarea>
            </div>

            <div class="form-group">
                <label>Lampiran (Opsional)</label>
                <input type="file" id="lampiran" accept="image/*,.pdf">
                <small>Surat dokter, surat izin, dll.</small>
            </div>

            <button type="submit" class="btn-submit">📤 Kirim Pengajuan</button>
        </form>

        <div id="notification" class="notification"></div>
    </div>

    <script src="izin.js"></script>
</body>
</html>
```

### 6.2 Buat `izin.css`

```css
/* Form Izin Styles */
body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 500px;
    margin: 0 auto;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

header h1 {
    font-size: 1.8rem;
}

#izinForm {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

.form-group input[readonly] {
    background: #f5f5f5;
}

.radio-group {
    display: flex;
    gap: 15px;
}

.radio-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: normal;
}

.btn-submit {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.notification {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    display: none;
}

.notification.show { display: block; }
.notification.success { background: #d4edda; color: #155724; }
.notification.error { background: #f8d7da; color: #721c24; }
```

### 6.3 Buat `izin.js`

```javascript
// Parse nama dari URL
const nama = new URLSearchParams(window.location.search).get('nama') || 'Unknown';
document.getElementById('nama').value = decodeURIComponent(nama);

// Set tanggal default ke hari ini
document.getElementById('tanggal').valueAsDate = new Date();

async function submitIzin(event) {
    event.preventDefault();

    const jenis = document.querySelector('input[name="jenis"]:checked').value;
    const tanggal = document.getElementById('tanggal').value;
    const alasan = document.getElementById('alasan').value;
    const lampiranFile = document.getElementById('lampiran').files[0];

    // Handle lampiran upload if needed
    let lampiranUrl = '';
    if (lampiranFile) {
        // Upload ke ImgBB atau storage
        lampiranUrl = await uploadLampiran(lampiranFile);
    }

    const data = {
        nama: nama,
        jenis: jenis,
        tanggal: tanggal,
        alasan: alasan,
        lampiran: lampiranUrl
    };

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=submitIzin`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
            showNotification('✅ Pengajuan berhasil dikirim! Menunggu approval admin.', false);
            document.getElementById('izinForm').reset();
            document.getElementById('nama').value = nama;
        } else {
            showNotification('❌ Gagal mengirim pengajuan.', true);
        }
    } catch (error) {
        showNotification('❌ Terjadi kesalahan.', true);
    }
}

function showNotification(message, isError) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + (isError ? 'error' : 'success');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}
```

---

## 🧪 Phase 7: Testing

### Testing Checklist

| Fitur | Test Case | Expected Result |
|-------|-----------|-----------------|
| Foto absen | Ambil foto dan submit | Foto terupload, URL tersimpan |
| Validasi MASUK | Klik MASUK 2x | Kedua kalinya di-block |
| Validasi PULANG tanpa MASUK | Klik PULANG tanpa MASUK | Di-block |
| Auto-fix | Lupa absen pulang, besok MASUK | PULANG auto dicatat |
| Dashboard | Buka admin.html | Summary & data tampil |
| Export | Filter & export | File ter-download |
| Riwayat | Klik tombol riwayat | Modal muncul, data tampil |
| Form Izin | Submit form | Data tersimpan, status PENDING |

---

## 🚀 Deployment Checklist

### Backend Deployment (Google Apps Script)

- [ ] Update `CodeV2.gs` di Apps Script editor
- [ ] Deploy → New version
- [ ] Copy new Web App URL
- [ ] Update `APPS_SCRIPT_URL` di semua file JS

### Frontend Deployment

- [ ] Upload semua file ke GitHub
- [ ] Update GitHub Pages source
- [ ] Test semua halaman

### Testing

- [ ] Test absensi MASUK/PULANG
- [ ] Test dashboard
- [ ] Test riwayat
- [ ] Test form izin
- [ ] Test export

---

## 📚 Related Documents

- [08_V2_FEATURES.md](./08_V2_FEATURES.md) - Overview fitur V2
- [10_V2_API.md](./10_V2_API.md) - Dokumentasi API
- [11_V2_DATABASE.md](./11_V2_DATABASE.md) - Skema database
- [12_V2_USER_GUIDE.md](./12_V2_USER_GUIDE.md) - Panduan pengguna

---

**Version:** 2.0
**Last Updated:** 3 Februari 2026
**Status:** DRAFT
