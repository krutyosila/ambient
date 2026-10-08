/* Ambient prototype navigation. Each screen sets window.__NAV = { name, back, links: [...], actions: [...] }.
   Matching is by visible text (or aria-label), so the screens stay plain HTML. */
(function () {
  var cfg = window.__NAV || {};
  var embedded = window.parent !== window;
  if (embedded) document.documentElement.classList.add('embed');

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function go(to) { if (to) window.location.href = to + '.html' + (embedded ? '' : ''); }
  function back() {
    if (cfg.back) go(cfg.back); else if (history.length > 1) history.back();
  }

  // candidates: smallest element whose text matches
  function find(text, all) {
    var els = document.body.querySelectorAll('button,a,span,div,b,small,label,i');
    var hits = [];
    for (var i = 0; i < els.length; i++) {
      var t = norm(els[i].textContent);
      if (!t || t.indexOf(text) === -1) continue;
      if (t.length > text.length + 60) continue; // avoid huge containers
      hits.push(els[i]);
    }
    // keep only deepest matches
    var deepest = hits.filter(function (h) {
      return !hits.some(function (o) { return o !== h && h.contains(o); });
    });
    return all ? deepest : deepest.slice(0, 1);
  }
  function climb(el, n) { while (n-- > 0 && el.parentElement) el = el.parentElement; return el; }
  function mark(el, fn) {
    if (el.__ambient) return;
    el.__ambient = true;
    el.classList.add('ambient-link');
    if (!/^(BUTTON|A)$/.test(el.tagName)) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'link'); }
    el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(e); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
  }

  // back / close buttons
  document.querySelectorAll('[aria-label="Geri"],[aria-label="Kapat"]').forEach(function (b) { mark(b, back); });

  // toggles
  document.querySelectorAll('.tg').forEach(function (t) {
    mark(t, function () { t.classList.toggle('on'); });
  });

  // links
  (cfg.links || []).forEach(function (l) {
    var targets = [];
    if (l.a) targets = Array.prototype.slice.call(document.querySelectorAll('[aria-label="' + l.a + '"]'));
    else targets = find(l.t, l.all).map(function (e) { return climb(e, l.up || 0); });
    if (!targets.length && window.console) console.warn('ambient: no match: ' + (l.t || l.a) + ' -> ' + l.to);
    targets.forEach(function (el) { mark(el, function () { go(l.to); }); });
  });

  // small interactions
  var actions = {
    accept: function (el) {
      var chip = find('Önerilen')[0];
      if (chip) { chip.textContent = 'Planlı'; chip.style.color = '#8fbcff'; chip.style.background = 'rgba(143,188,255,.12)'; }
      var row = el.parentElement;
      if (row) row.innerHTML = '<span style="font-size:13px;color:#8fcf9f">Eklendi. 17:30’da sorarım.</span>';
    },
    granted: function (el) {
      el.textContent = 'Verildi';
      el.style.background = 'rgba(143,207,159,.16)';
      el.style.color = '#8fcf9f';
    }
  };
  (cfg.actions || []).forEach(function (a) {
    find(a.t, a.all).forEach(function (el) {
      mark(el, function () { actions[a.do](el); });
    });
  });

  // shell communication (works across origins, including file://)
  if (embedded) {
    try { parent.postMessage({ ambient: 'page', name: cfg.name }, '*'); } catch (e) {}
    window.addEventListener('message', function (e) {
      if (e.data && e.data.ambient === 'hint') document.documentElement.classList.toggle('hint', !!e.data.on);
    });
  }
})();
