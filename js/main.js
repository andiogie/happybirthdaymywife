/* ═══════════════════════════════════════════════════
   BIRTHDAY WEBSITE — FULLPAGE EDITION  v3
   ═══════════════════════════════════════════════════ */
'use strict';

let data = null;
let allPhotos = [];
let currentLightboxIndex = 0;
let letterTypingDone = false;
let confettiStarted  = false;
let fpInstance       = null;

const SECTION_NAMES = [
  'Pembuka','Pertemuan','Pacaran','Lamaran',
  'Pernikahan','Orang Tua','Galeri','Video',
  'Surat Cinta','Ucapan','Penutup'
];

/* ══════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════ */
async function init() {
  // Sembunyikan #fullpage sampai loading selesai
  // — ini fix utama untuk bug "section ke-2 keliatan di belakang loading screen"
  const fp = document.getElementById('fullpage');
  if (fp) fp.style.visibility = 'hidden';

  try {
    const res = await fetch('data.json');
    data = await res.json();
  } catch (e) {
    data = fallbackData();
  }

  renderAll();
  initMusicPlayer();
  initLightbox();
  initLoading(); // loading terakhir supaya render selesai dulu
}

/* ══════════════════════════════════════════════════
   LOADING SCREEN
   Fix: #fullpage tidak terlihat sampai fullPage.js
   selesai init, loading screen sudah fully gone
══════════════════════════════════════════════════ */
function initLoading() {
  const screen     = document.getElementById('loading-screen');
  const musicBtn   = document.getElementById('music-player');
  const nav        = document.getElementById('fp-nav-custom');
  const fp         = document.getElementById('fullpage');

  // 4.2 detik → fade loading screen
  setTimeout(() => {
    screen.classList.add('done');

    // Tunggu CSS transition loading selesai (0.9s), baru init fullPage
    setTimeout(() => {
      // Tampilkan #fullpage, init fullPage.js
      if (fp) fp.style.visibility = 'visible';
      buildNavDots();
      startFullPage();

      // Tampilkan musik & nav setelah fullPage siap
      setTimeout(() => {
        if (musicBtn) musicBtn.classList.remove('hidden');
        if (nav) nav.classList.remove('hidden');
      }, 400);
    }, 950); // pas setelah transition loading done (0.9s)

  }, 4200);
}

/* ══════════════════════════════════════════════════
   FULLPAGE.JS
══════════════════════════════════════════════════ */
function startFullPage() {
  if (typeof fullpage === 'undefined') return;

  fpInstance = new fullpage('#fullpage', {
    licenseKey:          'gplv3-license',
    autoScrolling:       true,
    scrollHorizontally:  false,
    navigation:          false,
    scrollingSpeed:      900,
    easingcss3:          'cubic-bezier(0.77, 0, 0.175, 1)',
    touchSensitivity:    15,
    normalScrollElements:'.letter-paper, .carousel-track',
    fitToSection:        true,
    fitToSectionDelay:   500,
    scrollOverflow:      true,
    scrollOverflowReset: false,

    onLeave(origin, dest) {
      updateNavDots(dest.index);
      // Sembunyikan stitch snow saat pindah section lain
      if (dest.index !== 10) hideStitch();
    },
    afterLoad(origin, dest) {
      const idx = dest.index;
      updateNavDots(idx);
      if (idx === 8) startTypewriter();
      if (idx === 10 && !confettiStarted) {
        confettiStarted = true;
        // Set closing bg saat section benar-benar aktif
        const cbg = document.getElementById('closing-bg');
        if (cbg && data.closing.background_image) {
          cbg.style.backgroundImage = "url('" + data.closing.background_image + "')";
          cbg.style.backgroundSize  = 'cover';
          cbg.style.backgroundPosition = 'center';
        }
        startStitchSnow();
        startFloatingHearts();
      }
      // Back to top: tampil setelah section pertama
      const bt = document.getElementById('back-top');
      if (bt) bt.style.display = idx > 0 ? 'flex' : 'none';
    }
  });
}

/* ══════════════════════════════════════════════════
   RENDER ALL
══════════════════════════════════════════════════ */
function renderAll() {
  renderHero();
  renderChapter(0,'ch1', buildPertemuan);
  renderChapter(1,'ch2', buildPacaran);
  renderChapter(2,'ch3', buildLamaran);
  renderChapter(3,'ch4', buildPernikahan);
  renderChapter(4,'ch5', buildOrangTua);
  renderChapter(5,'ch6', buildGaleri);
  renderChapter(6,'ch7', buildVideo);
  renderChapter(7,'ch8', buildSurat);
  renderChapter(8,'ch9', buildUcapan);
  renderClosing();
}

function renderChapter(idx, prefix, fn) {
  const ch = data.chapters[idx];
  if (!ch) return;
  setText(`${prefix}-num`,       ch.number    || '');
  setText(`${prefix}-sub`,       ch.subtitle  || '');
  setText(`${prefix}-title`,     ch.title     || '');
  setText(`${prefix}-narration`, ch.narration || '');
  fn && fn(ch);
}

/* ── HERO ── */
function renderHero() {
  const { opening, meta } = data;
  const bg = document.getElementById('hero-bg');
  if (bg) bg.style.backgroundImage = `url('${opening.hero_image}')`;
  setText('hero-date',  `${meta.birthdate} ${meta.year}`);
  setText('hero-title', opening.headline);
  setText('hero-text',  opening.subtext);
  document.getElementById('btn-start')?.addEventListener('click', () => fpInstance?.moveTo(2));
  document.getElementById('btn-music-hero')?.addEventListener('click', toggleMusic);
  // stitch watermark dihapus
}

/* ── CH1 PERTEMUAN — CAROUSEL ── */
function buildPertemuan(ch) {
  setText('ch1-desc', ch.description || '');
  buildCarousel('ch1-track','ch1-prev','ch1-next','ch1-cdots', ch.photos || [], false);
}

/* ── CH2 PACARAN — SUB-SLIDES ── */
function buildPacaran(ch) {
  const items = ch.timeline || [];
  const slidesWrap = document.getElementById('tl-slides');
  const navWrap    = document.getElementById('tl-nav');
  const track      = document.getElementById('ch2-track');
  if (!slidesWrap || !track) return;

  let current = 0;

  // Build text slides (kiri)
  items.forEach((item, i) => {
    const s = document.createElement('div');
    s.className = 'tl-slide' + (i === 0 ? ' active' : '');
    s.innerHTML =
      `<p class="tl-date">${item.date}</p>` +
      `<h3 class="tl-title">${item.title}</h3>` +
      `<p class="tl-story">${item.story}</p>`;
    slidesWrap.appendChild(s);
  });

  // Build nav dots (kiri bawah)
  items.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'tl-dot-btn' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i+1}`);
    d.addEventListener('click', () => goTo(i));
    navWrap.appendChild(d);
  });

  // Build foto carousel (kanan) — foto aja, no caption
  items.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = item.src; img.alt = item.title; img.loading = 'lazy';
    const idx = allPhotos.length;
    allPhotos.push({ src: item.src, caption: item.title });
    img.addEventListener('click', () => openLightbox(idx));
    slide.appendChild(img);
    track.appendChild(slide);
  });

  function goTo(n) {
    current = n;
    // Update text slides
    slidesWrap.querySelectorAll('.tl-slide').forEach((s,i) => s.classList.toggle('active', i===n));
    // Update foto carousel
    track.style.transform = `translateX(-${n * 100}%)`;
    // Update nav dots
    navWrap.querySelectorAll('.tl-dot-btn').forEach((d,i) => d.classList.toggle('active', i===n));
  }

  // Prev/next buttons
  document.getElementById('ch2-prev')?.addEventListener('click', () =>
    goTo((current - 1 + items.length) % items.length));
  document.getElementById('ch2-next')?.addEventListener('click', () =>
    goTo((current + 1) % items.length));

  // Touch swipe support pada foto
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ?
      (current+1)%items.length :
      (current-1+items.length)%items.length);
  }, { passive:true });
}

/* ── CH3 LAMARAN — CAROUSEL ── */
function buildLamaran(ch) {
  setText('ch3-desc', ch.description || '');
  buildCarousel('ch3-track','ch3-prev','ch3-next','ch3-cdots', ch.photos || [], true);
}

/* ── CH4 PERNIKAHAN → carousel (sama persis seperti ch1,ch3,ch5) ── */
function buildPernikahan(ch) {
  setText('ch4-desc', ch.description || '');
  buildCarousel('ch4-track','ch4-prev','ch4-next','ch4-cdots', ch.photos || [], true);
}

/* ── CH5 ORANG TUA → carousel ── */
function buildOrangTua(ch) {
  setText('ch5-desc', ch.description || '');
  buildCarousel('ch5-track','ch5-prev','ch5-next','ch5-cdots', ch.photos || [], false);
}

/* ── CH6 GALERI → carousel ── */
function buildGaleri(ch) {
  const photos = (ch.photos || []).map((p,i) => ({
    ...p, caption: p.caption || `Kenangan ${i+1}`
  }));
  buildCarousel('ch6-track','ch6-prev','ch6-next','ch6-cdots', photos, true);
}

/* ── CH7 VIDEO ── */
function buildVideo(ch) {
  const w = document.getElementById('video-gallery');
  if (!w) return;
  (ch.videos || []).forEach(v => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumbnail">
        <img src="${v.thumbnail}" alt="${v.title}" loading="lazy"/>
        <div class="video-play-btn">▶</div>
      </div>
      <div class="video-info">
        <h3>${v.title}</h3>
        <p>${v.description}</p>
      </div>`;
    w.appendChild(card);
    card.querySelector('.video-thumbnail').addEventListener('click', () => {
      const pw = document.createElement('div');
      pw.className = 'video-player-wrap';
      const vid = document.createElement('video');
      vid.src = v.src; vid.controls = true; vid.autoplay = true;
      pw.appendChild(vid);
      card.querySelector('.video-thumbnail').replaceWith(pw);
    });
  });
}

/* ── CH8 SURAT ── */
function buildSurat(ch) {
  window._letterText   = ch.letter || '';
  window._letterSender = data.meta.sender || '';
}

function startTypewriter() {
  if (letterTypingDone) return;
  letterTypingDone = true;
  const el    = document.getElementById('letter-body');
  const sigEl = document.getElementById('letter-sig');
  if (!el) return;
  if (sigEl) sigEl.textContent = window._letterSender || '';
  const text   = window._letterText || '';
  const cursor = document.createElement('span');
  cursor.className = 'letter-cursor';
  let i = 0;
  el.textContent = '';
  el.appendChild(cursor);
  const iv = setInterval(() => {
    if (i < text.length) {
      el.textContent = text.slice(0, ++i);
      el.appendChild(cursor);
      const paper = el.closest('.letter-paper');
      if (paper) paper.scrollTop = paper.scrollHeight;
    } else {
      cursor.remove();
      sigEl?.classList.add('show');
      clearInterval(iv);
    }
  }, 18);
}

/* ── CH9 UCAPAN ── */
function buildUcapan(ch) {
  setText('card-message', ch.message || '');
}

/* ── CLOSING ── */
function renderClosing() {
  const { closing, meta } = data;
  const bg = document.getElementById('closing-bg');
  if (bg) {
    if (closing.background_image) {
      bg.style.backgroundImage = "url('" + closing.background_image + "')";
      bg.style.backgroundSize = 'cover';
      bg.style.backgroundPosition = 'center';
    } else {
      bg.style.background =
        'linear-gradient(135deg,#1a0508 0%,#0d0d1a 40%,#0a0a0a 70%,#1a0f0a 100%)';
    }
  }
  setText('closing-main',   closing.main_text  || '');
  setText('closing-love',   closing.love_text  || '');
  setText('closing-sender', `— ${meta.sender}`);
}

/* ══════════════════════════════════════════════════
   NAV DOTS
══════════════════════════════════════════════════ */
function buildNavDots() {
  const list = document.getElementById('fp-nav-list');
  if (!list) return;
  list.innerHTML = '';
  // Back to top click handler
  document.getElementById('back-top')?.addEventListener('click', () => {
    fpInstance?.moveTo(1); // section 1 = Hero (fullPage index mulai dari 1)
  });
  SECTION_NAMES.forEach((name, i) => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#'; a.title = name;
    if (i === 0) a.classList.add('active');
    a.addEventListener('click', e => { e.preventDefault(); fpInstance?.moveTo(i + 1); });
    li.appendChild(a);
    list.appendChild(li);
  });
}
function updateNavDots(idx) {
  document.querySelectorAll('#fp-nav-list a')
    .forEach((a, i) => a.classList.toggle('active', i === idx));
}

/* ══════════════════════════════════════════════════
   MUSIC
══════════════════════════════════════════════════ */
function initMusicPlayer() {
  document.getElementById('music-btn')?.addEventListener('click', toggleMusic);
}
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-btn');
  const label = btn?.querySelector('.music-label');
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => {
      btn?.classList.add('playing');
      if (label) label.textContent = 'Pause';
    }).catch(() => {});
  } else {
    audio.pause();
    btn?.classList.remove('playing');
    if (label) label.textContent = 'Musik';
  }
}

/* ══════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════ */
function initLightbox() {
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => navLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => navLightbox(1));
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb && !lb.classList.contains('hidden')) {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    }
  });
}
function openLightbox(idx) {
  if (idx < 0 || idx >= allPhotos.length) return;
  currentLightboxIndex = idx;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = allPhotos[idx].src;
  cap.textContent = allPhotos[idx].caption || '';
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  fpInstance?.setAllowScrolling(false);
}
function closeLightbox() {
  document.getElementById('lightbox')?.classList.add('hidden');
  document.body.style.overflow = '';
  fpInstance?.setAllowScrolling(true);
}
function navLightbox(dir) {
  let n = currentLightboxIndex + dir;
  if (n < 0) n = allPhotos.length - 1;
  if (n >= allPhotos.length) n = 0;
  openLightbox(n);
}

/* ══════════════════════════════════════════════════
   STITCH SNOW — rAF + position:fixed + preload
   Dijamin muncul, tidak bergantung fullPage DOM
══════════════════════════════════════════════════ */
let stitchSnowWrap = null;
let stitchRAF      = null;

function startStitchSnow() {
  // Hapus instance lama
  if (stitchSnowWrap) { stitchSnowWrap.remove(); stitchSnowWrap = null; }
  if (stitchRAF)      { cancelAnimationFrame(stitchRAF); stitchRAF = null; }

  // Container fixed di body — bebas dari fullPage transform
  const wrap = document.createElement('div');
  wrap.id = 'stitch-snow';
  wrap.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
    'pointer-events:none;z-index:9990;overflow:hidden;';
  document.body.appendChild(wrap);
  stitchSnowWrap = wrap;

  const VW = window.innerWidth;
  const VH = window.innerHeight;

  // Pre-load gambar dulu — INI kunci utamanya
  const img = new Image();
  img.src = 'images/stitch.png';

  function launchParticles() {
    const particles = [];

    for (let i = 0; i < 55; i++) {
      const size   = Math.random() * 28 + 22;   // 22–50px
      const el     = document.createElement('img');
      el.src = img.src;                          // pakai object yang sudah load
      el.style.cssText =
        `position:absolute;` +
        `width:${size}px;height:${size}px;` +
        `object-fit:contain;` +
        `opacity:${(Math.random() * 0.3 + 0.65).toFixed(2)};` +
        `will-change:transform;` +
        `filter:none;`,
      wrap.appendChild(el);

      particles.push({
        el,
        x:       Math.random() * VW,
        y:       -(Math.random() * VH + size),  // sebar di atas layar
        speedY:  Math.random() * 0.7 + 0.4,     // pelan kayak salju
        speedX:  (Math.random() - 0.5) * 0.3,
        wobbleA: Math.random() * 14 + 5,
        wobbleS: Math.random() * 0.018 + 0.008,
        wobbleP: Math.random() * Math.PI * 2,
        rotSpd:  (Math.random() - 0.5) * 0.7,
        rot:     0, t: 0,
        size
      });
    }

    function tick() {
      if (!stitchSnowWrap) return; // sudah di-hide


      for (const p of particles) {
        p.t    += 1;
        p.y    += p.speedY;
        p.rot  += p.rotSpd;
        const wx = Math.sin(p.wobbleP + p.t * p.wobbleS) * p.wobbleA;
        let   tx = p.x + wx;

        // Wrap horizontal
        if (tx < -p.size)   tx = VW + p.size;
        if (tx > VW + p.size) tx = -p.size;

        // Reset ke atas
        if (p.y > VH + p.size + 10) {
          p.y = -(p.size + 10);
          p.x = Math.random() * VW;
          p.t = 0;
        }

        p.el.style.transform =
          `translate(${tx.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg)`;
      }

      stitchRAF = requestAnimationFrame(tick);
    }

    tick();
  }

  // Tunggu gambar load, baru spawn partikel
  if (img.complete && img.naturalWidth > 0) {
    launchParticles();
  } else {
    img.onload  = launchParticles;
    img.onerror = launchParticles; // jalan meski gambar error
  }
}

function hideStitch() {
  if (stitchSnowWrap) {
    stitchSnowWrap.style.transition = 'opacity 0.5s';
    stitchSnowWrap.style.opacity    = '0';
    // Sembunyikan sementara, bukan hapus — kalau balik ke closing muncul lagi
    setTimeout(() => {
      if (stitchSnowWrap) stitchSnowWrap.style.display = 'none';
    }, 500);
  }
}

/* ══════════════════════════════════════════════════
   FLOATING HEARTS
══════════════════════════════════════════════════ */
function startFloatingHearts() {
  let container = document.getElementById('floating-hearts');
  if (!container) return;
  container.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
    'pointer-events:none;z-index:9991;overflow:hidden;';

  const emojis = ['❤️','💕','🌸','🌸','❤️','💕','🌷','💖','🌸','❤️'];
  const iv = setInterval(() => {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left             = `${Math.random() * 100}%`;
    h.style.fontSize         = `${(Math.random() * 1.3 + 0.9).toFixed(2)}rem`;
    h.style.animationDuration= `${(Math.random() * 5 + 6).toFixed(1)}s`;
    container.appendChild(h);
    setTimeout(() => h.remove(), 12000);
  }, 500);
  setTimeout(() => clearInterval(iv), 90000);
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */

/* Generic carousel builder
   trackId   — id of .carousel-track
   prevId    — id of prev button
   nextId    — id of next button
   dotsId    — id of dots container (pass null to skip)
   photos    — array of { src, caption }
   darkCaption — use dark caption style
*/
function buildCarousel(trackId, prevId, nextId, dotsId, photos, darkCaption) {
  const track = document.getElementById(trackId);
  if (!track) return;

  let cur = 0;

  photos.forEach((p, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = p.src; img.alt = p.caption || ''; img.loading = 'lazy';
    const idx = allPhotos.length;
    allPhotos.push({ src: p.src, caption: p.caption });
    img.addEventListener('click', () => openLightbox(idx));
    slide.appendChild(img);
    if (p.caption) {
      const cap = document.createElement('div');
      cap.className = 'caption' + (darkCaption ? ' dark' : '');
      cap.textContent = p.date ? `${p.date} · ${p.caption}` : p.caption;
      slide.appendChild(cap);
    }
    track.appendChild(slide);
  });

  // Dots
  const dotsWrap = dotsId ? document.getElementById(dotsId) : null;
  if (dotsWrap) {
    photos.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Foto ${i+1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function goTo(n) {
    cur = (n + photos.length) % photos.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    if (dotsWrap) dotsWrap.querySelectorAll('.cdot')
      .forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  document.getElementById(prevId)?.addEventListener('click', () => goTo(cur - 1));
  document.getElementById(nextId)?.addEventListener('click', () => goTo(cur + 1));

  // Touch swipe
  let ts = 0;
  track.addEventListener('touchstart', e => { ts = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend',   e => {
    const d = ts - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) goTo(d > 0 ? cur + 1 : cur - 1);
  }, { passive:true });
}

function makeStackCard(src, caption, dark = false) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.innerHTML =
    `<img src="${src}" alt="${caption || ''}" loading="lazy"/>` +
    (caption ? `<div class="caption${dark ? ' dark' : ''}">${caption}</div>` : '');
  const idx = allPhotos.length;
  card.addEventListener('click', () => openLightbox(idx));
  return card;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ══════════════════════════════════════════════════
   FALLBACK DATA
══════════════════════════════════════════════════ */
function fallbackData() {
  return {
    meta: { title:'Selamat Ulang Tahun ❤️', recipient:'Sayang', sender:'Cintamu', birthdate:'3 Juni', year:'2026' },
    opening: { headline:'Selamat Ulang Tahun Sayang ❤️', subtext:'Hari ini adalah perayaan untuk semua kebahagiaan yang telah kamu hadirkan.', hero_image:'images/hero.jpg' },
    chapters: [
      { id:'pertemuan',  number:'I',    subtitle:'Pertemuan',         title:'Awal Dari Segalanya',        narration:'Siapa sangka pertemuan sederhana itu mengubah hidup kita selamanya.', description:'', photos:[{src:'images/meet1.jpg',caption:'Pertemuan pertama'},{src:'images/meet2.jpg',caption:'Senyum pertama'},{src:'images/meet3.jpg',caption:'Awal segalanya'}] },
      { id:'pacaran',    number:'II',   subtitle:'Masa Pacaran',      title:'Hari-Hari Penuh Warna',      narration:'Setiap hari bersamamu adalah hadiah yang tak ternilai.', timeline:[{date:'2019',title:'Kencan Pertama',story:'Gugup tapi bahagia.',src:'images/date1.jpg'},{date:'2019',title:'Petualangan',story:'Tersesat tapi tertawa.',src:'images/date2.jpg'},{date:'2019',title:'Malam Bintang',story:'Berjanji selamanya.',src:'images/date3.jpg'},{date:'2019',title:'Ulang Tahunmu',story:'Pertama merayakan bersamamu.',src:'images/date4.jpg'}] },
      { id:'lamaran',    number:'III',  subtitle:'Lamaran',           title:'Maukah Kamu Menjadi Hidupku?', narration:'Hari ketika aku yakin ingin menghabiskan hidupku bersamamu.', description:'', photos:[{src:'images/proposal1.jpg',caption:'Momen paling berani'},{src:'images/proposal2.jpg',caption:'Ya!'},{src:'images/proposal3.jpg',caption:'Awal janji kita'}] },
      { id:'pernikahan', number:'IV',   subtitle:'Pernikahan',        title:'Dua Menjadi Satu',           narration:'Hari ketika dua perjalanan menjadi satu tujuan.', photos:[{src:'images/wedding1.jpg',caption:'Hari sakral'},{src:'images/wedding2.jpg',caption:'Sah selamanya'},{src:'images/wedding3.jpg',caption:'Dua keluarga'},{src:'images/wedding4.jpg',caption:'Tarian pertama'},{src:'images/wedding5.jpg',caption:'Kebahagiaan'},{src:'images/wedding6.jpg',caption:'Bersama'}] },
      { id:'orangtua',   number:'V',    subtitle:'Menjadi Orang Tua', title:'Cinta yang Bertumbuh',       narration:'Kebahagiaan kami bertambah ketika cinta ini tumbuh menjadi keluarga.', description:'', photos:[{src:'images/baby1.jpg',caption:'Menanti buah hati'},{src:'images/baby2.jpg',caption:'Hari paling ajaib'},{src:'images/baby3.jpg',caption:'Keluarga sempurna'},{src:'images/baby4.jpg',caption:'Tumbuh dengan cinta'}] },
      { id:'keluarga',   number:'VI',   subtitle:'Kenangan Keluarga', title:'Album Kenangan Kita',        narration:'Setiap foto menyimpan seribu kata.', photos:[{src:'images/family1.jpg'},{src:'images/family2.jpg'},{src:'images/family3.jpg'},{src:'images/family4.jpg'},{src:'images/family5.jpg'},{src:'images/family6.jpg'},{src:'images/family7.jpg'},{src:'images/family8.jpg'},{src:'images/family9.jpg'}] },
      { id:'video',      number:'VII',  subtitle:'Video Kenangan',    title:'Potongan-Potongan Bahagia',  narration:'Karena beberapa momen terlalu indah hanya untuk foto.', videos:[{title:'Perjalanan Cinta Kita',description:'Dari pertemuan pertama hingga hari ini',src:'images/video1.mp4',thumbnail:'images/video-thumb1.jpg'}] },
      { id:'surat',      number:'VIII', subtitle:'Surat Cinta',       title:'Dari Hatiku, Untukmu',       narration:'', letter:'Sayangku yang tercinta,\n\nJika ada satu hal yang selalu kusyukuri setiap hari, itu adalah momen pertama kita bertemu.\n\nKamu datang dengan caramu yang perlahan, dengan senyummu yang hangat, dan dengan ketulusanmu yang membuatku percaya bahwa cinta sejati itu nyata.\n\nKita telah bersama melewati begitu banyak hal. Tawa yang membuat perut sakit. Air mata yang kita usap bergantian. Dan setiap momen — momen biasa sekalipun — terasa luar biasa karena kamu ada di sana.\n\nHari ini, di hari ulang tahunmu, aku ingin kamu tahu:\n\nKamu adalah alasan terbesarku untuk bersyukur. Kamu adalah tangan yang selalu ingin kupegang. Kamu adalah rumah yang selalu ingin kukembali.\n\nAku mencintaimu — bukan hanya hari ini, tapi selamanya.' },
      { id:'ucapan',     number:'IX',   subtitle:'Ucapan Ulang Tahun',title:'Untuk Hari Spesialmu',      narration:'', message:'Selamat ulang tahun cintaku.\n\nTerima kasih sudah menjadi pasangan terbaik, sahabat terbaik, dan orang tua terbaik bagi keluarga kita.\n\nSemoga sehat selalu, panjang umur, bahagia, dan semua impianmu tercapai.\n\nAku akan selalu mencintaimu hari ini, besok, dan selamanya.' }
    ],
    closing: { background_image:'images/family-best.jpg', main_text:'Terima kasih sudah berjalan sejauh ini bersamaku ❤️', love_text:'Aku mencintaimu kemarin.\nAku mencintaimu hari ini.\nDan aku akan mencintaimu sampai kapan pun.' }
  };
}

document.addEventListener('DOMContentLoaded', init);
