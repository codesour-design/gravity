// ─────────────────────────────────────────────────────────────
// GravityFilterDrawer — drawer "Filtri avanzati" condiviso
//
// Un solo componente per tutti i moduli (Planning, Inventory, …):
// le sezioni si accendono/spengono via prop `sections`, come fa il
// team di sviluppo. UI di riferimento: drawer filtri del Planning.
//
// Uso:
//   <script src="../../filter-drawer.js"></script>
//   React.createElement(window.GravityFilterDrawer, {
//     open, onClose,                  // visibilità
//     onApply, onReset,               // footer (Applica / Azzera tutto)
//     activeCount,                    // badge nel titolo (filtri applicati)
//     sections: ['statoSpazi', 'tipologia', 'numeroFacce', ...],  // voci nel
//                                     // contesto corrente, in ordine di render
//     values:   { statoSpazi: [], tipologia: [], ... },           // stato draft
//     onChange: (key, value) => ...,  // aggiorna il draft
//     options:  { allTypes, typeFormats, allFormats, mediaOwner } // dati contesto
//   })
//
// Semantica valori: [] = nessun filtro (mostra tutto).
// Helper esposto per il filtraggio: window.gravityFaceCountKey(n) → '1'…'6'|'7+'
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // ── CSS (stile drawer Planning — usa i token Gravity) ──────
  const CSS = `
    .gfd-drawer .ant-drawer-body { padding: 0 !important; }
    .filter-section {
      padding: var(--gravity-space-sm, 12px) var(--gravity-space-md, 16px);
      border-bottom: 1px solid var(--gravity-border-secondary, #F0F0F0);
    }
    .filter-section:last-child { border-bottom: none; }
    .filter-section-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--gravity-text-secondary, rgba(0,0,0,0.65));
      margin-bottom: 8px;
    }
    .filter-macro-label {
      font-size: var(--gravity-fs-micro, 10px); font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--gravity-text-disabled, rgba(0,0,0,0.3));
      margin: 8px 0 4px;
    }
    .filter-macro-label:first-child { margin-top: 0; }
    .filter-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: var(--gravity-radius, 6px); border: 1px solid var(--gravity-border, #D9D9D9);
      font-size: var(--gravity-fs-body-sm, 13px); cursor: pointer; margin: 3px;
      background: var(--gravity-bg-container, #fff); color: var(--gravity-text-secondary, rgba(0,0,0,0.65));
      transition: all 0.15s; user-select: none;
    }
    .filter-chip.selected { background: var(--gravity-primary-bg, #F0EAFF); border-color: var(--gravity-primary, #3E00FB); color: var(--gravity-primary, #3E00FB); font-weight: 500; }
    .filter-chip:hover:not(.selected) { border-color: #b0b0b0; color: var(--gravity-text, rgba(0,0,0,0.88)); }
    .gfd-count {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 18px; height: 18px; border-radius: 9px;
      background: var(--gravity-primary, #3E00FB); color: #fff;
      font-size: var(--gravity-fs-micro, 10px); font-weight: 700; padding: 0 5px; line-height: 1;
    }
  `;
  function ensureStyles() {
    if (document.getElementById('gravity-filter-drawer-css')) return;
    const el = document.createElement('style');
    el.id = 'gravity-filter-drawer-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  // ── Costanti di dominio condivise ───────────────────────────
  // Chip "Numero facce": conteggi esatti 1–6, '7+' raccoglie i casi oltre
  const FACE_COUNT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7+'];
  window.gravityFaceCountKey = function (n) { return n >= 7 ? '7+' : String(n); };

  // Stato spazi (disponibilità commerciale — Planning)
  const SPACE_STATES = [
    { key: 'Available',  label: 'Disponibile', color: '#52C41A' },
    { key: 'In Option',  label: 'In Opzione',  color: '#EB2F96' },
    { key: 'Reserved',   label: 'Riservato',   color: '#1677FF' },
  ];
  // Status amministrativi (ciclo di vita impianto — Inventory)
  const ADMIN_STATES = [
    { key: 'Attivo',          label: 'Attivo',          color: '#1677FF' },
    { key: 'In Manutenzione', label: 'In Manutenzione', color: '#FA8C16' },
    { key: 'Inizializzato',   label: 'Inizializzato',   color: '#D48806' },
    { key: 'Rimosso',         label: 'Rimosso',         color: 'rgba(0,0,0,0.45)' },
  ];
  const CHANNELS = [
    { key: 'OOH',  color: '#52C41A' },
    { key: 'DOOH', color: '#EB2F96' },
  ];
  const DEFAULT_MEDIA_OWNER_OPTIONS = [
    { group: 'Gestione diretta', items: ['Proprietario'] },
    { group: 'Concessionarie',   items: ['IGPDecaux', 'Clear Channel', 'Verticals', 'Geonext', 'Pubbliemme', 'Cemusa', 'Neopolis', 'Mediacom', 'Urbanspot'] },
  ];

  // Icone Ant Design per tipologia (lookup case-insensitive: copre le
  // varianti di casing tra prototipi, es. 'Palo Luce' / 'Palo luce')
  const TYPE_ICON_NAMES = {
    'stendardo':        'ColumnHeightOutlined',
    'plancia':          'AppstoreOutlined',
    'poster':           'PictureOutlined',
    'telo':             'PictureOutlined',
    'rotor':            'SyncOutlined',
    'speciale':         'StarOutlined',
    'palina':           'PushpinOutlined',
    'palina butterfly': 'BranchesOutlined',
    'cartello':         'TagOutlined',
    'insegna':          'ShopOutlined',
    'pensilina':        'HomeOutlined',
    'parapedonale':     'CarOutlined',
    'palo luce':        'BulbOutlined',
    'cassonetto':       'InboxOutlined',
    'fioriera':         'HeartOutlined',
    'fermata bus':      'CarOutlined',
    'billboard':        'DesktopOutlined',
    'alux':             'PlayCircleOutlined',
    'totem':            'MobileOutlined',
  };
  function typeIcon(t) {
    const name = TYPE_ICON_NAMES[String(t).toLowerCase()];
    return name && window.icons ? window.icons[name] : null;
  }

  // ── Componente ──────────────────────────────────────────────
  window.GravityFilterDrawer = function GravityFilterDrawer({
    open, onClose, onApply, onReset,
    activeCount = 0,
    sections = [],
    values = {},
    onChange,
    options = {},
  }) {
    ensureStyles();
    const React = window.React;
    const { Drawer, Button, Select, Switch, InputNumber, Tooltip, Typography } = window.antd;
    const e = React.createElement;

    const val = (key) => values[key] || [];
    const toggle = (key, v) => {
      const arr = val(key);
      onChange(key, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    };

    const chip = (key, v, content) => e('span', {
      key: v,
      className: 'filter-chip' + (val(key).includes(v) ? ' selected' : ''),
      onClick: () => toggle(key, v),
    }, content);

    const chipRow = (children) => e('div', { style: { display: 'flex', gap: 0, flexWrap: 'wrap' } }, children);
    const section = (key, label, body) => e('div', { key, className: 'filter-section' },
      e('div', { className: 'filter-section-label' }, label),
      body
    );
    const dot = (color) => e('span', { key: 'dot', style: { width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 } });

    // Formati disponibili in base alle tipologie selezionate nel draft
    const typeFormats = options.typeFormats || {};
    const allFormats  = options.allFormats || [];
    const selTypes    = val('tipologia');
    const availableFormats = React.useMemo(() => {
      if (selTypes.length === 0) return allFormats;
      const s = new Set();
      selTypes.forEach(t => (typeFormats[t] || []).forEach(f => s.add(f)));
      return [...s].sort();
    }, [selTypes, typeFormats, allFormats]);

    // Rimuove dal draft i formati non più disponibili quando cambia la tipologia
    const selFormats = val('formato');
    React.useEffect(() => {
      if (selFormats.length === 0) return;
      const valid = selFormats.filter(f => availableFormats.includes(f));
      if (valid.length !== selFormats.length) onChange('formato', valid);
    }, [availableFormats]);

    // ── Renderer per sezione ──────────────────────────────────
    const RENDERERS = {

      statoSpazi: () => section('statoSpazi', 'Stato spazi',
        chipRow(SPACE_STATES.map(({ key, label, color }) =>
          chip('statoSpazi', key, [dot(color), label])
        ))
      ),

      statiAmm: () => section('statiAmm', 'Status amministrativi',
        chipRow(ADMIN_STATES.map(({ key, label, color }) =>
          chip('statiAmm', key, [dot(color), label])
        ))
      ),

      // Disabilitata — il filtraggio canale è gestito dalle tab esterne ai filtri
      canale: () => e(Tooltip, {
        key: 'canale',
        title: 'Prima di inserire i canali come filtri necessario redesign parco impianti. Attualmente filtraggio canale gestito da tab esterne ai filtri',
        placement: 'left',
      },
        e('div', { className: 'filter-section', style: { cursor: 'not-allowed' } },
          e('div', { className: 'filter-section-label', style: { color: 'rgba(0,0,0,0.25)' } }, 'Canale'),
          e('div', { style: { display: 'flex', gap: 0, flexWrap: 'wrap', pointerEvents: 'none', opacity: 0.45 } },
            CHANNELS.map(({ key, color }) =>
              e('span', { key, className: 'filter-chip' }, dot(color), key)
            )
          )
        )
      ),

      suolo: () => section('suolo', 'Suolo',
        chipRow(['Pubblico', 'Privato'].map(s => chip('suolo', s, s)))
      ),

      mediaOwner: () => section('mediaOwner', 'Media owner',
        e(Select, {
          mode: 'multiple',
          allowClear: true,
          showSearch: true,
          placeholder: 'Cerca o seleziona media owner…',
          value: val('mediaOwner'),
          onChange: v => onChange('mediaOwner', v),
          style: { width: '100%' },
          optionFilterProp: 'label',
          maxTagCount: 'responsive',
          options: (options.mediaOwner || DEFAULT_MEDIA_OWNER_OPTIONS).map(({ group, items }) => ({
            label: e('span', { style: { fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' } }, group),
            options: items.map(v => ({ label: v, value: v })),
          })),
        })
      ),

      // Nota per il team: tooltip promemoria, sezione comunque attiva
      tipologia: () => e(Tooltip, {
        key: 'tipologia',
        title: 'Chiedere icone degli impianti a reparto design',
        placement: 'left',
      },
        section('tipologia', 'Tipologia impianto',
        Object.entries(options.allTypes || {}).map(([macro, tipi]) =>
          e(React.Fragment, { key: macro },
            e('div', { className: 'filter-macro-label' }, macro),
            chipRow(tipi.map(t => {
              const IconComp = typeIcon(t);
              return chip('tipologia', t, [
                IconComp && e(IconComp, { key: 'i', style: { fontSize: 12 } }),
                t,
              ]);
            }))
          )
        ))
      ),

      numeroFacce: () => section('numeroFacce', 'Numero facce',
        chipRow(FACE_COUNT_OPTIONS.map(c => chip('numeroFacce', c, c)))
      ),

      illuminazione: () => section('illuminazione', 'Illuminazione facce',
        chipRow([
          { key: 'Illuminate',      label: 'Illuminato',      iconName: 'BulbOutlined' },
          { key: 'Retroilluminate', label: 'Retroilluminato', iconName: 'BulbFilled' },
          { key: 'Non illuminate',  label: 'Non illuminato',  iconName: null },
        ].map(({ key, label, iconName }) =>
          chip('illuminazione', key, [
            iconName && window.icons && e(window.icons[iconName], { key: 'i', style: { fontSize: 12 } }),
            label,
          ])
        ))
      ),

      // Nota per il team: tooltip promemoria, sezione comunque attiva
      formato: () => e(Tooltip, {
        key: 'formato',
        title: 'Capire insieme a reparto design i formati degli impianti per tipologia',
        placement: 'left',
      },
        section('formato', 'Formato impianto',
          chipRow(availableFormats.map(f => e('span', {
            key: f,
            className: 'filter-chip' + (selFormats.includes(f) ? ' selected' : ''),
            onClick: () => toggle('formato', f),
            style: { fontFamily: 'monospace', fontSize: 12 },
          }, f)))
        )
      ),

      modelloVendita: () => section('modelloVendita', 'Modello di vendita',
        chipRow(['Standard', 'Lungo termine'].map(m => chip('modelloVendita', m, m)))
      ),

      // Disabilitata — presto disponibile
      prezzoMax: () => e(Tooltip, { key: 'prezzoMax', title: 'Presto disponibile', placement: 'left' },
        e('div', { className: 'filter-section', style: { cursor: 'not-allowed' } },
          e('div', { className: 'filter-section-label', style: { color: 'rgba(0,0,0,0.25)' } }, 'Prezzo max per faccia'),
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' } },
            e(Switch, { size: 'small', checked: false, disabled: true, style: { flexShrink: 0 } }),
            e(Typography.Text, { style: { fontSize: 13, color: 'rgba(0,0,0,0.25)' } }, 'Max'),
            e(InputNumber, { value: 300, size: 'small', style: { width: 90 }, disabled: true, formatter: v => `€ ${v}` }),
            e(Typography.Text, { style: { fontSize: 13, color: 'rgba(0,0,0,0.25)' } }, '/ faccia'),
          )
        )
      ),
    };

    return e(Drawer, {
      rootClassName: 'gfd-drawer',
      title: e('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
        'Filtri avanzati',
        activeCount > 0 && e('span', { className: 'gfd-count', style: { marginLeft: 2 } }, activeCount)
      ),
      placement: 'right',
      width: 480,
      styles: { header: { padding: '12px 16px' }, body: { padding: 0 }, footer: { padding: '12px 16px' } },
      open,
      onClose,
      footer: e('div', { style: { display: 'flex', justifyContent: 'space-between' } },
        e(Button, { danger: true, type: 'text', onClick: onReset }, 'Azzera tutto'),
        e(Button, { type: 'primary', onClick: onApply }, 'Applica')
      ),
    },
      sections.map(key => RENDERERS[key] ? RENDERERS[key]() : null)
    );
  };
})();
