/* Saberium — arranque y eventos globales */
(function (S) {
  'use strict';
  const { $ } = S;
  const CLICK_SFX = new Set(['go', 'back', 'mode', 'brief', 'bsetup', 'pfield', 'psetup', 'startgame', 'shoptab', 'equip', 'pause', 'resume', 'next', 'again', 'practicewith']);

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const act = el.dataset.act, fn = (S.game.actions && S.game.actions[act]) || S.actions[act];
    if (!fn) return;
    S.audio.init();
    if (S.store.settings().music && !S.audio.musicOn) S.audio.music(true);
    if (CLICK_SFX.has(act)) S.audio.play('click');
    fn(el, e);
  });

  document.addEventListener('submit', e => { const f = e.target.closest('[data-form]'); if (f) S.onSubmit(f, e); });

  document.addEventListener('change', e => {
    const t = e.target, s = S.store.settings();
    if (t.dataset && t.dataset.set) {
      s[t.dataset.set] = t.checked; S.store.save(); S.applyPrefs();
      if (t.dataset.set === 'music') { S.audio.init(); S.audio.music(t.checked); }
      if (t.dataset.set === 'sfx' && t.checked) S.audio.play('ok');
    }
  });
  document.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset && t.dataset.setr) { S.store.settings()[t.dataset.setr] = +t.value; S.audio.setVol(); S.store.save(); }
  });

  document.addEventListener('keydown', e => S.game.key(e));
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.game.pauseIfActive(); });
  window.addEventListener('resize', () => { const c = $('#fx'); if (c) { c.width = innerWidth; c.height = innerHeight; } });

  S.applyPrefs();
  S.nav.go('home', {}, { reset: true });
})(window.S);
