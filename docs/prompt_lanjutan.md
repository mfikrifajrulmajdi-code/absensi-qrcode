# Prompt Lanjutan: Sistem Absensi QR Code V2

Gunakan prompt ini untuk melanjutkan pengembangan di session baru:

---

## PROMPT:

```
Saya sedang mengerjakan proyek Sistem Absensi QR Code V2 di folder:
d:\ai\percobaan\absensi-qrcode

## Tech Stack:
- Frontend: HTML, CSS, Vanilla JS (GitHub Pages)
- Backend: Google Apps Script
- Database: Google Sheets (sheet "Absensi" dan "Izin")
- Apps Script URL: https://script.google.com/macros/s/AKfycbw_auQAH6kPH-ivJPTgnsY_lsqieizti_1IrjjeYAl2t8hWok_nY5o9ngwA9s--t9md/exec

## Status Terakhir:
Sudah selesai implementasi:
1. ✅ Admin dashboard dengan summary MASUK/PULANG/BELUM ABSEN
2. ✅ Sistem pengajuan izin/sakit/cuti (form di src/izin.html)
3. ✅ Admin approval system untuk izin
4. ✅ Auto-detect izin setengah hari (jika sudah MASUK)
5. ✅ Auto-generate PULANG saat izin disetujui (jika entry terakhir MASUK)
6. ✅ Validasi duplikat izin (1 orang 1 izin per tanggal)

## File Penting:
- scripts/CodeV2.gs → Backend semua logic
- admin/admin.html & admin.js → Dashboard admin
- src/izin.html & izin.js → Form pengajuan izin
- index.html & app.js → Halaman utama absensi

## Struktur Sheet Izin:
Timestamp | Nama | Jenis | Tanggal | Alasan | Lampiran | Status | Updated At | Durasi

## Yang Mungkin Perlu Dikerjakan:
- Test dan fix bug yang mungkin muncul
- Notifikasi ke admin saat ada izin baru
- Riwayat izin di halaman karyawan
- Filter izin di admin dashboard

## Catatan:
- Setiap perubahan di CodeV2.gs HARUS redeploy Apps Script dengan "New version"
- Frontend otomatis update via GitHub Pages

Tolong review file walkthrough.md di folder .gemini untuk detail lengkap.

[LANJUTKAN DARI SINI - deskripsikan apa yang ingin dikerjakan]
```

---

## Tips Penggunaan:

1. Copy prompt di atas ke session baru
2. Tambahkan di bagian `[LANJUTKAN DARI SINI]` apa yang ingin dikerjakan
3. Contoh:
   - "Tolong tambahkan notifikasi Telegram saat ada izin baru"
   - "Fix bug: auto-PULANG tidak muncul setelah approve izin"
   - "Tambahkan halaman riwayat izin untuk karyawan"
