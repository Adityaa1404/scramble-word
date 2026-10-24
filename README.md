# 🎮 Word Hunt (Scramble Word)

> **Game Susun Kata Berbasis Web (Vanilla JavaScript)**  
> Game tebak dan susun kata interaktif yang dibangun murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript** tanpa ketergantungan library, framework, maupun build tools.

---

## 📖 Gambaran Permainan

**Word Hunt** adalah game berbasis web di mana pemain ditantang untuk menyusun sebanyak mungkin kata valid bahasa Indonesia dari sekumpulan huruf acak yang disediakan pada setiap ronde.

Permainan terdiri dari 3 alur layar utama:
1. **Layar Pengaturan (*Setup Screen*)**: Pemain memilih ronde yang ingin dimainkan lalu menekan tombol **"Mulai Main"**.
2. **Layar Arena (*Game Screen*)**: Area bermain interaktif yang menampilkan papan skor, kotak kata tersusun, deretan ubin huruf, tombol aksi (Kirim, Acak, Hapus, Lanjut), serta kisi daftar kata tersembunyi yang harus dicari.
3. **Layar Hasil (*Result Screen*)**: Ringkasan pencapaian dan total skor akhir setelah seluruh ronde selesai, lengkap dengan tombol untuk bermain kembali.

---

## ✨ Fitur Permainan

- 🔠 **3 Ronde Permainan Mandiri**: Dilengkapi bank kata bawaan bahasa Indonesia yang siap dimainkan tanpa memerlukan koneksi internet/server.
- 👆 **Mekanisme Ketukan Ubin (*Tap-to-Assemble & Tap-to-Remove*)**:
  - Klik huruf di kolam bawah untuk memasukkannya ke kotak susunan kata. Huruf yang terpilih otomatis dinonaktifkan di kolam bawah.
  - Klik huruf yang ada di kotak atas untuk membatalkan dan mengembalikannya ke kolam huruf.
- 🎲 **Pengacakan Huruf Adil (Fisher-Yates Shuffle)**: Tombol **"Acak Huruf"** mengocok posisi huruf secara merata untuk membantu pemain menemukan inspirasi kata baru.
- 🎯 **Kisi Target Kata Dinamis**: Kata target awalnya tertutup (hanya menampilkan jumlah huruf). Begitu ditebak dengan benar, kata akan terbuka bersama poin yang didapatkan.
- 🏆 **Sistem Skor Proporsional**: Setiap tebakan kata yang valid memberikan poin sesuai panjang kata (`panjang kata × 10 poin`).
- 📱 **Tampilan Bersih & Responsif**: Tampilan tetap proporsional dan nyaman dimainkan di layar smartphone, tablet, maupun desktop.

---

## 📂 Struktur Berkas

Semua berkas aplikasi permainan berada di dalam folder `game/`:

```text
game/
├── index.html   # Struktur semantik antarmuka (Layar Setup, Arena, dan Hasil)
├── style.css    # Desain visual, palet warna, ubin huruf, tata letak responsif
└── script.js    # Otak permainan (Data ronde, state, rendering, logika kata, event)
```

### Penjelasan Berkas:
- **[index.html](file:///d:/4-Programming/scramble%20word/game/index.html)**: Berisi elemen-elemen HTML seperti pemilihan ronde (`#round-select`), papan skor (`#score-text`), slot huruf (`#answer-slots` & `#tiles`), kisi kata target (`#words-grid`), dan tombol-tombol kendali.
- **[style.css](file:///d:/4-Programming/scramble%20word/game/style.css)**: Mengatur variabel desain (warna tema, kartu, efek hover, status tombol ubin normal/terpakai, dan responsivitas layout).
- **[script.js](file:///d:/4-Programming/scramble%20word/game/script.js)**: Menyimpan data bank kata, mengelola status permainan (*state*), memperbarui tampilan (*render*), mengecek kebenaran kata, dan mengikat tombol interaksi.

---

## 🚀 Cara Menjalankan

Tidak diperlukan instalasi Node.js, npm, ataupun server khusus:

1. Buka folder `game/`.
2. Klik ganda berkas **[index.html](file:///d:/4-Programming/scramble%20word/game/index.html)** di file explorer Anda untuk membukanya langsung di browser (Google Chrome, Microsoft Edge, Firefox, atau Safari).
3. *(Opsional)* Jika menggunakan Visual Studio Code, Anda juga dapat klik kanan berkas `index.html` lalu pilih **"Open with Live Server"**.

---

## 🧠 Alur & Logika Kode (`script.js`)

Logika permainan dibangun dengan pola yang bersih: **Input Pemain $\rightarrow$ Perbarui State $\rightarrow$ Render Ulang Tampilan**.

```text
[ Pemain Klik Ubin / Tombol ]
              ↓
  [ Update Catatan / State ]   --> Menyimpan index huruf, menambah skor, dsb.
              ↓
  [ Panggil Fungsi Render ]    --> renderTiles(), renderWordsGrid(), updateStats()
              ↓
 [ Layar Otomatis Diperbarui ]
```

### Rincian Komponen Logika:

1. **Bank Data Ronde (`ROUNDS`)**:
   Daftar ronde tetap yang berisi ID, nama, kumpulan huruf acak (`letters`), dan kamus kata valid (`words`).
2. **Catatan Permainan (`state`)**:
   Menyimpan data dinamis saat bermain: `roundIndex`, `score`, `foundWords`, `letters` (huruf aktif), dan `selectedIndices` (urutan indeks huruf yang sedang disusun).
3. **Fungsi Render UI**:
   - `renderTiles()`: Menggambar ubin di kotak tebakan atas dan memperbarui status tombol huruf di bawah (aktif/disabled).
   - `renderWordsGrid()`: Menampilkan chip kata (terbuka jika sudah ditebak, tertutup jika belum).
   - `updateStats()`: Memperbarui angka ronde, skor terkini, dan progres kata di layar.
4. **Interaksi Huruf**:
   - `selectLetter(index)`: Menambahkan indeks huruf ke antrean `selectedIndices` lalu merender ulang.
   - `unselectLetter(slotPosition)`: Menghapus indeks huruf dari kotak tebakan lalu merender ulang.
   - `shuffleLetters()`: Mengacak susunan array huruf menggunakan algoritma Fisher-Yates.
5. **Pemeriksaan Jawaban (`checkAnswer`)**:
   - Merangkai huruf tebakan dari indeks terpilih (`.map().join("")`).
   - Mencegah input kosong.
   - Mencegah kata yang sudah pernah ditemukan (`state.foundWords.includes(guess)`).
   - Memvalidasi ke dalam kunci jawaban ronde (`currentRound.words.includes(guess)`).
   - Jika benar: menambah skor, memasukkan ke `foundWords`, dan memberi feedback hijau.
   - Jika salah: memberi feedback merah.
6. **Penghubung Aksi (`addEventListener`)**:
   Menghubungkan tombol "Mulai", "Kirim Kata", "Acak Huruf", "Hapus", dan "Lanjut Ronde" ke fungsi logikanya masing-masing.

---

## 🛠️ Panduan Kustomisasi & Modifikasi

Anda dapat dengan mudah menyesuaikan isi game ini:

### 1. Mengubah Nilai Poin
Buka [script.js](file:///d:/4-Programming/scramble%20word/game/script.js#L193) pada fungsi `checkAnswer`:
```javascript
// Default: panjang kata * 10
const points = guess.length * 10;

// Contoh diubah: panjang kata * 20
const points = guess.length * 20;
```

### 2. Menambah Kata Baru atau Ronde Baru
Buka array `ROUNDS` di bagian atas [script.js](file:///d:/4-Programming/scramble%20word/game/script.js#L1-L20):
```javascript
{
  id: 4,
  name: "Ronde 4: M-A-K-A-N-S",
  letters: ["M", "A", "K", "A", "N", "S"],
  words: ["MAKAN", "MASAK", "MANA", "SAMA", "ANAK", "AKAN", "KAS"]
}
```

### 3. Mengubah Warna Tema Tampilan
Buka bagian `:root` pada [style.css](file:///d:/4-Programming/scramble%20word/game/style.css):
```css
:root {
  --primary: #2563eb;       /* Ubah warna tombol utama */
  --primary-hover: #1d4ed8; /* Warna saat tombol disentuh kursor */
  --bg: #f8fafc;            /* Warna latar belakang halaman */
}
```
