/*
 * map-popover.js — Popover/card condiviso della mappa Gravity
 * ===========================================================
 * Guscio unico usato da inventory-systems e planning per il popover che appare
 * al CLICK su un marker. Basato sulla ss-focus-card del planning.
 *
 * Filosofia: il GUSCIO (chrome: contenitore, animazione, close, titolo,
 * sottotitolo, azione) è condiviso; il CONTENUTO (righe info) e la POSIZIONE
 * restano per-app, passati come props.
 *
 * Espone window.GravityMapPopover (componente React via React.createElement).
 * Richiede React, @ant-design/icons (globals) e tokens.js (CSS variables).
 *
 * Props:
 *   position : { x, y } in px relativi al contenitore mappa, oppure null
 *              (fallback in basso al centro). L'ancoraggio è sopra il marker.
 *   onClose  : () => void
 *   title    : string | node
 *   subtitle : string | node
 *   action   : { label, onClick, danger? }  (opzionale)
 *   children : righe info (nodi React) — costruite da ogni app
 */
;(function (global) {
  'use strict';
  var React = global.React;

  function ensureStyle() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('gravity-map-popover-css')) return;
    var css =
      '.gmp-card{position:absolute;background:var(--gravity-bg-container,#fff);' +
      'border-radius:var(--gravity-radius-xl,12px);' +
      'box-shadow:0 8px 32px rgba(62,0,251,0.18),0 2px 8px rgba(0,0,0,0.10);' +
      'border:1.5px solid rgba(62,0,251,0.15);z-index:500;padding:12px 14px;' +
      'min-width:260px;max-width:320px;display:flex;flex-direction:column;gap:6px;' +
      "pointer-events:all;animation:gmp-in .15s ease;" +
      "font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;}" +
      '@keyframes gmp-in{from{opacity:0;transform:translate(-50%,calc(-100% + 6px));}' +
      'to{opacity:1;transform:translate(-50%,-100%);}}' +
      '.gmp-close{position:absolute;top:8px;right:8px;width:20px;height:20px;' +
      'border-radius:50%;border:none;background:transparent;cursor:pointer;display:flex;' +
      'align-items:center;justify-content:center;color:rgba(0,0,0,0.35);font-size:12px;' +
      'transition:background .1s;}' +
      '.gmp-close:hover{background:#f0f0f0;color:rgba(0,0,0,0.7);}' +
      '.gmp-title{font-size:14px;font-weight:600;color:rgba(0,0,0,0.88);padding-right:20px;line-height:1.3;}' +
      '.gmp-sub{font-size:12px;color:rgba(0,0,0,0.45);line-height:1.4;}' +
      '.gmp-row{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(0,0,0,0.65);}' +
      '.gmp-row svg{flex-shrink:0;}' +
      '.gmp-action{margin-top:4px;border:none;border-radius:6px;padding:6px 0;background:#3E00FB;' +
      'color:#fff;font-size:12px;font-weight:600;cursor:pointer;width:100%;font-family:inherit;transition:all .1s;}' +
      '.gmp-action-danger{background:#FFF0F0;color:#FF4D4F;}' +
      '.gmp-action-default{background:#fff;color:rgba(0,0,0,0.88);border:1px solid #d9d9d9;}' +
      '.gmp-action-default:hover{color:#3E00FB;border-color:#3E00FB;}';
    var el = document.createElement('style');
    el.id = 'gravity-map-popover-css';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function MapPopover(props) {
    var icons = global.icons || {};
    ensureStyle();

    var pos = props.position;
    var style = pos
      ? { left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)' }
      : { left: '50%', bottom: 24, transform: 'translateX(-50%)' };

    var children = [];
    children.push(React.createElement('button', {
      key: '_close', className: 'gmp-close',
      onClick: function (e) { e.stopPropagation(); if (props.onClose) props.onClose(); },
    }, icons.CloseOutlined ? React.createElement(icons.CloseOutlined) : '×'));

    if (props.title != null) {
      children.push(React.createElement('div', { key: '_title', className: 'gmp-title' }, props.title));
    }
    if (props.subtitle != null) {
      children.push(React.createElement('div', { key: '_sub', className: 'gmp-sub' }, props.subtitle));
    }

    // Righe info (children) costruite dall'app chiamante
    React.Children.toArray(props.children).forEach(function (child, i) {
      children.push(child);
    });

    if (props.action) {
      children.push(React.createElement('button', {
        key: '_action',
        className: 'gmp-action'
          + (props.action.danger ? ' gmp-action-danger' : '')
          + (props.action.variant === 'default' ? ' gmp-action-default' : ''),
        onClick: function (e) { e.stopPropagation(); if (props.action.onClick) props.action.onClick(); },
      }, props.action.label));
    }

    return React.createElement('div', {
      className: 'gmp-card', style: style,
      onClick: function (e) { e.stopPropagation(); },
    }, children);
  }

  // Helper per costruire una riga standard (icona + label + valore a destra)
  MapPopover.Row = function (opts) {
    var icons = global.icons || {};
    opts = opts || {};
    var kids = [];
    if (opts.icon && icons[opts.icon]) {
      kids.push(React.createElement(icons[opts.icon], {
        key: 'i', style: { fontSize: 11, color: 'rgba(0,0,0,0.4)' },
      }));
    }
    kids.push(React.createElement('span', { key: 'l' }, opts.label));
    if (opts.right != null) {
      kids.push(React.createElement('span', {
        key: 'r', style: { marginLeft: 'auto', fontWeight: 600 },
      }, opts.right));
    }
    return React.createElement('div', {
      key: opts.key,
      className: 'gmp-row',
      style: opts.divider ? { borderTop: '1px solid #f0f0f0', paddingTop: 6, marginTop: 2 } : null,
    }, kids);
  };

  global.GravityMapPopover = MapPopover;
})(window);
