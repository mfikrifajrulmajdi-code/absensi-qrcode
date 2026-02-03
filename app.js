// ============================================
// SISTEM ABSENSI QR CODE V2 - JavaScript
// ============================================

// ==========================================
// CONFIGURATION
// ==========================================

// Ganti URL ini dengan URL Web App dari Google Apps Script Anda
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPU4glnqkdwbyxsjF44NyygyWN4HCacUs54CJP6WAdiCSK9_Yvi96R0nn7UYCnb7gP/exec';

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let employeeData = {
    nama: 'Unknown',
    perusahaan: 'Nama Perusahaan',
    logoUrl: ''
};

let locationData = {
    latitude: null,
    longitude: null,
    error: null
};

let photoData = null;  // Base64 image data
let isSubmitting = false;

// ==========================================
// DOM ELEMENTS
// ==========================================

const elements = {
    employeeName: document.getElementById('employeeName'),
    companyName: document.getElementById('companyName'),
    companyLogo: document.getElementById('companyLogo'),
    companyBranding: document.querySelector('.company-branding'),
    coordinates: document.getElementById('coordinates'),
    currentTime: document.getElementById('currentTime'),
    currentDate: document.getElementById('currentDate'),
    headerTime: document.getElementById('headerTime'),
    btnCamera: document.getElementById('btnCamera'),
    cameraInput: document.getElementById('cameraInput'),
    photoPreview: document.getElementById('photoPreview'),
    capturedPhoto: document.getElementById('capturedPhoto'),
    btnMasuk: document.getElementById('btnMasuk'),
    btnPulang: document.getElementById('btnPulang'),
    absenStatus: document.getElementById('absenStatus'),
    notification: document.getElementById('notification'),
    notificationIcon: document.getElementById('notificationIcon'),
    notificationText: document.getElementById('notificationText'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupCameraInput();
});

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

    // 5. Check absensi status hari ini (V2)
    await checkAbsensiStatus();
}

// ==========================================
// URL PARAMETER PARSING
// ==========================================

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);

    employeeData.nama = params.get('nama') || 'Unknown';
    employeeData.perusahaan = params.get('perusahaan') || 'Nama Perusahaan';
    employeeData.logoUrl = params.get('logo') || '';

    // Decode URI components
    employeeData.nama = decodeURIComponent(employeeData.nama);
    employeeData.perusahaan = decodeURIComponent(employeeData.perusahaan);
    if (employeeData.logoUrl) {
        employeeData.logoUrl = decodeURIComponent(employeeData.logoUrl);
    }
}

function displayEmployeeInfo() {
    elements.employeeName.textContent = employeeData.nama;
    elements.companyName.textContent = employeeData.perusahaan;

    // Display logo if URL is provided
    if (employeeData.logoUrl) {
        elements.companyLogo.innerHTML = `<img src="${employeeData.logoUrl}" alt="Logo" onerror="this.parentElement.innerHTML='<span class=\'logo-placeholder\'>LOGO</span>'">`;
    }

    // Hide company branding section if both logo and company name are empty
    const hasLogo = employeeData.logoUrl && employeeData.logoUrl.trim() !== '';
    const hasCompanyName = employeeData.perusahaan && employeeData.perusahaan.trim() !== '' && employeeData.perusahaan !== 'Nama Perusahaan';

    if (!hasLogo && !hasCompanyName) {
        elements.companyBranding.classList.add('hidden');
    } else {
        elements.companyBranding.classList.remove('hidden');
    }
}

// ==========================================
// CAMERA FUNCTIONS (V2)
// ==========================================

function setupCameraInput() {
    elements.cameraInput.addEventListener('change', handleCameraCapture);
}

function openCamera() {
    elements.cameraInput.click();
}

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
        elements.capturedPhoto.src = photoData;
        elements.photoPreview.style.display = 'block';
        elements.btnCamera.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function retakePhoto() {
    photoData = null;
    elements.cameraInput.value = '';
    elements.photoPreview.style.display = 'none';
    elements.btnCamera.style.display = 'flex';
}

// ==========================================
// CLOCK & DATE
// ==========================================

function updateClock() {
    const now = new Date();

    // Time format: HH:MM:SS
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const timeStr = now.toLocaleTimeString('id-ID', timeOptions);
    elements.currentTime.textContent = timeStr;

    // Header time: HH:MM
    const headerTimeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    elements.headerTime.textContent = now.toLocaleTimeString('id-ID', headerTimeOptions);

    // Date format: Senin, 03 Februari 2026
    const dateOptions = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };
    const dateStr = now.toLocaleDateString('id-ID', dateOptions);
    elements.currentDate.textContent = dateStr;
}

// ==========================================
// GEOLOCATION
// ==========================================

function getLocation() {
    if (!navigator.geolocation) {
        locationData.error = 'Geolocation tidak didukung';
        displayLocationError();
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        options
    );
}

function onLocationSuccess(position) {
    locationData.latitude = position.coords.latitude;
    locationData.longitude = position.coords.longitude;
    locationData.error = null;

    displayLocation();
}

function onLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationData.error = 'Akses lokasi ditolak';
            break;
        case error.POSITION_UNAVAILABLE:
            locationData.error = 'Lokasi tidak tersedia';
            break;
        case error.TIMEOUT:
            locationData.error = 'Timeout mengambil lokasi';
            break;
        default:
            locationData.error = 'Error tidak diketahui';
    }

    displayLocationError();
}

function displayLocation() {
    const lat = locationData.latitude.toFixed(6);
    const lng = locationData.longitude.toFixed(6);
    elements.coordinates.textContent = `${lat}, ${lng}`;
    elements.coordinates.classList.remove('gps-error');
}

function displayLocationError() {
    elements.coordinates.textContent = locationData.error;
    elements.coordinates.classList.add('gps-error');
    elements.coordinates.classList.remove('loading-dots');
}

// ==========================================
// CHECK ABSENSI STATUS (V2)
// ==========================================

async function checkAbsensiStatus() {
    console.log('=== CHECKING ABSENSI STATUS ===');

    // Safety check
    if (!employeeData || !employeeData.nama) {
        console.error('❌ No employee data!');
        return;
    }

    try {
        const nama = encodeURIComponent(employeeData.nama);
        const url = `${APPS_SCRIPT_URL}?action=checkStatus&nama=${nama}`;
        console.log('Fetching status from:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Status result:', result);

        updateAbsensiStatus(result);
    } catch (error) {
        console.error('❌ Error checking status:', error);
        console.error('Error message:', error.message);
        // Jangan show error notification, ini adalah check opsional
    }
    console.log('=== STATUS CHECK DONE ===');
}

function updateAbsensiStatus(status) {
    console.log('Updating UI with status:', status);

    // Cek apakah user sudah submit MASUK/PULANG di session ini
    // Jika sudah, JANGAN override dengan status dari backend
    const hasMasukSession = sessionStorage.getItem('hasMasukToday') === 'true';
    const hasPulangSession = sessionStorage.getItem('hasPulangToday') === 'true';

    console.log('Session storage - hasMasukToday:', hasMasukSession, 'hasPulangToday:', hasPulangSession);

    // Update status message
    if (status.hasMasuk && status.hasPulang) {
        // Sudah lengkap
        console.log('✅ Status: Sudah lengkap (from backend)');
        setButtonState(elements.btnMasuk, true);
        setButtonState(elements.btnPulang, true);
        elements.absenStatus.innerHTML = '✅ <strong>Sudah absen lengkap hari ini</strong><br>MASUK: ' + status.jamMasuk + ' | PULANG: ' + status.jamPulang;
        elements.absenStatus.className = 'absen-status success';
    } else if (status.hasMasuk) {
        // Sudah MASUK, belum PULANG
        console.log('✅ Status: Sudah MASUK (from backend)');
        setButtonState(elements.btnMasuk, true);
        setButtonState(elements.btnPulang, false);
        elements.absenStatus.innerHTML = '✅ <strong>Sudah absen MASUK</strong><br>Jam: ' + status.jamMasuk + '<br>Silakan absen PULANG.';
        elements.absenStatus.className = 'absen-status info';
    } else if (hasMasukSession) {
        // Backend bilang belum absen, TAPI session bilang sudah MASUK
        // Ini karena backend cache belum update
        // Gunakan data dari session storage
        console.log('✅ Status: Sudah MASUK (from session - bypassing backend cache)');
        setButtonState(elements.btnMasuk, true);
        setButtonState(elements.btnPulang, !hasPulangSession);
        const jamMasuk = sessionStorage.getItem('jamMasuk') || '...';
        const jamPulang = sessionStorage.getItem('jamPulang') || '';

        if (hasPulangSession) {
            elements.absenStatus.innerHTML = '✅ <strong>Sudah absen lengkap hari ini</strong><br>MASUK: ' + jamMasuk + ' | PULANG: ' + jamPulang;
            elements.absenStatus.className = 'absen-status success';
        } else {
            elements.absenStatus.innerHTML = '✅ <strong>Sudah absen MASUK</strong><br>Jam: ' + jamMasuk + '<br>Silakan absen PULANG.';
            elements.absenStatus.className = 'absen-status info';
        }
    } else {
        // Belum absen sama sekali
        console.log('⏳ Status: Belum absen');
        setButtonState(elements.btnMasuk, false);
        setButtonState(elements.btnPulang, true);
        elements.absenStatus.innerHTML = '⏳ <strong>Belum absen hari ini</strong><br>Silakan ambil foto dan absen MASUK.';
        elements.absenStatus.className = 'absen-status warning';
    }
}

// Helper function to set button state (disabled + visual class)
function setButtonState(button, disabled) {
    button.disabled = disabled;

    if (disabled) {
        button.classList.add('btn-disabled');
        console.log('Button disabled with class:', button.className);
    } else {
        button.classList.remove('btn-disabled');
        console.log('Button enabled:', button.className);
    }
}

// ==========================================
// DEVICE DETECTION
// ==========================================

function getDeviceInfo() {
    const userAgent = navigator.userAgent;

    // Detect Device Type
    let deviceType = 'Desktop';
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = /Tablet|iPad/i.test(userAgent) ? 'Tablet' : 'Mobile';
    }

    // Detect OS
    let os = 'Unknown';
    if (/Windows/i.test(userAgent)) {
        os = 'Windows';
    } else if (/Macintosh|Mac OS/i.test(userAgent)) {
        os = 'MacOS';
    } else if (/Android/i.test(userAgent)) {
        os = 'Android';
    } else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) {
        os = 'iOS';
    } else if (/Linux/i.test(userAgent)) {
        os = 'Linux';
    }

    // Detect Browser
    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent) && !/Edge|OPR/i.test(userAgent)) {
        browser = 'Chrome';
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        browser = 'Safari';
    } else if (/Firefox/i.test(userAgent)) {
        browser = 'Firefox';
    } else if (/Edge/i.test(userAgent)) {
        browser = 'Edge';
    } else if (/OPR/i.test(userAgent)) {
        browser = 'Opera';
    }

    return {
        deviceType,
        os,
        browser,
        userAgent
    };
}

// ==========================================
// SUBMIT ABSENSI
// ==========================================

async function submitAbsensi(tipe) {
    console.log('=== SUBMIT ABSENSI START ===');
    console.log('Tipe:', tipe);
    console.log('Tombol MASUK disabled?', elements.btnMasuk.disabled);
    console.log('Tombol PULANG disabled?', elements.btnPulang.disabled);

    // Prevent double submit - check both isSubmitting flag and button state
    if (isSubmitting) {
        console.log('⚠️ Already submitting...');
        alert('Sedang memproses, harap tunggu...');
        return;
    }

    // Check if this specific button is already disabled
    const clickedBtn = tipe === 'MASUK' ? elements.btnMasuk : elements.btnPulang;
    if (clickedBtn.disabled || clickedBtn.classList.contains('btn-disabled')) {
        console.log('⚠️ Button already disabled, ignoring click...');
        return;
    }

    // Check if URL is configured
    if (APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        alert('⚠️ URL Apps Script belum dikonfigurasi!\nSilakan hubungi admin.');
        console.error('URL not configured');
        return;
    }

    // Validate photo (required in V2)
    if (!photoData) {
        alert('❌ Silakan ambil foto terlebih dahulu!');
        console.error('No photo data');
        return;
    }

    console.log('✅ Validation passed');
    console.log('Nama:', employeeData.nama);
    console.log('Photo size:', photoData.length);

    isSubmitting = true;
    showLoading(true);
    disableButtons(true);

    console.log('⏳ Starting submit process...');

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

    console.log('Sending data:', {
        nama: data.nama,
        tipe: data.tipe,
        hasLocation: !!(data.latitude && data.longitude),
        photoSize: data.photo ? data.photo.length : 0
    });

    try {
        // Send to Google Apps Script
        // Using no-cors mode because Google Apps Script doesn't send CORS headers
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Fetch completed, response:', response);

        // With no-cors, we can't read the response, but request is sent
        // Show success (assuming it worked)
        const successMsg = tipe === 'MASUK'
            ? '✅ Absensi MASUK berhasil!'
            : '✅ Absensi PULANG berhasil!';

        showNotification(successMsg, false);
        console.log('Success notification shown');

        // Visual feedback on button
        const btn = tipe === 'MASUK' ? elements.btnMasuk : elements.btnPulang;
        btn.classList.add('success');
        setTimeout(() => btn.classList.remove('success'), 300);

        // UPDATE STATUS LANGSUNG BERDASARKAN SUBMIT YANG SUKSES
        // Ini mengatasi masalah backend cache yang belum bisa baca data baru
        console.log('✅ Updating UI status based on successful submit...');

        const now = new Date();
        const jam = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        if (tipe === 'MASUK') {
            // Update UI untuk status MASUK
            setButtonState(elements.btnMasuk, true);
            setButtonState(elements.btnPulang, false);
            elements.absenStatus.innerHTML = '✅ <strong>Sudah absen MASUK</strong><br>Jam: ' + jam + '<br>Silakan absen PULANG.';
            elements.absenStatus.className = 'absen-status info';
            console.log('✅ Status updated: Sudah MASUK');
        } else {
            // Update UI untuk status PULANG (lengkap)
            setButtonState(elements.btnMasuk, true);
            setButtonState(elements.btnPulang, true);
            elements.absenStatus.innerHTML = '✅ <strong>Sudah absen lengkap hari ini</strong><br>MASUK: ' + (sessionStorage.getItem('jamMasuk') || jam) + ' | PULANG: ' + jam;
            elements.absenStatus.className = 'absen-status success';
            console.log('✅ Status updated: Sudah lengkap');
        }

        // Simpan ke sessionStorage untuk persist status di session browser
        if (tipe === 'MASUK') {
            sessionStorage.setItem('jamMasuk', jam);
            sessionStorage.setItem('hasMasukToday', 'true');
        } else if (tipe === 'PULANG') {
            sessionStorage.setItem('jamPulang', jam);
            sessionStorage.setItem('hasPulangToday', 'true');
        }

        console.log('💡 Status diupdate langsung dari frontend (backend cache issue)');

        // Clear photo after successful submit
        if (tipe === 'PULANG') {
            retakePhoto();
        }

        showLoading(false);
        isSubmitting = false;
        console.log('=== SUBMIT ABSENSI END ===');

    } catch (error) {
        console.error('❌ Submit error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);

        alert(`❌ Gagal mengirim absensi!\n\nError: ${error.message}\n\nSilakan coba lagi atau hubungi admin.`);

        showNotification('❌ Gagal mengirim data. Coba lagi.', true);

        // Re-enable buttons ONLY on error
        showLoading(false);
        disableButtons(false);
        isSubmitting = false;
        console.log('=== SUBMIT ABSENSI END (ERROR) ===');
    }
}

// ==========================================
// RIWAYAT FUNCTIONS (V2)
// ==========================================

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

    const container = document.getElementById('riwayatList');
    container.innerHTML = '<p class="loading-message">Memuat riwayat...</p>';

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getRiwayat&nama=${nama}&bulan=${bulan}&tahun=${tahun}`);
        const data = await response.json();

        renderRiwayat(data);
    } catch (error) {
        console.error('Error loading riwayat:', error);
        container.innerHTML = '<p class="riwayat-empty">Gagal memuat riwayat. Silakan coba lagi.</p>';
    }
}

function renderRiwayat(data) {
    const container = document.getElementById('riwayatList');

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="riwayat-empty">Tidak ada data riwayat untuk periode ini.</p>';
        return;
    }

    let html = '';
    data.forEach(item => {
        const isAuto = item.isAuto ? ' <span style="color: #ffa502; font-size: 0.8rem;">(auto)</span>' : '';
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

// ==========================================
// UI HELPERS
// ==========================================

function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.add('show');
    } else {
        elements.loadingOverlay.classList.remove('show');
    }
}

function disableButtons(disabled) {
    // Disable buttons
    elements.btnMasuk.disabled = disabled;
    elements.btnPulang.disabled = disabled;

    // Visual disable - tambahkan class untuk override
    if (disabled) {
        elements.btnMasuk.classList.add('btn-disabled');
        elements.btnPulang.classList.add('btn-disabled');
    } else {
        elements.btnMasuk.classList.remove('btn-disabled');
        elements.btnPulang.classList.remove('btn-disabled');
    }

    console.log('Buttons disabled:', disabled, 'MASUK:', elements.btnMasuk.disabled, 'PULANG:', elements.btnPulang.disabled);
}

function showNotification(message, isError = false) {
    // Set content
    elements.notificationText.textContent = message;

    // Set style
    elements.notification.classList.remove('success', 'error');
    elements.notification.classList.add(isError ? 'error' : 'success');

    // Show
    elements.notification.classList.add('show');

    // Auto hide after 3 seconds
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// ==========================================
// DEBUG (for development)
// ==========================================

function debugInfo() {
    console.log('Employee Data:', employeeData);
    console.log('Location Data:', locationData);
    console.log('Photo Data:', photoData ? 'Has photo' : 'No photo');
    console.log('Apps Script URL:', APPS_SCRIPT_URL);
}

// Expose to console for debugging
window.debugInfo = debugInfo;
