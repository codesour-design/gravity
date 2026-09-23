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
 *   title       : string — titolo principale nell'header
 *   badge       : { text, variant, icon? }  (opzionale — badge singolo nell'header)
 *   badges      : [{ text, variant, icon? }]  (opzionale — badge multipli, alternativo a badge)
 *   showMenu    : boolean — mostra ⋮ kebab nell'header  (default false)
 *   image       : { id, placeholder, aspectRatio, heightPx }  (opzionale)
 *   bodyBadges  : [{ text, variant, icon? }]  (opzionale — badge nella sezione Informations)
 *   address     : { primary, secondary }  (opzionale — 2 righe di testo dopo bodyBadges)
 *   fields      : [{ icon, label, value, valueStyle, valueNode }]
 *   bodyColumns : 1 | 2  (default 1)
 *   bodyLayout  : 'vertical' | 'horizontal'  (default 'vertical')
 *                   horizontal → immagine a sinistra, contenuto a destra
 *   footer      : React node — footer libero (backward compat)
 *   footerText  : string — testo a sinistra nel footer strutturato
 *   footerButton: React node — pulsante a destra nel footer strutturato
 *   style       : oggetto CSSProperties aggiuntivo sul wrapper esterno
 *   className   : string aggiuntiva sul wrapper esterno
 *
 * Helper esposti su window.GravityEntityCard:
 *   GravityEntityCard.statusDot(color, label) → node
 *   GravityEntityCard.badgeVariants            — mappa variant → stili CSS
 *
 * Badge variants: default | primary | ooh | dooh | success | warning | error | blue | cyan
 *
 * Utilizza <image-slot> se image-slot.js è caricato prima, altrimenti div placeholder.
 */
;(function (global) {
  'use strict';

  if (global.GravityEntityCard) return;

  var React  = global.React;
  var icons  = global.icons || {};
  var h      = React.createElement;

  // ── Badge variants ────────────────────────────────────────────────────────
  var BADGE_VARIANTS = {
    default : { border: '1px solid #d9d9d9',   color: 'rgba(0,0,0,0.88)', background: '#ffffff' },
    primary : { border: '1px solid #D3C4FF',   color: '#3E00FB',          background: '#F0EBFF' },
    ooh     : { border: '1px solid #B7EB8F',   color: '#389e0d',          background: '#F6FFED' },
    dooh    : { border: '1px solid #FFADD2',   color: '#eb2f96',          background: '#fff0f6' },
    success : { border: '1px solid #B7EB8F',   color: '#389e0d',          background: '#F6FFED' },
    warning : { border: '1px solid #FFE58F',   color: '#d48806',          background: '#FFFBE6' },
    error   : { border: '1px solid #FFA39E',   color: '#cf1322',          background: '#FFF1F0' },
    blue    : { border: '1px solid #91CAFF',   color: '#1677FF',          background: '#E6F4FF' },
    cyan    : { border: '1px solid #87e8de',   color: '#13c2c2',          background: '#e6fffb' },
  };

  var BADGE_BASE = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    padding: '1px 8px',
    borderRadius: '4px',
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontWeight: 400,
  };

  function Badge(props) {
    var variant  = props.variant || 'default';
    var colors   = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
    var style    = Object.assign({}, BADGE_BASE, colors);
    var IconComp = props.icon ? icons[props.icon] : null;
    return h('span', { style: style },
      IconComp ? h(IconComp, { style: { fontSize: '12px', flexShrink: 0 } }) : null,
      props.text
    );
  }

  // ── Status dot ────────────────────────────────────────────────────────────
  function statusDot(color, label) {
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
      h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 } }),
      h('span', { style: { fontWeight: 400, color: 'rgba(0,0,0,0.65)', fontSize: '12px' } }, label)
    );
  }

  // ── Image area ────────────────────────────────────────────────────────────
  function ImageArea(props) {
    var id          = props.id;
    var placeholder = props.placeholder || 'Immagine';
    var heightPx    = props.heightPx || 160;

    var sizeStyle = props.aspectRatio && !props.heightPx
      ? { width: '100%', aspectRatio: props.aspectRatio }
      : { width: '100%', height: heightPx + 'px' };

    if (typeof global.customElements !== 'undefined' && global.customElements.get('image-slot')) {
      return h('image-slot', Object.assign({ id: id, placeholder: placeholder, shape: 'rect' }, { style: Object.assign({ display: 'block', overflow: 'hidden' }, sizeStyle) }));
    }

    var PicIcon = icons.PictureOutlined || icons.FileImageOutlined;
    return h('div', {
      style: Object.assign({
        background: '#d9d9d9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: 'rgba(0,0,0,0.25)',
        fontSize: '12px',
        userSelect: 'none',
        flexShrink: 0,
      }, sizeStyle),
    },
      PicIcon ? h(PicIcon, { style: { fontSize: '22px', opacity: 0.5 } }) : null,
      h('span', null, placeholder)
    );
  }

  // ── Field row ─────────────────────────────────────────────────────────────
  function FieldRow(props) {
    var IconComp = props.icon ? icons[props.icon] : null;
    var iconNode = IconComp
      ? h(IconComp, { style: { fontSize: '14px', color: 'rgba(0,0,0,0.45)', flexShrink: 0, width: '16px', height: '16px' } })
      : null;
    var valueNode = props.valueNode
      || h('span', { style: Object.assign({ fontWeight: 400, color: 'rgba(0,0,0,0.65)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, props.valueStyle) }, props.value);

    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', lineHeight: '20px', height: '20px' } },
      iconNode,
      h('span', { style: { fontWeight: 600, color: 'rgba(0,0,0,0.88)', flexShrink: 0, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, props.label),
      valueNode
    );
  }

  // ── CSS (iniettato una volta sola) ────────────────────────────────────────
  function ensureCSS() {
    if (document.getElementById('gravity-entity-card-css')) return;
    var s = document.createElement('style');
    s.id  = 'gravity-entity-card-css';
    s.textContent = [
      /* Card wrapper */
      '.gec-card{border-radius:8px;border:1px solid #f0f0f0;overflow:hidden;background:#fff;display:flex;flex-direction:column;align-items:flex-start;width:320px;box-sizing:border-box}',
      /* Header */
      '.gec-header{display:flex;gap:8px;align-items:center;padding:8px 12px;width:100%;box-sizing:border-box;border-bottom:1px solid #f0f0f0}',
      '.gec-header-title-row{display:flex;flex:1;gap:8px;align-items:center;min-width:0;overflow:hidden}',
      '.gec-title{font-size:16px;font-weight:600;line-height:24px;color:rgba(0,0,0,0.88);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1;min-width:0}',
      '.gec-menu{font-size:16px;color:rgba(0,0,0,0.45);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px}',
      '.gec-menu:hover{background:rgba(0,0,0,0.04);color:rgba(0,0,0,0.65)}',
      /* Informations — vertical */
      '.gec-informations{display:flex;flex-direction:column;gap:12px;padding:12px;width:100%;box-sizing:border-box;flex:1}',
      /* Informations — horizontal (image + content side by side) */
      '.gec-informations--h{display:flex;flex-direction:row;gap:0;width:100%;box-sizing:border-box;flex:1}',
      '.gec-img-col{width:220px;flex-shrink:0;align-self:flex-start;border-right:1px solid #f0f0f0;overflow:hidden}',
      '.gec-info-content{display:flex;flex-direction:column;gap:12px;padding:12px;flex:1;min-width:0}',
      /* Body badges row */
      '.gec-body-badges{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
      /* Address block */
      '.gec-address{display:flex;flex-direction:column;font-size:12px;line-height:20px;font-weight:400}',
      '.gec-address-primary{color:rgba(0,0,0,0.65)}',
      '.gec-address-secondary{color:rgba(0,0,0,0.45);font-size:12px}',
      /* Divider */
      '.gec-divider{height:1px;background:#f0f0f0;width:100%;flex-shrink:0}',
      /* Fields */
      '.gec-fields{display:flex;flex-direction:column;gap:12px}',
      '.gec-fields--2col{display:grid;grid-template-columns:1fr 1fr;column-gap:16px;row-gap:9px}',
      /* Footer */
      '.gec-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-top:1px solid #f0f0f0;width:100%;box-sizing:border-box}',
      '.gec-footer-text{font-size:16px;font-weight:600;line-height:24px;color:rgba(0,0,0,0.88);white-space:nowrap;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── Main component ────────────────────────────────────────────────────────
  function GravityEntityCard(props) {
    ensureCSS();

    var title        = props.title       || '';
    var badge        = props.badge;
    var badges       = props.badges;
    var showMenu     = props.showMenu    || false;
    var image        = props.image;
    var bodyBadges   = props.bodyBadges  || [];
    var address      = props.address;
    var fields       = props.fields      || [];
    var bodyColumns  = props.bodyColumns || 1;
    var bodyLayout   = props.bodyLayout  || 'vertical';
    var footer       = props.footer;
    var footerText   = props.footerText;
    var footerButton = props.footerButton;
    var style        = props.style;
    var className    = props.className;

    var isHorizontal = bodyLayout === 'horizontal';

    // Header badges
    var allHeaderBadges = badges || (badge ? [badge] : []);

    // ── Header ──
    var EllipsisIcon = icons.EllipsisOutlined;
    var header = h('div', { className: 'gec-header' },
      h('div', { className: 'gec-header-title-row' },
        h('span', { className: 'gec-title' }, title),
        allHeaderBadges.map(function (b, i) {
          return h(Badge, { key: i, text: b.text, variant: b.variant, icon: b.icon });
        })
      ),
      showMenu
        ? h('div', { className: 'gec-menu' },
            EllipsisIcon ? h(EllipsisIcon) : h('span', null, '⋮')
          )
        : null
    );

    // ── Image ──
    var imageEl = image
      ? h(ImageArea, {
          id:          image.id,
          placeholder: image.placeholder,
          aspectRatio: image.aspectRatio,
          heightPx:    image.heightPx,
        })
      : null;

    // ── Informations content ──
    var hasBodyContent = bodyBadges.length > 0 || address || fields.length > 0;

    var bodyBadgesEl = bodyBadges.length
      ? h('div', { className: 'gec-body-badges' },
          bodyBadges.map(function (b, i) {
            return h(Badge, { key: i, text: b.text, variant: b.variant, icon: b.icon });
          })
        )
      : null;

    var addressEl = address
      ? h('div', { className: 'gec-address' },
          address.primary   ? h('span', { className: 'gec-address-primary' },   address.primary)   : null,
          address.secondary ? h('span', { className: 'gec-address-secondary' }, address.secondary) : null
        )
      : null;

    var fieldsEl = fields.length
      ? h('div', { className: bodyColumns === 2 ? 'gec-fields--2col' : 'gec-fields' },
          fields.map(function (f, i) {
            return h(FieldRow, {
              key:       i,
              icon:      f.icon,
              label:     f.label,
              value:     f.value,
              valueStyle: f.valueStyle,
              valueNode: f.valueNode,
            });
          })
        )
      : null;

    var needsDivider = address && fields.length > 0;

    var infoContent = h('div', { className: 'gec-info-content' },
      bodyBadgesEl,
      addressEl,
      needsDivider ? h('div', { className: 'gec-divider' }) : null,
      fieldsEl
    );

    // ── Body section ──
    var bodySection = null;
    if (isHorizontal) {
      // Image LEFT (220px, 16:9) + content RIGHT (flex:1, height libera)
      bodySection = h('div', { className: 'gec-informations--h' },
        image
          ? h('div', { className: 'gec-img-col' },
              h(ImageArea, { id: image.id, placeholder: image.placeholder, aspectRatio: '16/9' })
            )
          : null,
        hasBodyContent ? infoContent : null
      );
    } else {
      // Vertical: image above content
      bodySection = h('div', { className: 'gec-informations' },
        imageEl,
        hasBodyContent ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' } },
          bodyBadgesEl,
          addressEl,
          needsDivider ? h('div', { className: 'gec-divider' }) : null,
          fieldsEl
        ) : null
      );
    }

    // ── Footer ──
    var footerEl = null;
    if (footer) {
      footerEl = h('div', { className: 'gec-footer' }, footer);
    } else if (footerText || footerButton) {
      footerEl = h('div', { className: 'gec-footer' },
        footerText   ? h('span', { className: 'gec-footer-text' }, footerText) : null,
        footerButton || null
      );
    }

    var cardStyle = Object.assign({}, style);
    if (isHorizontal) {
      cardStyle.width = cardStyle.width || 'auto';
    }

    return h('div', { className: 'gec-card' + (className ? ' ' + className : ''), style: cardStyle },
      header,
      bodySection,
      footerEl
    );
  }

  GravityEntityCard.statusDot    = statusDot;
  GravityEntityCard.badgeVariants = BADGE_VARIANTS;

  global.GravityEntityCard = GravityEntityCard;

}(window));
