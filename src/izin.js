// ============================================
// FORM IZIN - JavaScript
// ============================================

// Ganti URL ini dengan URL Web App dari Google Apps Script Anda
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec';

// ==========================================
// INITIALIZATION
// ==========================================

let sudahMasukHariIni = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Parse nama dari URL
    const nama = new URLSearchParams(window.location.search).get('nama');

    if (nama) {
        document.getElementById('nama').value = decodeURIComponent(nama);
        // Cek status MASUK hari ini
        await checkMasukStatusHariIni(decodeURIComponent(nama));
    } else {
        document.getElementById('nama').value = 'Unknown';
        document.getElementById('nama').placeholder = 'Nama tidak ditemukan di URL';
    }

    // Set tanggal default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    document.getElementById('tanggal').max = today; // Tidak bisa pilih tanggal masa depan

    // Setup file input
    setupFileInput();
});

/**
 * Cek apakah karyawan sudah MASUK hari ini
 */
async function checkMasukStatusHariIni(nama) {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=checkStatus&nama=${encodeURIComponent(nama)}`);
        const data = await response.json();

        console.log('Status check result:', data);

        if (data.sudahMasuk) {
            sudahMasukHariIni = true;
            // Tampilkan info banner
            document.getElementById('infoBanner').style.display = 'block';
            // Auto-set durasi ke setengah hari
            const setengahHariRadio = document.querySelector('input[name="durasi"][value="SETENGAH_HARI"]');
            if (setengahHariRadio) {
                setengahHariRadio.checked = true;
            }
        }
    } catch (error) {
        console.error('Error checking MASUK status:', error);
    }
}

// ==========================================
// FILE INPUT HANDLING
// ==========================================

let lampiranData = null;

function setupFileInput() {
    const fileInput = document.getElementById('lampiran');

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];

        if (!file) {
            lampiranData = null;
            document.getElementById('filePreview').style.display = 'none';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('❌ Ukuran file maksimal 5MB', true);
            fileInput.value = '';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showNotification('❌ Hanya file gambar (JPG, PNG) atau PDF yang diperbolehkan', true);
            fileInput.value = '';
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            lampiranData = e.target.result;

            // Show preview
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('filePreview').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    });
}

function removeFile() {
    document.getElementById('lampiran').value = '';
    lampiranData = null;
    document.getElementById('filePreview').style.display = 'none';
}

// ==========================================
// SUBMIT IZIN
// ==========================================

async function submitIzin(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value;
    const jenis = document.querySelector('input[name="jenis"]:checked').value;
    const tanggal = document.getElementById('tanggal').value;
    const alasan = document.getElementById('alasan').value;

    // Validate
    if (nama === 'Unknown') {
        showNotification('❌ Nama tidak ditemukan. Pastikan URL benar.', true);
        return;
    }

    if (!tanggal) {
        showNotification('❌ Silakan pilih tanggal izin', true);
        return;
    }

    if (!alasan || alasan.trim().length < 5) {
        showNotification('❌ Silakan isi alasan (minimal 5 karakter)', true);
        return;
    }

    // Disable submit button
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    try {
        const durasi = document.querySelector('input[name="durasi"]:checked').value;

        const data = {
            action: 'submitIzin',  // Identifier for backend routing
            nama: nama,
            jenis: jenis,
            tanggal: tanggal,
            alasan: alasan,
            durasi: durasi,
            lampiran: lampiranData || ''
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Success
        showNotification('✅ Pengajuan izin berhasil dikirim! Menunggu approval admin.', false);

        // Reset form
        document.getElementById('izinForm').reset();

        // Reset nama
        document.getElementById('nama').value = nama;

        // Reset tanggal ke hari ini
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggal').value = today;

        // Reset lampiran
        lampiranData = null;
        document.getElementById('filePreview').style.display = 'none';

    } catch (error) {
        console.error('Submit error:', error);
        showNotification('❌ Gagal mengirim pengajuan. Silakan coba lagi.', true);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = '📤 Kirim Pengajuan';
    }
}

// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');

    notification.textContent = message;
    notification.className = 'notification show ' + (isError ? 'error' : 'success');

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// ==========================================
// DEBUG
// ==========================================

function debugInfo() {
    console.log('Apps Script URL:', APPS_SCRIPT_URL);
    console.log('Nama:', document.getElementById('nama').value);
    console.log('Lampiran:', lampiranData ? 'Has file' : 'No file');
}

window.debugInfo = debugInfo;
