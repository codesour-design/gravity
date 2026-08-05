/*
 * entity-card.js — Entity Card condivisa Gravity
 * ===============================================
 * Componente unico e parametrico: header, immagine, body e footer
 * sono sezioni opzionali, composte in base al tipo di entità.
 *
 * Espone window.GravityEntityCard (componente React via React.createElement).
 * Richiede React, @ant-design/icons (globals) e tokens.js (CSS variables).
 *
 * Props di GravityEntityCard:
 *   title      : string — titolo principale nell'header
 *   badge      : { text, variant }  (opzionale)
 *                  variant: 'default' | 'primary' | 'success' | 'ooh' | 'dooh'
 *   badges     : [{ text, variant }]  (opzionale — badge multipli, alternativo a badge)
 *   showMenu   : boolean — mostra ⋮ kebab nell'header  (default false)
 *   image      : { id, placeholder, aspectRatio }  (opzionale)
 *                  id: chiave univoca per image-slot
 *                  placeholder: testo dell'empty state
 *                  aspectRatio: es. '16/9' (default '16/9') o numero px per height fissa
 *   fields     : [{ icon, label, value, valueStyle, valueNode }]
 *                  icon: nome dell'icona AntD (es. 'TagOutlined'), oppure null
 *                  label: string (con il due-punti incluso, es. 'Tipologia:')
 *                  value: string (testo valore, opzionale se valueNode presente)
 *                  valueStyle: oggetto CSSProperties aggiuntivo sul valore
 *                  valueNode: React node per valori complessi (es. stato con dot)
 *   bodyColumns: 1 | 2  (default 1)
 *   footer     : React node — contenuto opzionale in fondo alla card
 *   style      : oggetto CSSProperties aggiuntivo sul wrapper esterno
 *   className  : string aggiuntiva sul wrapper esterno
 *
 * Helper esposti su window.GravityEntityCard:
 *   GravityEntityCard.statusDot(color, label) → node  — punto colorato + testo
 *   GravityEntityCard.badgeVariants             — mappa variant → stili CSS
 *
 * Utilizzo:
 *   <script src="../../_shared/entity-card.js"></script>
 *
 *   React.createElement(window.GravityEntityCard, {
 *     title: 'Impianto Via Maqueda 148',
 *     badge: { text: 'PA-001', variant: 'default' },
 *     image: { id: 'imp-001', placeholder: 'foto impianto' },
 *     fields: [
 *       { icon: 'TagOutlined',    label: 'Tipologia:', value: 'Pensilina' },
 *       { icon: 'ExpandOutlined', label: 'Formato:',   value: '140×200 cm' },
 *     ],
 *   })
 */
;(function (global) {
  'use strict';

  if (global.GravityEntityCard) return;

  var React  = global.React;
  var icons  = global.icons || {};
  var h      = React.createElement;

  // ── Badge color variants ──────────────────────────────────────────────────
  var BADGE_VARIANTS = {
    default : { border: '1px solid #d9d9d9',   color: 'rgba(0,0,0,0.65)', background: '#fafafa' },
    primary : { border: '1px solid #D3C4FF',   color: '#3E00FB',          background: '#F0EBFF' },
    ooh     : { border: '1px solid #B7EB8F',   color: '#389e0d',          background: '#F6FFED' },
    dooh    : { border: '1px solid #FFADD2',   color: '#C41D7F',          background: '#FFF0F6' },
    success : { border: '1px solid #B7EB8F',   color: '#389e0d',          background: '#F6FFED' },
    warning : { border: '1px solid #FFE58F',   color: '#d48806',          background: '#FFFBE6' },
    error   : { border: '1px solid #FFA39E',   color: '#cf1322',          background: '#FFF1F0' },
    blue    : { border: '1px solid #91CAFF',   color: '#1677FF',          background: '#E6F4FF' },
  };

  var BADGE_BASE = {
    margin: 0,
    fontSize: '12px',
    padding: '0 7px',
    borderRadius: '4px',
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  function Badge(props) {
    var variant = props.variant || 'default';
    var style = Object.assign({}, BADGE_BASE, BADGE_VARIANTS[variant] || BADGE_VARIANTS.default);
    return h('span', { style: style }, props.text);
  }

  // ── Status dot (punto colorato + label) ───────────────────────────────────
  function statusDot(color, label) {
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
      h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 } }),
      h('span', { style: { fontWeight: 400, color: 'rgba(0,0,0,0.65)' } }, label)
    );
  }

  // ── Image placeholder ────────────────────────────────────────────────────
  // Usa <image-slot> se il custom element è definito (image-slot.js caricato),
  // altrimenti un div placeholder coerente con lo stile del design.
  function ImageArea(props) {
    var id          = props.id;
    var placeholder = props.placeholder || 'Immagine';
    var aspectRatio = props.aspectRatio || '16/9';
    var heightPx    = props.heightPx;  // alternativa ad aspectRatio (es. 150)

    var sizeStyle = heightPx
      ? { width: '100%', height: heightPx + 'px', display: 'block' }
      : { width: '100%', aspectRatio: aspectRatio, display: 'block' };

    // Se image-slot è definito come custom element usa quello,
    // altrimenti fallback a un div con icona
    if (typeof global.customElements !== 'undefined' && global.customElements.get('image-slot')) {
      return h('image-slot', Object.assign({ id: id, shape: 'rect', placeholder: placeholder }, { style: sizeStyle }));
    }

    // Fallback placeholder
    var UploadIcon = icons.PictureOutlined || icons.FileImageOutlined;
    return h('div', {
      style: Object.assign({
        background: 'rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: 'rgba(0,0,0,0.25)',
        fontSize: '12px',
        userSelect: 'none',
      }, sizeStyle),
    },
      UploadIcon ? h(UploadIcon, { style: { fontSize: '24px', opacity: 0.4 } }) : null,
      h('span', null, placeholder)
    );
  }

  // ── Field row ─────────────────────────────────────────────────────────────
  function FieldRow(props) {
    var Icon      = props.icon ? icons[props.icon] : null;
    var iconNode  = Icon
      ? h(Icon, { style: { fontSize: '14px', color: 'rgba(0,0,0,0.45)', flexShrink: 0 } })
      : null;
    var valueNode = props.valueNode
      || h('span', { style: Object.assign({ fontWeight: 400, color: 'rgba(0,0,0,0.65)' }, props.valueStyle) }, props.value);

    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', lineHeight: '20px' } },
      iconNode,
      h('span', { style: { fontWeight: 600, color: 'rgba(0,0,0,0.88)', flexShrink: 0 } }, props.label),
      valueNode
    );
  }

  // ── Inject CSS (una volta sola) ───────────────────────────────────────────
  function ensureCSS() {
    if (document.getElementById('gravity-entity-card-css')) return;
    var s = document.createElement('style');
    s.id  = 'gravity-entity-card-css';
    s.textContent =
      '.gec-card{border-radius:8px;border:1px solid #F0F0F0;overflow:hidden;background:#fff}' +
      '.gec-header{display:flex;align-items:flex-start;justify-content:space-between;' +
      '  gap:10px;padding:14px 16px;border-bottom:1px solid #F5F5F5}' +
      '.gec-header-left{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}' +
      '.gec-title{font-size:16px;font-weight:600;line-height:24px;' +
      '  color:rgba(0,0,0,0.88);white-space:nowrap}' +
      '.gec-menu{font-size:18px;color:#595959;line-height:1;flex-shrink:0;' +
      '  cursor:pointer;padding:0 2px;user-select:none}' +
      '.gec-body{padding:14px 16px;display:flex;flex-direction:column;gap:9px}' +
      '.gec-body-2col{padding:14px 16px;display:grid;' +
      '  grid-template-columns:1fr 1fr;column-gap:16px;row-gap:9px}' +
      '.gec-footer{display:flex;align-items:center;justify-content:space-between;' +
      '  gap:12px;padding:11px 16px;border-top:1px solid #F5F5F5;background:#FCFCFD}';
    document.head.appendChild(s);
  }

  // ── EntityCard principale ─────────────────────────────────────────────────
  function GravityEntityCard(props) {
    ensureCSS();

    var title       = props.title || '';
    var badge       = props.badge;
    var badges      = props.badges;
    var showMenu    = props.showMenu || false;
    var image       = props.image;          // { id, placeholder, aspectRatio, heightPx }
    var fields      = props.fields || [];
    var bodyColumns = props.bodyColumns || 1;
    var footer      = props.footer;
    var style       = props.style;
    var className   = props.className;

    // Normalizza badges: badge singolo → array
    var allBadges = badges || (badge ? [badge] : []);

    var headerLeft = h('div', { className: 'gec-header-left' },
      h('span', { className: 'gec-title' }, title),
      allBadges.map(function (b, i) {
        return h(Badge, { key: i, text: b.text, variant: b.variant });
      })
    );

    var header = h('div', { className: 'gec-header' },
      headerLeft,
      showMenu ? h('span', { className: 'gec-menu' }, '⋮') : null
    );

    var imageEl = image
      ? h(ImageArea, {
          id: image.id,
          placeholder: image.placeholder,
          aspectRatio: image.aspectRatio,
          heightPx: image.heightPx,
        })
      : null;

    var bodyClass = bodyColumns === 2 ? 'gec-body-2col' : 'gec-body';
    var body = fields.length
      ? h('div', { className: bodyClass },
          fields.map(function (f, i) {
            return h(FieldRow, {
              key: i,
              icon: f.icon,
              label: f.label,
              value: f.value,
              valueStyle: f.valueStyle,
              valueNode: f.valueNode,
            });
          })
        )
      : null;

    var footerEl = footer
      ? h('div', { className: 'gec-footer' }, footer)
      : null;

    return h('div', { className: 'gec-card' + (className ? ' ' + className : ''), style: style },
      header,
      imageEl,
      body,
      footerEl
    );
  }

  // ── Helper statici esposti sul componente ─────────────────────────────────
  GravityEntityCard.statusDot    = statusDot;
  GravityEntityCard.badgeVariants = BADGE_VARIANTS;

  global.GravityEntityCard = GravityEntityCard;

}(window));
