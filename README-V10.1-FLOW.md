# BelvaDeva V10.1 — Child Journey Thread

## Fokus perubahan
- Navigasi anak disederhanakan menjadi Beranda / Main / Koleksi.
- Kostum tetap ada, tetapi menjadi bagian dari karakter/koleksi, bukan tujuan utama di dock.
- Beranda punya satu tujuan utama: Petualangan Hari Ini (5 bintang).
- Lima misi harian dipilih deterministik per profil per tanggal; semua game tetap bebas dibuka dari Main.
- Hasil setiap game kembali ke loop: bintang hari ini → hadiah → lanjut petualangan / pilih game.
- Journey 9 Bintang tetap sebagai special story adventure, tidak mengunci game utama.
- Tidak mengubah schema/localStorage V10 atau data pemain.

## Uji cepat
1. Pilih Belva/Deva dan kostum.
2. Home harus menunjukkan 0–5 bintang dan satu CTA utama.
3. Tekan Main: semua kategori game terbuka.
4. Masuk game Jari langsung tanpa game lain.
5. Selesaikan satu misi harian: bintang Home bertambah.
6. Hasil misi menawarkan Lanjut petualangan atau pilih game sendiri.
7. Koleksi punya tombol Kostum dan Main lagi.
8. Kostum kembali ke Home.
9. Ganti profil: progres harian masing-masing terpisah.
10. Refresh: data lama/progres tetap ada.
