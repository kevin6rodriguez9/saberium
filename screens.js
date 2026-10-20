/* Saberium — navegación y pantallas */
(function (S) {
  'use strict';
  const { $, $$, esc, field, icon, fmt } = S;
  const LV = ['Fácil', 'Intermedio', 'Avanzado'];
  let current = null, stack = [];
  const app = () => $('#app');

  /* ---------- componentes ---------- */
  const avatar = (p, big) => `<span class="avatar ${big ? 'big' : ''} frame-${p.equipped.frame}">${icon(p.equipped.avatar)}</span>`;
  const stars = (n, max) => Array.from({ length: max || 3 }, (_, i) => `<span class="st ${i < n ? 'on' : ''}">${icon('star')}</span>`).join('');
  const bar = (pct, color) => `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%;${color ? '--bc:' + color : ''}"></i></div>`;
  const head = (title, sub, noBack) => `<div class="shead">${noBack ? '' : `<button class="icon-btn" data-act="back" aria-label="Volver">${icon('back')}</button>`}<div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
  const titleName = p => (S.ITEMS.title.find(t => t.id === p.equipped.title) || {}).name || '';
  const advStars = (p, f, l) => p.adv[f + '-' + l] || 0;
  const worldDone = (p, f) => [0, 1, 2].every(l => advStars(p, f, l) > 0);
  const worldOpen = (p, i) => i === 0 || worldDone(p, S.FIELDS[i - 1].id);
  const levelOpen = (p, i, l) => worldOpen(p, i) && (l === 0 || advStars(p, S.FIELDS[i].id, l - 1) > 0);
  const advDone = p => S.FIELDS.reduce((n, f) => n + [0, 1, 2].filter(l => advStars(p, f.id, l) > 0).length, 0);
  function nextAdventure(p) {
    for (let i = 0; i < S.FIELDS.length; i++) for (let l = 0; l < 3; l++) if (advStars(p, S.FIELDS[i].id, l) === 0 && levelOpen(p, i, l)) return { field: S.FIELDS[i].id, level: l };
    return null;
  }
  const unclaimed = p => S.ensureMissions(p).list.filter(m => !m.claimed && m.progress >= S.missionDef(m.id).goal).length;

  /* ---------- navegación ---------- */
  S.nav = {
    go(name, params, opts) {
      opts = opts || {};
      if (opts.reset) stack = [];
      else if (!opts.replace && current && current.name !== 'game' && current.name !== 'results') stack.push(current);
      current = { name, params: params || {} };
      render();
    },
    back() {
      const prev = stack.pop();
      if (prev) { current = prev; render(); } else S.nav.go(S.store.cur() ? 'menu' : 'home', {}, { reset: true });
    },
    get cur() { return current; }
  };

  function topbar() {
    const p = S.store.cur(), el = $('#top');
    const show = p && !['home', 'profiles', 'game'].includes(current.name);
    el.hidden = !show; if (!show) return;
    const li = S.levelInfo(p.xp);
    el.innerHTML = `<button class="brand sm" data-act="go" data-to="menu" aria-label="Ir al menú principal">${S.logoMark()}<span>SABERIUM</span></button>
      <div class="me" title="Nivel ${li.level}">${avatar(p)}<div class="me-info"><b>${esc(p.name)}</b><span>Nivel ${li.level}</span>${bar(li.pct, 'var(--gold)')}</div></div>
      <div class="chip coins" title="Monedas">${icon('coin')}<b>${fmt(p.coins)}</b></div>`;
  }

  function render() {
    const name = current.name, fn = SCREENS[name];
    if (name !== 'game') S.game.leave();
    const p = S.store.cur();
    if (!['home', 'profiles'].includes(name) && !p) { current = { name: 'home', params: {} }; return render(); }
    if (p) { S.ensureMissions(p); }
    S.applyPrefs(); topbar();
    app().innerHTML = fn(current.params || {}, p);
    app().className = 'screen s-' + name;
    window.scrollTo(0, 0);
    const h = $('h1', app()); if (h && name !== 'game') { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (SCREENS[name + '_mount']) SCREENS[name + '_mount'](current.params, p);
  }
  S.nav.render = render;

  const SCREENS = {};

  /* ---------- inicio ---------- */
  SCREENS.home = () => {
    const p = S.store.cur();
    return `<section class="hero">
      <div class="hero-main">
        <div class="brand big">${S.logoMark()}<h1 class="wordmark">SABERIUM</h1></div>
        <p class="tagline">Cinco mundos, un cristal y miles de formas de demostrar lo que sabes.</p>
        <div class="hero-actions">
          ${p ? `<button class="btn primary lg" data-act="go" data-to="menu">Continuar como ${esc(p.name)}</button><button class="btn ghost lg" data-act="go" data-to="profiles">Cambiar jugador</button>`
            : `<button class="btn primary lg" data-act="go" data-to="profiles">Jugar</button>`}
          <button class="btn ghost lg" data-act="go" data-to="settings" ${p ? '' : 'data-needplayer="1"'}>Ajustes</button>
        </div>
      </div>
      <ul class="worlds-strip" aria-label="Los cinco campos">
        ${S.FIELDS.map(f => `<li style="--fc:${f.color}">${icon(f.id)}<b>${f.name}</b><span>${f.world}</span></li>`).join('')}
      </ul>
    </section>`;
  };

  /* ---------- perfiles ---------- */
  SCREENS.profiles = (params) => {
    const ps = S.store.players();
    const free = S.ITEMS.avatar.filter(a => a.price === 0);
    return `<section class="narrow">${head('¿Quién juega?', 'Elige tu perfil o crea uno nuevo. Tu progreso se guarda en este dispositivo.')}
      ${ps.length ? `<div class="plist">${ps.map(p => `<div class="pcard">
          <button class="pick" data-act="selectp" data-id="${p.id}">${avatar(p, true)}<span class="pn"><b>${esc(p.name)}</b><small>Nivel ${S.levelOf(p.xp)} · ${fmt(p.xp)} XP</small></span></button>
          <button class="icon-btn sm" data-act="delp" data-id="${p.id}" aria-label="Eliminar perfil de ${esc(p.name)}">${icon('x')}</button></div>`).join('')}</div>`
        : `<p class="empty">Aún no hay perfiles. Crea el primero para empezar a jugar.</p>`}
      ${params.del ? `<div class="notice"><p>¿Eliminar el perfil de <b>${esc(S.store.players().find(x => x.id === params.del)?.name || '')}</b>? No se puede deshacer.</p><div class="row"><button class="btn danger" data-act="delp2" data-id="${params.del}">Sí, eliminar</button><button class="btn ghost" data-act="delp0">Cancelar</button></div></div>` : ''}
      <form class="card form" data-form="newp"><h2>Nuevo perfil</h2>
        <label for="pname">Nombre del jugador</label>
        <input id="pname" name="name" type="text" maxlength="16" required minlength="2" placeholder="Por ejemplo: Camila" autocomplete="off">
        <fieldset><legend>Avatar inicial</legend><div class="avchoice">
          ${free.map((a, i) => `<label class="avopt"><input type="radio" name="av" value="${a.id}" ${i === 0 ? 'checked' : ''}><span>${icon(a.id)}<small>${a.name}</small></span></label>`).join('')}
        </div></fieldset>
        <p class="err" id="perr" role="alert" hidden></p>
        <button class="btn primary" type="submit">Crear y jugar</button>
      </form></section>`;
  };

  /* ---------- menú ---------- */
  SCREENS.menu = (_, p) => {
    const li = S.levelInfo(p.xp), na = nextAdventure(p), un = unclaimed(p);
    const tiles = [
      ['modes', 'play', 'Jugar', 'Elige un modo de juego'], ['worlds', 'map', 'Aventura', `${advDone(p)} de 15 niveles`],
      ['missions', 'gift', 'Misiones', un ? `${un} para reclamar` : 'Retos de hoy'], ['shop', 'cart', 'Tienda', 'Estilo con monedas'],
      ['progress', 'chart', 'Progreso', 'Cómo vas por materia'], ['profile', 'user', 'Perfil y logros', `${Object.keys(p.ach).length} de ${S.ACHIEVEMENTS.length} logros`],
      ['settings', 'gear', 'Ajustes', 'Sonido y accesibilidad'], ['profiles', 'swap', 'Cambiar jugador', 'Otro perfil']
    ];
    return `<section>
      <div class="welcome card"><div class="w-left">${avatar(p, true)}<div><p class="eyebrow">${esc(titleName(p))}</p><h1>Hola, ${esc(p.name)}</h1></div></div>
        <div class="w-xp"><div class="row sb"><b>Nivel ${li.level}</b><span>${fmt(li.into)} / ${fmt(li.need)} XP</span></div>${bar(li.pct, 'var(--gold)')}</div></div>
      ${na ? `<button class="cta" data-act="brief" data-mode="adventure" data-field="${na.field}" data-level="${na.level}" style="--fc:${field(na.field).color}">${icon(na.field)}<span><small>Continuar aventura</small><b>${field(na.field).world} · ${LV[na.level]}</b></span>${icon('play')}</button>` :
        `<button class="cta" data-act="go" data-to="modes"><span><small>Aventura completada</small><b>Prueba el Desafío final</b></span>${icon('trophy')}</button>`}
      <div class="tiles">${tiles.map(t => `<button class="tile" data-act="go" data-to="${t[0]}">${icon(t[1])}<b>${t[2]}</b><small>${t[3]}</small>${t[0] === 'missions' && un ? `<i class="dot" aria-label="${un} por reclamar">${un}</i>` : ''}</button>`).join('')}</div>
    </section>`;
  };

  /* ---------- modos ---------- */
  SCREENS.modes = (_, p) => {
    const done = advDone(p), locked = done < S.FINAL_REQ;
    return `<section>${head('Modos de juego', 'Cada modo tiene sus propias reglas y su condición de victoria.')}
      <div class="mgrid">${Object.entries(S.MODES).map(([id, m]) => {
        const lock = id === 'final' && locked, best = p.best[id];
        return `<article class="mcard ${lock ? 'locked' : ''}" style="--fc:${m.color}"><div class="mc-ic">${icon(lock ? 'lock' : m.icon)}</div>
          <h2>${m.name}</h2><p>${m.short}</p>
          <p class="mc-meta">${lock ? `Completa ${S.FINAL_REQ} niveles de Aventura (${done}/${S.FINAL_REQ})` : (best ? `Récord: ${fmt(best)} pts` : 'Aún sin récord')}</p>
          <button class="btn ${lock ? 'ghost' : 'primary'}" data-act="mode" data-mode="${id}">${lock ? 'Bloqueado' : id === 'adventure' ? 'Ver mundos' : id === 'practice' ? 'Elegir materia' : 'Ver reglas'}</button></article>`;
      }).join('')}</div></section>`;
  };

  /* ---------- aventura: mundos ---------- */
  SCREENS.worlds = (_, p) => `<section>${head('Aventura', 'Supera los tres niveles de un mundo para abrir el siguiente.')}
    <div class="wlist">${S.FIELDS.map((f, i) => {
      const open = worldOpen(p, i), n = [0, 1, 2].filter(l => advStars(p, f.id, l) > 0).length;
      return `<article class="world ${open ? '' : 'locked'}" style="--fc:${f.color}">
        <div class="w-head">${icon(open ? f.id : 'lock')}<div><h2>${f.world}</h2><p>${f.name} · ${n}/3 niveles</p></div></div>
        ${open ? '' : `<p class="w-lock">Completa ${S.FIELDS[i - 1].world} para abrir este mundo.</p>`}
        <div class="levels">${[0, 1, 2].map(l => {
          const ok = levelOpen(p, i, l);
          return `<button class="lvl" ${ok ? `data-act="brief" data-mode="adventure" data-field="${f.id}" data-level="${l}"` : 'disabled aria-disabled="true"'}>
            <span class="lv-n">${ok ? l + 1 : icon('lock')}</span><b>${LV[l]}</b><span class="stars">${stars(advStars(p, f.id, l))}</span></button>`;
        }).join('')}</div></article>`;
    }).join('')}</div></section>`;

  /* ---------- práctica: campos y materias ---------- */
  SCREENS.fields = (_, p) => `<section>${head('Elige un campo', 'Practica la materia que quieras, sin presión.')}
    <div class="fgrid">${S.FIELDS.map(f => {
      const s = p.stats.fields[f.id], acc = s && s.a ? Math.round(s.c / s.a * 100) : null;
      return `<button class="fcard" style="--fc:${f.color}" data-act="pfield" data-field="${f.id}">${icon(f.id)}<h2>${f.name}</h2><p>${f.blurb}</p>
        <span class="f-meta">${S.QUESTIONS.filter(q => q.f === f.id).length} retos · ${acc === null ? 'sin practicar' : acc + ' % de acierto'}</span></button>`;
    }).join('')}</div></section>`;

  SCREENS.practice = (params) => {
    const f = field(params.field), subj = params.subject || '', diff = params.diff || 0;
    const avail = S.QUESTIONS.filter(q => q.f === f.id && (!subj || q.s === subj) && (!diff || q.d === diff)).length;
    return `<section class="narrow" style="--fc:${f.color}">${head('Modo práctica', f.name)}
      <div class="card">
        <h2 class="h3">Materia</h2>
        <div class="chips">${['', ...f.subjects].map(s => `<button class="chipbtn ${s === subj ? 'on' : ''}" data-act="psetup" data-subject="${esc(s)}" data-diff="${diff}" data-field="${f.id}" aria-pressed="${s === subj}">${s || 'Todas'}</button>`).join('')}</div>
        <h2 class="h3">Dificultad</h2>
        <div class="chips">${[[0, 'Todas'], [1, 'Fácil'], [2, 'Intermedio'], [3, 'Avanzado']].map(([d, n]) => `<button class="chipbtn ${d === diff ? 'on' : ''}" data-act="psetup" data-subject="${esc(subj)}" data-diff="${d}" data-field="${f.id}" aria-pressed="${d === diff}">${n}</button>`).join('')}</div>
        <p class="note">${avail ? `${avail} retos disponibles con este filtro. Jugarás hasta 10.` : 'No hay retos con esta combinación. Cambia la materia o la dificultad.'}</p>
        <button class="btn primary lg" data-act="startgame" data-mode="practice" data-field="${f.id}" data-subject="${esc(subj)}" data-diff="${diff}" ${avail ? '' : 'disabled'}>Empezar práctica</button>
      </div></section>`;
  };

  /* ---------- reglas antes de jugar ---------- */
  SCREENS.briefing = (params) => {
    const m = S.MODES[params.mode], diff = params.diff || 0, adv = params.mode === 'adventure';
    const f = adv ? field(params.field) : null;
    const choose = ['quick', 'timed', 'mixed'].includes(params.mode);
    return `<section class="narrow" style="--fc:${f ? f.color : m.color}">
      ${head(adv ? `${f.world} · ${LV[params.level]}` : m.name, adv ? f.name : m.short)}
      <div class="card"><div class="brief-ic">${icon(adv ? f.id : m.icon)}</div>
        <h2 class="h3">Reglas</h2><ul class="rules">${m.rules.map(r => `<li>${r}</li>`).join('')}</ul>
        ${choose ? `<h2 class="h3">Dificultad</h2><div class="chips">${[[0, 'Todas'], [1, 'Fácil'], [2, 'Intermedio'], [3, 'Avanzado']].map(([d, n]) => `<button class="chipbtn ${d === diff ? 'on' : ''}" data-act="bsetup" data-mode="${params.mode}" data-diff="${d}" aria-pressed="${d === diff}">${n}</button>`).join('')}</div>` : ''}
        <button class="btn primary lg" data-act="startgame" data-mode="${params.mode}" ${adv ? `data-field="${params.field}" data-level="${params.level}"` : ''} data-diff="${diff}">¡Comenzar!</button>
      </div></section>`;
  };

  /* ---------- resultados ---------- */
  SCREENS.results = (r) => {
    const m = S.MODES[r.mode], p = S.store.cur();
    const titles = { adventure: ['¡Nivel superado!', 'Nivel no superado'], quick: ['¡Desafío cumplido!', 'Fin del desafío'], practice: ['Práctica terminada', 'Práctica terminada'],
      timed: ['¡Reto superado!', 'Tiempo agotado'], mixed: ['¡Reto mixto completado!', 'Reto mixto sin terminar'], final: ['¡Campeón del Cristal!', 'Desafío final no superado'] };
    const why = r.reason === 'lives' ? 'Te quedaste sin vidas.' : r.reason === 'time' ? 'Se acabó el tiempo.' : '';
    const acc = r.total ? Math.round(r.correct / r.total * 100) : 0;
    const mm = Math.floor(r.secs / 60), ss = String(r.secs % 60).padStart(2, '0');
    const next = r.mode === 'adventure' && r.win ? nextAdventure(p) : null;
    return `<section class="results ${r.win ? 'win' : 'lose'}" style="--fc:${m.color}">
      <div class="res-hero"><div class="res-ic">${icon(r.win ? 'trophy' : 'heart')}</div><h1>${titles[r.mode][r.win ? 0 : 1]}</h1>
        ${r.mode === 'adventure' && r.win ? `<div class="stars big">${stars(r.stars)}</div>` : ''}
        <p>${why} ${r.win ? 'Buen trabajo.' : 'Cada error es una pista de qué repasar. Inténtalo de nuevo.'}${r.mode === 'timed' ? ` Meta: ${m.goal} aciertos.` : ''}</p></div>
      ${r.lvlAfter > r.lvlBefore ? `<div class="banner lvl">${icon('bolt')}<b>¡Subiste al nivel ${r.lvlAfter}!</b></div>` : ''}
      ${r.record && r.score > 0 ? `<div class="banner rec">${icon('trophy')}<b>Nuevo récord personal: ${fmt(r.score)} pts</b>${r.prevBest ? `<span>Antes: ${fmt(r.prevBest)}</span>` : ''}</div>` : ''}
      <div class="stat-grid">
        <div class="stat"><small>Puntos</small><b>${fmt(r.score)}</b></div>
        <div class="stat"><small>Experiencia</small><b>+${fmt(r.xp)}</b></div>
        <div class="stat"><small>Monedas</small><b>+${fmt(r.coins)}</b></div>
        <div class="stat"><small>Aciertos</small><b>${r.correct}/${r.total}</b></div>
        <div class="stat"><small>Precisión</small><b>${acc} %</b></div>
        <div class="stat"><small>Mejor racha</small><b>${r.maxStreak}</b></div>
        <div class="stat"><small>Tiempo</small><b>${mm}:${ss}</b></div>
        ${r.bonusCoins ? `<div class="stat"><small>Bono de victoria</small><b>+${r.bonusCoins}</b></div>` : ''}
      </div>
      ${r.fresh.length ? `<div class="card"><h2 class="h3">Logros desbloqueados</h2><ul class="achlist">${r.fresh.map(a => `<li>${icon('star')}<span><b>${esc(a.name)}</b><small>${esc(a.desc)} (+20 monedas)</small></span></li>`).join('')}</ul></div>` : ''}
      <div class="card"><h2 class="h3">Recomendaciones</h2>
        ${r.weak.length ? `<p class="note">Estos temas te costaron más. Un repaso corto ayuda:</p><div class="chips">${r.weak.map(w => `<button class="chipbtn" style="--fc:${field(w.f).color}" data-act="practicewith" data-field="${w.f}" data-subject="${esc(w.s)}">${esc(w.s)} (${w.n} ${w.n === 1 ? 'error' : 'errores'})</button>`).join('')}</div>`
          : `<p class="note">${r.total ? 'No tuviste errores en esta partida. Sube la dificultad para seguir creciendo.' : 'Responde más preguntas para recibir recomendaciones.'}</p>`}</div>
      ${r.log.length ? `<details class="card review"><summary>Revisar respuestas (${r.log.length})</summary><ol>${r.log.map(l => `<li class="${l.ok ? 'ok' : 'bad'}">${icon(l.ok ? 'check' : 'x')}<span><b>${esc(l.q.q)}</b><small>${esc(l.q.e)}</small></span></li>`).join('')}</ol></details>` : ''}
      <div class="actions">
        ${next ? `<button class="btn primary lg" data-act="brief" data-mode="adventure" data-field="${next.field}" data-level="${next.level}">Siguiente nivel</button>` : ''}
        <button class="btn ${next ? 'ghost' : 'primary'} lg" data-act="again">Jugar de nuevo</button>
        <button class="btn ghost lg" data-act="go" data-to="menu" data-reset="1">Menú principal</button>
      </div></section>`;
  };
  SCREENS.results_mount = (r) => {
    if (r.win) S.confetti(r.mode === 'final' ? 220 : 110);
    if (r.lvlAfter > r.lvlBefore) setTimeout(() => S.confetti(90), 700);
  };

  SCREENS.game = () => S.game.render();

  /* ---------- perfil ---------- */
  SCREENS.profile = (_, p) => {
    const li = S.levelInfo(p.xp), st = p.stats, acc = st.answered ? Math.round(st.correct / st.answered * 100) : 0;
    return `<section>${head('Perfil')}
      <div class="card pfhead">${avatar(p, true)}<div><p class="eyebrow">${esc(titleName(p))}</p><h2>${esc(p.name)}</h2>
        <div class="row sb"><b>Nivel ${li.level}</b><span>${fmt(p.xp)} XP en total</span></div>${bar(li.pct, 'var(--gold)')}<small>Faltan ${fmt(li.need - li.into)} XP para el nivel ${li.level + 1}</small></div></div>
      <div class="stat-grid">
        <div class="stat"><small>Partidas</small><b>${st.games}</b></div><div class="stat"><small>Respuestas correctas</small><b>${st.correct}</b></div>
        <div class="stat"><small>Precisión</small><b>${st.answered ? acc + ' %' : '—'}</b></div><div class="stat"><small>Mejor racha</small><b>${st.bestStreak}</b></div>
        <div class="stat"><small>Monedas</small><b>${fmt(p.coins)}</b></div><div class="stat"><small>Niveles de Aventura</small><b>${advDone(p)}/15</b></div></div>
      <div class="card"><h2 class="h3">Récords personales</h2>${Object.keys(p.best).length ? `<ul class="records">${Object.entries(S.MODES).filter(([id]) => p.best[id]).map(([id, m]) => `<li>${icon(m.icon)}<span>${m.name}</span><b>${fmt(p.best[id])} pts</b></li>`).join('')}</ul>` : '<p class="note">Todavía no tienes récords. Termina una partida para registrar el primero.</p>'}</div>
      <div class="card"><h2 class="h3">Logros (${Object.keys(p.ach).length}/${S.ACHIEVEMENTS.length})</h2>
        <ul class="achgrid">${S.ACHIEVEMENTS.map(a => { const got = p.ach[a.id]; return `<li class="${got ? 'got' : ''}" ${a.medal && got ? `style="--fc:${a.medal}"` : ''}>${icon(got ? 'star' : 'lock')}<span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span></li>`; }).join('')}</ul></div></section>`;
  };

  /* ---------- misiones ---------- */
  SCREENS.missions = (_, p) => {
    const ms = S.ensureMissions(p), all = ms.list.every(m => m.claimed);
    return `<section class="narrow">${head('Misiones diarias', 'Se renuevan cada día. Reclama tus recompensas al completarlas.')}
      <div class="mlist">${ms.list.map((m, i) => {
        const d = S.missionDef(m.id), done = m.progress >= d.goal, pr = Math.min(m.progress, d.goal);
        return `<article class="mission ${m.claimed ? 'claimed' : ''}"><div class="m-top"><h2>${d.text}</h2><span class="reward">+${d.coins} ${icon('coin')} · +${d.xp} XP</span></div>
          ${bar(pr / d.goal * 100, 'var(--ok)')}<div class="row sb"><small>${pr} / ${d.goal}</small>
          <button class="btn ${done && !m.claimed ? 'primary' : 'ghost'} sm" data-act="claim" data-i="${i}" ${done && !m.claimed ? '' : 'disabled'}>${m.claimed ? 'Reclamada' : done ? 'Reclamar' : 'En curso'}</button></div></article>`;
      }).join('')}</div>
      <article class="mission bonus ${ms.bonus ? 'claimed' : ''}"><div class="m-top"><h2>Bono del día</h2><span class="reward">+30 ${icon('coin')} · +60 XP</span></div>
        <p class="note">Reclama las tres misiones para abrir este premio extra.</p>
        <button class="btn ${all && !ms.bonus ? 'primary' : 'ghost'} sm" data-act="claimbonus" ${all && !ms.bonus ? '' : 'disabled'}>${ms.bonus ? 'Reclamado' : all ? 'Reclamar bono' : 'Bloqueado'}</button></article>
      <div class="actions"><button class="btn primary" data-act="go" data-to="modes">Ir a jugar</button></div></section>`;
  };

  /* ---------- tienda ---------- */
  SCREENS.shop = (params, p) => {
    const cat = params.cat || 'avatar';
    return `<section>${head('Tienda', 'Gasta tus monedas en objetos de estilo. No cambian tu puntaje.')}
      <div class="row sb wrap"><div class="tabs" role="tablist">${Object.entries(S.ITEM_CATS).map(([k, n]) => `<button role="tab" aria-selected="${k === cat}" class="tab ${k === cat ? 'on' : ''}" data-act="shoptab" data-cat="${k}">${n}</button>`).join('')}</div>
        <div class="chip coins">${icon('coin')}<b>${fmt(p.coins)}</b></div></div>
      <div class="igrid">${S.ITEMS[cat].map(it => {
        const own = p.owned[cat].includes(it.id), eq = p.equipped[cat] === it.id, can = p.coins >= it.price;
        let prev = '';
        if (cat === 'avatar') prev = `<span class="avatar big frame-none">${icon(it.id)}</span>`;
        else if (cat === 'frame') prev = `<span class="avatar big frame-${it.id}">${icon(p.equipped.avatar)}</span>`;
        else if (cat === 'bg') prev = `<span class="bgprev" data-bg="${it.id}"></span>`;
        else prev = `<span class="ttl">${esc(it.name)}</span>`;
        return `<article class="item ${eq ? 'eq' : ''}">${prev}<h2>${esc(it.name)}</h2>
          ${own ? `<button class="btn ${eq ? 'ghost' : 'primary'} sm" data-act="equip" data-cat="${cat}" data-id="${it.id}" ${eq ? 'disabled' : ''}>${eq ? 'Equipado' : 'Equipar'}</button>`
            : `<button class="btn ${can ? 'primary' : 'ghost'} sm" data-act="buy" data-cat="${cat}" data-id="${it.id}" ${can ? '' : 'disabled'}>${icon('coin')} ${it.price}${can ? '' : ' · faltan ' + (it.price - p.coins)}</button>`}</article>`;
      }).join('')}</div></section>`;
  };

  /* ---------- progreso académico ---------- */
  SCREENS.progress = (_, p) => {
    const st = p.stats;
    if (!st.answered) return `<section class="narrow">${head('Progreso académico')}<div class="card empty-card">${icon('chart')}<h2>Aún no hay datos</h2><p>Responde algunas preguntas y aquí verás tu precisión en cada campo y materia.</p><button class="btn primary" data-act="go" data-to="modes">Jugar ahora</button></div></section>`;
    const subs = [];
    S.FIELDS.forEach(f => f.subjects.forEach(s => { const x = st.subjects[f.id + '|' + s] || { a: 0, c: 0 }; subs.push({ f: f.id, s, a: x.a, c: x.c, acc: x.a ? x.c / x.a : null }); }));
    const weak = subs.filter(x => x.a >= 3 && x.acc < 0.7).sort((a, b) => a.acc - b.acc).slice(0, 3);
    const fresh = subs.filter(x => x.a < 3).sort((a, b) => a.a - b.a).slice(0, 3);
    const recs = weak.length ? weak : fresh;
    return `<section>${head('Progreso académico', `${st.correct} aciertos de ${st.answered} respuestas (${Math.round(st.correct / st.answered * 100)} %)`)}
      <div class="card"><h2 class="h3">${weak.length ? 'Te conviene repasar' : 'Para explorar'}</h2><div class="chips">${recs.map(x => `<button class="chipbtn" style="--fc:${field(x.f).color}" data-act="practicewith" data-field="${x.f}" data-subject="${esc(x.s)}">${esc(x.s)}${x.a ? ' · ' + Math.round(x.acc * 100) + ' %' : ' · sin practicar'}</button>`).join('')}</div></div>
      <div class="pgrid">${S.FIELDS.map(f => {
        const s = st.fields[f.id] || { a: 0, c: 0 }, pct = s.a ? Math.round(s.c / s.a * 100) : 0;
        return `<article class="pcardf" style="--fc:${f.color}"><div class="w-head">${icon(f.id)}<div><h2>${f.name}</h2><p>${s.a ? `${s.c} de ${s.a} correctas` : 'Sin practicar'}</p></div><b class="pct">${s.a ? pct + ' %' : '—'}</b></div>
          ${bar(pct)}<ul class="subs">${f.subjects.map(sn => { const x = st.subjects[f.id + '|' + sn] || { a: 0, c: 0 }, pp = x.a ? Math.round(x.c / x.a * 100) : 0; return `<li><span>${sn}</span><div>${bar(pp)}</div><small>${x.a ? pp + ' %' : '—'}</small></li>`; }).join('')}</ul></article>`;
      }).join('')}</div></section>`;
  };

  /* ---------- ajustes ---------- */
  SCREENS.settings = (params) => {
    const s = S.store.settings();
    const sw = (k, label, desc) => `<label class="switch"><input type="checkbox" data-set="${k}" ${s[k] ? 'checked' : ''}><span class="track"></span><span class="sl"><b>${label}</b><small>${desc}</small></span></label>`;
    return `<section class="narrow">${head('Ajustes')}
      <div class="card"><h2 class="h3">Sonido</h2>
        ${sw('sfx', 'Efectos de sonido', 'Aciertos, errores, logros y subidas de nivel.')}
        ${sw('music', 'Música de fondo', 'Una melodía suave mientras juegas.')}
        <label class="range" for="vol"><b>Volumen</b><input id="vol" type="range" min="0" max="1" step="0.05" value="${s.vol}" data-setr="vol"></label>
        <button class="btn ghost sm" data-act="testsound">Probar sonido</button></div>
      <div class="card"><h2 class="h3">Accesibilidad</h2>
        ${sw('reduce', 'Reducir animaciones', 'Desactiva confeti, sacudidas y movimientos.')}
        ${sw('large', 'Texto grande', 'Aumenta el tamaño de la letra en todo el juego.')}
        ${sw('contrast', 'Alto contraste', 'Bordes y textos más marcados.')}
        <p class="note">Puedes jugar con el teclado: números 1 a 4 para elegir, V y F en verdadero o falso, Esc para pausar.</p></div>
      <div class="card"><h2 class="h3">Datos</h2>
        ${S.store.cur() ? (params.confirm === 'reset' ? `<div class="notice"><p>Se borrará todo el progreso de <b>${esc(S.store.cur().name)}</b>. Los demás perfiles no cambian.</p><div class="row"><button class="btn danger" data-act="reset2">Sí, reiniciar</button><button class="btn ghost" data-act="cfg0">Cancelar</button></div></div>` : `<button class="btn ghost" data-act="cfg" data-c="reset">Reiniciar mi progreso</button>`) : ''}
        ${params.confirm === 'wipe' ? `<div class="notice"><p>Se borrarán todos los perfiles y ajustes de este dispositivo.</p><div class="row"><button class="btn danger" data-act="wipe2">Sí, borrar todo</button><button class="btn ghost" data-act="cfg0">Cancelar</button></div></div>` : `<button class="btn ghost" data-act="cfg" data-c="wipe">Borrar todos los datos</button>`}
      </div></section>`;
  };

  /* ---------- acciones ---------- */
  const cfgFrom = d => {
    const c = { mode: d.mode, diff: +d.diff || 0 };
    if (d.field) c.field = d.field; if (d.level !== undefined) c.level = +d.level; if (d.subject) c.subject = d.subject;
    return c;
  };
  let lastCfg = null;
  const ACT = S.actions = {
    go(el) { if (el.dataset.needplayer) { S.toast('Primero crea o elige un perfil.'); return S.nav.go('profiles'); } S.nav.go(el.dataset.to, {}, el.dataset.reset ? { reset: true } : {}); },
    back() { S.nav.back(); },
    selectp(el) { S.store.select(el.dataset.id); S.audio.play('click'); S.nav.go('menu', {}, { reset: true }); },
    delp(el) { S.nav.go('profiles', { del: el.dataset.id }, { replace: true }); },
    delp0() { S.nav.go('profiles', {}, { replace: true }); },
    delp2(el) { S.store.remove(el.dataset.id); S.nav.go('profiles', {}, { replace: true }); },
    mode(el) {
      const m = el.dataset.mode, p = S.store.cur();
      if (m === 'adventure') return S.nav.go('worlds');
      if (m === 'practice') return S.nav.go('fields');
      if (m === 'final' && advDone(p) < S.FINAL_REQ) { S.toast(`Completa ${S.FINAL_REQ} niveles de Aventura para abrir el Desafío final.`); return; }
      S.nav.go('briefing', { mode: m });
    },
    brief(el) { S.nav.go('briefing', { mode: el.dataset.mode, field: el.dataset.field, level: +el.dataset.level }); },
    bsetup(el) { S.nav.go('briefing', { mode: el.dataset.mode, diff: +el.dataset.diff }, { replace: true }); },
    pfield(el) { S.nav.go('practice', { field: el.dataset.field }); },
    psetup(el) { S.nav.go('practice', { field: el.dataset.field, subject: el.dataset.subject, diff: +el.dataset.diff }, { replace: true }); },
    practicewith(el) { S.nav.go('practice', { field: el.dataset.field, subject: el.dataset.subject }); },
    startgame(el) { lastCfg = cfgFrom(el.dataset); S.game.start(lastCfg); },
    again() { const r = current.params; if (r && r.cfg) { lastCfg = r.cfg; S.game.start(lastCfg); } else S.nav.go('modes', {}, { reset: true }); },
    claim(el) {
      const p = S.store.cur(); const d = S.missionDef(S.ensureMissions(p).list[+el.dataset.i].id);
      if (S.claimMission(p, +el.dataset.i)) { S.toast(`<b>Misión reclamada</b><span>+${d.coins} monedas · +${d.xp} XP</span>`); S.confetti(30, innerWidth / 2, innerHeight / 3); render(); }
    },
    claimbonus() { const p = S.store.cur(); if (S.claimBonus(p)) { S.toast('<b>Bono del día reclamado</b><span>+30 monedas · +60 XP</span>'); S.confetti(60); render(); } },
    shoptab(el) { S.nav.go('shop', { cat: el.dataset.cat }, { replace: true }); },
    buy(el) {
      const p = S.store.cur(), cat = el.dataset.cat, it = S.ITEMS[cat].find(x => x.id === el.dataset.id);
      if (!it || p.owned[cat].includes(it.id)) return;
      if (p.coins < it.price) { S.toast('Te faltan monedas para este objeto.'); return; }
      p.coins -= it.price; p.owned[cat].push(it.id); p.equipped[cat] = it.id; p.counters.bought++;
      S.audio.play('coin'); S.checkAchievements(p); S.store.save();
      S.toast(`<b>Comprado y equipado</b><span>${esc(it.name)}</span>`); render();
    },
    equip(el) { const p = S.store.cur(); const cat = el.dataset.cat; if (p.owned[cat].includes(el.dataset.id)) { p.equipped[cat] = el.dataset.id; S.store.save(); S.audio.play('click'); render(); } },
    testsound() { S.audio.play('ok'); },
    cfg(el) { S.nav.go('settings', { confirm: el.dataset.c }, { replace: true }); },
    cfg0() { S.nav.go('settings', {}, { replace: true }); },
    reset2() { const p = S.store.cur(); S.store.reset(p.id); S.toast('Progreso reiniciado.'); S.nav.go('menu', {}, { reset: true }); },
    wipe2() { S.store.wipe(); S.audio.music(false); S.nav.go('home', {}, { reset: true }); }
  };

  S.onSubmit = function (form, e) {
    if (form.dataset.form === 'newp') {
      e.preventDefault();
      const name = form.elements.name.value.trim(), err = $('#perr');
      if (name.length < 2) { err.hidden = false; err.textContent = 'Escribe un nombre de al menos 2 letras.'; return; }
      if (S.store.players().some(p => p.name.toLowerCase() === name.toLowerCase())) { err.hidden = false; err.textContent = 'Ya existe un perfil con ese nombre. Elige otro.'; return; }
      S.store.create(name, form.elements.av.value); S.audio.play('done'); S.nav.go('menu', {}, { reset: true });
    }
  };
})(window.S);
