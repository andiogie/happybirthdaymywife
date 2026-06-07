# Birthday Website — Panduan untuk Claude

## Tentang Project
Website ulang tahun interaktif untuk **Tri Ayu Permata Sari** dari **Andi Putra Ogie**.
Dibangun dengan HTML, CSS, JavaScript murni + fullPage.js untuk scroll snap.

## Stack
- **fullPage.js 4.0.20** — fullscreen snap scrolling
- **Google Fonts** — Cormorant Garamond, Jost, Great Vibes
- **Vanilla JS** — tidak ada framework
- **XAMPP / Vercel** — untuk hosting lokal & produksi

## Struktur File
```
birthday-website/
├── index.html              ← Struktur HTML semua section
├── data.json               ← SEMUA teks & konten (edit di sini)
├── vercel.json             ← Config deploy Vercel
├── css/
│   └── style.css           ← Semua styling + animasi
├── js/
│   └── main.js             ← Logic: render, carousel, fullPage, stitch snow
├── images/                 ← Semua foto (ganti placeholder dengan foto asli)
│   ├── hero.jpg            ← Hero background (landscape 1920x1080)
│   ├── family-best.jpg     ← Closing background (landscape 1920x1080)
│   ├── meet1-3.jpg         ← Section I Pertemuan (carousel)
│   ├── date1-4.jpg         ← Section II Pacaran (sub-slides)
│   ├── proposal1-3.jpg     ← Section III Lamaran (carousel)
│   ├── wedding1-3.jpg      ← Section IV Pernikahan (carousel)
│   ├── baby1-4.jpg         ← Section V Orang Tua (carousel)
│   ├── family1-9.jpg       ← Section VI Galeri (carousel)
│   ├── video-thumb1.jpg    ← Section VII Video thumbnail
│   ├── video1.mp4          ← Section VII Video file
│   └── stitch.png          ← Animasi snow di section penutup
└── music/
    └── background.mp3      ← Musik background (tidak autoplay)
```

## Section Layout
Semua section I–VI pakai layout yang sama:
- **Kiri**: teks (chapter number, subtitle, title, narration, description)
- **Kanan**: carousel foto (swipe/klik ‹ ›)

Section khusus:
- **II Pacaran**: sub-slides — teks kiri berganti sesuai foto (4 slide)
- **VII Video**: split kiri teks, kanan video player
- **VIII Surat**: typewriter effect, trigger saat section aktif
- **X Closing**: fullscreen background + Stitch snow unlimited + floating hearts

## Cara Edit Konten
**Semua teks** → edit `data.json` saja, tidak perlu sentuh file lain.

Field penting di `data.json`:
```json
{
  "meta": {
    "recipient": "Tri Ayu Permata Sari",
    "sender": "Andi Putra Ogie",
    "birthdate": "12 Juni",
    "year": "2026"
  },
  "closing": {
    "background_image": "images/family-best.jpg"
  }
}
```

## Known Issues & Fix
- **Foto tidak muncul**: pastikan nama file persis sama (huruf kecil, no spasi)
- **Closing background tidak muncul**: cek `index.html`, pastikan closing-bg pakai `id="closing-bg"` bukan class `closing-gradient`
- **Cache browser**: tekan Ctrl+Shift+R setelah ganti foto

## Cara Jalankan Lokal
```bash
# Pakai XAMPP
# Taruh folder di: C:\xampp\htdocs\birthday-website\
# Buka: http://localhost/birthday-website/

# Atau Python
cd birthday-website && python3 -m http.server 8080
# Buka: http://localhost:8080
```

## Deploy ke Vercel
```bash
npm i -g vercel
cd birthday-website
vercel
# Atau drag & drop folder ke vercel.com/new
```

## CSS Variables Utama
```css
--gold: #C9A96E;
--rose: #E8B4B8;
--cream: #F9F3EC;
--dark: #1A0F0A;
--font-display: 'Cormorant Garamond';
--font-script: 'Great Vibes';
--font-body: 'Jost';
```

## Fungsi JS Utama
| Fungsi | Kegunaan |
|--------|---------|
| `buildCarousel(trackId, prevId, nextId, dotsId, photos, dark)` | Buat carousel foto |
| `buildPacaran(ch)` | Sub-slides section pacaran |
| `startTypewriter()` | Efek ketik surat cinta |
| `startStitchSnow()` | Animasi Stitch jatuh di penutup |
| `startFloatingHearts()` | Emoji hati naik dari bawah |
| `openLightbox(idx)` | Buka foto fullscreen |
| `toggleMusic()` | Play/pause background music |

## Yang Masih Bisa Ditambah
- [ ] Video kenangan (timpa `images/video1.mp4`)
- [ ] Musik background (taruh `music/background.mp3`)
- [ ] Foto lengkap semua section
