# BelvaDeva V10 — Tahap 0 + Tahap 1

Baseline: `BelvaDeva-Adaptive-Backsound-FingersConsistent.html`.

## Asumsi aman
- Kunci `localStorage` tetap `belvadeva-v9` agar data yang sudah ada tetap ditemukan. Isi datanya dimigrasikan ke schema 10 secara in-place tanpa menghapus key lama lain.
- Import cadangan menerima format V9 dan V10.
- Semua data pemain tetap lokal di perangkat; tidak ada server, tracker, analytics, CDN, atau font eksternal.
- PWA/service worker aktif hanya saat dilayani lewat `http://localhost`, HTTPS, atau GitHub Pages. Membuka `index.html` langsung tetap menjalankan aplikasi, tetapi browser tidak mengaktifkan service worker pada `file://`.
- WebP menjadi format utama untuk gambar besar. Fallback JPEG lokal tetap disediakan.

# Tahap 0 — Modularisasi

## File yang dihasilkan/diubah
- `index.html`
- `css/app.css`
- `js/data.js`
- `js/profiles.js`
- `js/audio.js`
- `js/music.js`
- `js/rewards.js`
- `js/game.js`
- `js/app.js`
- `assets/images/*`
- `tools/stage0_extract.py`
- `stage0-report.json`

## Ringkasan
- 8 data URI gambar base64 dikeluarkan dari HTML ke `assets/images/`.
- 11 blok `<style>` digabung berurutan menjadi `css/app.css` agar cascade tidak berubah.
- 7 blok JavaScript dipisah sesuai tanggung jawab modul.
- Urutan pemuatan JavaScript dipertahankan.
- Tidak ada `data:image/...;base64` tersisa di source modular.
- Syntax seluruh file JS dicek dengan `node --check` bila Node tersedia.

## Cara membangun ulang Tahap 0
```bash
python tools/stage0_extract.py BelvaDeva-Adaptive-Backsound-FingersConsistent.html ./build-stage0
```

## Checklist manual Tahap 0
1. Buka `index.html` dan pastikan layar pemilih Belva/Deva tampil.
2. Pilih Belva, pilih satu kostum, lalu pastikan Home muncul.
3. Buka **Dunia** dan masuk ke minimal 3 sub-game berbeda.
4. Pastikan ilustrasi jari, karakter, dan gambar Home muncul; tidak ada ikon gambar rusak.
5. Selesaikan satu soal, refresh, lalu pastikan progres tetap tersimpan.
6. Ganti profil Belva → Deva dan pastikan progres profil tidak bercampur.
7. Buka Mode Orang Tua dan pastikan data lama tetap terlihat.
8. Cek console browser: tidak boleh ada 404 untuk `css/`, `js/`, atau `assets/`.

# Tahap 1 — Performa, PWA, dan keamanan data

## File yang dihasilkan/diubah
- `index.html`
- `css/app.css`
- `js/profiles.js`
- `js/audio.js`
- `js/music.js`
- `js/app.js`
- `js/storage.js` (baru)
- `js/pwa.js` (baru)
- `manifest.webmanifest` (baru)
- `sw.js` (baru)
- `audio/catalog.json` (baru, placeholder lokal untuk rekaman)
- `assets/images/family-3d2d.webp` + fallback `.jpg`
- `assets/characters/*.webp` + fallback `.jpg`
- `assets/icons/*`
- `stage1-image-report.json`
- `stage1-report.json`
- `tools/stage1_upgrade.py`
- `tools/rebuild_stage01.py`
- `tests/stage1-smoke.js`

## Optimasi gambar
| Aset | Sebelum | WebP utama | Penghematan |
|---|---:|---:|---:|
| Family 3D/2D | 1,880,082 B | 133,110 B | 92.9% |
| Atlas karakter | 223,789 B | 112,384 B total 6 WebP | 49.8% jika keenamnya dimuat |

Fallback lokal:
- Family: `family-3d2d.jpg` 249,017 B.
- 6 karakter: total fallback JPG sekitar 214 KB.
- Atlas/PNG besar build-time tidak lagi ikut runtime final.

## PWA/offline
- `manifest.webmanifest` + ikon 192/512 + apple-touch-icon.
- `sw.js` melakukan precache dan cache-first untuk resource same-origin.
- Cache diberi versi berdasarkan hash isi file, jadi deploy perubahan baru memicu cache baru.
- Semua aset runtime lokal; tidak ada CDN.

## Data dan migrasi
- Schema dinaikkan menjadi **10**.
- Key penyimpanan sengaja tetap `belvadeva-v9` agar instalasi lama langsung terbaca.
- Store V9 dimigrasikan ke V10 tanpa menghapus pemain/progres.
- Migrasi langsung dari `belva-world-v2` tetap dipertahankan.
- Import backup menerima V9 dan V10.
- `navigator.storage.persist()` dipanggil bila browser mendukungnya.
- Parent Mode menampilkan status penyimpanan permanen, tanggal ekspor terakhir, dan reminder jika belum backup / >7 hari.

## Parent gate
- Harus menahan tombol selama 3 detik terlebih dahulu.
- Setelah itu input matematika dibuka.
- Soal acak lebih sulit: penjumlahan, pengurangan, atau perkalian sederhana.

## Audio
Tiga volume tersimpan terpisah:
- Musik latar.
- Efek suara.
- Narasi/TTS.

Musik tetap ducking saat narasi berbicara. `audio/catalog.json` disiapkan untuk rekaman lokal pada tahap berikutnya.

## Cara membangun ulang Tahap 0 + 1
Build-time membutuhkan Python + Pillow. Node opsional untuk syntax check.

```bash
python tools/rebuild_stage01.py \
  BelvaDeva-Adaptive-Backsound-FingersConsistent.html \
  ./build
```

Untuk menguji PWA lokal:
```bash
cd build
python -m http.server 8080
```
Lalu buka `http://localhost:8080`.

## Checklist manual Tahap 1
1. Sebelum deploy, simpan backup V9. Buka build baru dan pastikan profil/progres yang sama tetap muncul.
2. Selesaikan satu soal, reload halaman, pastikan progres baru tetap tersimpan bersama progres lama.
3. Buka Orang Tua: pastikan gerbang belum menerima soal sebelum tombol ditahan penuh 3 detik.
4. Setelah hold selesai, jawab soal matematika benar dan pastikan Parent Mode terbuka.
5. Geser volume Musik, Efek, Narasi ke nilai berbeda; keluar/refresh; buka Parent Mode dan pastikan nilainya tetap.
6. Klik **Tes efek** dan **Tes narasi** untuk memastikan slider masing-masing bekerja.
7. Cek bagian Cadangan: tanggal ekspor terakhir tampil; jika belum pernah backup, reminder 7 hari tampil.
8. Klik ekspor, kembali ke Parent Mode, pastikan tanggal ekspor berubah.
9. Jalankan lewat HTTPS/localhost, aktifkan airplane mode setelah halaman selesai ter-cache, reload, lalu coba Home + Dunia + beberapa game.
10. Di Chrome DevTools/Application atau Safari Web Inspector, pastikan manifest dan service worker aktif dan tidak ada request ke domain eksternal.

## Uji otomatis yang sudah dijalankan
- `node --check` untuk seluruh JS + service worker: lulus.
- `tests/stage1-smoke.js`: migrasi store V9 → V10, import backup V9, dan migrasi `belva-world-v2`: lulus.
- Pemeriksaan referensi file dari `index.html`: tidak ada referensi yang hilang.
- Rebuild bersih dari HTML tunggal menggunakan `tools/rebuild_stage01.py`: lulus.

Catatan: lingkungan build saat ini memblokir navigasi browser headless/local HTTP, sehingga instalasi PWA/offline real-browser tetap perlu checklist manual di HP/desktop nyata.
