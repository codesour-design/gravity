/**
 * Gravity Handoff Engine
 * Motore tour condiviso per tutti i prototipi.
 *
 * Attivazione: aggiungere prima di questo script:
 *   <script src="./handoff-steps.js"></script>
 *   che espone window.HANDOFF_STEPS (array) e opzionalmente window.HANDOFF_META.
 *
 * Se window.HANDOFF_STEPS non esiste o è vuoto, il motore non si attiva.
 */
(function () {
  if (!window.HANDOFF_STEPS || !window.HANDOFF_STEPS.length) return;

  var steps = window.HANDOFF_STEPS;
  var meta  = window.HANDOFF_META || {};
  var activeStep = null;
  var panelOpen  = false;

  // ── Stili ─────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '.ghf-highlight{outline:2.5px solid #3E00FB!important;outline-offset:3px;border-radius:4px;position:relative;z-index:1000;}',
    '.ghf-fab{position:fixed;bottom:24px;right:24px;z-index:9100;background:#3E00FB;color:#fff;border:none;border-radius:20px;padding:8px 16px 8px 12px;font-size:13px;font-weight:600;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;box-shadow:0 4px 16px rgba(62,0,251,.4);display:flex;align-items:center;gap:7px;transition:transform .15s,right .25s ease;}',
    '.ghf-fab:hover{transform:translateY(-1px);}',
    '.ghf-fab-badge{background:#FF4A1C;color:#fff;font-size:10px;font-weight:700;min-width:16px;height:16px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;}',
    '.ghf-panel{position:fixed;top:0;right:0;bottom:0;width:320px;background:#fff;z-index:9000;box-shadow:-4px 0 32px rgba(0,0,0,.12);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;}',
    '.ghf-panel.open{transform:translateX(0);}',
    '.ghf-panel-header{padding:18px 20px 14px;border-bottom:1px solid rgba(0,0,0,.06);}',
    '.ghf-panel-header-row{display:flex;align-items:center;justify-content:space-between;}',
    '.ghf-panel-title{font-size:15px;font-weight:700;color:rgba(0,0,0,.88);}',
    '.ghf-panel-meta{font-size:11px;color:rgba(0,0,0,.35);margin-top:3px;}',
    '.ghf-close{width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,.05);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(0,0,0,.4);flex-shrink:0;}',
    '.ghf-close:hover{background:rgba(0,0,0,.1);}',
    '.ghf-steps-list{flex:1;overflow-y:auto;padding:8px 0;}',
    '.ghf-step-item{padding:11px 20px;cursor:pointer;display:flex;gap:12px;align-items:flex-start;transition:background .12s;border-left:3px solid transparent;}',
    '.ghf-step-item:hover{background:rgba(62,0,251,.03);}',
    '.ghf-step-item.active{background:rgba(62,0,251,.05);border-left-color:#3E00FB;}',
    '.ghf-step-num{width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.06);color:rgba(0,0,0,.4);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:background .12s,color .12s;}',
    '.ghf-step-item.active .ghf-step-num{background:#3E00FB;color:#fff;}',
    '.ghf-step-body{flex:1;min-width:0;}',
    '.ghf-step-title-row{display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap;}',
    '.ghf-step-title{font-size:13px;font-weight:600;color:rgba(0,0,0,.88);}',
    '.ghf-badge-novita{background:#FF4A1C;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px;text-transform:uppercase;letter-spacing:.04em;flex-shrink:0;}',
    '.ghf-step-desc{font-size:12px;color:rgba(0,0,0,.5);line-height:1.55;}',
    '.ghf-panel-footer{padding:12px 16px;border-top:1px solid rgba(0,0,0,.06);display:flex;align-items:center;gap:8px;}',
    '.ghf-btn{flex:1;padding:6px 10px;border-radius:6px;border:1px solid #d9d9d9;background:#fff;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer;transition:background .12s;color:rgba(0,0,0,.88);}',
    '.ghf-btn:hover:not(:disabled){background:#f5f5f5;}',
    '.ghf-btn.primary{background:#3E00FB;color:#fff;border-color:#3E00FB;}',
    '.ghf-btn.primary:hover:not(:disabled){background:#3200d4;}',
    '.ghf-btn:disabled{opacity:.35;cursor:not-allowed;}',
    '.ghf-counter{font-size:12px;color:rgba(0,0,0,.3);white-space:nowrap;flex-shrink:0;min-width:36px;text-align:center;}',
  ].join('');
  document.head.appendChild(style);

  // ── DOM ───────────────────────────────────────────────────────────────────
  var novitaCount = steps.filter(function (s) { return s.novita; }).length;

  var fab = document.createElement('button');
  fab.className = 'ghf-fab';
  fab.setAttribute('title', 'Apri Handoff Guide');
  fab.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>' +
    '<span>Handoff</span>' +
    (novitaCount ? '<span class="ghf-fab-badge">' + novitaCount + '</span>' : '');

  var panel = document.createElement('div');
  panel.className = 'ghf-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', 'Handoff Guide');

  var metaLine = [];
  if (meta.version) metaLine.push('v' + meta.version);
  if (meta.date)    metaLine.push(meta.date);
  if (meta.author)  metaLine.push(meta.author);

  panel.innerHTML =
    '<div class="ghf-panel-header">' +
      '<div class="ghf-panel-header-row">' +
        '<span class="ghf-panel-title">' + esc(meta.title || 'Handoff Guide') + '</span>' +
        '<button class="ghf-close" id="ghf-close" title="Chiudi">✕</button>' +
      '</div>' +
      (metaLine.length ? '<div class="ghf-panel-meta">' + esc(metaLine.join(' · ')) + '</div>' : '') +
    '</div>' +
    '<div class="ghf-steps-list" id="ghf-steps-list"></div>' +
    '<div class="ghf-panel-footer">' +
      '<button class="ghf-btn" id="ghf-prev" disabled>← Indietro</button>' +
      '<span class="ghf-counter" id="ghf-counter"></span>' +
      '<button class="ghf-btn primary" id="ghf-next">Avanti →</button>' +
    '</div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Steps list render ─────────────────────────────────────────────────────
  function renderList() {
    var list = document.getElementById('ghf-steps-list');
    list.innerHTML = steps.map(function (s, i) {
      var active = activeStep === i;
      return (
        '<div class="ghf-step-item' + (active ? ' active' : '') + '" data-idx="' + i + '">' +
          '<div class="ghf-step-num">' + (i + 1) + '</div>' +
          '<div class="ghf-step-body">' +
            '<div class="ghf-step-title-row">' +
              '<span class="ghf-step-title">' + esc(s.title) + '</span>' +
              (s.novita ? '<span class="ghf-badge-novita">Novità</span>' : '') +
            '</div>' +
            '<div class="ghf-step-desc">' + esc(s.description) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('.ghf-step-item').forEach(function (el) {
      el.addEventListener('click', function () { goTo(+el.dataset.idx); });
    });
  }

  function updateFooter() {
    document.getElementById('ghf-prev').disabled    = activeStep === null || activeStep === 0;
    document.getElementById('ghf-next').disabled    = activeStep === null || activeStep === steps.length - 1;
    document.getElementById('ghf-counter').textContent = activeStep !== null
      ? (activeStep + 1) + ' / ' + steps.length : '';
  }

  // ── Highlight ─────────────────────────────────────────────────────────────
  function clearHL() {
    document.querySelectorAll('.ghf-highlight').forEach(function (el) {
      el.classList.remove('ghf-highlight');
    });
  }

  function highlight(idx) {
    clearHL();
    var s = steps[idx];
    if (!s || !s.selector) return;
    var el = document.querySelector(s.selector);
    if (!el) return;
    el.classList.add('ghf-highlight');
    setTimeout(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function goTo(idx) {
    activeStep = idx;
    highlight(idx);
    renderList();
    updateFooter();
    setTimeout(function () {
      var active = document.querySelector('.ghf-step-item.active');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }, 60);
  }

  function openPanel() {
    panelOpen = true;
    panel.classList.add('open');
    fab.style.right = '336px';
    if (activeStep === null && steps.length) goTo(0);
    else { renderList(); updateFooter(); }
  }

  function closePanel() {
    panelOpen = false;
    panel.classList.remove('open');
    fab.style.right = '24px';
    clearHL();
  }

  // ── Events ────────────────────────────────────────────────────────────────
  fab.addEventListener('click', function () { panelOpen ? closePanel() : openPanel(); });
  document.getElementById('ghf-close').addEventListener('click', closePanel);
  document.getElementById('ghf-prev').addEventListener('click', function () {
    if (activeStep > 0) goTo(activeStep - 1);
  });
  document.getElementById('ghf-next').addEventListener('click', function () {
    if (activeStep < steps.length - 1) goTo(activeStep + 1);
  });

  // Keyboard: Escape chiude, frecce navigano
  document.addEventListener('keydown', function (e) {
    if (!panelOpen) return;
    if (e.key === 'Escape')       { closePanel(); }
    if (e.key === 'ArrowRight' && activeStep < steps.length - 1) goTo(activeStep + 1);
    if (e.key === 'ArrowLeft'  && activeStep > 0)                goTo(activeStep - 1);
  });

  // Init
  renderList();
  updateFooter();
})();
