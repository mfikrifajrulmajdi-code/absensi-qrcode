# Prompt Lanjutan: Sistem Absensi QR Code V3

Gunakan prompt ini untuk melanjutkan pengembangan di session baru.

---

## 📋 PROMPT LENGKAP (Copy ini):

```
Saya sedang mengerjakan proyek Sistem Absensi QR Code V3 di folder:
d:\ai\percobaan\absensi-qrcode

## Tech Stack:
- Frontend: HTML, CSS, Vanilla JS (GitHub Pages)
- Backend: Google Apps Script
- Database: Google Sheets (sheet "Absensi" dan "Izin")
- Apps Script URL: https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec

## Status Terakhir (V2 - Verified 2026-02-05):
✅ Admin dashboard dengan summary MASUK/PULANG/BELUM ABSEN
✅ Sistem pengajuan izin/sakit/cuti (form di src/izin.html)
✅ Admin approval system untuk izin
✅ Auto-detect izin setengah hari (jika sudah MASUK)
✅ Auto-generate PULANG saat izin disetujui (jika entry terakhir MASUK)
✅ Validasi duplikat izin (1 orang 1 izin per tanggal)
✅ Testing verified - sistem berjalan normal

## File Penting:
- scripts/CodeV2.gs → Backend semua logic (1084 lines)
- admin/admin.html & admin.js → Dashboard admin
- src/izin.html & izin.js → Form pengajuan izin
- index.html & app.js → Halaman utama absensi
- docs/V3_ROADMAP.md → Rencana fitur V3 dengan code snippet

## Struktur Sheet Absensi:
Timestamp | Nama | Tipe | Latitude | Longitude | Device Type | OS | Browser | User Agent | Foto

## Struktur Sheet Izin:
Timestamp | Nama | Jenis | Tanggal | Alasan | Lampiran | Status | Updated At | Durasi

## API Endpoints (GET):
- ?action=checkStatus&nama=X → Cek status MASUK/PULANG hari ini
- ?action=summary → Summary absensi hari ini
- ?action=getData → Data absensi dengan filter
- ?action=getRiwayat&nama=X&bulan=Y&tahun=Z → Riwayat absensi
- ?action=getIzinPending → List izin pending approval
- ?action=approveIzin&id=X&status=Y → Approve/reject izin
- ?action=export → Export data ke CSV

## V3 Roadmap (Prioritas):
1. 🔴 Riwayat Izin di Halaman Karyawan - Karyawan lihat status izin
2. 🟡 Notifikasi Email ke Admin - MailApp.sendEmail saat izin baru
3. 🟡 Filter & Search di Admin - Filter by status/nama/tanggal
4. 🟢 Export Laporan Excel/PDF - Client-side CSV atau server PDF
5. 🟢 Dashboard Statistik - Chart.js untuk visualisasi

## Catatan:
- Setiap perubahan di CodeV2.gs HARUS redeploy Apps Script dengan "New version"
- Frontend otomatis update via GitHub Pages
- Roadmap lengkap ada di docs/V3_ROADMAP.md dengan code snippet

Tolong implementasikan fitur: [PILIH DARI ROADMAP V3]
```

---

## 🎯 Contoh Penggunaan:

### Opsi 1 - Riwayat Izin:
```
[...prompt di atas...]
Tolong implementasikan fitur: Riwayat Izin di Halaman Karyawan
```

### Opsi 2 - Notifikasi Email:
```
[...prompt di atas...]
Tolong implementasikan fitur: Notifikasi Email ke Admin saat ada izin baru
```

### Opsi 3 - Filter Dashboard:
```
[...prompt di atas...]
Tolong implementasikan fitur: Filter & Search di Admin Dashboard
```

---

## 📁 Struktur Folder:

```
d:\ai\percobaan\absensi-qrcode\
├── index.html          # Halaman utama absensi
├── app.js              # Logic halaman utama
├── style.css           # Styling global
├── admin/
│   ├── admin.html      # Dashboard admin
│   └── admin.js        # Logic admin
├── src/
│   ├── izin.html       # Form izin
│   ├── izin.js         # Logic izin
│   └── izin.css        # Styling izin
├── scripts/
│   └── CodeV2.gs       # Backend Apps Script (COPY KE GOOGLE SHEETS)
├── tools/
│   └── qr-generator.html # Generator QR code
├── docs/
│   ├── V3_ROADMAP.md   # ⭐ Rencana fitur V3 dengan code snippet
│   └── prompt_lanjutan.md # File ini
└── TESTING_GUIDE.md    # Panduan testing lengkap
```

---

## ⚠️ Reminder Deployment:

1. Edit `scripts/CodeV2.gs` di local
2. Copy ke Google Apps Script Editor
3. Deploy → New deployment → Web app
4. Execute as: Me, Access: Anyone
5. Test di browser
6. Commit & push ke GitHub (frontend auto-update)

---

**Last Updated:** 2026-02-05
**Version:** V2 (Verified) → Ready for V3
