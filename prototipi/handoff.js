/**
 * Gravity Handoff Engine v6 — Controlli in navbar + Inspector componenti
 *
 * - Niente più FAB: i controlli vivono nella navbar accanto alla campanella.
 *   · Switch con icona dev → attiva l'inspector: in hover su ogni componente
 *     mostra nome, livello atomico, funzione e variante Figma.
 *   · Icona user story → dropdown con i tour (motore spotlight invariato).
 *
 * Configurazione in handoff-steps.js:
 *   window.HANDOFF_META       — { title, version, date, author }
 *   window.HANDOFF_SCREENS    — { key: { label, detect: fn } }
 *   window.HANDOFF_TOURS      — [{ id, title, description, roles?, startScreen?, novita?, steps: [...] }]
 *   window.HANDOFF_COMPONENTS — [{ selector, name, level, custom?, funzione, figma, variant?(el) }]
 */
(function () {
  if (!window.HANDOFF_TOURS || !window.HANDOFF_TOURS.length) return;

  var h           = React.createElement;
  var useState    = React.useState;
  var useEffect   = React.useEffect;
  var useRef      = React.useRef;
  var useMemo     = React.useMemo;

  var ALL_TOURS  = window.HANDOFF_TOURS;
  var SCREENS    = window.HANDOFF_SCREENS || null;
  var META       = window.HANDOFF_META || {};
  var COMPONENTS = window.HANDOFF_COMPONENTS || [];
  var DEPS       = window.HANDOFF_DEPENDENCIES || [];
  var NOTES      = window.HANDOFF_NOTES || [];
  var RELATIONS  = window.HANDOFF_RELATIONS || [];
  var SCENARIOS  = window.HANDOFF_SCENARIOS || [];
  var OUT_OF_SPRINT = window.HANDOFF_OUT_OF_SPRINT || [];
  var VERSIONS   = (META.versions && META.versions.length) ? META.versions : null;

  var ROLE_COLOR = {
    'Tenant Admin':       'purple',
    'Operations Manager': 'geekblue',
    'Operation Manager':  'geekblue',
    'Planner':            'green',
    'Sales':              'volcano',
    'Inventory Manager':  'cyan',
  };
  var FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  var MONO = '"SF Mono","Fira Code",monospace';

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
        ? h('strong', { key: i, style: { fontWeight: 700 } }, part)  // colore ereditato (leggibile su bianco e su scuro)
        : part;
    });
  }

  // Inline: **grassetto** + ==evidenziato giallo== (testo scuro, leggibile ovunque).
  function parseInline(text) {
    if (text == null || (String(text).indexOf('==') === -1 && String(text).indexOf('**') === -1)) return text;
    var out = [];
    String(text).split('==').forEach(function (seg, i) {
      if (i % 2 === 1) {
        out.push(h('mark', { key: 'hl' + i, style: { background: '#FFE58F', color: 'rgba(0,0,0,0.85)', padding: '0 3px', borderRadius: 3, fontWeight: 600 } }, parseBold(seg)));
      } else if (seg !== '') {
        out.push(h('span', { key: 'tx' + i }, parseBold(seg)));
      }
    });
    return out;
  }

  // Rendering schematico: inline (**grassetto** / ==giallo==) + righe "- " → lista puntata.
  function renderRich(text) {
    if (text == null) return null;
    var lines = String(text).split('\n');
    return lines.map(function (line, i) {
      var bullet = /^\s*-\s+/.test(line);
      var content = bullet ? line.replace(/^\s*-\s+/, '') : line;
      return h('div', {
        key: i,
        style: bullet ? { paddingLeft: 12, position: 'relative', marginTop: 2 } : (i > 0 ? { marginTop: 3 } : null),
      },
        bullet ? h('span', { style: { position: 'absolute', left: 2 } }, '•') : null,
        parseInline(content)
      );
    });
  }

  // Pill pulita che indica la schermata di riferimento (evidente e coerente).
  function screenChip(label) {
    if (!label) return null;
    return h('span', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 11, fontWeight: 600, color: '#3E00FB',
        background: 'rgba(62,0,251,0.08)', borderRadius: 4, padding: '1px 8px', lineHeight: '18px',
      },
    }, h(icons.LayoutOutlined, { style: { fontSize: 10 } }), label);
  }

  // Renderer tabella riusabile (step.table e pannello Dipendenze).
  // Marche: ✓ verde · ✗ grigio · ◐ ambra; le altre celle restano testo normale.
  function renderMatrix(tbl) {
    return h('div', { style: { borderRadius: 6, border: '1px solid rgba(0,0,0,.08)', overflow: 'hidden' } },
      h('table', { style: { width: '100%', borderCollapse: 'collapse', fontFamily: FONT } },
        h('thead', null,
          h('tr', null, tbl.headers.map(function (hd, i) {
            return h('th', {
              key: i,
              style: {
                textAlign: i === 0 ? 'left' : 'center', padding: '6px 8px',
                background: 'rgba(0,0,0,.03)', color: 'rgba(0,0,0,.55)',
                fontWeight: 600, fontSize: 11, borderBottom: '1px solid rgba(0,0,0,.08)',
              },
            }, hd);
          }))
        ),
        h('tbody', null, tbl.rows.map(function (r, ri) {
          return h('tr', { key: ri }, r.map(function (c, ci) {
            var mark = c === '✓' ? '#52C41A' : c === '✗' ? 'rgba(0,0,0,.25)' : c === '◐' ? '#FA8C16' : null;
            return h('td', {
              key: ci,
              style: {
                textAlign: ci === 0 ? 'left' : 'center', padding: '5px 8px',
                fontSize: 12, fontWeight: ci === 0 ? 500 : 700,
                whiteSpace: ci === 0 ? 'normal' : 'nowrap',
                color: mark || (ci === 0 ? 'rgba(0,0,0,.8)' : 'rgba(0,0,0,.65)'),
                borderBottom: ri < tbl.rows.length - 1 ? '1px solid rgba(0,0,0,.05)' : 'none',
              },
            }, c);
          }));
        }))
      ),
      tbl.note ? h('div', {
        style: { padding: '5px 8px', fontSize: 10, color: 'rgba(0,0,0,.4)', background: 'rgba(0,0,0,.02)' },
      }, tbl.note) : null
    );
  }

  function filterTours(role) {
    return ALL_TOURS.filter(function(t) { return !t.roles || t.roles.indexOf(role) !== -1; });
  }

  // ── Rilevamento variante AntD generico (da classi DOM) ────────────────────

  function detectVariant(el) {
    var c = el.classList;
    if (c.contains('ant-btn')) {
      var type = c.contains('ant-btn-primary') ? 'Primary'
               : c.contains('ant-btn-dashed')  ? 'Dashed'
               : c.contains('ant-btn-text')    ? 'Text'
               : c.contains('ant-btn-link')    ? 'Link' : 'Default';
      var size = c.contains('ant-btn-sm') ? 'Small' : c.contains('ant-btn-lg') ? 'Large' : 'Default';
      var parts = ['Type=' + type, 'Size=' + size];
      if (c.contains('ant-btn-dangerous')) parts.push('Danger=True');
      if (c.contains('ant-btn-icon-only')) parts.push('Content=Icon Only');
      else if (el.querySelector('.anticon')) parts.push('Content=Icon');
      if (el.disabled) parts.push('State=Disabled');
      return parts.join(' · ');
    }
    if (c.contains('ant-select')) {
      var parts2 = ['Size=' + (c.contains('ant-select-sm') ? 'Small' : c.contains('ant-select-lg') ? 'Large' : 'Default')];
      if (c.contains('ant-select-multiple')) parts2.push('Mode=Multiple');
      if (c.contains('ant-select-disabled')) parts2.push('State=Disabled');
      else if (c.contains('ant-select-open')) parts2.push('State=Open');
      return parts2.join(' · ');
    }
    if (c.contains('ant-input-affix-wrapper') || c.contains('ant-input')) {
      var size3 = (c.contains('ant-input-affix-wrapper-lg') || c.contains('ant-input-lg')) ? 'Large'
                : (c.contains('ant-input-affix-wrapper-sm') || c.contains('ant-input-sm')) ? 'Small' : 'Default';
      var p3 = ['Size=' + size3];
      if (el.querySelector('.ant-input-prefix')) p3.push('Prefix=True');
      if (el.querySelector('.ant-input-suffix')) p3.push('Suffix=True');
      return p3.join(' · ');
    }
    if (c.contains('ant-picker')) {
      return (c.contains('ant-picker-range') ? 'Range' : 'Single')
        + (c.contains('ant-picker-disabled') ? ' · State=Disabled' : '');
    }
    if (c.contains('ant-checkbox-wrapper')) {
      var box = el.querySelector('.ant-checkbox');
      if (!box) return null;
      return box.classList.contains('ant-checkbox-indeterminate') ? 'State=Indeterminate'
           : box.classList.contains('ant-checkbox-checked') ? 'State=Checked'
           : box.classList.contains('ant-checkbox-disabled') ? 'State=Disabled' : 'State=Default';
    }
    if (c.contains('ant-switch')) {
      return 'Size=' + (c.contains('ant-switch-small') ? 'Small' : 'Default')
        + ' · Checked=' + (c.contains('ant-switch-checked') ? 'True' : 'False');
    }
    if (c.contains('ant-tag')) {
      return el.querySelector('.anticon-close') ? 'Closable=True' : null;
    }
    if (c.contains('ant-progress')) {
      return 'Type=Line · ShowInfo=False';
    }
    if (c.contains('ant-alert')) {
      return 'Type=' + (c.contains('ant-alert-success') ? 'Success' : c.contains('ant-alert-warning') ? 'Warning' : c.contains('ant-alert-error') ? 'Error' : 'Info')
        + (el.querySelector('.ant-alert-description') ? ' · Description=True' : '');
    }
    if (c.contains('ant-form-item')) {
      var lbl = el.querySelector('.ant-form-item-label label');
      return 'Layout=Vertical' + (lbl ? ' · Label="' + lbl.textContent + '"' : '');
    }
    if (c.contains('ant-avatar')) {
      return 'Shape=Circle · Type=' + (el.querySelector('img') ? 'Image' : 'Text');
    }
    return null;
  }

  // ── DevInspector ──────────────────────────────────────────────────────────
  // Hover su un componente registrato → highlight + card informativa.

  function levelColor(level) {
    return level === 'Atomo'     ? '#52C41A'
         : level === 'Molecola'  ? '#1677FF'
         : level === 'Organismo' ? '#722ED1'
         : '#8C8C8C';
  }

  // Riga meta della card inspector (label + valore monospace)
  function metaLine(label, value, vColor) {
    return h('div', { style: { fontSize: 11, fontFamily: MONO } },
      h('span', { style: { color: 'rgba(255,255,255,0.35)' } }, label + '  '),
      h('span', { style: { color: vColor || '#9CDCFE' } }, value)
    );
  }

  // Info tipografiche basate sui token ufficiali Ant Design (Typography):
  // base 14 · SM 12 · LG 16 · XL 20 · Heading1-5 = 38/30/24/20/16 ·
  // fontWeightStrong 600 · colorText 0.88 / Secondary 0.65 / Tertiary 0.45 / Quaternary 0.25.
  function typographyInfo(el) {
    if (!el) return null;
    var cs;
    try { cs = window.getComputedStyle(el); } catch (e) { return null; }
    var sizePx = Math.round(parseFloat(cs.fontSize) || 0);
    if (!sizePx) return null;
    var weight = parseInt(cs.fontWeight, 10) || 400;
    var lhPx = (cs.lineHeight === 'normal') ? null : Math.round(parseFloat(cs.lineHeight));
    var color = cs.color;
    var ls = (cs.letterSpacing && cs.letterSpacing !== 'normal') ? cs.letterSpacing : null;
    var tag = (el.tagName || '').toLowerCase();
    var cls = el.classList;
    var HEAD = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5 };
    var role = HEAD[tag] ? ('Title · livello ' + HEAD[tag])
             : tag === 'p' ? 'Paragraph'
             : (cls && cls.contains('ant-typography')) ? 'Text'
             : 'Testo';
    var SIZE = { 38: 'fontSizeHeading1', 30: 'fontSizeHeading2', 24: 'fontSizeHeading3', 20: 'fontSizeHeading4', 16: 'fontSizeHeading5', 14: 'fontSize (base)', 12: 'fontSizeSM' };
    var sizeToken = SIZE[sizePx] || (sizePx + 'px (custom)');
    if (!HEAD[tag]) { if (sizePx === 16) sizeToken = 'fontSizeLG'; else if (sizePx === 20) sizeToken = 'fontSizeXL'; }
    var weightName = weight >= 600 ? 'fontWeightStrong' : weight >= 500 ? 'Medium' : 'Regular';
    var COLORTOK = {
      'rgba(0, 0, 0, 0.88)': 'colorText', 'rgba(0, 0, 0, 0.65)': 'colorTextSecondary',
      'rgba(0, 0, 0, 0.45)': 'colorTextTertiary', 'rgba(0, 0, 0, 0.25)': 'colorTextQuaternary',
    };
    return {
      role: role, sizePx: sizePx, sizeToken: sizeToken, weight: weight, weightName: weightName,
      lhPx: lhPx, color: color, colorToken: COLORTOK[color] || null, ls: ls,
    };
  }

  // rgb(a) → HEX (null se trasparente o non valido)
  function rgbToHex(rgb) {
    var m = (rgb || '').match(/\d+(?:\.\d+)?/g);
    if (!m || m.length < 3) return null;
    if (m.length >= 4 && parseFloat(m[3]) === 0) return null;
    return '#' + m.slice(0, 3).map(function (n) { var x = parseInt(n, 10).toString(16); return x.length === 1 ? '0' + x : x; }).join('').toUpperCase();
  }

  // Colori preset Ant Design (livello 6) + palette Gravity → nome leggibile.
  var ANTD_PRESET = {
    '#52C41A': 'green / success', '#FF4D4F': 'red / error', '#FAAD14': 'gold / warning',
    '#FA8C16': 'orange', '#1677FF': 'blue / processing', '#2F54EB': 'geekblue',
    '#EB2F96': 'magenta', '#722ED1': 'purple', '#13C2C2': 'cyan', '#A0D911': 'lime',
    '#FA541C': 'volcano', '#FF4A1C': 'volcano (Gravity secondary)', '#3E00FB': 'primary (Gravity)',
  };

  // Info colore di un tag: preset Ant Design (se riconosciuto) + valori effettivi.
  function colorInfo(el) {
    if (!el) return null;
    var cs; try { cs = window.getComputedStyle(el); } catch (e) { return null; }
    var txtHex = rgbToHex(cs.color), bgHex = rgbToHex(cs.backgroundColor), bdHex = rgbToHex(cs.borderTopColor);
    // dot di status interno (Badge status / chip col pallino): primo figlio con background
    var dotHex = null;
    try {
      var kids = el.querySelectorAll('*');
      for (var i = 0; i < kids.length; i++) {
        var kh = rgbToHex(window.getComputedStyle(kids[i]).backgroundColor);
        if (kh) { dotHex = kh; break; }
      }
    } catch (e2) {}
    var preset = (txtHex && ANTD_PRESET[txtHex]) || (bgHex && ANTD_PRESET[bgHex]) || (dotHex && ANTD_PRESET[dotHex]) || (bdHex && ANTD_PRESET[bdHex]) || null;
    return { txt: cs.color, txtHex: txtHex, bg: cs.backgroundColor, bgHex: bgHex, border: cs.borderTopColor, borderHex: bdHex, dotHex: dotHex, preset: preset };
  }

  // Info icona: nome dal class anticon-* + libreria (Ant Design vs custom).
  function iconInfo(el) {
    if (!el) return null;
    var ic = (el.classList && el.classList.contains('anticon')) ? el
           : (el.querySelector ? el.querySelector('.anticon') : null);
    if (ic) {
      var name = null;
      Array.prototype.forEach.call(ic.classList, function (c) { if (c.indexOf('anticon-') === 0) name = c.slice(8); });
      return { lib: 'Ant Design', name: name };
    }
    var tag = (el.tagName || '').toLowerCase();
    if (tag === 'svg' || tag === 'img') return { lib: 'custom', name: null };
    return null;
  }

  function DevInspector() {
    var _t = useState(null); var target = _t[0]; var setTarget = _t[1];

    useEffect(function () {
      function onMove(e) {
        var node = e.target;
        if (!(node instanceof Element)) return;
        // ignora la UI dell'handoff stessa
        if (node.closest('#gravity-handoff-root') || node.closest('#ghf-nav-slot') ||
            node.closest('.ghf-us-panel') || node.closest('.ant-tooltip')) return;
        var best = null;
        var bestDepth = -1;
        for (var i = 0; i < COMPONENTS.length; i++) {
          var entry = COMPONENTS[i];
          var el;
          try { el = node.closest(entry.selector); } catch (err) { el = null; }
          if (!el) continue;
          var depth = 0; var p = el;
          while (p) { depth++; p = p.parentElement; }
          if (depth > bestDepth) { bestDepth = depth; best = { entry: entry, el: el }; }
        }
        // elemento di testo sotto il cursore (per le info tipografiche)
        var textEl = null;
        try { textEl = node.closest('.ant-typography, h1, h2, h3, h4, h5'); } catch (e3) { textEl = null; }
        if (!textEl && node.children.length === 0 && (node.textContent || '').trim()) textEl = node;
        if (!best && !textEl) { setTarget(null); return; }
        setTarget(function (prev) {
          var bel = best ? best.el : null, ben = best ? best.entry : null;
          if (prev && prev.el === bel && prev.entry === ben && prev.textEl === textEl) return prev;
          return { entry: ben, el: bel, textEl: textEl };
        });
      }
      function onLeave() { setTarget(null); }
      document.addEventListener('mouseover', onMove, true);
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('scroll', onLeave, true);
      return function () {
        document.removeEventListener('mouseover', onMove, true);
        document.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('scroll', onLeave, true);
      };
    }, []);

    if (!target) return null;
    var entry = target.entry;
    // info tipografiche dal testo sotto il cursore
    var typo = typographyInfo(target.textEl);
    // Atomo testo: hover su un testo DENTRO un contenitore (molecola/organismo/pagina)
    // → mostra l'atomo Text/Title invece del contenitore (divisione in atomi).
    var asTextAtom = !!(typo && entry && target.el && target.textEl &&
      target.el !== target.textEl && target.el.contains(target.textEl) &&
      !(target.el.matches && target.el.matches('button, a, .ant-btn')) &&
      (entry.level === 'Molecola' || entry.level === 'Organismo' || entry.level === 'Pagina'));
    var anchorEl = asTextAtom ? target.textEl : (target.el || target.textEl);
    if (!anchorEl || !anchorEl.isConnected) return null;

    var rect  = anchorEl.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // variante AntD: solo per componenti registrati (non in modalità atomo-testo)
    var variant = null;
    if (entry && !asTextAtom) {
      try {
        variant = typeof entry.variant === 'function' ? entry.variant(anchorEl)
                : entry.variant || detectVariant(anchorEl);
      } catch (e) {}
    }

    // card sotto al target, sopra se non c'è spazio
    var CARD_W = 320;
    var cardLeft = Math.max(8, Math.min(rect.left, vw - CARD_W - 8));
    var below = rect.bottom + 220 < vh;
    var cardStyle = {
      position: 'fixed',
      left: cardLeft,
      top: below ? rect.bottom + 8 : undefined,
      bottom: below ? undefined : (vh - rect.top + 8),
      width: CARD_W,
      background: '#101010',
      borderRadius: 10,
      padding: '12px 14px',
      zIndex: 9600,
      pointerEvents: 'none',
      fontFamily: FONT,
      boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
    };

    return h(React.Fragment, null,
      // highlight
      h('div', {
        style: {
          position: 'fixed',
          left: rect.left - 3, top: rect.top - 3,
          width: rect.width + 6, height: rect.height + 6,
          border: '2px solid #3E00FB',
          background: 'rgba(62,0,251,0.05)',
          borderRadius: 6,
          zIndex: 9590,
          pointerEvents: 'none',
        },
      }),
      // card info
      h('div', { className: 'ghf-inspector-card', style: cardStyle },
        // ── Header ──
        (entry && !asTextAtom)
          ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' } },
              h('span', { style: { fontSize: 13, fontWeight: 700, color: '#fff' } }, entry.name),
              h('span', {
                style: {
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
                  color: levelColor(entry.level), border: '1px solid ' + levelColor(entry.level),
                  borderRadius: 4, padding: '1px 6px',
                },
              }, entry.level || 'Atomo'),
              entry.custom ? h('span', {
                style: {
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.6px',
                  background: '#FF4A1C', color: '#fff', borderRadius: 4, padding: '2px 6px',
                },
              }, 'CUSTOM') : null
            )
          : h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' } },
              h('span', { style: { fontSize: 13, fontWeight: 700, color: '#fff' } }, typo ? typo.role : 'Testo'),
              h('span', {
                style: {
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
                  color: levelColor('Atomo'), border: '1px solid ' + levelColor('Atomo'), borderRadius: 4, padding: '1px 6px',
                },
              }, 'Atomo'),
              asTextAtom ? h('span', { style: { fontSize: 10, color: 'rgba(255,255,255,0.4)' } }, 'in ' + entry.name) : null
            ),
        (entry && !asTextAtom && entry.funzione) ? h('div', {
          style: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 8 },
        }, renderRich(entry.funzione)) : null,
        // ── Meta componente (solo se registrato, non in modalità atomo-testo) ──
        (entry && !asTextAtom) ? h('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 } },
          entry.custom
            ? h(React.Fragment, null,
                entry.composizione ? metaLine('composto da', entry.composizione, '#B5CEA8') : null,
                entry.figma ? metaLine('figma', entry.figma, '#9CDCFE')
                  : h('div', { style: { fontSize: 11, fontFamily: MONO, color: '#FFB454' } }, '⚠ Figma da definire — fornire link al design system')
              )
            : h(React.Fragment, null,
                entry.figma ? metaLine('ant design', entry.figma, '#9CDCFE') : null,
                entry.composizione ? metaLine('composto da', entry.composizione, '#B5CEA8') : null,
                variant ? metaLine('variante', variant, '#CE9178') : null
              )
        ) : null,
        // ── Colore (per i tag: preset Ant Design + valori effettivi) ──
        (entry && entry.tag && !asTextAtom) ? (function () {
          var ci = colorInfo(anchorEl);
          return ci ? h('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 } },
            h('div', { style: { fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 } }, 'Colore'),
            ci.preset ? metaLine('status / preset', ci.preset, '#9CDCFE') : null,
            ci.dotHex ? metaLine('dot', ci.dotHex, '#DCDCAA') : null,
            metaLine('testo', ci.txtHex ? (ci.txtHex + ' · ' + ci.txt) : ci.txt, '#DCDCAA'),
            ci.bgHex ? metaLine('sfondo', ci.bgHex + ' · ' + ci.bg, '#DCDCAA')
              : (ci.bg && ci.bg !== 'rgba(0, 0, 0, 0)' ? metaLine('sfondo', ci.bg, '#DCDCAA') : null),
            ci.borderHex ? metaLine('bordo', ci.borderHex, '#DCDCAA') : null
          ) : null;
        })() : null,
        // ── Icona (Ant Design o custom) ──
        (entry && entry.icon && !asTextAtom) ? (function () {
          var ii = iconInfo(anchorEl);
          return ii ? h('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 } },
            h('div', { style: { fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 } }, 'Icona'),
            metaLine('libreria', ii.lib === 'Ant Design' ? 'Ant Design' : '⚠ custom (non Ant Design)', ii.lib === 'Ant Design' ? '#9CDCFE' : '#FFB454'),
            ii.name ? metaLine('icona', 'Icon / ' + ii.name, '#DCDCAA') : null
          ) : null;
        })() : null,
        // ── Tipografia (token ufficiali Ant Design) ──
        typo ? h('div', { style: { borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: (entry && !asTextAtom) ? 8 : 0, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 } },
          (entry && !asTextAtom) ? h('div', { style: { fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 } }, 'Testo') : null,
          metaLine('tipo', typo.role, '#C586C0'),
          metaLine('dimensione', typo.sizePx + 'px · ' + typo.sizeToken, '#9CDCFE'),
          metaLine('peso', typo.weight + ' · ' + typo.weightName, '#CE9178'),
          typo.lhPx ? metaLine('interlinea', typo.lhPx + 'px', '#B5CEA8') : null,
          metaLine('colore', typo.color + (typo.colorToken ? ' · ' + typo.colorToken : ''), '#DCDCAA'),
          typo.ls ? metaLine('spaziatura', typo.ls, '#B5CEA8') : null
        ) : null
      )
    );
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
      // Porta il target in vista una volta sola (lo scroll utente è bloccato: questo è programmatico)
      var scrollEl = colIndex
        ? (function () { var c = document.querySelectorAll('.ant-table-cell:nth-child(' + colIndex + ')'); return c.length ? c[Math.min(1, c.length - 1)] : null; })()
        : (selector ? document.querySelector(selector) : null);
      if (scrollEl && scrollEl.scrollIntoView) scrollEl.scrollIntoView({ block: 'center', inline: 'nearest' });
      update();
      var raf = requestAnimationFrame(update); // dopo paint/scroll
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true); // ricalcola mentre lo scroll programmatico assesta
      return function () { cancelAnimationFrame(raf); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
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

  function TourBalloon({ step, index, total, steps, screenLabel, role, roleColor, usTitle, onPrev, onNext, onGoTo, onExit }) {
    var BALLOON_W = 440;
    var GAP       = 18;
    var _p = useState({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
    var pos = _p[0]; var setPos = _p[1];
    var balloonRef = useRef(null);
    var _idx = useState(false); var indexOpen = _idx[0]; var setIndexOpen = _idx[1];
    // Reset indice collassabile ad ogni cambio step
    useEffect(function () { setIndexOpen(false); }, [step]);

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
      window.addEventListener('scroll', calc, true); // riposiziona il balloon dopo lo scroll automatico
      return function () { cancelAnimationFrame(raf); window.removeEventListener('resize', calc); window.removeEventListener('scroll', calc, true); };
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
        // Mai oltre la viewport: header + footer fissi, body scrollabile
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - ' + (GAP * 2) + 'px)',
      }),
    },
      // Barra progress
      h('div', {
        style: {
          height: 3,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden',
          flexShrink: 0,
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
        style: { padding: '12px 18px 10px', borderBottom: '1px solid rgba(0,0,0,.06)', flexShrink: 0 },
      },
        h('div', {
          style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)', marginBottom: 5 },
        }, usTitle || screenLabel || '—'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' } },
          h(antd.Tag, {
            color: roleColor || 'default',
            style: { margin: 0, fontSize: 11, fontWeight: 600 },
          }, role || '—'),
          screenLabel ? h('span', { style: { fontSize: 11, color: 'rgba(0,0,0,.4)' } }, screenLabel) : null
        )
      ),
      // Body — unica area scrollabile (tutto il resto resta fisso e a schermo)
      h('div', { style: { padding: '12px 18px 12px', flex: 1, overflowY: 'auto', minHeight: 0 } },
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
          }, h(icons.UnorderedListOutlined, { style: { fontSize: 10 } }), ' Indice')
        ),
        // Indice step (collassabile, sempre accessibile)
        indexOpen ? h('div', {
          style: {
            marginBottom: 10, borderRadius: 6,
            border: '1px solid rgba(0,0,0,.07)',
            maxHeight: 360, overflowY: 'auto',
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
        }, renderRich(step.description)),
        // ── Tabella (opzionale, sempre visibile) ─────────────────────────
        step.table ? h('div', { style: { marginTop: 10 } }, renderMatrix(step.table)) : null,
        // ── Sezione dev (sempre visibile) ────────────────────────────────
        step.dev ? h('div', {
          style: {
            marginTop: 10, background: '#0f0f0f', borderRadius: 6,
            padding: '10px 12px',
          },
        },
          h('div', {
            style: { fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: MONO },
          }, '{ } dev'),
          (typeof step.dev === 'string'
            ? [{ label: null, value: step.dev }]
            : step.dev
          ).map(function (item, i, arr) {
            return h('div', { key: i, style: { marginBottom: i < arr.length - 1 ? 12 : 0 } },
              item.label ? h('div', {
                style: { fontSize: 9, color: 'rgba(255,255,255,.3)', marginBottom: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' },
              }, item.label) : null,
              h('pre', {
                style: { margin: 0, fontSize: 11, color: '#9CDCFE', fontFamily: MONO, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.55 },
              }, item.value)
            );
          })
        ) : null
      ),
      // Footer navigazione
      h('div', {
        style: {
          padding: '10px 14px',
          borderTop: '1px solid rgba(0,0,0,.06)',
          display: 'flex', alignItems: 'center', gap: 8,
          flexShrink: 0,
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

  // ── Pannello user story (contenuto del dropdown in navbar) ────────────────

  function UsPanel({ tours, screen, role, roleColor, sprintMode, onSprintToggle, onStart }) {
    tours = (tours || []).slice().sort(function (a, b) {
      function n(t) { var m = (t.title || '').match(/US#?\s*([\d.]+)/i); return m ? m[1].split('.').map(Number) : [Infinity]; }
      var na = n(a), nb = n(b);
      for (var i = 0; i < Math.max(na.length, nb.length); i++) {
        var x = na[i] == null ? -1 : na[i], y = nb[i] == null ? -1 : nb[i];
        if (x !== y) return x - y;
      }
      return 0;
    });
    // Filtro per tipo di schermata (template)
    var _f = useState('all'); var scrFilter = _f[0]; var setScrFilter = _f[1];
    var screens = [];
    tours.forEach(function (t) { if (t.startScreen && screens.indexOf(t.startScreen) === -1) screens.push(t.startScreen); });
    var shown = scrFilter === 'all' ? tours : tours.filter(function (t) { return t.startScreen === scrFilter; });

    function filterChip(label, active, onClick) {
      return h('button', {
        key: label, onClick: onClick,
        style: {
          fontSize: 11, fontWeight: 600, cursor: 'pointer', lineHeight: '18px',
          padding: '1px 10px', borderRadius: 12, fontFamily: FONT,
          border: '1px solid ' + (active ? '#3E00FB' : 'rgba(0,0,0,0.12)'),
          background: active ? '#3E00FB' : '#fff',
          color: active ? '#fff' : 'rgba(0,0,0,0.6)',
        },
      }, label);
    }

    // Mostra TUTTE le US del ruolo (filtrabili per schermata): il tag "template"
    // esplicita il flusso e il tour porta l'utente nei punti giusti.
    var items = (shown.length === 0)
      ? h('div', { style: { padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(0,0,0,.3)' } },
          'Nessuna user story per questo filtro.')
      : shown.map(function (tour) {
          return h('div', {
            key: tour.id,
            onClick: function () { onStart(tour); },
            style: { padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,.04)', transition: 'background .1s' },
            onMouseEnter: function (e) { e.currentTarget.style.background = 'rgba(62,0,251,.03)'; },
            onMouseLeave: function (e) { e.currentTarget.style.background = ''; },
          },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' } },
              screenChip(tour.startScreen ? screenLabel(tour.startScreen) : null),
              h('span', { style: { fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,.88)' } }, tour.title),
              tour.novita ? h(antd.Tag, { color: '#FF4A1C', style: { margin: 0, fontSize: 9, lineHeight: '14px', padding: '0 4px', fontWeight: 600 } }, 'Novità') : null
            ),
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.45)', marginBottom: 0, lineHeight: 1.5 } }, renderRich(tour.description)),
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.25)', marginTop: 4 } }, tour.steps.length + ' step')
          );
        });

    return h('div', {
      className: 'ghf-us-panel',
      style: {
        width: 440, background: '#fff', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,.15)',
        maxHeight: 480, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      },
    },
      h('div', { style: { padding: '12px 16px 10px', borderBottom: '1px solid rgba(0,0,0,.06)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          h('span', { style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)' } }, 'User story'),
          h(antd.Tag, { color: roleColor, style: { margin: 0, fontSize: 11, fontWeight: 600 } }, role)
        ),
        // Toggle interfaccia semplificata — evidenzia gli elementi fuori sprint
        (typeof onSprintToggle === 'function' && OUT_OF_SPRINT.length) ? h('div', {
          style: {
            display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 10,
            padding: '8px 10px', borderRadius: 8,
            background: sprintMode ? 'rgba(255,74,28,.06)' : 'rgba(0,0,0,.03)',
            border: '1px solid ' + (sprintMode ? 'rgba(255,74,28,.3)' : 'rgba(0,0,0,.06)'),
          },
        },
          h(antd.Switch, { size: 'small', checked: !!sprintMode, onChange: onSprintToggle, style: { marginTop: 2 } }),
          h('div', { style: { flex: 1 } },
            h('div', { style: { fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,.85)' } }, 'Interfaccia semplificata'),
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.45)', lineHeight: 1.45, marginTop: 1 } },
              'Evidenzia le aree ', h('b', { style: { color: '#FF4A1C' } }, 'fuori sprint'), ' — senza user story, non da realizzare ora.')
          )
        ) : null
      ),
      screens.length > 1 ? h('div', { style: { padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,.06)', display: 'flex', gap: 6, flexWrap: 'nowrap', alignItems: 'center', whiteSpace: 'nowrap' } },
        h('span', { style: { fontSize: 9, color: 'rgba(0,0,0,.35)', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 700, marginRight: 2 } }, 'Schermata'),
        filterChip('Tutte', scrFilter === 'all', function () { setScrFilter('all'); }),
        screens.map(function (s) { return filterChip(screenLabel(s), scrFilter === s, function () { setScrFilter(s); }); })
      ) : null,
      h('div', { style: { flex: 1, overflowY: 'auto' } }, items)
    );
  }

  // ── Pannello modello: Relazioni tra entità + Dipendenze (regole) ──────────

  function ModelPanel({ relations, deps, scenarios }) {
    var _t = useState('scenari'); var tab = _t[0]; var setTab = _t[1];
    var data = tab === 'relazioni' ? (relations || []) : tab === 'dipendenze' ? (deps || []) : (scenarios || []);

    function tabBtn(label, key) {
      var active = tab === key;
      return h('button', {
        key: key, onClick: function () { setTab(key); },
        style: {
          fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
          padding: '5px 12px', border: 'none', background: 'transparent',
          color: active ? '#3E00FB' : 'rgba(0,0,0,0.5)',
          borderBottom: '2px solid ' + (active ? '#3E00FB' : 'transparent'),
        },
      }, label);
    }

    var items = (data.length === 0)
      ? h('div', { style: { padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(0,0,0,.3)' } },
          'Nessun elemento.')
      : data.map(function (d) {
          return h('div', { key: d.id, style: { padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,.05)' } },
            h('div', { style: { fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,.88)', marginBottom: d.description ? 4 : 8 } }, d.title),
            d.description ? h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.45)', lineHeight: 1.5, marginBottom: 8 } }, renderRich(d.description)) : null,
            d.table ? renderMatrix(d.table) : null
          );
        });

    return h('div', {
      className: 'ghf-model-panel',
      style: {
        width: 560, background: '#fff', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,.15)',
        maxHeight: 540, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      },
    },
      h('div', { style: { padding: '12px 16px 0', borderBottom: '1px solid rgba(0,0,0,.06)' } },
        h('div', { style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)' } }, 'Modello di dominio'),
        h('div', { style: { display: 'flex', gap: 4, marginTop: 6 } },
          tabBtn('Scenari', 'scenari'),
          tabBtn('Dipendenze', 'dipendenze'),
          tabBtn('Relazioni', 'relazioni')
        )
      ),
      h('div', { style: { flex: 1, overflowY: 'auto' } }, items)
    );
  }

  // ── Pannello note interne (contenuto del dropdown in navbar) ──────────────

  function NotesPanel({ notes }) {
    var items = (!notes || notes.length === 0)
      ? h('div', { style: { padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(0,0,0,.3)' } },
          'Nessuna nota.')
      : notes.map(function (n) {
          return h('div', { key: n.id, style: { padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,.05)' } },
            h('div', { style: { fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,.88)', marginBottom: 6 } }, n.title),
            h('div', { style: { fontSize: 12, color: 'rgba(0,0,0,.6)', lineHeight: 1.55 } }, renderRich(n.body))
          );
        });

    return h('div', {
      className: 'ghf-notes-panel',
      style: {
        width: 360, background: '#fff', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,.15)',
        maxHeight: 520, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      },
    },
      h('div', { style: { padding: '12px 16px 10px', borderBottom: '1px solid rgba(0,0,0,.06)' } },
        h('div', { style: { fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,.88)' } }, 'Note interne'),
        h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,.4)', marginTop: 2 } }, 'Appunti di design per lo sviluppo')
      ),
      h('div', { style: { flex: 1, overflowY: 'auto' } }, items)
    );
  }

  // ── Interfaccia semplificata: evidenzia gli elementi FUORI SPRINT ─────────
  // Aggiunge la classe .ghf-oos agli elementi in OUT_OF_SPRINT (anche portalati
  // e transitori, es. voci di dropdown). Ripassa in loop perché l'app ri-renderizza.
  function SprintMarker() {
    useEffect(function () {
      var STYLE_ID = 'ghf-oos-style';
      if (!document.getElementById(STYLE_ID)) {
        var st = document.createElement('style');
        st.id = STYLE_ID;
        st.textContent =
          '.ghf-oos{position:relative!important;outline:1.5px dashed #FF4A1C!important;' +
          'outline-offset:-1px;border-radius:4px;' +
          'background-image:repeating-linear-gradient(45deg,rgba(255,74,28,.05) 0 6px,rgba(255,74,28,.12) 6px 12px)!important;}' +
          '.ghf-oos::after{content:"fuori sprint";position:absolute;top:-8px;right:6px;z-index:30;' +
          'background:#FF4A1C;color:#fff;font-size:8px;font-weight:700;line-height:1;letter-spacing:.3px;' +
          'padding:2px 5px;border-radius:8px;font-family:' + FONT.replace(/"/g, "'") + ';pointer-events:none;text-transform:uppercase;white-space:nowrap;}';
        document.head.appendChild(st);
      }
      function apply() {
        var marked = [];
        OUT_OF_SPRINT.forEach(function (entry) {
          var els;
          try { els = document.querySelectorAll(entry.selector); } catch (e) { return; }
          Array.prototype.forEach.call(els, function (el) {
            if (entry.text && (el.textContent || '').indexOf(entry.text) === -1) return;
            el.classList.add('ghf-oos');
            if (entry.note && el.getAttribute('title') == null) el.setAttribute('title', entry.note);
            marked.push(el);
          });
        });
        // rimuove la marcatura dagli elementi non più in lista (es. dropdown chiuso)
        Array.prototype.forEach.call(document.querySelectorAll('.ghf-oos'), function (el) {
          if (marked.indexOf(el) === -1) { el.classList.remove('ghf-oos'); el.removeAttribute('title'); }
        });
      }
      apply();
      var id = setInterval(apply, 400);
      return function () {
        clearInterval(id);
        Array.prototype.forEach.call(document.querySelectorAll('.ghf-oos'), function (el) {
          el.classList.remove('ghf-oos'); el.removeAttribute('title');
        });
      };
    }, []);

    // Legenda fissa in basso: spiega la modalità attiva
    return h('div', {
      style: {
        position: 'fixed', left: 16, bottom: 16, zIndex: 9998,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', borderRadius: 8, fontFamily: FONT,
        background: 'rgba(255,255,255,.96)', border: '1px solid rgba(255,74,28,.35)',
        boxShadow: '0 4px 16px rgba(0,0,0,.12)', fontSize: 11, color: 'rgba(0,0,0,.65)',
      },
    },
      h('span', { style: { width: 18, height: 12, borderRadius: 3, border: '1.5px dashed #FF4A1C', background: 'repeating-linear-gradient(45deg,rgba(255,74,28,.05) 0 4px,rgba(255,74,28,.12) 4px 8px)', flex: 'none' } }),
      h('span', null, h('b', { style: { color: 'rgba(0,0,0,.85)' } }, 'Interfaccia semplificata'), ' — le aree evidenziate sono ', h('b', { style: { color: '#FF4A1C' } }, 'fuori sprint'), ' (non da realizzare ora)')
    );
  }

  // ── Badge versione + selettore (nel dev-bar) ──────────────────────────────
  function VersionBadge() {
    var _o = useState(false); var open = _o[0]; var setOpen = _o[1];
    if (!VERSIONS) return null;
    var current = VERSIONS.filter(function (v) { return v.current; })[0] || VERSIONS[0];

    function go(v) {
      setOpen(false);
      if (!v.file || v.current) return;
      // v.file include già il parametro di versione (es. index.html?handoff=v1)
      location.href = v.file + location.hash;
    }

    var menu = h('div', {
      style: { width: 240, background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,.15)', overflow: 'hidden', fontFamily: FONT },
    },
      VERSIONS.map(function (v) {
        var disabled = !v.file;
        return h('div', {
          key: v.id,
          onClick: function () { if (!disabled) go(v); },
          style: {
            padding: '10px 12px', borderBottom: '1px solid rgba(0,0,0,.04)',
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: disabled ? 0.45 : 1,
            background: v.current ? 'rgba(62,0,251,.05)' : 'transparent',
          },
          onMouseEnter: function (e) { if (!disabled && !v.current) e.currentTarget.style.background = 'rgba(0,0,0,.03)'; },
          onMouseLeave: function (e) { if (!disabled && !v.current) e.currentTarget.style.background = 'transparent'; },
        },
          h('span', { style: { fontSize: 12, fontWeight: 700, color: v.current ? '#3E00FB' : 'rgba(0,0,0,.75)', minWidth: 26 } }, v.id),
          h('span', { style: { flex: 1, fontSize: 11, color: 'rgba(0,0,0,.5)' } }, v.note || ''),
          v.approved ? h(antd.Tag, { color: 'green', style: { margin: 0, fontSize: 9, lineHeight: '14px', padding: '0 5px', fontWeight: 600 } }, 'Approvata') : null,
          v.current ? h(icons.CheckOutlined, { style: { fontSize: 12, color: '#3E00FB' } }) : null
        );
      })
    );

    return h(antd.Dropdown, {
      trigger: ['click'], open: open, onOpenChange: setOpen, placement: 'bottomRight',
      dropdownRender: function () { return menu; },
    },
      h('span', {
        style: {
          display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
          height: 24, padding: '0 8px', borderRadius: 6, fontFamily: FONT,
          background: '#fff', border: '1px solid rgba(0,0,0,0.15)',
          fontSize: 12, fontWeight: 700, color: '#3E00FB', lineHeight: '22px',
        },
      },
        h('span', null, (current && current.id) || 'V?'),
        h(icons.DownOutlined, { style: { fontSize: 8, color: 'rgba(0,0,0,0.4)' } })
      )
    );
  }

  // ── Controlli in navbar (portal accanto alla campanella) ─────────────────

  function NavControls({ devMode, onDevToggle, sprintMode, onSprintToggle, tours, onStart, screen, role, roleColor, novitaCount, deps, notes, relations, scenarios }) {
    var _us = useState(false); var usOpen = _us[0]; var setUsOpen = _us[1];
    var _dep = useState(false); var depOpen = _dep[0]; var setDepOpen = _dep[1];
    var _nt = useState(false); var notesOpen = _nt[0]; var setNotesOpen = _nt[1];
    return h('span', {
      // Area unica che raggruppa toggle dev + user story
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 10,
        height: 32, padding: '0 6px 0 10px', marginRight: 2,
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 8,
      },
    },
      // Badge versione + selettore (solo se META.versions è definito)
      VERSIONS ? h(VersionBadge) : null,
      VERSIONS ? h('span', { style: { width: 1, height: 16, background: 'rgba(0,0,0,0.1)' } }) : null,
      // Switch dev — attiva l'inspector componenti
      h(antd.Tooltip, { title: devMode ? 'Inspector componenti attivo' : 'Inspector componenti (dev)', placement: 'bottom' },
        h(antd.Switch, {
          checked: devMode,
          onChange: onDevToggle,
          checkedChildren: h(icons.CodeOutlined, { style: { fontSize: 12 } }),
          unCheckedChildren: h(icons.CodeOutlined, { style: { fontSize: 12 } }),
        })
      ),
      // Divider interno
      h('span', { style: { width: 1, height: 16, background: 'rgba(0,0,0,0.1)' } }),
      // User story — trigger con estetica button (icona + label)
      h(antd.Dropdown, {
        trigger: ['click'],
        open: usOpen,
        onOpenChange: setUsOpen,
        placement: 'bottomRight',
        dropdownRender: function () {
          return h(UsPanel, { tours: tours, screen: screen, role: role, roleColor: roleColor, sprintMode: sprintMode, onSprintToggle: onSprintToggle, onStart: function (tour) { setUsOpen(false); onStart(tour); } });
        },
      },
        h('span', { style: { display: 'inline-flex' } },
          h(antd.Badge, { count: novitaCount, size: 'small', offset: [-2, 4] },
            h('span', {
              title: 'User story',
              style: {
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 24, padding: '0 10px',
                background: '#fff', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6,
                color: 'rgba(0,0,0,0.75)', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600, lineHeight: '22px',
                transition: 'color .15s, border-color .15s',
              },
              onMouseEnter: function (e) { e.currentTarget.style.color = '#3E00FB'; e.currentTarget.style.borderColor = '#3E00FB'; },
              onMouseLeave: function (e) { e.currentTarget.style.color = 'rgba(0,0,0,0.75)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; },
            },
              h(icons.FlagOutlined, { style: { fontSize: 13 } }),
              h('span', null, 'User story')
            )
          )
        )
      ),
      // Divider interno
      h('span', { style: { width: 1, height: 16, background: 'rgba(0,0,0,0.1)' } }),
      // Dipendenze — trigger con estetica button (icona + label)
      h(antd.Dropdown, {
        trigger: ['click'],
        open: depOpen,
        onOpenChange: setDepOpen,
        placement: 'bottomRight',
        dropdownRender: function () { return h(ModelPanel, { scenarios: scenarios, relations: relations, deps: deps }); },
      },
        h('span', {
          title: 'Modello di dominio (relazioni + dipendenze)',
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 24, padding: '0 10px',
            background: '#fff', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6,
            color: 'rgba(0,0,0,0.75)', cursor: 'pointer',
            fontFamily: FONT, fontSize: 12, fontWeight: 600, lineHeight: '22px',
            transition: 'color .15s, border-color .15s',
          },
          onMouseEnter: function (e) { e.currentTarget.style.color = '#3E00FB'; e.currentTarget.style.borderColor = '#3E00FB'; },
          onMouseLeave: function (e) { e.currentTarget.style.color = 'rgba(0,0,0,0.75)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; },
        },
          h(icons.ApartmentOutlined, { style: { fontSize: 13 } }),
          h('span', null, 'Modello')
        )
      ),
      // Le note interne sono ora marker inline contestuali (CoffeeOutlined rosso)
      // ancorati alle aree UI di riferimento — vedi HandoffDesignNote nel prototipo.
    );
  }

  // ── HandoffApp ────────────────────────────────────────────────────────────

  function HandoffApp() {
    var _c = useState(null);         var activeTour = _c[0]; var setActiveTour = _c[1];
    var _d = useState(0);            var tourCur    = _d[0]; var setTourCur    = _d[1];
    var _e = useState(false);        var tourOpen   = _e[0]; var setTourOpen   = _e[1];
    var _f = useState(detectScreen); var screen     = _f[0]; var setScreen     = _f[1];
    var _g = useState(getRole);      var role       = _g[0]; var setRole       = _g[1];
    var _h = useState(function () { return localStorage.getItem('ghf_dev_mode') === '1'; });
    var devMode = _h[0]; var setDevMode = _h[1];
    var _sp = useState(function () { return localStorage.getItem('ghf_sprint_mode') === '1'; });
    var sprintMode = _sp[0]; var setSprintMode = _sp[1];
    var _s = useState(null);         var slotEl     = _s[0]; var setSlotEl     = _s[1];

    var tours = useMemo(function () { return filterTours(role); }, [role]);

    // Inserisce (e mantiene) lo slot nella navbar, prima della campanella
    useEffect(function () {
      function ensureSlot() {
        var existing = document.getElementById('ghf-nav-slot');
        if (existing && existing.isConnected) {
          setSlotEl(function (prev) { return prev === existing ? prev : existing; });
          return;
        }
        var bell = document.getElementById('gravity-bell-btn');
        if (!bell || !bell.parentNode) return;
        var slot = document.createElement('span');
        slot.id = 'ghf-nav-slot';
        slot.style.display = 'inline-flex';
        slot.style.alignItems = 'center';
        bell.parentNode.insertBefore(slot, bell);
        setSlotEl(slot);
      }
      ensureSlot();
      var id = setInterval(ensureSlot, 600);
      return function () { clearInterval(id); };
    }, []);

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

    function toggleDev(v) {
      setDevMode(v);
      try { localStorage.setItem('ghf_dev_mode', v ? '1' : '0'); } catch (e) {}
    }

    function toggleSprint(v) {
      setSprintMode(v);
      try { localStorage.setItem('ghf_sprint_mode', v ? '1' : '0'); } catch (e) {}
    }

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
      var target = tour.startScreen;
      var begin = function () { setActiveTour(tour); setTourOpen(true); goToStep(tour, 0); };
      if (!target || !SCREENS) { begin(); return; }

      function waitFor(scr, cb) {
        var n = 0;
        var iv = setInterval(function () {
          n++;
          if (detectScreen() === scr || n > 50) { clearInterval(iv); cb(); }
        }, 100);
      }

      // Dettaglio: apre sempre dalla lista la pianificazione adatta alla casistica
      if (target === 'selezione-spazi') {
        var open = (typeof tour.goTo === 'function') ? tour.goTo
                 : (SCREENS[target] && SCREENS[target].goTo);
        var doOpen = function () {
          if (typeof open === 'function') { try { open(); } catch (e) {} }
          waitFor('selezione-spazi', begin);
        };
        if (detectScreen() === 'lista') { doOpen(); }
        else {
          // già su un dettaglio (magari sbagliato) → torna alla lista, poi apri quello giusto
          if (SCREENS.lista && SCREENS.lista.goTo) { try { SCREENS.lista.goTo(); } catch (e) {} }
          waitFor('lista', doOpen);
        }
        return;
      }

      // Lista: assicura di essere sulla lista
      if (target === 'lista') {
        if (detectScreen() === 'lista') { begin(); return; }
        if (SCREENS.lista && SCREENS.lista.goTo) { try { SCREENS.lista.goTo(); } catch (e) {} }
        waitFor('lista', begin);
        return;
      }

      begin();
    }

    function exitTour() {
      setActiveTour(null);
      setTourOpen(false);
      setTourCur(0);
      var hl = document.getElementById('ghf-col-hl');
      if (hl) hl.remove();
    }

    var roleColor      = ROLE_COLOR[role] || 'default';
    var curScreenLabel = screen ? screenLabel(screen) : null;
    var novitaCount    = tours.filter(function (t) { return t.novita; }).length;

    var navControls = slotEl ? ReactDOM.createPortal(
      h(NavControls, {
        devMode:        devMode,
        onDevToggle:    toggleDev,
        sprintMode:     sprintMode,
        onSprintToggle: toggleSprint,
        tours:       tours,
        onStart:     startTour,
        screen:      screen,
        role:        role,
        roleColor:   roleColor,
        novitaCount: novitaCount,
        deps:        DEPS,
        notes:       NOTES,
        relations:   RELATIONS,
        scenarios:   SCENARIOS,
      }),
      slotEl
    ) : null;

    var tourUi = (tourOpen && activeTour) ? h(React.Fragment, null,
      h(SpotlightOverlay, {
        selector: activeTour.steps[tourCur].selector,
        colIndex: activeTour.steps[tourCur].colIndex,
        padding:  activeTour.steps[tourCur].colIndex ? 0 : (activeTour.steps[tourCur].mask === false ? 0 : 10),
      }),
      h(TourBalloon, {
        step:        activeTour.steps[tourCur],
        index:       tourCur,
        total:       activeTour.steps.length,
        steps:       activeTour.steps,
        screenLabel: curScreenLabel || '—',
        role:        role,
        roleColor:   roleColor,
        usTitle:     activeTour.title,
        onPrev:      function () { goToStep(activeTour, tourCur - 1); },
        onNext:      function () { goToStep(activeTour, tourCur + 1); },
        onGoTo:      function (i) { goToStep(activeTour, i); },
        onExit:      exitTour,
      })
    ) : null;

    return h(antd.ConfigProvider, { theme: window.GRAVITY_THEME || {} },
      h(antd.App, null,
        navControls,
        tourUi,
        (devMode && !tourOpen && COMPONENTS.length) ? h(DevInspector) : null,
        (sprintMode && OUT_OF_SPRINT.length) ? h(SprintMarker) : null
      )
    );
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  var container = document.createElement('div');
  container.id = 'gravity-handoff-root';
  document.body.appendChild(container);
  ReactDOM.createRoot(container).render(h(HandoffApp));
})();
