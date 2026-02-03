// ============================================
// DASHBOARD ADMIN - JavaScript
// ============================================

// Ganti URL ini dengan URL Web App dari Google Apps Script Anda
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec';

let refreshInterval;
let countdownValue = 30;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    startAutoRefresh();
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
});

async function loadDashboard() {
    // Load summary
    await loadSummary();

    // Load table data
    await loadTableData();

    // Load pending approvals
    await loadPendingApprovals();
}

// ==========================================
// SUMMARY
// ==========================================

async function loadSummary() {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=summary`);
        const data = await response.json();

        document.getElementById('totalMasuk').textContent = data.masuk || 0;
        document.getElementById('totalPulang').textContent = data.pulang || 0;
        document.getElementById('totalBelum').textContent = data.belum || 0;
    } catch (error) {
        console.error('Error loading summary:', error);
        document.getElementById('totalMasuk').textContent = 'Err';
        document.getElementById('totalPulang').textContent = 'Err';
        document.getElementById('totalBelum').textContent = 'Err';
    }
}

// ==========================================
// TABLE DATA
// ==========================================

async function loadTableData() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const nama = document.getElementById('filterName').value;
    const tipe = document.getElementById('filterType').value;

    const params = new URLSearchParams();
    params.append('action', 'getData');
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (nama) params.append('nama', nama);
    if (tipe) params.append('tipe', tipe);

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();

        renderTable(data);
    } catch (error) {
        console.error('Error loading table data:', error);
        renderTableError();
    }
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Tidak ada data</td></tr>';
        return;
    }

    let html = '';
    data.forEach(row => {
        const time = row.timestamp.substring(11, 16);
        const date = row.timestamp.substring(0, 10);
        const deviceInfo = `${row.deviceType} - ${row.os}`;
        const photoLink = row.foto ? `<span class="photo-link" onclick="showPhoto('${row.foto}')">📷 Lihat</span>` : '-';

        html += `
            <tr>
                <td>
                    <div style="font-weight: 600;">${time}</div>
                    <div style="font-size: 0.8rem; color: #666;">${date}</div>
                </td>
                <td>${row.nama}</td>
                <td>
                    <span style="padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; ${row.tipe === 'MASUK' ? 'background: #d4edda; color: #155724;' : 'background: #f8d7da; color: #721c24;'}">
                        ${row.tipe}
                    </span>
                </td>
                <td>
                    <div style="font-size: 0.9rem;">${deviceInfo}</div>
                    <div style="font-size: 0.8rem; color: #666;">${row.browser}</div>
                </td>
                <td>${photoLink}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderTableError() {
    document.getElementById('tableBody').innerHTML = '<tr><td colspan="5" class="empty-row">Gagal memuat data</td></tr>';
}

// ==========================================
// FILTER
// ==========================================

function applyFilter() {
    loadTableData();
}

function clearFilter() {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('filterName').value = '';
    document.getElementById('filterType').value = '';
    loadTableData();
}

// ==========================================
// EXPORT
// ==========================================

function exportData() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    const params = new URLSearchParams();
    params.append('action', 'export');
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const exportUrl = `${APPS_SCRIPT_URL}?${params.toString()}`;

    // Open in new tab to download
    window.open(exportUrl, '_blank');
}

// ==========================================
// PENDING APPROVALS
// ==========================================

async function loadPendingApprovals() {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getIzinPending`);
        const data = await response.json();

        renderPendingApprovals(data);
    } catch (error) {
        console.error('Error loading pending approvals:', error);
        document.getElementById('pendingList').innerHTML = '<p class="loading-row">Gagal memuat data</p>';
    }
}

function renderPendingApprovals(data) {
    const container = document.getElementById('pendingList');

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="empty-row">Tidak ada pengajuan pending</p>';
        return;
    }

    let html = '';
    data.forEach(item => {
        const jenisIcon = item.jenis === 'Sakit' ? '🤒' : (item.jenis === 'Izin' ? '📋' : '🏖️');

        html += `
            <div class="approval-item">
                <div class="approval-header">
                    <div class="approval-name">${jenisIcon} ${item.nama}</div>
                    <div class="approval-actions">
                        <button class="btn-approve" onclick="approveIzin('${item.id}', 'APPROVED')">✓ Approve</button>
                        <button class="btn-reject" onclick="approveIzin('${item.id}', 'REJECTED')">✗ Reject</button>
                    </div>
                </div>
                <div class="approval-detail">
                    <strong>Jenis:</strong> ${item.jenis}<br>
                    <strong>Tanggal:</strong> ${item.tanggal}<br>
                    <strong>Alasan:</strong> ${item.alasan}<br>
                    ${item.lampiran ? `<strong>Lampiran:</strong> <a href="${item.lampiran}" target="_blank">📎 Lihat</a><br>` : ''}
                    <strong>Submitted:</strong> ${item.submittedAt}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function approveIzin(id, status) {
    if (!confirm(`Anda yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) {
        return;
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=approveIzin&id=${id}&status=${status}&admin=Admin`);
        const result = await response.json();

        if (result.status === 'success') {
            alert(`Pengajuan berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}!`);
            loadPendingApprovals();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        console.error('Error approving izin:', error);
        alert('Gagal memproses pengajuan.');
    }
}

// ==========================================
// PHOTO MODAL
// ==========================================

function showPhoto(url) {
    document.getElementById('modalPhoto').src = url;
    document.getElementById('photoModal').style.display = 'flex';
}

function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
}

// ==========================================
// AUTO REFRESH
// ==========================================

function startAutoRefresh() {
    countdownValue = 30;

    refreshInterval = setInterval(() => {
        countdownValue--;

        if (countdownValue <= 0) {
            countdownValue = 30;
            loadDashboard();
        }

        document.getElementById('countdown').textContent = countdownValue;
    }, 1000);
}

// ==========================================
// TIMESTAMP
// ==========================================

function updateTimestamp() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const timeStr = now.toLocaleDateString('id-ID', options);
    document.getElementById('dashboardTime').textContent = timeStr;
}

// ==========================================
// DEBUG
// ==========================================

function debugInfo() {
    console.log('Apps Script URL:', APPS_SCRIPT_URL);
}

window.debugInfo = debugInfo;
