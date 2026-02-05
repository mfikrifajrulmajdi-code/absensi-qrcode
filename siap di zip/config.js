// ============================================
// KONFIGURASI SISTEM ABSENSI - EDIT FILE INI SAJA
// ============================================
// 
// Petunjuk Setup:
// 1. Ganti APPS_SCRIPT_URL dengan URL dari Google Apps Script Anda
// 2. Ganti COMPANY_NAME dengan nama perusahaan/organisasi
// 3. (Opsional) Ganti ADMIN_EMAIL untuk notifikasi
// 4. Save file ini
// 5. Selesai! Semua halaman akan menggunakan konfigurasi ini.
//
// ============================================

const CONFIG = {
    // ==========================================
    // WAJIB DIGANTI - URL Backend
    // ==========================================
    // Dapatkan URL ini dari: Google Sheets → Extensions → Apps Script → Deploy → Web app
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec',

    // ==========================================
    // INFO PERUSAHAAN (Opsional)
    // ==========================================
    COMPANY_NAME: 'Nama Perusahaan',
    ADMIN_EMAIL: 'admin@example.com',

    // ==========================================
    // PENGATURAN SISTEM (Jangan diubah kecuali perlu)
    // ==========================================
    VERSION: '2.0.0',
    AUTO_REFRESH_INTERVAL: 30,  // Detik - interval refresh dashboard admin
    MAX_PHOTO_SIZE: 5,          // MB - maksimal ukuran foto
    JAM_KERJA: 8                // Jam - untuk kalkulasi auto-fix pulang
};

// ============================================
// JANGAN EDIT DI BAWAH INI
// ============================================

// Backward compatibility - agar kode lama tetap bisa jalan
const APPS_SCRIPT_URL = CONFIG.APPS_SCRIPT_URL;

// Export untuk module (jika diperlukan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
