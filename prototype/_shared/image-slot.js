/*
 * image-slot.js — Custom element <image-slot>
 * ============================================
 * Web component per gli slot immagine nelle Entity Card e nei popover mappa.
 * Si carica prima di entity-card.js: se presente, ImageArea lo usa
 * al posto del div placeholder.
 *
 * Attributi:
 *   src         : URL immagine (opzionale — se assente mostra placeholder)
 *   placeholder : testo del placeholder  (default "Immagine")
 *   shape       : 'rect' | 'square'  (non influenza il rendering, futuro)
 *   id          : identificatore univoco dello slot
 *
 * Utilizzo:
 *   <script src="../../_shared/image-slot.js"></script>
 *   <image-slot id="imp-001" placeholder="foto impianto"
 *               style="width:100%;height:160px;display:block;"></image-slot>
 *
 * Lo slot lascia la dimensione all'elemento padre (width/height via style o CSS).
 */
;(function () {
  'use strict';

  if (typeof window.customElements === 'undefined') return;
  if (window.customElements.get('image-slot')) return;

  var PLACEHOLDER_SVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">',
    '<rect x="2" y="2" width="20" height="20" rx="2" fill="rgba(0,0,0,0.10)"/>',
    '<path d="M6 16l3.5-4.5 2.5 3 2-2.5L18 16H6z" fill="rgba(0,0,0,0.25)"/>',
    '<circle cx="8.5" cy="8.5" r="1.5" fill="rgba(0,0,0,0.25)"/>',
    '</svg>',
  ].join('');

  var IMAGE_SLOT_CSS = [
    'image-slot{display:block;overflow:hidden;background:#d9d9d9;position:relative}',
    'image-slot img{width:100%;height:100%;object-fit:cover;display:block}',
    'image-slot .is-placeholder{',
    '  width:100%;height:100%;display:flex;flex-direction:column;',
    '  align-items:center;justify-content:center;gap:8px;',
    '  color:rgba(0,0,0,0.35);font-size:12px;',
    '  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;',
    '  user-select:none;pointer-events:none;',
    '}',
  ].join('');

  /* Inject shared stylesheet once */
  if (!document.getElementById('image-slot-css')) {
    var s = document.createElement('style');
    s.id = 'image-slot-css';
    s.textContent = IMAGE_SLOT_CSS;
    document.head.appendChild(s);
  }

  var ImageSlot = /** @class */ (function () {
    function ImageSlot() {
      var _this = HTMLElement.call(this) || this;
      return _this;
    }
    ImageSlot.prototype = Object.create(HTMLElement.prototype);
    ImageSlot.prototype.constructor = ImageSlot;

    ImageSlot.observedAttributes = ['src', 'placeholder'];

    ImageSlot.prototype.connectedCallback = function () { this._render(); };
    ImageSlot.prototype.attributeChangedCallback = function () { this._render(); };

    ImageSlot.prototype._render = function () {
      var src         = this.getAttribute('src');
      var placeholder = this.getAttribute('placeholder') || 'Immagine';

      if (src) {
        this.innerHTML = '<img src="' + src.replace(/"/g, '&quot;') + '" alt="' + placeholder.replace(/"/g, '&quot;') + '">';
      } else {
        this.innerHTML = '<div class="is-placeholder">' + PLACEHOLDER_SVG + '<span>' + placeholder + '</span></div>';
      }
    };

    Object.defineProperty(ImageSlot.prototype, 'src', {
      get: function () { return this.getAttribute('src'); },
      set: function (v) {
        if (v) this.setAttribute('src', v);
        else this.removeAttribute('src');
      },
    });

    return ImageSlot;
  }());

  window.customElements.define('image-slot', ImageSlot);
}());
