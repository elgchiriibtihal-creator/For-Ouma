/* =====================================================
   OUMA'S MIDNIGHT WORLD — Main JavaScript 💜
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────
   INTRO SPLASH
───────────────────────────────────────────── */
const introSplash = document.getElementById('introSplash');
const introEnter  = document.getElementById('introEnter');
introEnter.addEventListener('click', () => {
  introSplash.classList.add('hidden');
  document.body.style.overflow = '';
  // Start ambient on enter
  createAmbientSound();
});
document.body.style.overflow = 'hidden'; // lock scroll while splash is visible

/* ─────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────── */
(function buildNavDots() {
  const sections = ['landing','carsSection','sadSection','lettersSection','starsSection','chaosSection'];
  const labels   = ['🌌','🚗','💜','💌','🌙','😂'];
  const nav = document.createElement('nav');
  nav.className = 'nav-dots';
  nav.setAttribute('aria-label', 'Navigate sections');
  sections.forEach((id, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.setAttribute('title', labels[i]);
    dot.addEventListener('click', () => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });
  document.body.appendChild(nav);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const idx = sections.indexOf(e.target.id);
      if (idx >= 0) {
        nav.children[idx].classList.toggle('active', e.isIntersecting);
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
})();

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseenter', () => cursorGlow.style.opacity = '1');
document.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
document.querySelectorAll('button, .car-card, .envelope-card, .landing-car, .popup-close, .letter-close').forEach(el => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('big'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('big'));
});

/* ─────────────────────────────────────────────
   STARS GENERATOR
───────────────────────────────────────────── */
function generateStars(containerId, count = 80) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${(Math.random()*3+2).toFixed(1)}s;
      --min-op:${(Math.random()*0.3+0.1).toFixed(2)};
    `;
    container.appendChild(star);
  }
}
['starsLanding','starsCars','starsSad','starsLetters','starsNight','starsChaos','footerStars'].forEach(id => {
  generateStars(id, id === 'starsLanding' ? 120 : 70);
});

/* ─────────────────────────────────────────────
   SCROLL FADE IN
───────────────────────────────────────────── */
const fadeSections = document.querySelectorAll('.section-title, .sad-content, .chaos-content, .star-canvas-wrapper');
fadeSections.forEach(el => el.classList.add('fade-in-section'));
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
fadeSections.forEach(el => fadeObserver.observe(el));

/* ─────────────────────────────────────────────
   SECTION 1: LANDING TYPEWRITER + CARS
───────────────────────────────────────────── */
const typewriterEl = document.getElementById('typewriterText');
const hintTextEl   = document.getElementById('hintText');
const scrollIndicatorEl = document.getElementById('scrollIndicator');

const typewriterLines = [
  { text: 'Hey Ouma…',                  pause: 900  },
  { text: '',                            pause: 800  },
  { text: 'I made you a little world.', pause: 2000 },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeText(el, text, speed = 60) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
}
async function deleteText(el, speed = 35) {
  while (el.textContent.length > 0) {
    el.textContent = el.textContent.slice(0, -1);
    await sleep(speed);
  }
}

async function runTypewriter() {
  await sleep(600);
  for (let i = 0; i < typewriterLines.length; i++) {
    const { text, pause } = typewriterLines[i];
    if (text) await typeText(typewriterEl, text);
    await sleep(pause);
    if (i < typewriterLines.length - 1 && text) await deleteText(typewriterEl);
  }
  // Show hint
  await sleep(300);
  hintTextEl.style.transition = 'opacity 1.2s';
  hintTextEl.style.opacity = '1';
  await sleep(1500);
  scrollIndicatorEl.style.transition = 'opacity 1.5s';
  scrollIndicatorEl.style.opacity = '1';
}
runTypewriter();

// Landing cars
const CAR_COLORS = [
  { body: '#7c3aed', window: '#c084fc', light: '#fbbf24' },
  { body: '#5b21b6', window: '#a78bfa', light: '#fbbf24' },
  { body: '#4c1d95', window: '#8b5cf6', light: '#fef08a' },
  { body: '#6d28d9', window: '#ddd6fe', light: '#fbbf24' },
  { body: '#c084fc', window: '#f3e8ff', light: '#fbbf24' },
];

function makeCarSVG(colors, scale = 1, flip = false) {
  const w = 90 * scale, h = 46 * scale;
  const flip_ = flip ? `transform="scale(-1,1) translate(-90,0)"` : '';
  return `
  <svg width="${w}" height="${h}" viewBox="0 0 90 46" fill="none" xmlns="http://www.w3.org/2000/svg" ${flip_}>
    <!-- body -->
    <rect x="5" y="18" width="80" height="22" rx="5" fill="${colors.body}"/>
    <!-- cabin -->
    <path d="M22 18 L30 6 L62 6 L70 18 Z" fill="${colors.body}"/>
    <!-- window -->
    <path d="M28 17 L34 8 L58 8 L64 17 Z" fill="${colors.window}" opacity="0.7"/>
    <!-- headlight -->
    <circle cx="80" cy="27" r="4" fill="${colors.light}" opacity="0.9"/>
    <circle cx="80" cy="27" r="6" fill="${colors.light}" opacity="0.2"/>
    <!-- tail light -->
    <circle cx="10" cy="27" r="3" fill="#f87171" opacity="0.8"/>
    <!-- wheels -->
    <circle cx="22" cy="40" r="6" fill="#1a0033"/>
    <circle cx="22" cy="40" r="3" fill="#7c3aed"/>
    <circle cx="68" cy="40" r="6" fill="#1a0033"/>
    <circle cx="68" cy="40" r="3" fill="#7c3aed"/>
  </svg>`;
}

function spawnLandingCar(container) {
  const el = document.createElement('div');
  el.className = 'landing-car';
  const colors = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
  el.innerHTML = makeCarSVG(colors, 1 + Math.random() * 0.4);
  const duration = 8 + Math.random() * 12;
  const delay    = Math.random() * -20;
  const lane     = Math.random() > 0.5 ? 4 : 20;
  el.style.cssText = `bottom:${lane}px; animation-duration:${duration}s; animation-delay:${delay}s;`;
  el.addEventListener('click', () => showCarMessage('🚗', getRandomMessage('landing')));
  container.appendChild(el);
}

const landingCarsContainer = document.getElementById('landingCars');
for (let i = 0; i < 6; i++) spawnLandingCar(landingCarsContainer);

/* ─────────────────────────────────────────────
   SECTION 2: CARS GRID
───────────────────────────────────────────── */
const CAR_MESSAGES = [
  { type: 'soft',    text: "Ouma, you deserve peace like this every night. 🌙" },
  { type: 'soft',    text: "You carry so much. Put it down for a second, just here." },
  { type: 'soft',    text: "If I could pause a moment, I'd pause this one with you." },
  { type: 'funny',   text: "3wiwra spotted. Confidence level: illegal 🚨" },
  { type: 'funny',   text: "Ouma be like: chaotic on the outside, soft on the inside 🥲" },
  { type: 'funny',   text: "fun fact: you're genuinely hilarious. not everyone gets that 😌" },
  { type: 'cute',    text: "I like when you exist. Just saying. 💜" },
  { type: 'cute',    text: "soft hours are for Ouma only. no drama allowed here." },
  { type: 'cute',    text: "your laugh does something weird to the whole atmosphere tbh 🌟" },
  { type: 'soft',    text: "rest is not laziness. rest is you being kind to yourself." },
  { type: 'funny',   text: "3wiwra really said: *chaos* and then acted normal. iconic." },
  { type: 'deep',    text: "you matter more than you realize, Oumaima. genuinely." },
  { type: 'special', text: "✨ you found the special one ✨\n\ncome here 🫶\n\n(this one was always yours)" },
];

function getRandomMessage(context) {
  const filtered = context === 'landing' ? CAR_MESSAGES.filter(m => m.type !== 'special') : CAR_MESSAGES;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const carsGrid = document.getElementById('carsGrid');
const CAR_EMOJIS = ['🚗','🚕','🏎️','🚙','🚐','🚌'];

CAR_MESSAGES.forEach((msg, i) => {
  const card = document.createElement('div');
  card.className = 'car-card' + (msg.type === 'special' ? ' special' : '');
  const emoji = CAR_EMOJIS[i % CAR_EMOJIS.length];
  card.innerHTML = `<span class="car-emoji">${emoji}</span><span class="car-number">car #${String(i+1).padStart(2,'0')}</span>`;
  card.addEventListener('click', () => showCarMessage(emoji, msg));
  card.addEventListener('mouseenter', () => cursorGlow.classList.add('big'));
  card.addEventListener('mouseleave', () => cursorGlow.classList.remove('big'));
  carsGrid.appendChild(card);
});

function showCarMessage(emoji, msg) {
  const popup    = document.getElementById('carMessagePopup');
  const textEl   = document.getElementById('popupText');
  const iconEl   = document.querySelector('.popup-icon');
  const sparkles = document.getElementById('popupSparkles');
  iconEl.textContent = emoji;
  textEl.textContent  = msg.text;
  const isSpecial = msg.type === 'special';
  sparkles.textContent = isSpecial ? '✨💜✨' : (msg.type === 'funny' ? '😄💜😄' : '💜✨💜');
  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.getElementById('popupClose').addEventListener('click', closePopup);
document.getElementById('carMessagePopup').addEventListener('click', e => {
  if (e.target === document.getElementById('carMessagePopup')) closePopup();
});
function closePopup() {
  document.getElementById('carMessagePopup').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePopup();
    closeLetterModal();
  }
});

/* ─────────────────────────────────────────────
   SECTION 3: PRESS IF SAD
───────────────────────────────────────────── */
const SAD_MESSAGES = [
  "It's okay to feel like this. 🌙",
  "You don't have to carry everything.",
  "I got you, always. 💜",
  "take a breath. just one. you're okay.",
  "your feelings are valid, even when they're heavy.",
  "tonight doesn't define you. neither does yesterday.",
];

let sadTimeout;
document.getElementById('sadButton').addEventListener('click', () => {
  const msgEl   = document.getElementById('sadMessage');
  const section = document.getElementById('sadSection');
  const pick    = SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)];

  msgEl.innerHTML = `<span>${pick}</span><span class="sad-sub-message">even when you're 3wiwra and dramatic 😌</span>`;
  msgEl.classList.add('visible');
  section.classList.add('sad-glow');
  spawnHearts();

  clearTimeout(sadTimeout);
  sadTimeout = setTimeout(() => {
    msgEl.classList.remove('visible');
    section.classList.remove('sad-glow');
  }, 6000);
});

function spawnHearts() {
  const container = document.getElementById('heartsContainer');
  const emojis = ['💜','🫶','💜','✨','🌙','💫','💜'];
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const x   = Math.random() * 100;
    const dur  = (2 + Math.random() * 2.5).toFixed(1);
    const rot  = (Math.random() * 40 - 20).toFixed(0);
    heart.style.cssText = `left:${x}%; --dur:${dur}s; --rot:${rot}deg; animation-delay:${(Math.random()*0.8).toFixed(2)}s;`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (parseFloat(dur) + 0.9) * 1000);
  }
}

/* ─────────────────────────────────────────────
   SECTION 4: FLOATING LETTERS
───────────────────────────────────────────── */
const ENVELOPES = [
  {
    label: 'for Ouma',
    color: '#7c3aed',
    flap:  '#5b21b6',
    lines: [
      "I'm proud of you.",
      "Not because of what you do—",
      "but because of who you are.",
      "",
      "that's the part that matters.",
    ],
    sign: "— your little world 💜",
  },
  {
    label: 'for 3wiwra only ⚠️',
    color: '#c084fc',
    flap:  '#7c3aed',
    lines: [
      "okay so you're kind of a lot.",
      "in the best way possible.",
      "",
      "you owe me a smile. right now.",
      "don't fight it. just smile.",
      "(you already did, didn't you 😌)",
    ],
    sign: "— from someone who noticed 🫶",
  },
  {
    label: 'for the quiet Ouma',
    color: '#a78bfa',
    flap:  '#7c3aed',
    lines: [
      "You're stronger than you think.",
      "",
      "even on the nights you don't feel it.",
      "especially on those nights.",
    ],
    sign: "— for real though 💜",
  },
];

const envelopesContainer = document.getElementById('envelopesContainer');
ENVELOPES.forEach((env, i) => {
  const card = document.createElement('div');
  card.className = 'envelope-card';
  const tilt = (i % 2 === 0 ? -3 : 3);
  const floatDur = (3.5 + i * 0.7).toFixed(1);
  card.style.cssText = `--tilt:${tilt}deg; --float-dur:${floatDur}s; animation-delay:${i*0.4}s;`;
  card.innerHTML = `
    <svg class="envelope-svg" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="132" height="76" rx="10" fill="${env.color}22" stroke="${env.color}" stroke-width="2"/>
      <rect x="4" y="20" width="132" height="76" rx="10" fill="${env.color}11"/>
      <!-- envelope body -->
      <rect x="5" y="21" width="130" height="74" rx="9" fill="${env.color}33"/>
      <!-- flap -->
      <path d="M5 21 L70 64 L135 21 Z" fill="${env.flap}55" stroke="${env.color}" stroke-width="1.5"/>
      <!-- bottom fold lines -->
      <path d="M5 95 L50 55" stroke="${env.color}55" stroke-width="1"/>
      <path d="M135 95 L90 55" stroke="${env.color}55" stroke-width="1"/>
      <!-- seal -->
      <circle cx="70" cy="58" r="10" fill="${env.color}" opacity="0.9"/>
      <text x="70" y="63" text-anchor="middle" font-size="11" fill="white">💜</text>
    </svg>
    <span class="envelope-label">${env.label}</span>
  `;
  card.addEventListener('click', () => openLetter(env));
  card.addEventListener('mouseenter', () => cursorGlow.classList.add('big'));
  card.addEventListener('mouseleave', () => cursorGlow.classList.remove('big'));
  envelopesContainer.appendChild(card);
});

function openLetter(env) {
  const modal  = document.getElementById('letterModal');
  const body   = document.getElementById('letterBody');
  body.innerHTML = env.lines.map(l => l ? `<div class="letter-line">${l}</div>` : '<br>').join('');
  body.innerHTML += `<span class="letter-sign">${env.sign}</span>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.getElementById('letterClose').addEventListener('click', closeLetterModal);
document.getElementById('letterModal').addEventListener('click', e => {
  if (e.target === document.getElementById('letterModal')) closeLetterModal();
});
function closeLetterModal() {
  document.getElementById('letterModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   SECTION 5: NIGHT FREEDOM — STAR CANVAS
───────────────────────────────────────────── */
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');

let canvasStars = [];
let dragging    = null;
let dragOffX    = 0, dragOffY = 0;
let constellationShown = false;

const STAR_COUNT = 22;
const CONNECT_DIST = 80; // px distance to auto-connect
// Special constellation layout (letters O-U-M-A)
const SPECIAL_STAR_COUNT = 6;

function resizeCanvas() {
  const wrapper = canvas.parentElement;
  canvas.width  = wrapper.offsetWidth;
  canvas.height = parseInt(canvas.style.height) || 420;
  if (window.innerWidth <= 600) canvas.height = 300;
  canvas.style.height = canvas.height + 'px';
}

function initCanvasStars() {
  resizeCanvas();
  canvasStars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    canvasStars.push({
      id:   i,
      x:    20 + Math.random() * (canvas.width  - 40),
      y:    20 + Math.random() * (canvas.height - 40),
      r:    2 + Math.random() * 3.5,
      glow: Math.random() > 0.5,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
}
initCanvasStars();
window.addEventListener('resize', () => { initCanvasStars(); constellationShown = false; });

function drawCanvasStars(ts) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < canvasStars.length; i++) {
    for (let j = i + 1; j < canvasStars.length; j++) {
      const dx = canvasStars[i].x - canvasStars[j].x;
      const dy = canvasStars[i].y - canvasStars[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.65;
        ctx.save();
        ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
        ctx.lineWidth   = 1.2;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(canvasStars[i].x, canvasStars[i].y);
        ctx.lineTo(canvasStars[j].x, canvasStars[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Draw stars
  canvasStars.forEach(star => {
    star.twinkle += 0.02;
    const opacity = 0.6 + Math.sin(star.twinkle) * 0.4;
    ctx.save();
    ctx.globalAlpha = opacity;
    if (star.glow) {
      ctx.shadowBlur  = 12;
      ctx.shadowColor = '#e879f9';
    }
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Check constellation
  const connections = countConnections();
  if (connections >= 8 && !constellationShown) {
    triggerConstellationMessage();
  }

  requestAnimationFrame(drawCanvasStars);
}
requestAnimationFrame(drawCanvasStars);

function countConnections() {
  let count = 0;
  for (let i = 0; i < canvasStars.length; i++) {
    for (let j = i+1; j < canvasStars.length; j++) {
      const dx = canvasStars[i].x - canvasStars[j].x;
      const dy = canvasStars[i].y - canvasStars[j].y;
      if (Math.sqrt(dx*dx+dy*dy) < CONNECT_DIST) count++;
    }
  }
  return count;
}

function triggerConstellationMessage() {
  constellationShown = true;
  const el = document.getElementById('starMessage');
  el.innerHTML = 'Ouma 💜<br><span style="font-family:var(--font-main);font-size:1rem;color:#c084fccc;">you light up my night. not even joking</span>';
  el.classList.add('visible');
  spawnHearts();
  document.getElementById('starHint').style.opacity = '0';
}

// Drag
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY,
  };
}

function findStar(pos) {
  for (let i = canvasStars.length - 1; i >= 0; i--) {
    const s  = canvasStars[i];
    const dx = s.x - pos.x, dy = s.y - pos.y;
    if (Math.sqrt(dx*dx+dy*dy) <= Math.max(s.r + 10, 16)) return i;
  }
  return -1;
}

canvas.addEventListener('mousedown', e => {
  const pos = getCanvasPos(e);
  const idx = findStar(pos);
  if (idx >= 0) {
    dragging = idx;
    dragOffX  = canvasStars[idx].x - pos.x;
    dragOffY  = canvasStars[idx].y - pos.y;
    canvas.style.cursor = 'grabbing';
  }
});
canvas.addEventListener('mousemove', e => {
  if (dragging === null) return;
  const pos = getCanvasPos(e);
  canvasStars[dragging].x = Math.max(5, Math.min(canvas.width-5,  pos.x + dragOffX));
  canvasStars[dragging].y = Math.max(5, Math.min(canvas.height-5, pos.y + dragOffY));
});
canvas.addEventListener('mouseup',   () => { dragging = null; canvas.style.cursor = 'none'; });
canvas.addEventListener('mouseleave',() => { dragging = null; });

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const pos = getCanvasPos(e);
  const idx = findStar(pos);
  if (idx >= 0) { dragging = idx; dragOffX = canvasStars[idx].x - pos.x; dragOffY = canvasStars[idx].y - pos.y; }
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (dragging === null) return;
  const pos = getCanvasPos(e);
  canvasStars[dragging].x = Math.max(5, Math.min(canvas.width-5,  pos.x + dragOffX));
  canvasStars[dragging].y = Math.max(5, Math.min(canvas.height-5, pos.y + dragOffY));
}, { passive: false });
canvas.addEventListener('touchend', () => { dragging = null; });

/* ─────────────────────────────────────────────
   SECTION 6: CHAOS BUTTON
───────────────────────────────────────────── */
const CHAOS_LINES = [
  "ntkhatrou ta3rftk atpressi…",
  "yallah ari wa7ed 10dh a3wiwra 😤",
  "ghandwzhalik had lmra gha 7at you're cute",
  "okay but like… seriously 😭💜",
  "3wiwra.exe has stopped responding",
];

let chaosActive = false;

document.getElementById('chaosButton').addEventListener('click', () => {
  if (chaosActive) return;
  chaosActive = true;
  const msgEl  = document.getElementById('chaosMessage');
  const section = document.getElementById('chaosSection');

  // show message
  msgEl.innerHTML = CHAOS_LINES.map(l => `<p>${l}</p>`).join('');
  msgEl.classList.add('visible');

  // shake
  section.classList.add('chaos-shake');
  setTimeout(() => section.classList.remove('chaos-shake'), 700);

  // spawn chaos cars
  spawnChaosCars();

  // flash BG
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    section.style.background = flashCount % 2 === 0
      ? 'radial-gradient(ellipse at 50% 50%, #3b0a6b 0%, #1a0033 70%)'
      : 'radial-gradient(ellipse at 50% 50%, #120020 0%, #0d0014 70%)';
    flashCount++;
    if (flashCount > 8) {
      clearInterval(flashInterval);
      section.style.background = '';
    }
  }, 120);

  // play chaos sound (web audio)
  playChaosSound();

  setTimeout(() => {
    chaosActive = false;
    msgEl.classList.remove('visible');
    setTimeout(() => msgEl.innerHTML = '', 400);
  }, 5000);
});

function spawnChaosCars() {
  const container = document.getElementById('chaosCars');
  container.innerHTML = '';
  const carEmojis = ['🚗','🚕','🏎️','🚙','🚐'];
  for (let i = 0; i < 30; i++) {
    const car = document.createElement('div');
    car.className = 'chaos-car';
    car.textContent = carEmojis[Math.floor(Math.random() * carEmojis.length)];
    const startY = Math.random() * window.innerHeight;
    const startX = Math.random() * window.innerWidth;
    const angle  = Math.random() * 360;
    const dist   = 200 + Math.random() * 400;
    const dur    = 0.5 + Math.random() * 1.5;
    const delay  = Math.random() * 0.5;
    car.style.cssText = `
      left: ${startX}px; top: ${startY}px;
      font-size: ${1.2 + Math.random() * 1.5}rem;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      transform: rotate(${angle}deg) translateX(${dist}px);
    `;
    container.appendChild(car);
    setTimeout(() => car.remove(), (dur + delay + 0.2) * 1000);
  }
}

function playChaosSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx_ = new AudioCtx();
    const notes = [220, 440, 330, 550, 280, 660, 200];
    notes.forEach((freq, i) => {
      const osc  = ctx_.createOscillator();
      const gain = ctx_.createGain();
      osc.connect(gain);
      gain.connect(ctx_.destination);
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.04, ctx_.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx_.currentTime + i * 0.1 + 0.35);
      osc.start(ctx_.currentTime + i * 0.1);
      osc.stop(ctx_.currentTime + i * 0.1 + 0.4);
    });
  } catch(e) { /* audio not available */ }
}

/* ─────────────────────────────────────────────
   RAIN TOGGLE
───────────────────────────────────────────── */
const rainOverlay = document.getElementById('rainOverlay');
const rainToggle  = document.getElementById('rainToggle');
let rainOn = false;
let raindrops = [];

function createRain() {
  rainOverlay.innerHTML = '';
  raindrops = [];
  for (let i = 0; i < 100; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    const left   = Math.random() * 100;
    const height = 10 + Math.random() * 25;
    const dur    = (0.5 + Math.random() * 0.8).toFixed(2);
    const delay  = (Math.random() * 2).toFixed(2);
    drop.style.cssText = `
      left:${left}%;
      height:${height}px;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    rainOverlay.appendChild(drop);
  }
}

rainToggle.addEventListener('click', () => {
  rainOn = !rainOn;
  if (rainOn) {
    createRain();
    rainOverlay.classList.add('active');
    rainToggle.classList.add('on');
    rainToggle.title = 'Stop rain 🌧️';
  } else {
    rainOverlay.classList.remove('active');
    rainToggle.classList.remove('on');
    rainToggle.title = 'Toggle Rain 🌧️';
    setTimeout(() => rainOverlay.innerHTML = '', 700);
  }
});

/* ─────────────────────────────────────────────
   AMBIENT NIGHT SOUND (subtle)
───────────────────────────────────────────── */
function createAmbientSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const actx   = new AudioCtx();
    const bufSz  = actx.sampleRate * 2;
    const buffer = actx.createBuffer(1, bufSz, actx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufSz; i++) data[i] = (Math.random() * 2 - 1) * 0.05;

    const src  = actx.createBufferSource();
    src.buffer = buffer;
    src.loop   = true;

    const biquad      = actx.createBiquadFilter();
    biquad.type       = 'lowpass';
    biquad.frequency.value = 400;

    const gainNode = actx.createGain();
    gainNode.gain.value = 0.08;

    src.connect(biquad);
    biquad.connect(gainNode);
    gainNode.connect(actx.destination);
    src.start();
  } catch(e) {}
}

// Start ambient on first user interaction
document.addEventListener('click', function onFirstClick() {
  createAmbientSound();
  document.removeEventListener('click', onFirstClick);
}, { once: true });

/* ─────────────────────────────────────────────
   PAGE TITLE EASTER EGG
───────────────────────────────────────────── */
const titles = [
  "Ouma's Midnight World 💜",
  "hey Ouma 🌙",
  "still here 💜",
  "made for you ✨",
  "Ouma's World 🫶",
];
let titleIdx = 0;
setInterval(() => {
  titleIdx = (titleIdx + 1) % titles.length;
  document.title = titles[titleIdx];
}, 4000);

/* ─────────────────────────────────────────────
   SMOOTH SCROLL BEHAVIOUR for nav
───────────────────────────────────────────── */
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('mouseenter', () => cursorGlow.classList.add('big'));
  dot.addEventListener('mouseleave', () => cursorGlow.classList.remove('big'));
});

/* ─────────────────────────────────────────────
   SECTION ENTRANCE GLOW
───────────────────────────────────────────── */
const sectionGlowObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.transition = 'box-shadow 1s';
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section').forEach(s => sectionGlowObserver.observe(s));
