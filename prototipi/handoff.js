/**
 * Gravity Handoff Engine v5 — Spotlight custom
 * Tour completamente blindato: overlay full-screen, spotlight sul target,
 * scroll bloccato, solo il balloon è interagibile.
 *
 * Configurazione in handoff-steps.js:
 *   window.HANDOFF_META    — { title, version, date, author }
 *   window.HANDOFF_SCREENS — { key: { label, detect: fn } }
 *   window.HANDOFF_TOURS   — [{ id, title, description, roles?, startScreen?,
 *                               novita?, steps: [{ title, description,
 *                               selector?, placement?, mask?, onEnter?, delay? }] }]
 */
(function () {
  if (!window.HANDOFF_TOURS || !window.HANDOFF_TOURS.length) return;

  var h           = React.createElement;
  var useState    = React.useState;
  var useEffect   = React.useEffect;
  var useRef      = React.useRef;
  var useMemo     = React.useMemo;

  var ALL_TOURS = window.HANDOFF_TOURS;
  var SCREENS   = window.HANDOFF_SCREENS || null;
  var META      = window.HANDOFF_META || {};

  var ROLE_COLOR = {
    'Tenant Admin':       'purple',
    'Operations Manager': 'geekblue',
    'Operation Manager':  'geekblue',
    'Planner':            'green',
    'Sales':              'volcano',
    'Inventory Manager':  'cyan',
  };
  var FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getRole() { return localStorage.getItem('gravity_proto_role') || 'Tenant Admin'; }

  function detectScreen() {
    if (!SCREENS) return null;
    for (var k in SCREENS) { try { if (SCREENS[k].detect()) return k; } catch(e) {} }
    return null;
  }

  function screenLabel(k) { return (SCREENS && SCREENS[k]) ? SCREENS[k].label : k; }

  // Parsing **grassetto** nelle descrizioni
  function parseBold(text) {
    if (!text || text.indexOf('**') === -1) return text;
    var parts = text.split('**');
    return parts.map(function (part, i) {
      return i % 2 === 1
        ? h('strong', { key: i, style: { fontWeight: 700, color: 'rgba(0,0,0,.78)' } }, part)
        : part;
    });
  }

  function filterTours(role) {
    return ALL_TOURS.filter(function(t) { return !t.roles || t.roles.indexOf(role) !== -1; });
  }

  // ── SpotlightOverlay ──────────────────────────────────────────────────────
  // Oscura tutto lo schermo tranne il rect del target.
  // Blocca scroll (wheel, touch, keyboard) tramite event listener non-passivi.

  function SpotlightOverlay({ selector, colIndex, padding }) {
    padding = padding == null ? 0 : padding;
    var overlayRef = useRef(null);
    var _r = useState(null); var rect = _r[0]; var setRect = _r[1];

    // Calcola e aggiorna rect del target
    useEffect(function () {
      function update() {
        if (colIndex) {
          var cells = document.querySelectorAll('.ant-table-cell:nth-child(' + colIndex + ')');
          if (!cells.length) { setRect(null); return; }
          var rs = Array.prototype.slice.call(cells).map(function (c) { return c.getBoundingClientRect(); });
          var minX = Math.min.apply(null, rs.map(function (r) { return r.left; }));
          var minY = Math.min.apply(null, rs.map(function (r) { return r.top; }));
          var maxX = Math.max.apply(null, rs.map(function (r) { return r.right; }));
          var maxY = Math.max.apply(null, rs.map(function (r) { return r.bottom; }));
          setRect({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
          return;
        }
        if (!selector) { setRect(null); return; }
        var el = document.querySelector(selector);
        if (!el) { setRect(null); return; }
        var r = el.getBoundingClientRect();
        setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
      }
      update();
      var raf = requestAnimationFrame(update); // dopo paint
      window.addEventListener('resize', update);
      return function () { cancelAnimationFrame(raf); window.removeEventListener('resize', update); };
    }, [selector, colIndex]);

    // Blocca scroll: wheel e touch (non-passive) sull'overlay
    useEffect(function () {
      var el = overlayRef.current;
      if (!el) return;
      var prevent = function(e) { e.preventDefault(); };
      el.addEventListener('wheel',     prevent, { passive: false });
      el.addEventListener('touchmove', prevent, { passive: false });
      return function () {
        el.removeEventListener('wheel',     prevent);
        el.removeEventListener('touchmove', prevent);
      };
    }, []);

    // Blocca scroll da tastiera (Arrow, Page, Space)
    useEffect(function () {
      var KEYS = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' '];
      var prevent = function(e) { if (KEYS.indexOf(e.key) !== -1) e.preventDefault(); };
      document.addEventListener('keydown', prevent);
      return function () { document.removeEventListener('keydown', prevent); };
    }, []);

    var spotStyle;
    if (rect) {
      spotStyle = {
        position: 'fixed',
        left:   rect.x - padding,
        top:    rect.y - padding,
        width:  rect.w + padding * 2,
        height: rect.h + padding * 2,
        borderRadius: 8,
        // La box-shadow gigante oscura tutto il resto
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
        zIndex: 9001,
        pointerEvents: 'none',
        transition: 'left .3s ease, top .3s ease, width .3s ease, height .3s ease',
      };
    } else {
      // Nessun target: overlay solido (es. step informativi)
      spotStyle = {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        zIndex: 9001,
        pointerEvents: 'none',
      };
    }

    return h(React.Fragment, null,
      // 1. Block overlay — cattura tutti gli eventi puntatore
      h('div', {
        ref: overlayRef,
        style: {
          position: 'fixed', inset: 0,
          zIndex: 9000,
          cursor: 'default',
        },
      }),
      // 2. Spotlight — buco visivo
      h('div', { style: spotStyle })
    );
  }

  // ── TourBalloon ───────────────────────────────────────────────────────────
  // Balloon posizionato accanto al target. Unico elemento interagibile durante il tour.

  function TourBalloon({ step, index, total, steps, screenLabel, role, roleColor, onPrev, onNext, onGoTo, onExit }) {
    var BALLOON_W = 320;
    var GAP       = 18;
    var _p = useState({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
    var pos = _p[0]; var setPos = _p[1];
    var balloonRef = useRef(null);
    var _dv  = useState(false); var devOpen   = _dv[0];  var setDevOpen   = _dv[1];
    var _idx = useState(false); var indexOpen = _idx[0]; var setIndexOpen = _idx[1];
    // Reset sezioni collassabili ad ogni cambio step
    useEffect(function () { setDevOpen(false); setIndexOpen(false); }, [step]);

    useEffect(function () {
      function calc() {
        var r = null;
        if (step.colIndex) {
          var cells = document.querySelectorAll('.ant-table-cell:nth-child(' + step.colIndex + ')');
          if (cells.length) {
            var rs = Array.prototype.slice.call(cells).map(function (c) { return c.getBoundingClientRect(); });
            var minX = Math.min.apply(null, rs.map(function (x) { return x.left; }));
            var minY = Math.min.apply(null, rs.map(function (x) { return x.top; }));
            var maxX = Math.max.apply(null, rs.map(function (x) { return x.right; }));
            var maxY = Math.max.apply(null, rs.map(function (x) { return x.bottom; }));
            r = { left: minX, top: minY, right: maxX, bottom: maxY, width: maxX - minX, height: maxY - minY };
          }
        } else if (step.selector) {
          var el = document.querySelector(step.selector);
          if (el) r = el.getBoundingClientRect();
        }
        if (!r) {
          setPos({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
          return;
        }
        var bh  = balloonRef.current ? balloonRef.current.offsetHeight : 180;
        var vw  = window.innerWidth;
        var vh  = window.innerHeight;
        var pl  = step.placement || 'bottom';
        var style = { position: 'fixed' };

        if (pl === 'bottom') {
          style.top  = Math.min(r.bottom + GAP, vh - bh - GAP);
          style.left = Math.max(GAP, Math.min(r.left + r.width / 2 - BALLOON_W / 2, vw - BALLOON_W - GAP));
        } else if (pl === 'top') {
          style.top  = Math.max(GAP, r.top - bh - GAP);
          style.left = Math.max(GAP, Math.min(r.left + r.width / 2 - BALLOON_W / 2, vw - BALLOON_W - GAP));
        } else if (pl === 'right') {
          style.left = Math.min(r.right + GAP, vw - BALLOON_W - GAP);
          style.top  = Math.max(GAP, Math.min(r.top + r.height / 2 - bh / 2, vh - bh - GAP));
        } else if (pl === 'left') {
          style.left = Math.max(GAP, r.left - BALLOON_W - GAP);
          style.top  = Math.max(GAP, Math.min(r.top + r.height / 2 - bh / 2, vh - bh - GAP));
        } else {
          style.top  = '50%'; style.left = '50%'; style.transform = 'translate(-50%,-50%)';
        }
        setPos(style);
      }
      calc();
      var raf = requestAnimationFrame(calc);
      window.addEventListener('resize', calc);
      return function () { cancelAnimationFrame(raf); window.removeEventListener('resize', calc); };
    }, [step]);

    return h('div', {
      ref: balloonRef,
      style: Object.assign({}, pos, {
        width: BALLOON_W,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        zIndex: 9100,
        fontFamily: FONT,
        overflow: 'hidden',
      }),
    },
      // Barra progress
      h('div', {
        style: {
          height: 3,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden',
        },
      },
        h('div', {
          style: {
            height: '100%',
            width: ((index + 1) / total * 100) + '%',
            background: '#3E00FB',
            transition: 'width .3s ease',
          },
        })
      ),
      // Header schermata + ruolo
      h('div', {
        style: { padding: '12px 18px 10px', borderBottom: '1px solid rgba(0,0,0,.06)' },
      },
        h('div', {
          style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)', marginBottom: 5 },
        }, screenLabel || '—'),
        h(antd.Tag, {
          color: roleColor || 'default',
          style: { margin: 0, fontSize: 11, fontWeight: 600 },
        }, role || '—')
      ),
      // Body
      h('div', { style: { padding: '12px 18px 12px' } },
        // Counter + toggle indice
        h('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
        },
          h('span', {
            style: { fontSize: 11, color: 'rgba(0,0,0,.3)', fontWeight: 500 },
          }, 'Step ' + (index + 1) + ' di ' + total),
          h('button', {
            onClick: function () { setIndexOpen(function (v) { return !v; }); },
            style: {
              display: 'inline-flex', alignItems: 'center', gap: 4,
              border: 'none', background: indexOpen ? 'rgba(62,0,251,.08)' : 'transparent',
              color: indexOpen ? '#3E00FB' : 'rgba(0,0,0,.3)',
              cursor: 'pointer', fontSize: 11, fontWeight: 600,
              padding: '2px 6px', borderRadius: 4, fontFamily: FONT,
            },
          }, h(icons.UnorderedListOutlined, { style: { fontSize: 10 } }), '\u00a0Indice')
        ),
        // Indice step (collassabile, sempre accessibile)
        indexOpen ? h('div', {
          style: {
            marginBottom: 10, borderRadius: 6,
            border: '1px solid rgba(0,0,0,.07)',
            maxHeight: 192, overflowY: 'auto',
          },
        },
          steps.map(function (s, i) {
            var cur = i === index;
            return h('div', {
              key: i,
              onClick: function () { setIndexOpen(false); onGoTo(i); },
              style: {
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '7px 10px',
                background: cur ? 'rgba(62,0,251,.06)' : 'transparent',
                borderBottom: i < steps.length - 1 ? '1px solid rgba(0,0,0,.04)' : 'none',
                cursor: 'pointer', transition: 'background .1s',
              },
              onMouseEnter: function (e) { if (!cur) e.currentTarget.style.background = 'rgba(0,0,0,.03)'; },
              onMouseLeave: function (e) { if (!cur) e.currentTarget.style.background = cur ? 'rgba(62,0,251,.06)' : 'transparent'; },
            },
              h('span', {
                style: { fontSize: 10, fontWeight: 700, minWidth: 16, textAlign: 'center', color: cur ? '#3E00FB' : 'rgba(0,0,0,.22)', marginTop: 1, flexShrink: 0 },
              }, i + 1),
              h('span', {
                style: { fontSize: 12, color: cur ? '#3E00FB' : 'rgba(0,0,0,.6)', fontWeight: cur ? 600 : 400, lineHeight: 1.45 },
              }, s.title)
            );
          })
        ) : null,
        // Titolo step
        h('div', {
          style: { fontSize: 14, fontWeight: 700, color: 'rgba(0,0,0,.88)', marginBottom: 8 },
        }, step.title),
        h('div', {
          style: { fontSize: 13, color: 'rgba(0,0,0,.6)', lineHeight: 1.6 },
        }, parseBold(step.description)),
        // ── Sezione dev (opzionale) ──────────────────────────────────────
        step.dev ? h(React.Fragment, null,
          h('button', {
            onClick: function () { setDevOpen(function (v) { return !v; }); },
            style: {
              display: 'inline-flex', alignItems: 'center', gap: 4,
              marginTop: 10, padding: '2px 8px',
              background: devOpen ? '#1a1a1a' : 'rgba(0,0,0,.05)',
              color: devOpen ? '#9CDCFE' : 'rgba(0,0,0,.3)',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              fontSize: 11, fontFamily: '"SF Mono","Fira Code",monospace', fontWeight: 600,
            },
          }, '{ } dev'),
          devOpen ? h('div', {
            style: {
              marginTop: 6, background: '#0f0f0f', borderRadius: 6,
              padding: '10px 12px', overflowY: 'auto', maxHeight: 200,
            },
          },
            (typeof step.dev === 'string'
              ? [{ label: null, value: step.dev }]
              : step.dev
            ).map(function (item, i, arr) {
              return h('div', { key: i, style: { marginBottom: i < arr.length - 1 ? 12 : 0 } },
                item.label ? h('div', {
                  style: { fontSize: 9, color: 'rgba(255,255,255,.3)', marginBottom: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' },
                }, item.label) : null,
                h('pre', {
                  style: { margin: 0, fontSize: 11, color: '#9CDCFE', fontFamily: '"SF Mono","Fira Code",monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.55 },
                }, item.value)
              );
            })
          ) : null
        ) : null
      ),
      // Footer navigazione
      h('div', {
        style: {
          padding: '10px 14px',
          borderTop: '1px solid rgba(0,0,0,.06)',
          display: 'flex', alignItems: 'center', gap: 8,
        },
      },
        h(antd.Button, {
          size: 'small',
          disabled: index === 0,
          onClick: onPrev,
        }, '← Indietro'),
        h('span', { style: { flex: 1 } }),
        index < total - 1
          ? h(antd.Button, { size: 'small', type: 'primary', onClick: onNext }, 'Avanti →')
          : h(antd.Button, { size: 'small', type: 'primary', onClick: onExit }, 'Fine ✓'),
        h('span', { style: { color: 'rgba(0,0,0,.12)' } }, '|'),
        h(antd.Button, {
          size: 'small', danger: true, type: 'text',
          title: 'Esci dal tour',
          onClick: onExit,
        }, h(icons.CloseOutlined))
      )
    );
  }

  // ── HandoffApp ────────────────────────────────────────────────────────────

  function HandoffApp() {
    var _a = useState(false);        var panelOpen  = _a[0]; var setPanelOpen  = _a[1];
    var _b = useState(false);        var minimized  = _b[0]; var setMinimized  = _b[1];
    var _c = useState(null);         var activeTour = _c[0]; var setActiveTour = _c[1];
    var _d = useState(0);            var tourCur    = _d[0]; var setTourCur    = _d[1];
    var _e = useState(false);        var tourOpen   = _e[0]; var setTourOpen   = _e[1];
    var _f = useState(detectScreen); var screen     = _f[0]; var setScreen     = _f[1];
    var _g = useState(getRole);      var role       = _g[0]; var setRole       = _g[1];

    var tours = useMemo(function () { return filterTours(role); }, [role]);

    // MutationObserver: rileva cambio schermata
    useEffect(function () {
      if (!SCREENS) return;
      var obs = new MutationObserver(function () { setScreen(detectScreen()); });
      obs.observe(document.body, { childList: true, subtree: true });
      return function () { obs.disconnect(); };
    }, []);

    // Polling: rileva cambio ruolo
    useEffect(function () {
      var id = setInterval(function () {
        setRole(function (prev) {
          var r = getRole();
          if (r !== prev && activeTour && activeTour.roles && activeTour.roles.indexOf(r) === -1) {
            setActiveTour(null); setTourOpen(false); setTourCur(0);
          }
          return r;
        });
      }, 400);
      return function () { clearInterval(id); };
    }, [activeTour]);

    // goToStep — gestisce onEnter + delay prima di aggiornare l'indice
    function goToStep(tour, newCur) {
      if (!tour || newCur < 0 || newCur >= tour.steps.length) return;
      var step = tour.steps[newCur];
      if (step && step.onEnter) {
        step.onEnter();
        setTimeout(function () { setTourCur(newCur); }, typeof step.delay === 'number' ? step.delay : 150);
      } else {
        setTourCur(newCur);
      }
    }

    function startTour(tour) {
      setActiveTour(tour);
      setTourOpen(true);
      setPanelOpen(false);
      goToStep(tour, 0);
    }

    function exitTour() {
      setActiveTour(null);
      setTourOpen(false);
      setTourCur(0);
      setPanelOpen(true);
      var hl = document.getElementById('ghf-col-hl');
      if (hl) hl.remove();
    }

    var roleColor       = ROLE_COLOR[role] || 'default';
    var curScreenLabel  = screen ? screenLabel(screen) : null;
    var novitaCount     = tours.filter(function (t) { return t.novita; }).length;

    // ── Vista tour attivo ─────────────────────────────────────────────────
    if (tourOpen && activeTour) {
      var step      = activeTour.steps[tourCur];
      var totalSteps = activeTour.steps.length;
      return h(antd.ConfigProvider, { theme: window.GRAVITY_THEME || {} },
        h(antd.App, null,
          h(SpotlightOverlay, { selector: step.selector, colIndex: step.colIndex, padding: step.colIndex ? 0 : (step.mask === false ? 0 : 10) }),
          h(TourBalloon, {
            step:        step,
            index:       tourCur,
            total:       totalSteps,
            steps:       activeTour.steps,
            screenLabel: curScreenLabel || '—',
            role:        role,
            roleColor:   roleColor,
            onPrev:      function () { goToStep(activeTour, tourCur - 1); },
            onNext:      function () { goToStep(activeTour, tourCur + 1); },
            onGoTo:      function (i) { goToStep(activeTour, i); },
            onExit:      exitTour,
          })
        )
      );
    }

    // ── Vista pannello (selezione tour) ───────────────────────────────────

    var tourListItems = tours.length === 0
      ? h('div', { style: { padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(0,0,0,.3)' } },
          'Nessun tour disponibile per questo ruolo.')
      : tours.map(function (tour) {
          var wrongScreen = tour.startScreen && screen && tour.startScreen !== screen;
          return h('div', {
            key: tour.id,
            onClick: function () { startTour(tour); },
            style: { padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,.04)', transition: 'background .1s' },
            onMouseEnter: function (e) { e.currentTarget.style.background = 'rgba(62,0,251,.03)'; },
            onMouseLeave: function (e) { e.currentTarget.style.background = ''; },
          },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' } },
              h('span', { style: { fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,.88)' } }, tour.title),
              tour.novita ? h(antd.Tag, { color: '#FF4A1C', style: { margin: 0, fontSize: 9, lineHeight: '14px', padding: '0 4px', fontWeight: 600 } }, 'Novità') : null,
              tour.roles  ? h(antd.Tag, { color: ROLE_COLOR[tour.roles[0]] || 'default', style: { margin: 0, fontSize: 9, lineHeight: '14px', padding: '0 4px' } }, tour.roles.join(', ')) : null
            ),
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.45)', marginBottom: wrongScreen ? 6 : 0, lineHeight: 1.5 } }, tour.description),
            wrongScreen ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#FA8C16' } },
              h(icons.InfoCircleOutlined, { style: { fontSize: 10 } }),
              h('span', null, 'Inizia da: ' + screenLabel(tour.startScreen))
            ) : null,
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.25)', marginTop: 4 } }, tour.steps.length + ' step')
          );
        });

    var panel = (panelOpen && !minimized) ? h('div', {
      style: {
        position: 'fixed', bottom: 80, right: 24, width: 288,
        background: '#fff', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,.15)',
        zIndex: 9000, display: 'flex', flexDirection: 'column',
        maxHeight: 520, overflow: 'hidden', fontFamily: FONT,
      },
    },
      // Header
      h('div', { style: { padding: '14px 16px 12px', borderBottom: '1px solid rgba(0,0,0,.06)' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
          h('div', null,
            h('div', { style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)', marginBottom: 5 } },
              curScreenLabel || META.title || 'Handoff Guide'),
            h(antd.Tag, { color: roleColor, style: { margin: 0, fontSize: 11, fontWeight: 600 } }, role)
          ),
          h('button', {
            onClick: function () { setMinimized(true); },
            style: { border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(0,0,0,.25)', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0 },
          }, '–')
        )
      ),
      // Lista tour
      h('div', { style: { flex: 1, overflowY: 'auto' } }, tourListItems)
    ) : null;

    var fab = h(antd.FloatButton, {
      type: 'primary',
      tooltip: panelOpen && !minimized ? 'Chiudi guida' : 'Handoff Guide',
      badge: novitaCount > 0 ? { count: novitaCount, color: '#FF4A1C' } : undefined,
      icon: h(icons.InfoCircleOutlined),
      description: 'Handoff',
      shape: 'square',
      style: { bottom: 24, right: 24, insetInlineEnd: 24, width: 64, height: 64 },
      onClick: function () {
        if (minimized) { setMinimized(false); setPanelOpen(true); return; }
        if (panelOpen) setPanelOpen(false); else setPanelOpen(true);
      },
    });

    return h(antd.ConfigProvider, { theme: window.GRAVITY_THEME || {} },
      h(antd.App, null, panel, fab)
    );
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes ghf-pulse {',
    '  0%   { box-shadow: 0 0 0 0 rgba(62,0,251,0.45); }',
    '  70%  { box-shadow: 0 0 0 14px rgba(62,0,251,0); }',
    '  100% { box-shadow: 0 0 0 0 rgba(62,0,251,0); }',
    '}',
    '#gravity-handoff-root .ant-float-btn-body {',
    '  animation: ghf-pulse 2s ease-out infinite;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  var container = document.createElement('div');
  container.id = 'gravity-handoff-root';
  document.body.appendChild(container);
  ReactDOM.createRoot(container).render(h(HandoffApp));
})();
