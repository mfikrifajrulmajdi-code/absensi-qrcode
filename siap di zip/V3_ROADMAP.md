# 🚀 Sistem Absensi QR Code V3 - Roadmap

**Dibuat:** 2026-02-05  
**Status:** Draft - Ready for Development

---

## 📋 Daftar Fitur V3

| # | Fitur | Prioritas | Kompleksitas |
|---|-------|-----------|--------------|
| 1 | Riwayat Izin di Halaman Karyawan | 🔴 Tinggi | ⭐⭐ Sedang |
| 2 | Notifikasi Admin (Email) | 🟡 Sedang | ⭐⭐ Sedang |
| 3 | Filter & Search di Admin | 🟡 Sedang | ⭐ Mudah |
| 4 | Export Laporan (PDF/Excel) | 🟢 Rendah | ⭐⭐⭐ Rumit |
| 5 | Dashboard Statistik | 🟢 Rendah | ⭐⭐ Sedang |

---

## 1️⃣ Riwayat Izin di Halaman Karyawan

### Deskripsi
Karyawan bisa melihat status pengajuan izin mereka (PENDING/APPROVED/REJECTED).

### File yang Perlu Diubah

#### Backend: `scripts/CodeV2.gs`
```javascript
// Tambah action baru di doGet()
if (action === 'getRiwayatIzin') {
  return getRiwayatIzin(e.parameter.nama);
}

// Fungsi baru
function getRiwayatIzin(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");
  if (!sheet) return createJSONResponse([]);
  
  var data = sheet.getDataRange().getValues();
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === nama) {
      result.push({
        tanggal: data[i][3],
        jenis: data[i][2],
        alasan: data[i][4],
        status: data[i][6],
        durasi: data[i][8] || "SEHARI_PENUH"
      });
    }
  }
  
  return createJSONResponse(result);
}
```

#### Frontend: `src/izin.html`
```html
<!-- Tambah section setelah form -->
<div class="riwayat-izin-section">
  <h3>📋 Riwayat Pengajuan Izin</h3>
  <div id="riwayat-izin-container">Memuat...</div>
</div>
```

#### Frontend: `src/izin.js`
```javascript
// Tambah fungsi load riwayat
async function loadRiwayatIzin() {
  const nama = getNamaFromURL();
  const response = await fetch(`${API_URL}?action=getRiwayatIzin&nama=${encodeURIComponent(nama)}`);
  const data = await response.json();
  
  const container = document.getElementById('riwayat-izin-container');
  if (data.length === 0) {
    container.innerHTML = '<p>Belum ada pengajuan izin.</p>';
    return;
  }
  
  let html = '<table class="riwayat-table"><tr><th>Tanggal</th><th>Jenis</th><th>Status</th></tr>';
  data.forEach(item => {
    const statusClass = item.status === 'APPROVED' ? 'status-approved' : 
                        item.status === 'REJECTED' ? 'status-rejected' : 'status-pending';
    html += `<tr>
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td class="${statusClass}">${item.status}</td>
    </tr>`;
  });
  html += '</table>';
  container.innerHTML = html;
}

// Panggil saat page load
document.addEventListener('DOMContentLoaded', loadRiwayatIzin);
```

---

## 2️⃣ Notifikasi Admin (Email)

### Deskripsi
Admin menerima email saat ada pengajuan izin baru.

### File yang Perlu Diubah

#### Backend: `scripts/CodeV2.gs`
```javascript
// Tambah config di atas
var ADMIN_EMAIL = 'admin@example.com'; // Ganti dengan email admin

// Di dalam handleSubmitIzin(), setelah sheet.appendRow():
function sendNotificationToAdmin(data) {
  var subject = '🔔 Pengajuan Izin Baru: ' + data.nama;
  var body = `
Pengajuan izin baru dari: ${data.nama}

📌 Detail:
- Jenis: ${data.jenis}
- Tanggal: ${data.tanggal}
- Alasan: ${data.alasan}
- Durasi: ${data.durasi || 'SEHARI_PENUH'}

🔗 Approve/Reject di: https://mfikrifajrulmajdi-code.github.io/absensi-qrcode/admin/admin.html
  `;
  
  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// Panggil di handleSubmitIzin setelah appendRow:
sendNotificationToAdmin(data);
```

### Catatan
- MailApp.sendEmail() sudah built-in di Apps Script
- Daily quota: 100 emails/day (free tier)

---

## 3️⃣ Filter & Search di Admin Dashboard

### Deskripsi
Admin bisa filter izin berdasarkan status, tanggal, atau nama.

### File yang Perlu Diubah

#### Frontend: `admin/admin.html`
```html
<!-- Tambah di section Pending Approval -->
<div class="filter-izin">
  <select id="filter-status-izin">
    <option value="">Semua Status</option>
    <option value="PENDING">Pending</option>
    <option value="APPROVED">Approved</option>
    <option value="REJECTED">Rejected</option>
  </select>
  <input type="date" id="filter-tanggal-izin" />
  <input type="text" id="filter-nama-izin" placeholder="Cari nama..." />
  <button onclick="filterIzin()">Filter</button>
</div>
```

#### Backend: `scripts/CodeV2.gs`
```javascript
// Update getIzinPending → getAllIzin dengan filter
function getAllIzin(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Izin");
  if (!sheet) return createJSONResponse([]);
  
  var data = sheet.getDataRange().getValues();
  var result = [];
  
  var statusFilter = params.status || '';
  var namaFilter = params.nama ? params.nama.toLowerCase() : '';
  
  for (var i = 1; i < data.length; i++) {
    var rowStatus = data[i][6];
    var rowNama = data[i][1];
    
    if (statusFilter && rowStatus !== statusFilter) continue;
    if (namaFilter && rowNama.toLowerCase().indexOf(namaFilter) === -1) continue;
    
    result.push({
      id: "row_" + (i + 1),
      nama: rowNama,
      jenis: data[i][2],
      tanggal: data[i][3],
      alasan: data[i][4],
      status: rowStatus,
      durasi: data[i][8]
    });
  }
  
  return createJSONResponse(result);
}
```

---

## 4️⃣ Export Laporan (PDF/Excel)

### Deskripsi
Export data absensi & izin ke format Excel atau PDF bulanan.

### Pendekatan

#### Option A: Client-side Excel (Recommended - Simple)
```javascript
// Di admin.js
function exportToExcel() {
  const data = currentAbsensiData; // Data yang sudah di-load
  
  let csv = 'Timestamp,Nama,Tipe,Lokasi,Device\n';
  data.forEach(row => {
    csv += `${row.timestamp},${row.nama},${row.tipe},${row.latitude},${row.deviceType}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Absensi_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}
```

#### Option B: Server-side PDF (Advanced)
```javascript
// Di CodeV2.gs - Menggunakan Google Docs API
function generatePDFReport(params) {
  // Create Google Doc dari template
  // Convert ke PDF
  // Return download URL
}
```

---

## 5️⃣ Dashboard Statistik

### Deskripsi
Visualisasi kehadiran per minggu/bulan dengan chart.

### Library Recommended
- **Chart.js** (CDN, mudah integrasi)

### Contoh Implementasi

#### Frontend: `admin/admin.html`
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="chart-container">
  <canvas id="attendanceChart"></canvas>
</div>
```

#### Frontend: `admin/admin.js`
```javascript
function renderChart(data) {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      datasets: [{
        label: 'Hadir',
        data: data.hadir,
        backgroundColor: '#4CAF50'
      }, {
        label: 'Izin',
        data: data.izin,
        backgroundColor: '#FF9800'
      }]
    }
  });
}
```

---

## 📅 Timeline Rekomendasi

| Minggu | Fitur | Estimasi |
|--------|-------|----------|
| Week 1 | Riwayat Izin Karyawan | 2-3 jam |
| Week 2 | Filter Admin Dashboard | 1-2 jam |
| Week 3 | Notifikasi Email | 1 jam |
| Week 4 | Export CSV | 1 jam |
| Week 5+ | Dashboard Chart & PDF | 4-6 jam |

---

## ⚠️ Reminder Deployment

Setiap perubahan di `CodeV2.gs`:
1. Buka Apps Script Editor
2. Deploy → New deployment
3. Pilih "Web app"
4. Execute as: Me
5. Who has access: Anyone
6. Copy URL baru (atau tetap pakai versi "Head" untuk auto-update)

---

## 📝 Template Prompt untuk Lanjut Development

Gunakan prompt ini saat melanjutkan:

```
Saya ingin melanjutkan pengembangan Sistem Absensi QR Code V3.
- Folder: d:\ai\percobaan\absensi-qrcode
- Roadmap: docs/V3_ROADMAP.md
- Backend: scripts/CodeV2.gs
- API URL: https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec

Tolong implementasikan fitur [NAMA FITUR] sesuai roadmap.
```

---

**Status:** Ready for Development 🟢
