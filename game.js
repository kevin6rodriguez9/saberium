/* Saberium — motor de partida */
(function (S) {
  'use strict';
  const { $, $$, esc, shuffle, field, icon } = S;

  S.MODES = {
    adventure: { name: 'Aventura', icon: 'map', lives: 3, color: '#4C8DFF', short: 'Cinco mundos, tres niveles cada uno.',
      rules: ['Cada nivel tiene 7 retos de un solo campo.', 'Tienes 3 vidas: cada error cuesta una.', 'Si terminas con vidas, ganas de 1 a 3 estrellas y se abre el siguiente nivel.'] },
    quick: { name: 'Desafío rápido', icon: 'bolt', lives: 3, color: '#FFC83D', short: '10 preguntas al azar de todas las áreas.',
      rules: ['10 preguntas aleatorias de los cinco campos.', 'Tienes 3 vidas.', 'Terminas con al menos una vida y ganas el desafío.'] },
    practice: { name: 'Modo práctica', icon: 'target', lives: 0, color: '#2ED98A', short: 'Elige materia y practica sin presión.',
      rules: ['Elige campo, materia y dificultad.', 'Sin vidas y sin límite de tiempo.', 'Recibes la mitad de puntos y no ganas monedas.'] },
    timed: { name: 'Contra el reloj', icon: 'clock', lives: 0, time: 60, penalty: 5, goal: 10, color: '#FF5C7A', short: '60 segundos: responde todo lo que puedas.',
      rules: ['Tienes 60 segundos en total.', 'Cada error resta 5 segundos.', 'Con 10 aciertos o más superas el reto.'] },
    mixed: { name: 'Reto mixto', icon: 'shuffle', lives: 3, color: '#F25CC1', short: '15 retos: 3 de cada campo, de fácil a difícil.',
      rules: ['15 retos: tres de cada uno de los cinco campos.', 'La dificultad sube poco a poco.', 'Tienes 3 vidas y ganas si terminas con alguna.'] },
    final: { name: 'Desafío final', icon: 'trophy', lives: 3, color: '#A98BFF', short: 'Tres rondas con distintos tipos de reto.',
      rules: ['Ronda 1: selección múltiple y verdadero o falso.', 'Ronda 2: completar y resolver problemas.', 'Ronda 3: relacionar y ordenar.', 'Tienes 3 vidas para toda la prueba.'] }
  };
  S.FINAL_REQ = 5; // niveles de Aventura necesarios para abrir el Desafío final

  let G = null, tick = null, autoNext = null;
  S.game = { get G() { return G; } };

  /* ---------- normalización de respuestas escritas ---------- */
  function norm(s) {
    s = String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();
    s = s.replace(/[$\s]/g, '').replace(/(\d)\.(?=\d{3}(\D|$))/g, '$1').replace(/,/g, '.').replace(/[.!?;:]+$/, '');
    return s;
  }
  S.normAnswer = norm;

  S.game.start = function (cfg) {
    const p = S.store.cur(); if (!p) return false;
    const qs = S.buildQuestions(p, cfg);
    if (!qs.length) { S.toast('No hay preguntas con esos filtros. Prueba con otra dificultad.'); return false; }
    clearInterval(tick); clearTimeout(autoNext);
    const M = S.MODES[cfg.mode];
    G = { cfg, M, qs, i: 0, lives: M.lives, score: 0, streak: 0, maxStreak: 0, correct: 0, wrong: 0, coins: 0, log: [], time: M.time || 0,
      t0: Date.now(), paused: false, locked: false, over: false, xpBefore: p.xp, wrongSubj: {}, seenIds: [] };
    S.nav.go('game', {}, { replace: true });
    return true;
  };
  S.game.leave = function () { clearInterval(tick); clearTimeout(autoNext); G = null; };

  /* ---------- pintado ---------- */
  S.game.render = function () {
    if (!G) { S.nav.go('menu', {}, { replace: true }); return ''; }
    const html = `<section class="game" id="game">
      <header class="hud" id="hud"></header>
      <div class="prog" id="gprog" role="progressbar" aria-label="Progreso de la partida"><i></i></div>
      <main class="qwrap" id="qcard"></main>
      <div id="fb" aria-live="polite"></div>
    </section>`;
    setTimeout(() => {
      hud(); renderQ();
      if (G.M.time) { clearInterval(tick); tick = setInterval(onTick, 100); }
    }, 0);
    return html;
  };

  function onTick() {
    if (!G || G.paused || G.over) return;
    G.time -= 0.1; if (G.time <= 0) { G.time = 0; hud(); finish('time'); return; }
    const t = $('#htime'); if (t) { t.textContent = Math.ceil(G.time) + ' s'; t.classList.toggle('low', G.time <= 10); }
  }

  function hud() {
    const el = $('#hud'); if (!el || !G) return;
    const q = G.q || G.qs[G.i], f = field(q.f);
    let hearts = '';
    if (G.M.lives) for (let i = 0; i < G.M.lives; i++) hearts += `<span class="heart ${i < G.lives ? 'on' : ''}">${icon('heart')}</span>`;
    el.innerHTML = `<button class="icon-btn" data-act="pause" aria-label="Pausar">${icon('pause')}</button>
      <div class="hud-field" style="--fc:${f.color}">${icon(f.id)}<span>${esc(G.cfg.mode === 'practice' || G.cfg.mode === 'adventure' ? f.name : f.name)}</span></div>
      <div class="hud-stats">
        ${hearts ? `<div class="hearts" aria-label="Vidas: ${G.lives}">${hearts}</div>` : ''}
        ${G.M.time ? `<div class="chip time" id="htime">${Math.ceil(G.time)} s</div>` : ''}
        <div class="chip" title="Puntos">${icon('star')}<b id="hscore">${G.score}</b></div>
        <div class="chip streak ${G.streak >= 3 ? 'hot' : ''}" title="Racha">${icon('flame')}<b>${G.streak}</b></div>
      </div>`;
    const pr = $('#gprog i');
    if (pr) pr.style.width = (G.M.time ? Math.min(100, (G.M.time - G.time) / G.M.time * 100) : (G.i / G.qs.length) * 100) + '%';
  }

  function roundLabel() {
    if (G.cfg.mode !== 'final') return '';
    const r = G.qs.rounds; let acc = 0;
    for (let k = 0; k < r.length; k++) { acc += r[k]; if (G.i < acc) return `Ronda ${k + 1} de 3`; }
    return '';
  }
  const TYPE_NAME = { mc: 'Selección múltiple', tf: 'Verdadero o falso', fill: 'Completa la respuesta', match: 'Relaciona', order: 'Ordena' };

  function renderQ() {
    if (!G) return;
    const q = G.q = G.qs[G.i], f = field(q.f), d = S.DIFFS[q.d - 1];
    G.locked = false; G.state = {};
    $('#fb').innerHTML = '';
    let body = '';
    if (q.t === 'mc') {
      G.state.opts = shuffle(q.o.map((t, i) => ({ t, i })));
      body = `<div class="opts">${G.state.opts.map((o, k) => `<button class="opt" data-act="pick" data-k="${k}"><kbd>${k + 1}</kbd><span>${esc(o.t)}</span></button>`).join('')}</div>`;
    } else if (q.t === 'tf') {
      body = `<div class="opts tf"><button class="opt" data-act="tf" data-v="1"><kbd>V</kbd><span>Verdadero</span></button><button class="opt" data-act="tf" data-v="0"><kbd>F</kbd><span>Falso</span></button></div>`;
    } else if (q.t === 'fill') {
      body = `<form class="fillf" id="fillf" autocomplete="off"><label class="sr" for="ans">Tu respuesta</label><input id="ans" type="text" placeholder="Escribe tu respuesta" autocapitalize="off" spellcheck="false" enterkeyhint="done"><button class="btn primary" type="submit">Comprobar</button></form>`;
    } else if (q.t === 'match') {
      G.state.map = {}; G.state.sel = null;
      G.state.right = shuffle(q.pairs.map((p, i) => i));
      body = '<div id="matchbox"></div>';
    } else if (q.t === 'order') {
      let ord = q.items.map((_, i) => i); let tries = 0;
      do { ord = shuffle(ord); tries++; } while (ord.every((v, i) => v === i) && tries < 10);
      G.state.ord = ord;
      body = '<div id="orderbox"></div>';
    }
    const rl = roundLabel();
    $('#qcard').innerHTML = `<article class="qcard" style="--fc:${f.color}">
      <div class="qmeta"><span class="tag">${esc(q.s)}</span><span class="tag diff d${q.d}">${d.name} · ${d.points} pts</span><span class="tag ghost">${TYPE_NAME[q.t]}</span>${rl ? `<span class="tag round">${rl}</span>` : ''}</div>
      <h2 class="qtext">${esc(q.q)}</h2>
      ${body}
    </article>`;
    if (q.t === 'match') drawMatch();
    if (q.t === 'order') drawOrder();
    if (q.t === 'fill') { const fm = $('#fillf'); fm.addEventListener('submit', e => { e.preventDefault(); checkFill(); }); setTimeout(() => { const a = $('#ans'); if (a && !G.paused) a.focus({ preventScroll: true }); }, 50); }
    hud();
  }

  function drawMatch() {
    const q = G.q, st = G.state, box = $('#matchbox'); if (!box) return;
    const done = Object.keys(st.map).length === q.pairs.length;
    const rightOwner = {}; Object.keys(st.map).forEach(l => { rightOwner[st.map[l]] = +l; });
    box.innerHTML = `<p class="hint">Toca un elemento de la izquierda y luego su pareja de la derecha. Toca de nuevo para deshacer.</p>
      <div class="match">
        <div class="col">${q.pairs.map((p, i) => `<button class="mi ${st.sel === i ? 'sel' : ''} ${i in st.map ? 'paired c' + (i % 5) : ''}" data-act="mleft" data-i="${i}">${esc(p[0])}</button>`).join('')}</div>
        <div class="col">${st.right.map(j => `<button class="mi ${j in rightOwner ? 'paired c' + (rightOwner[j] % 5) : ''}" data-act="mright" data-j="${j}">${esc(q.pairs[j][1])}</button>`).join('')}</div>
      </div>
      <button class="btn primary wide" data-act="checkmatch" ${done ? '' : 'disabled'}>Comprobar</button>`;
  }
  function drawOrder() {
    const q = G.q, st = G.state, box = $('#orderbox'); if (!box) return;
    box.innerHTML = `<p class="hint">Usa las flechas para colocar los elementos en el orden correcto.</p>
      <ol class="order">${st.ord.map((idx, pos) => `<li><span class="pos">${pos + 1}</span><span class="otxt">${esc(q.items[idx])}</span>
        <button class="icon-btn sm" data-act="omove" data-pos="${pos}" data-dir="-1" aria-label="Subir" ${pos === 0 ? 'disabled' : ''}>${icon('up')}</button>
        <button class="icon-btn sm" data-act="omove" data-pos="${pos}" data-dir="1" aria-label="Bajar" ${pos === st.ord.length - 1 ? 'disabled' : ''}>${icon('down')}</button></li>`).join('')}</ol>
      <button class="btn primary wide" data-act="checkorder">Comprobar</button>`;
  }

  /* ---------- acciones del jugador ---------- */
  const A = S.game.actions = {
    pick(el) {
      if (!G || G.locked || G.paused) return;
      const k = +el.dataset.k, o = G.state.opts[k], ok = o.i === G.q.a;
      $$('.opt').forEach((b, i) => { const oo = G.state.opts[i]; b.disabled = true; if (oo.i === G.q.a) b.classList.add('right'); });
      if (!ok) el.classList.add('wrong');
      resolve(ok);
    },
    tf(el) {
      if (!G || G.locked || G.paused) return;
      const v = el.dataset.v === '1', ok = v === G.q.a;
      $$('.opt').forEach(b => { b.disabled = true; if ((b.dataset.v === '1') === G.q.a) b.classList.add('right'); });
      if (!ok) el.classList.add('wrong');
      resolve(ok);
    },
    mleft(el) {
      if (G.locked) return; const i = +el.dataset.i, st = G.state;
      if (i in st.map) { delete st.map[i]; st.sel = null; } else st.sel = st.sel === i ? null : i;
      S.audio.play('click'); drawMatch();
    },
    mright(el) {
      if (G.locked) return; const j = +el.dataset.j, st = G.state;
      const owner = Object.keys(st.map).find(l => st.map[l] === j);
      if (owner !== undefined) { delete st.map[owner]; S.audio.play('click'); drawMatch(); return; }
      if (st.sel === null) { S.toast('Primero toca un elemento de la izquierda.'); return; }
      st.map[st.sel] = j; st.sel = null; S.audio.play('click'); drawMatch();
    },
    checkmatch() {
      if (G.locked) return; const q = G.q, st = G.state;
      if (Object.keys(st.map).length < q.pairs.length) return;
      const ok = q.pairs.every((_, i) => st.map[i] === i);
      $$('#matchbox .mi').forEach(b => { b.disabled = true; });
      resolve(ok);
    },
    omove(el) {
      if (G.locked) return; const pos = +el.dataset.pos, dir = +el.dataset.dir, o = G.state.ord, t = pos + dir;
      if (t < 0 || t >= o.length) return;
      [o[pos], o[t]] = [o[t], o[pos]]; S.audio.play('click'); drawOrder();
      const nb = $$('#orderbox .order li')[t]; if (nb) { const b = $$('button', nb).find(x => x.dataset.dir === el.dataset.dir && !x.disabled); if (b) b.focus(); }
    },
    checkorder() {
      if (G.locked) return; const ok = G.state.ord.every((v, i) => v === i);
      $$('#orderbox button').forEach(b => { b.disabled = true; });
      resolve(ok);
    },
    next() { next(); },
    pause() { pause(); },
    resume() { resume(); },
    quit(el) {
      if (el.dataset.sure !== '1') { el.dataset.sure = '1'; el.textContent = 'Sí, salir sin recompensa'; el.classList.add('danger'); return; }
      abandon();
    }
  };

  function checkFill() {
    if (!G || G.locked || G.paused) return;
    const inp = $('#ans'); if (!inp || !inp.value.trim()) { S.toast('Escribe una respuesta primero.'); return; }
    const v = norm(inp.value), ok = G.q.a.some(a => norm(a) === v);
    inp.disabled = true; $('#fillf button').disabled = true; inp.classList.add(ok ? 'right' : 'wrong');
    resolve(ok);
  }

  function correctText(q) {
    if (q.t === 'mc') return q.o[q.a];
    if (q.t === 'tf') return q.a ? 'Verdadero' : 'Falso';
    if (q.t === 'fill') return q.a[0];
    if (q.t === 'match') return q.pairs.map(p => p[0] + ' → ' + p[1]).join(' · ');
    return q.items.join(' → ');
  }

  function resolve(ok) {
    if (G.locked) return; G.locked = true;
    const p = S.store.cur(), q = G.q, f = q.f, d = S.DIFFS[q.d - 1], practice = G.cfg.mode === 'practice';
    const st = p.stats, sf = st.fields[f] = st.fields[f] || { a: 0, c: 0 }, sk = f + '|' + q.s, ss = st.subjects[sk] = st.subjects[sk] || { a: 0, c: 0 };
    st.answered++; sf.a++; ss.a++; G.seenIds.push(q.id);
    let gain = 0, bonus = 0, coinGain = 0;
    if (ok) {
      G.streak++; G.maxStreak = Math.max(G.maxStreak, G.streak);
      bonus = G.streak >= 3 ? 5 * Math.min(Math.floor(G.streak / 3), 4) : 0;
      gain = Math.round((q.pts + bonus) * (practice ? 0.5 : 1));
      G.score += gain; G.correct++; st.correct++; sf.c++; ss.c++;
      if (!practice) { coinGain = d.coins + (G.streak % 5 === 0 ? 5 : 0); G.coins += coinGain; }
      st.bestStreak = Math.max(st.bestStreak, G.streak);
      S.missionEvent(p, 'correct', 1); S.missionEvent(p, 'field:' + f, 1); S.missionEvent(p, 'points', gain); S.missionEvent(p, 'streak', G.streak);
      S.audio.play('ok');
    } else {
      G.streak = 0; G.wrong++; G.wrongSubj[q.f + '|' + q.s] = (G.wrongSubj[q.f + '|' + q.s] || 0) + 1;
      if (G.M.lives) G.lives--;
      if (G.M.time) G.time = Math.max(0, G.time - G.M.penalty);
      S.audio.play('bad');
      const c = $('.qcard'); if (c && !S.reduced()) { c.classList.add('shake'); }
    }
    G.log.push({ id: q.id, ok });
    S.rememberQuestions(p, [q.id]); S.store.save();

    const last = G.i + 1 >= G.qs.length, dead = G.M.lives && G.lives <= 0, timeUp = G.M.time && G.time <= 0;
    const endNow = last || dead || timeUp;
    const label = endNow ? 'Ver resultados' : 'Siguiente';
    $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" role="status">
      <div class="fb-head">${icon(ok ? 'check' : 'x')}<b>${ok ? ['¡Correcto!', '¡Excelente!', '¡Muy bien!', '¡Así se hace!'][G.i % 4] : 'No es esa'}</b>
        ${ok ? `<span class="gain">+${gain} pts${coinGain ? ` · +${coinGain} monedas` : ''}</span>` : `<span class="gain">${G.M.time ? '−' + G.M.penalty + ' s' : (G.M.lives ? 'Pierdes una vida' : 'Sin penalización')}</span>`}</div>
      ${ok ? '' : `<p class="fb-ans">Respuesta correcta: <b>${esc(correctText(q))}</b></p>`}
      <p class="fb-exp">${esc(q.e)}</p>
      ${G.M.time ? '' : `<button class="btn primary" data-act="next" id="nextbtn">${label}</button>`}
    </div>`;
    if (ok && G.streak >= 3 && G.streak % 3 === 0 && !S.reduced()) S.confetti(25, innerWidth / 2, innerHeight * 0.6);
    hud();
    const nb = $('#nextbtn'); if (nb) setTimeout(() => nb.focus({ preventScroll: false }), 30);
    if (G.M.time) { clearTimeout(autoNext); autoNext = setTimeout(() => { if (G && !G.paused && !G.over) next(); }, ok ? 900 : 1700); }
  }

  function next() {
    if (!G || G.over) return; clearTimeout(autoNext);
    const dead = G.M.lives && G.lives <= 0;
    if (dead) return finish('lives');
    if (G.M.time && G.time <= 0) return finish('time');
    if (G.i + 1 >= G.qs.length) return finish('done');
    G.i++; renderQ(); window.scrollTo(0, 0);
  }

  /* ---------- pausa ---------- */
  function pause() {
    if (!G || G.over || G.paused) return; G.paused = true;
    const ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'pauseov';
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Partida en pausa"><h2>Partida en pausa</h2><p>Tu progreso de esta partida se mantiene. El tiempo está detenido.</p>
      <div class="stack"><button class="btn primary" data-act="resume" id="resbtn">Continuar</button><button class="btn ghost" data-act="quit">Salir de la partida</button></div></div>`;
    document.body.appendChild(ov); $('#resbtn').focus();
  }
  function resume() { const ov = $('#pauseov'); if (ov) ov.remove(); if (G) G.paused = false; }
  S.game.pauseIfActive = function () { if (G && !G.over && !G.paused && $('#game')) pause(); };
  S.game.key = function (e) {
    if (!G || G.over || !$('#game')) return;
    if (e.key === 'Escape') { G.paused ? resume() : pause(); return; }
    if (G.paused) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const q = G.q;
    if (G.locked) { if (e.key === 'Enter' && !G.M.time) { /* el botón con foco ya lo gestiona */ } return; }
    if (q.t === 'mc' && /^[1-4]$/.test(e.key)) { const b = $$('.opt')[+e.key - 1]; if (b) b.click(); }
    if (q.t === 'tf' && /^[vVfF]$/.test(e.key)) { const b = $$('.opt')[/[vV]/.test(e.key) ? 0 : 1]; if (b) b.click(); }
  };

  /* ---------- final de partida ---------- */
  function abandon() {
    const r = $('#pauseov'); if (r) r.remove();
    clearInterval(tick); clearTimeout(autoNext);
    const p = S.store.cur(); S.store.save(); G = null;
    S.toast('Saliste de la partida. Tus respuestas quedaron registradas en tus estadísticas.');
    S.nav.go('menu', {}, { replace: true, reset: true });
  }

  function finish(reason) {
    if (!G || G.over) return; G.over = true; clearInterval(tick); clearTimeout(autoNext);
    const p = S.store.cur(), c = G.cfg, M = G.M, st = p.stats, total = G.correct + G.wrong;
    let win;
    if (c.mode === 'timed') win = G.correct >= M.goal;
    else if (c.mode === 'practice') win = true;
    else win = reason === 'done' && G.lives > 0;
    let stars = 0, bonusCoins = 0, bonusXp = 0;
    if (c.mode === 'adventure' && win) {
      stars = G.wrong === 0 ? 3 : G.wrong === 1 ? 2 : 1; bonusCoins = 10 + 5 * stars;
      const key = c.field + '-' + c.level; p.adv[key] = Math.max(p.adv[key] || 0, stars);
    } else if (c.mode === 'quick' && win) bonusCoins = 8;
    else if (c.mode === 'mixed' && win) bonusCoins = 15;
    else if (c.mode === 'timed' && win) bonusCoins = 8;
    else if (c.mode === 'final' && win) { bonusCoins = 60; bonusXp = 100; st.finalWins++; }
    S.addCoins(p, G.coins + bonusCoins); p.xp += G.score + bonusXp;
    const perfect = G.wrong === 0 && total >= 5 && c.mode !== 'timed' && reason === 'done';
    st.games++; if (perfect) st.perfect++;
    S.missionEvent(p, 'games', 1); if (perfect) S.missionEvent(p, 'perfect', 1); if (c.mode === 'timed') { S.missionEvent(p, 'timed', 1); st.timedBest = Math.max(st.timedBest, G.correct); }
    const prevBest = p.best[c.mode] || 0, record = G.score > prevBest; if (record) p.best[c.mode] = G.score;
    const lvlBefore = S.levelOf(G.xpBefore), lvlAfter = S.levelOf(p.xp);
    const fresh = S.checkAchievements(p);
    S.store.save();
    const weak = Object.entries(G.wrongSubj).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => { const [f, s] = k.split('|'); return { f, s, n }; });
    const res = { cfg: c, mode: c.mode, win, reason, score: G.score, xp: G.score + bonusXp, coins: G.coins + bonusCoins, correct: G.correct, wrong: G.wrong, total,
      maxStreak: G.maxStreak, stars, secs: Math.round((Date.now() - G.t0) / 1000), lvlBefore, lvlAfter, fresh, weak, record, prevBest,
      log: G.log.map(l => ({ q: S.qById[l.id], ok: l.ok })), perfect, bonusCoins, bonusXp };
    G = null;
    S.audio.play(win ? 'done' : 'lose'); if (lvlAfter > lvlBefore) setTimeout(() => S.audio.play('level'), 900);
    S.nav.go('results', res, { replace: true, reset: true });
  }
})(window.S);
