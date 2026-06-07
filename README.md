# 🎂 Website Ulang Tahun — Panduan Lengkap

## 📁 Struktur File

```
birthday-website/
├── index.html              ← Halaman utama
├── data.json               ← Semua teks & cerita (EDIT INI)
├── vercel.json             ← Konfigurasi Vercel
├── css/
│   └── style.css           ← Semua styling
├── js/
│   └── main.js             ← Semua interaksi
├── images/                 ← Ganti dengan foto asli
│   ├── hero.jpg            ← Foto utama (1920×1080)
│   ├── family-best.jpg     ← Foto penutup (1920×1080)
│   ├── meet1-3.jpg         ← Foto pertemuan
│   ├── date1-4.jpg         ← Foto pacaran
│   ├── proposal1-3.jpg     ← Foto lamaran
│   ├── wedding1-6.jpg      ← Foto pernikahan
│   ├── baby1-4.jpg         ← Foto anak
│   ├── family1-9.jpg       ← Galeri kenangan
│   └── video-thumb1.jpg    ← Thumbnail video
└── music/
    └── background.mp3      ← File musik (buat folder ini)
```

---

## 🖼️ Cara Ganti Foto

1. Siapkan foto-foto Anda dalam format JPG/PNG
2. Ganti nama file sesuai daftar di atas
3. Simpan di folder `/images/`
4. **Tips ukuran:**
   - Hero & penutup: 1920×1080px
   - Galeri: 800×600px atau lebih besar
   - Format JPG lebih ringan dari PNG

---

## ✏️ Cara Edit Teks

Buka file **`data.json`** dan edit bagian yang diinginkan:

### Ganti nama & tanggal:
```json
"meta": {
  "recipient": "Nama Istri/Suami",
  "sender": "Nama Anda",
  "birthdate": "3 Juni",
  "year": "2026"
}
```

### Edit cerita tiap chapter:
Setiap chapter di array `chapters` bisa diedit:
- `title` — judul bab
- `narration` — kalimat narasi
- `description` — deskripsi tambahan
- `photos` — daftar foto dengan caption dan tanggal
- `timeline` — untuk bab pacaran

### Edit surat cinta:
```json
{
  "id": "surat",
  "letter": "Tuliskan surat cinta Anda di sini...\n\nGunakan \\n untuk baris baru."
}
```

---

## 🎵 Cara Tambah Musik

1. Buat folder `music/` di dalam folder proyek
2. Simpan file musik dengan nama `background.mp3`
3. **Rekomendasi musik piano romantis (royalty free):**
   - [pixabay.com](https://pixabay.com/music/) — cari "romantic piano"
   - [bensound.com](https://www.bensound.com/) — cari "romantic"
   - [freemusicarchive.org](https://freemusicarchive.org/)

---

## 🎬 Cara Tambah Video

1. Simpan video di folder `images/` dengan nama `video1.mp4`
2. Buat thumbnail: `video-thumb1.jpg`
3. Edit bagian video di `data.json`:
```json
{
  "id": "video",
  "videos": [
    {
      "title": "Judul Video",
      "description": "Deskripsi singkat",
      "src": "images/video1.mp4",
      "thumbnail": "images/video-thumb1.jpg"
    }
  ]
}
```

---

## 🚀 Deploy ke Vercel

### Cara 1: Via Vercel CLI (Termudah)
```bash
# Install Vercel CLI
npm i -g vercel

# Masuk ke folder proyek
cd birthday-website

# Deploy
vercel

# Ikuti instruksi — pilih "No" untuk semua pertanyaan framework
# Vercel akan memberikan URL publik
```

### Cara 2: Via GitHub + Vercel Dashboard
1. Upload folder ke GitHub (buat repo baru)
2. Buka [vercel.com](https://vercel.com) → Login
3. Klik "New Project" → Import repo GitHub
4. Setting:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: *(kosongkan)*
   - Output Directory: `./`
5. Klik Deploy!

### Cara 3: Via Vercel Dashboard (Drag & Drop)
1. Buka [vercel.com/new](https://vercel.com/new)
2. Drag & drop seluruh folder `birthday-website`
3. Deploy langsung!

---

## 🎨 Kustomisasi Warna

Edit variabel di `css/style.css` bagian `:root`:

```css
:root {
  --gold: #C9A96E;        /* Warna emas */
  --rose: #E8B4B8;        /* Warna rose/pink */
  --cream: #F9F3EC;       /* Warna krem */
  --dark: #1A0F0A;        /* Warna gelap */
}
```

---

## 📱 Fitur Website

- ✅ Loading screen elegan
- ✅ Musik background (play/pause)
- ✅ 10 Chapter perjalanan cinta
- ✅ Timeline interaktif (Chapter Pacaran)
- ✅ Galeri masonry (Chapter Keluarga)
- ✅ Efek typewriter surat cinta
- ✅ Lightbox foto (klik foto → fullscreen)
- ✅ Confetti & floating hearts di penutup
- ✅ Scroll progress bar
- ✅ Reveal animasi saat scroll
- ✅ Fully responsive (mobile & desktop)
- ✅ Deploy siap pakai di Vercel

---

## ❤️ Tips Akhir

- Pilih foto-foto terbaik yang punya cerita kuat
- Edit surat cinta dengan kata-kata dari hati
- Tambahkan musik yang memiliki kenangan bersama
- Waktu terbaik untuk hadirkan: saat ulang tahun pagi hari
- Kirim link URL setelah deploy — dan siapkan tisu! 😊
