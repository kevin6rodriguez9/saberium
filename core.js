/* Saberium — núcleo: utilidades, iconos, almacenamiento, audio, efectos */
(function (S) {
  'use strict';

  /* ---------- utilidades ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rnd = n => Math.floor(Math.random() * n);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dateKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const field = id => S.FIELDS.find(f => f.id === id);
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  Object.assign(S, { $, $$, esc, shuffle, rnd, clamp, dateKey, field, fmt, hash });

  /* ---------- iconos ---------- */
  const P = {
    mat: '<path d="M4 7h7M7.5 3.5v7M13 7h7M4.5 15.5l5 5M9.5 15.5l-5 5M14 16h6M14 19h6"/>',
    nat: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>',
    soc: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    hum: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M9 8h6"/>',
    art: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    flame: '<path d="M12 22c4 0 7-2.8 7-7 0-3-2-5-3-7-1 2-2 2.5-3 2.5 0-3-1-6-4-8 0 4-4 6-4 12 0 4 3 7.5 7 7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M10 18h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9c-2 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-3 3-5 3"/>',
    cart: '<path d="M3 4h3l2 12h11l2-8H7"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    rocket: '<path d="M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10zM9 16l-3 4 4-1M15 16l3 4-4-1"/><circle cx="12" cy="10" r="1.6"/>',
    owl: '<path d="M5 5l4 2h6l4-2v9a7 7 0 0 1-14 0z"/><circle cx="9.5" cy="11" r="1.5"/><circle cx="14.5" cy="11" r="1.5"/><path d="M12 13l-1 2h2z"/>',
    fox: '<path d="M3 4l5 3h8l5-3-1 9-8 8-8-8z"/><path d="M9 12h.01M15 12h.01M11 16h2"/>',
    robot: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V4M9 13h.01M15 13h.01M9 17h6"/><circle cx="12" cy="3.5" r="1"/>',
    planet: '<circle cx="12" cy="12" r="5"/><path d="M3 15c-1-2 4-7 12-9M21 9c1 2-4 7-12 9"/>',
    dragon: '<path d="M4 18c0-6 4-12 10-12 3 0 6 2 6 5s-3 4-5 3c-1 4-6 6-11 4z"/><path d="M16 9h.01"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  };
  const icon = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  S.icon = icon;
  S.logoMark = () => {
    const cols = S.FIELDS.map(f => f.color);
    const c = [50, 50], R = 46, pts = [];
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; pts.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]); }
    let s = '';
    for (let i = 0; i < 5; i++) { const a = pts[i], b = pts[(i + 1) % 5]; s += `<polygon points="${c} ${a} ${b}" fill="${cols[i]}" stroke="#0D0F1E" stroke-width="2" stroke-linejoin="round"/>`; }
    return `<svg class="logo-mark" viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;
  };

  /* ---------- almacenamiento ---------- */
  const KEY = 'saberium_v1';
  const defSettings = () => ({ sfx: true, music: false, vol: 0.6, reduce: false, large: false, contrast: false });
  let db = null;
  function load() {
    try { const r = localStorage.getItem(KEY); db = r ? JSON.parse(r) : null; } catch (e) { db = null; }
    if (!db || typeof db !== 'object') db = { players: {}, current: null, settings: defSettings() };
    db.players = db.players || {};
    db.settings = Object.assign(defSettings(), db.settings || {});
    if (db.current && !db.players[db.current]) db.current = null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* sin almacenamiento: se juega en memoria */ } }
  load();

  S.ITEMS = {
    avatar: [
      { id: 'rocket', name: 'Cohete', price: 0 }, { id: 'owl', name: 'Búho', price: 0 }, { id: 'fox', name: 'Zorro', price: 0 },
      { id: 'robot', name: 'Robot', price: 60 }, { id: 'planet', name: 'Planeta', price: 90 },
      { id: 'bolt', name: 'Rayo', price: 120 }, { id: 'dragon', name: 'Dragón', price: 200 }],
    frame: [
      { id: 'none', name: 'Sin marco', price: 0 }, { id: 'gold', name: 'Marco dorado', price: 80 },
      { id: 'neon', name: 'Marco neón', price: 140 }, { id: 'rainbow', name: 'Marco prisma', price: 250 }],
    bg: [
      { id: 'aurora', name: 'Aurora', price: 0 }, { id: 'dusk', name: 'Atardecer', price: 100 },
      { id: 'neon', name: 'Ciudad neón', price: 160 }, { id: 'forest', name: 'Bosque', price: 120 }],
    title: [
      { id: 'novato', name: 'Explorador novato', price: 0 }, { id: 'curioso', name: 'Mente curiosa', price: 50 },
      { id: 'estratega', name: 'Estratega', price: 110 }, { id: 'sabio', name: 'Sabio del Cristal', price: 300 }]
  };
  S.ITEM_CATS = { avatar: 'Avatares', frame: 'Marcos', bg: 'Fondos', title: 'Títulos' };

  S.store = {
    get db() { return db; },
    save, settings: () => db.settings,
    players: () => Object.values(db.players),
    cur: () => db.current ? db.players[db.current] : null,
    select(id) { db.current = id; save(); },
    logout() { db.current = null; save(); },
    create(name, avatar) {
      const id = 'p' + Date.now().toString(36) + rnd(999);
      db.players[id] = {
        id, name: name.trim().slice(0, 16), xp: 0, coins: 0, totalCoins: 0, created: Date.now(),
        stats: { games: 0, answered: 0, correct: 0, bestStreak: 0, perfect: 0, timedBest: 0, finalWins: 0, fields: {}, subjects: {} },
        best: {}, adv: {}, ach: {}, recent: [], seen: {},
        owned: { avatar: ['rocket', 'owl', 'fox'], frame: ['none'], bg: ['aurora'], title: ['novato'] },
        equipped: { avatar: avatar || 'rocket', frame: 'none', bg: 'aurora', title: 'novato' },
        missions: { date: '', list: [], bonus: false }, counters: { bought: 0, missionsDone: 0 }
      };
      db.current = id; save(); return db.players[id];
    },
    remove(id) { delete db.players[id]; if (db.current === id) db.current = null; save(); },
    reset(id) { const p = db.players[id]; if (!p) return null; const n = p.name; delete db.players[id]; db.current = null; return S.store.create(n, 'rocket'); },
    wipe() { db = { players: {}, current: null, settings: defSettings() }; save(); }
  };

  /* nivel y experiencia: nivel n requiere 60·(n−1)² puntos acumulados */
  S.levelOf = xp => Math.floor(Math.sqrt(Math.max(0, xp) / 60)) + 1;
  S.xpFor = lvl => 60 * (lvl - 1) * (lvl - 1);
  S.levelInfo = xp => {
    const l = S.levelOf(xp), a = S.xpFor(l), b = S.xpFor(l + 1);
    return { level: l, into: xp - a, need: b - a, pct: clamp((xp - a) / (b - a) * 100, 0, 100) };
  };

  /* ---------- audio ---------- */
  const A = { ctx: null, master: null, musicOn: false, timer: null, step: 0 };
  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return true; }
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      A.ctx = new C(); A.master = A.ctx.createGain(); A.master.connect(A.ctx.destination); A.setVol();
      return true;
    } catch (e) { return false; }
  };
  A.setVol = function () { if (A.master) A.master.gain.value = clamp(db.settings.vol, 0, 1) * 0.5; };
  A.tone = function (f, dur, type, vol, delay) {
    if (!A.ctx) return;
    try {
      const t = A.ctx.currentTime + (delay || 0), o = A.ctx.createOscillator(), g = A.ctx.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(A.master); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* ignorar */ }
  };
  const SFX = {
    click: () => A.tone(520, 0.06, 'triangle', 0.15),
    ok: () => { A.tone(660, 0.12, 'triangle', 0.3); A.tone(880, 0.18, 'triangle', 0.3, 0.1); },
    bad: () => { A.tone(220, 0.18, 'sawtooth', 0.18); A.tone(165, 0.25, 'sawtooth', 0.18, 0.12); },
    done: () => [523, 659, 784, 1047].forEach((f, i) => A.tone(f, 0.2, 'triangle', 0.28, i * 0.1)),
    lose: () => [392, 330, 262, 196].forEach((f, i) => A.tone(f, 0.28, 'triangle', 0.25, i * 0.16)),
    level: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => A.tone(f, 0.22, 'square', 0.16, i * 0.08)),
    ach: () => { A.tone(880, 0.12, 'sine', 0.3); A.tone(1175, 0.12, 'sine', 0.3, 0.12); A.tone(1568, 0.3, 'sine', 0.3, 0.24); },
    coin: () => { A.tone(1200, 0.08, 'square', 0.12); A.tone(1600, 0.16, 'square', 0.12, 0.07); }
  };
  A.play = function (n) { if (!db.settings.sfx) return; if (!A.init()) return; if (SFX[n]) SFX[n](); };
  const MELODY = [0, 4, 7, 9, 7, 4, 2, 4, 0, 4, 7, 12, 9, 7, 4, 2];
  const BASS = [0, 0, 0, 0, -5, -5, -5, -5, -3, -3, -3, -3, -5, -5, -7, -7];
  A.music = function (on) {
    clearInterval(A.timer); A.timer = null; A.musicOn = false;
    if (!on) return;
    if (!A.init()) return;
    A.musicOn = true;
    const base = 261.63;
    A.timer = setInterval(() => {
      if (!db.settings.music || document.hidden) return;
      const i = A.step++ % 16, f = base * Math.pow(2, MELODY[i] / 12), b = base / 2 * Math.pow(2, BASS[i] / 12);
      A.tone(f, 0.28, 'triangle', 0.06);
      if (i % 4 === 0) A.tone(b, 0.5, 'sine', 0.1);
    }, 260);
  };
  S.audio = A;

  /* ---------- efectos ---------- */
  S.applyPrefs = function () {
    const s = db.settings, r = document.documentElement, p = S.store.cur();
    r.classList.toggle('reduce', !!s.reduce); r.classList.toggle('large', !!s.large); r.classList.toggle('contrast', !!s.contrast);
    document.body.dataset.bg = p ? p.equipped.bg : 'aurora';
  };
  S.reduced = () => db.settings.reduce || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  let fxc, fxx, parts = [], raf = 0;
  function frame() {
    fxx.clearRect(0, 0, fxc.width, fxc.height);
    parts.forEach(p => { p.vy += 0.12; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--; fxx.save(); fxx.translate(p.x, p.y); fxx.rotate(p.r); fxx.fillStyle = p.c; fxx.globalAlpha = Math.min(1, p.life / 30); fxx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6); fxx.restore(); });
    parts = parts.filter(p => p.life > 0 && p.y < fxc.height + 20);
    raf = parts.length ? requestAnimationFrame(frame) : 0;
    if (!parts.length) fxx.clearRect(0, 0, fxc.width, fxc.height);
  }
  S.confetti = function (n, x, y) {
    if (S.reduced()) return;
    fxc = fxc || $('#fx'); if (!fxc) return;
    fxc.width = innerWidth; fxc.height = innerHeight; fxx = fxc.getContext('2d');
    const cols = S.FIELDS.map(f => f.color).concat(['#FFC83D']);
    for (let i = 0; i < (n || 80); i++) {
      const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      parts.push({ x: x != null ? x : innerWidth / 2, y: y != null ? y : innerHeight * 0.35, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, s: 6 + Math.random() * 8, c: cols[rnd(cols.length)], life: 90 + rnd(60) });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const toastQ = [];
  S.toast = function (html, kind) {
    const box = $('#toasts'); if (!box) return;
    const t = document.createElement('div'); t.className = 'toast ' + (kind || '');
    t.innerHTML = html; box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
  };
  void toastQ;
})(window.S = window.S || {});
