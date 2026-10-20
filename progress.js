/* Saberium — progreso: logros, misiones, recompensas, selección de preguntas */
(function (S) {
  'use strict';
  const { shuffle, hash, dateKey, field } = S;

  /* ---------- logros ---------- */
  const worldDone = (p, f) => [0, 1, 2].every(l => (p.adv[f + '-' + l] || 0) > 0);
  S.ACHIEVEMENTS = [
    { id: 'first', name: 'Primer paso', desc: 'Termina tu primera partida.', test: p => p.stats.games >= 1 },
    { id: 'streak5', name: 'En racha', desc: 'Acierta 5 preguntas seguidas.', test: p => p.stats.bestStreak >= 5 },
    { id: 'streak10', name: 'Imparable', desc: 'Acierta 10 preguntas seguidas.', test: p => p.stats.bestStreak >= 10 },
    { id: 'perfect', name: 'Partida perfecta', desc: 'Termina una partida de 5 o más preguntas sin errores.', test: p => p.stats.perfect >= 1 },
    { id: 'correct50', name: 'Cincuenta aciertos', desc: 'Acumula 50 respuestas correctas.', test: p => p.stats.correct >= 50 },
    { id: 'correct200', name: 'Doscientos aciertos', desc: 'Acumula 200 respuestas correctas.', test: p => p.stats.correct >= 200 },
    { id: 'lvl5', name: 'Nivel 5', desc: 'Alcanza el nivel 5.', test: p => S.levelOf(p.xp) >= 5 },
    { id: 'lvl10', name: 'Nivel 10', desc: 'Alcanza el nivel 10.', test: p => S.levelOf(p.xp) >= 10 },
    { id: 'coins100', name: 'Pequeño tesoro', desc: 'Gana 100 monedas en total.', test: p => p.totalCoins >= 100 },
    { id: 'timed', name: 'Contra el tiempo', desc: 'Logra 12 aciertos en una partida contra el reloj.', test: p => p.stats.timedBest >= 12 },
    { id: 'final', name: 'Campeón final', desc: 'Supera el Desafío final.', test: p => p.stats.finalWins >= 1 },
    { id: 'shopper', name: 'Primer estilo', desc: 'Compra un objeto en la tienda.', test: p => p.counters.bought >= 1 },
    { id: 'missions', name: 'Constante', desc: 'Completa 5 misiones diarias.', test: p => p.counters.missionsDone >= 5 },
    ...S.FIELDS.map(f => ({ id: 'world_' + f.id, name: 'Maestro de ' + f.world, desc: 'Supera los 3 niveles de ' + f.name + ' en Aventura.', medal: f.color, test: p => worldDone(p, f.id) })),
    { id: 'allworlds', name: 'Cristal completo', desc: 'Completa los cinco mundos de Aventura.', test: p => S.FIELDS.every(f => worldDone(p, f.id)) }
  ];
  S.checkAchievements = function (p) {
    const fresh = [];
    S.ACHIEVEMENTS.forEach(a => {
      if (!p.ach[a.id] && a.test(p)) {
        p.ach[a.id] = Date.now(); p.coins += 20; p.totalCoins += 20; fresh.push(a);
      }
    });
    if (fresh.length) { S.audio.play('ach'); fresh.forEach(a => S.toast(`<b>Logro desbloqueado</b><span>${S.esc(a.name)} · +20 monedas</span>`, 'ach')); }
    return fresh;
  };

  /* ---------- misiones diarias ---------- */
  S.MISSION_POOL = [
    { id: 'm_correct', text: 'Acierta 15 preguntas', goal: 15, metric: 'correct', coins: 15, xp: 40 },
    { id: 'm_games', text: 'Termina 3 partidas', goal: 3, metric: 'games', coins: 12, xp: 30 },
    { id: 'm_streak', text: 'Logra una racha de 5 aciertos', goal: 5, metric: 'streak', coins: 15, xp: 40 },
    { id: 'm_points', text: 'Suma 150 puntos', goal: 150, metric: 'points', coins: 15, xp: 35 },
    { id: 'm_perfect', text: 'Termina una partida sin errores', goal: 1, metric: 'perfect', coins: 20, xp: 50 },
    { id: 'm_timed', text: 'Juega una partida Contra el reloj', goal: 1, metric: 'timed', coins: 10, xp: 25 },
    ...S.FIELDS.map(f => ({ id: 'm_f_' + f.id, text: 'Acierta 6 preguntas de ' + f.name, goal: 6, metric: 'field:' + f.id, coins: 14, xp: 35 }))
  ];
  S.ensureMissions = function (p) {
    const d = dateKey();
    if (p.missions.date === d && p.missions.list.length) return p.missions;
    const pool = S.MISSION_POOL.slice(), seed = hash(d + p.id), picks = [];
    let s = seed;
    while (picks.length < 3) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; picks.push(pool.splice(s % pool.length, 1)[0]); }
    p.missions = { date: d, bonus: false, list: picks.map(m => ({ id: m.id, progress: 0, claimed: false })) };
    S.store.save();
    return p.missions;
  };
  S.missionDef = id => S.MISSION_POOL.find(m => m.id === id);
  S.missionEvent = function (p, metric, amount) {
    const ms = S.ensureMissions(p);
    ms.list.forEach(m => {
      const def = S.missionDef(m.id); if (!def || def.metric !== metric) return;
      m.progress = metric === 'streak' ? Math.max(m.progress, amount) : m.progress + amount;
    });
  };
  S.claimMission = function (p, idx) {
    const ms = S.ensureMissions(p), m = ms.list[idx], def = m && S.missionDef(m.id);
    if (!m || m.claimed || m.progress < def.goal) return false;
    m.claimed = true; p.counters.missionsDone++; S.addCoins(p, def.coins); p.xp += def.xp;
    S.audio.play('coin');
    S.checkAchievements(p); S.store.save(); return true;
  };
  S.claimBonus = function (p) {
    const ms = S.ensureMissions(p);
    if (ms.bonus || !ms.list.every(m => m.claimed)) return false;
    ms.bonus = true; S.addCoins(p, 30); p.xp += 60; S.audio.play('coin'); S.store.save(); return true;
  };
  S.addCoins = (p, n) => { p.coins += n; p.totalCoins += Math.max(0, n); };

  /* ---------- selección de preguntas ---------- */
  S.pickQuestions = function (p, filter, n, opts) {
    opts = opts || {};
    let pool = S.QUESTIONS.filter(filter);
    const rec = new Set(p.recent || []);
    pool = shuffle(pool);
    pool.sort((a, b) => (rec.has(a.id) ? 1 : 0) - (rec.has(b.id) ? 1 : 0));   // primero las no vistas
    if (opts.sortDiff) { const head = pool.slice(0, n); head.sort((a, b) => a.d - b.d); return head; }
    return pool.slice(0, n);
  };
  S.rememberQuestions = function (p, ids) {
    p.recent = (p.recent || []).filter(i => !ids.includes(i)).concat(ids).slice(-70);
  };
  /* Prepara las preguntas de una partida según su configuración. */
  S.buildQuestions = function (p, cfg) {
    const diffOk = q => !cfg.diff || cfg.diff === 0 || q.d === cfg.diff;
    switch (cfg.mode) {
      case 'adventure': {
        const lvl = cfg.level + 1, base = q => q.f === cfg.field;
        let qs = S.pickQuestions(p, q => base(q) && q.d === lvl, 7);
        if (qs.length < 7) {
          const used = new Set(qs.map(q => q.id));
          const extra = S.pickQuestions(p, q => base(q) && !used.has(q.id) && Math.abs(q.d - lvl) === 1, 7 - qs.length);
          qs = qs.concat(extra);
        }
        return shuffle(qs);
      }
      case 'quick': return S.pickQuestions(p, diffOk, 10);
      case 'practice': return S.pickQuestions(p, q => q.f === cfg.field && (!cfg.subject || q.s === cfg.subject) && diffOk(q), 10);
      case 'timed': return shuffle(S.QUESTIONS.filter(diffOk));
      case 'mixed': {
        let out = [];
        S.FIELDS.forEach(f => { out = out.concat(S.pickQuestions(p, q => q.f === f.id && diffOk(q), 3)); });
        return out.sort((a, b) => a.d - b.d || Math.random() - .5);
      }
      case 'final': {
        const used = new Set();
        const take = (types, n) => {
          const r = S.pickQuestions(p, q => !used.has(q.id) && types.includes(q.t) && q.d >= 2, n);
          r.forEach(q => used.add(q.id)); return r;
        };
        const r1 = take(['mc', 'tf'], 5), r2 = take(['fill'], 4), r3 = take(['match', 'order'], 3);
        const list = r1.concat(r2, r3);
        list.rounds = [r1.length, r2.length, r3.length];
        return list;
      }
    }
    return [];
  };
})(window.S);
