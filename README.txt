BELVADEVA V9 — CARA MEMASANG

PILIH SATU CARA:
A. Praktis satu file: gunakan index-standalone.html, ubah nama menjadi index.html dan unggah menggantikan file lama. Gambar dan kode tertanam. Tanpa instalasi PWA.
B. Versi terstruktur + PWA: unggah index.html, css/, js/, images/, audio/, manifest.webmanifest, sw.js ke folder repository GitHub Pages yang sama. Jangan hanya copy index.html untuk cara B. Tidak perlu mengunggah index-standalone.html.

PROGRES
- V9 membaca bintang selesai dari belva-world-v2 pada origin/browser yang sama. Penyimpanan lama tidak dihapus. Statistik percobaan pertama lama tidak dibuat-buat.
- Progres V9 memakai ID profil, sehingga mengubah nama tidak mengubah identitas progres.
- Cadangan V9 memakai JSON V9. Impor versi lama belum tersedia; migrasi langsung dari browser lama didukung.
- Ketika mengganti HP, ekspor JSON V9 dari mode orang tua, lalu impor di HP baru.
- Lima bintang diberikan untuk misi selesai, termasuk ketika memakai bantuan. Ringkasan orang tua memakai benar pada percobaan pertama tanpa bantuan; ini bukan asesmen klinis.
- Semua 6 karakter/kostum dapat langsung dipilih saat masuk. Koleksi stiker tetap terbuka lewat misi.

AUDIO — BATASAN YANG PENTING
- Paket ini BELUM berisi rekaman suara. TTS bawaan perangkat masih dipakai, sehingga kualitas/bunyi perlu dicoba di HP.
- Modul sudah mendahulukan audio di audio/catalog.json. Tambahkan MP3 Indonesia, isi path contohnya audio/betul.mp3 pada key correct. Gunakan klip umum, jangan audio yang menyebut nama anak tertentu untuk semua profil.
- Jika audio ditambah, tambahkan juga path ke ASSETS dalam sw.js dan naikkan nama CACHE agar tersedia offline.

PWA
- Buka situs lewat HTTPS dengan koneksi internet sekali, lalu muat ulang. Setelah cache terpasang dapat dicoba offline.
- Instal ke layar utama bergantung browser; audio TTS tertentu tetap membutuhkan internet.
- Jika service worker lama masih aktif, tutup semua tab aplikasi lalu buka kembali.

VALIDASI
- Soal dan kunci jawaban, bantuan, bintang completion, resume, isolasi profil, cadangan, migrasi, dan ringkasan diuji dengan DOM terprogram.
- Tampilan portrait/landscape, kualitas suara dan instalasi PWA di HP nyata belum diverifikasi.
- Tidak ada pelacak/analitik/font eksternal. Pengaturan perangkat TTS dapat memakai layanan jaringan sendiri.
