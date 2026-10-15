# BelvaDeva V10.3.1 — FULL UPLOAD

## Cara upload ke GitHub Pages
1. Ekstrak ZIP ini.
2. Buka repository GitHub `belvadeva`.
3. Upload **isi folder ini langsung ke root repository** (pastikan `index.html` berada di root).
4. Commit changes.
5. GitHub → Settings → Pages → Deploy from branch → `main` / `(root)`.
6. Tunggu 1–3 menit lalu buka GitHub Pages.

## Setelah update dari versi lama
Karena aplikasi memakai Service Worker/PWA, browser HP kadang masih menampilkan cache lama. Jika tampilan belum berubah, refresh 2x atau tutup-buka tab. Service worker V10.3.1 otomatis membersihkan cache BelvaDeva lama setelah aktif.

## Musik / lagu
- Musik latar original dibuat secara procedural menggunakan Web Audio API.
- Tidak memakai lagu komersial atau file audio dari internet.
- Berfungsi offline setelah aplikasi tercache.
- Musik berbeda untuk Home, Angka, Jari, Kata, Warna, tiap lokasi Journey, Koleksi, dan Reward.
- Browser HP memerlukan sentuhan pertama sebelum audio boleh berbunyi.
- Saat narasi soal berbunyi, volume musik otomatis diturunkan.
- Volume dapat diatur dari Mode Orang Tua.

## Fitur final
- Profil Belva / Deva + kostum Dongeng, Superhero, Antariksa.
- Daily missions dan collectible rewards.
- Angka, jari, tambah, kurang, huruf, suku kata, membaca, warna.
- Story Journey: 5 lokasi × 5 checkpoint = 25 bintang.
- Countdown dan kesempatan: Lv1=3, Lv2=4, Lv3=6, Lv4=10, Lv5=12.
- Animasi menang Belva/Deva + Victory FX.
- Family Reward setelah 25/25 bintang.
- PWA/offline + local progress + parent gate + backup data.
