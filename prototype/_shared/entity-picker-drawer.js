// ─────────────────────────────────────────────────────────────
// GravityEntityPickerDrawer — drawer di selezione entità: intestazione + ricerca + filtri
// a cascata + griglia di card selezionabili + paginazione (components/entity-picker-drawer.md)
//
// Estratto dal drawer "Seleziona impianto" di inventory-licenses. Il componente possiede
// layout, spacing e intestazione (le regole del design system); il chiamante possiede i dati,
// lo stato dei filtri e il contenuto delle card. Non ricostruire il pattern inline.
//
// Uso:
//   <script src="../_shared/entity-picker-drawer.js"></script>   (dopo entity-card.js)
//
//   React.createElement(window.GravityEntityPickerDrawer, {
//     open, onClose, dirty,
//     title,                 // nodo già costruito dal chiamante (DiscardCloseIcon + testo,
//     cancelAction,          // "Annulla" con Popconfirm): restano locali al prototipo
//     width,                 // default 1080 (3 card da ~320px) — vedi doc per altre colonne
//     confirmText, confirmIcon, confirmDisabled, onConfirm,     // default 'Seleziona' + Plus
//     heading: { title, description },       // intestazione: azione + vincoli, non il titolo drawer
//     search:  { value, onChange, placeholder },
//     filters: [{ key, value, onChange, options, placeholder, width }],  // ordine = cascata
//     sort:    { label, icon, onToggle },     // facoltativo, toggle sul conteggio
//     total,                                  // n. risultati (dopo filtri)
//     items,                                  // SOLO la pagina corrente
//     getKey, selectedKeys, onToggle, renderCard,   // renderCard(item, selected) → card
//     columns,                                // default 3
//     pagination: { current, pageSize, onChange },
//     emptyText, countLabel,                  // countLabel(n) → "N impianti trovati" (default generico)
//   })
//
//   Helper filtri a cascata (statici):
//   GravityEntityPickerDrawer.facetItems(items, filters, key)
//     → elementi compatibili con TUTTI gli altri filtri attivi (per calcolare le opzioni di `key`)
//   GravityEntityPickerDrawer.cascade(items, filters, changedKey, value, autofillKeys)
//     → nuovo oggetto filtri: azzera i filtri incompatibili con la nuova scelta e autocompila
//       (solo `autofillKeys`) quelli che restano con un unico valore possibile
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  function tk() {
    return (window.GRAVITY_THEME && window.GRAVITY_THEME.token) || {};
  }

  // Filtri a cascata --------------------------------------------------------
  function facetItems(items, filters, key) {
    return items.filter(function (s) {
      return Object.keys(filters).every(function (k) { return k === key || !filters[k] || s[k] === filters[k]; });
    });
  }

  function cascade(items, filters, changedKey, value, autofillKeys) {
    var next = Object.assign({}, filters);
    next[changedKey] = value || null;
    // 1. azzera i filtri già impostati che non hanno più risultati con la nuova scelta
    Object.keys(next).filter(function (k) { return k !== changedKey && next[k]; }).forEach(function (k) {
      var ok = items.some(function (s) { return s[changedKey] === next[changedKey] && s[k] === next[k]; });
      if (next[changedKey] && !ok) next[k] = null;
    });
    // 2. autocompila i filtri vuoti che restano con un solo valore possibile
    if (next[changedKey]) {
      var pool = items.filter(function (s) {
        return Object.keys(next).every(function (k) { return !next[k] || s[k] === next[k]; });
      });
      (autofillKeys || []).filter(function (k) { return k !== changedKey && !next[k]; }).forEach(function (k) {
        var vals = Array.from(new Set(pool.map(function (s) { return s[k]; })));
        if (vals.length === 1) next[k] = vals[0];
      });
    }
    return next;
  }

  // Componente ---------------------------------------------------------------
  function GravityEntityPickerDrawer(props) {
    var h = React.createElement;
    var a = window.antd;
    var icons = window.icons || {};
    var token = tk();
    var primary = token.colorPrimary || '#3E00FB';
    // Scala spaziatura (components/entity-picker-drawer.md): 4 dentro un gruppo, 12 tra
    // controlli affini, 16 tra card e prima della griglia, 20 tra blocchi, 24 = padding drawer.
    var S = { xxs: 4, sm: 12, md: 16, lg: 20, xl: 24 };

    var columns = props.columns || 3;
    var pag = props.pagination;
    var selected = props.selectedKeys || [];
    var items = props.items || [];
    var heading = props.heading || {};
    var Plus = icons.PlusOutlined;
    var Search = icons.SearchOutlined;

    var filterControls = (props.filters || []).map(function (f) {
      return h(a.Select, {
        key: f.key, value: f.value, allowClear: true, placeholder: f.placeholder,
        style: { width: f.width || 160 }, options: f.options, onChange: f.onChange,
      });
    });

    return h(a.Drawer, {
      title: props.title, placement: 'right', width: props.width || 1080, closable: false,
      rootClassName: props.rootClassName, destroyOnClose: true,
      maskClosable: !props.dirty, keyboard: !props.dirty,
      onClose: props.onClose, open: props.open,
      styles: { body: { padding: S.xl } },
      extra: h(a.Space, null,
        props.cancelAction,
        h(a.Button, {
          type: 'primary', icon: props.confirmIcon || (Plus ? h(Plus) : null),
          onClick: props.onConfirm, disabled: props.confirmDisabled,
        }, props.confirmText || 'Seleziona'),
      ),
    },
      // Intestazione: titolo (azione) + descrizione (come cercare + vincoli)
      (heading.title || heading.description) && h('div', {
        style: { marginBottom: S.lg, display: 'flex', flexDirection: 'column', gap: S.xxs },
      },
        heading.title && h(a.Typography.Title, { level: 4, style: { margin: 0 } }, heading.title),
        heading.description && h(a.Typography.Text, { type: 'secondary' }, heading.description),
      ),
      // Ricerca + filtri: sempre una sola riga
      h('div', { style: { display: 'flex', gap: S.sm, marginBottom: S.lg } },
        props.search && h(a.Input, {
          value: props.search.value, onChange: props.search.onChange,
          placeholder: props.search.placeholder, allowClear: true,
          prefix: Search ? h(Search) : null, style: { flex: 1, minWidth: 0 },
        }),
        filterControls,
      ),
      // Conteggio + ordinamento
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.md } },
        h('span', { style: { fontSize: 13, color: 'rgba(0,0,0,0.45)' } },
          props.countLabel
            ? props.countLabel(props.total || 0)
            : ((props.total || 0) === 1 ? '1 elemento trovato' : (props.total || 0) + ' elementi trovati')),
        props.sort && h(a.Button, {
          type: 'text', size: 'small', icon: props.sort.icon, onClick: props.sort.onToggle,
        }, props.sort.label),
      ),
      // Griglia / stato vuoto
      items.length === 0
        ? h(a.Empty, {
            description: props.emptyText || 'Nessun risultato. Modifica la ricerca o i filtri.',
            image: a.Empty.PRESENTED_IMAGE_SIMPLE, style: { margin: S.xl + 'px 0' },
          })
        : h(React.Fragment, null,
            h(a.Row, { gutter: [S.md, S.md], style: { marginBottom: S.lg } },
              items.map(function (item) {
                var key = props.getKey(item);
                var sel = selected.indexOf(key) !== -1;
                return h(a.Col, { key: key, span: 24 / columns },
                  h('div', {
                    onClick: function () { props.onToggle(key); },
                    style: {
                      cursor: 'pointer', borderRadius: 8, outlineOffset: 1, height: '100%',
                      outline: '2px solid ' + (sel ? primary : 'transparent'),
                    },
                  }, props.renderCard(item, sel)),
                );
              }),
            ),
            pag && (props.total || 0) > pag.pageSize && h('div', { style: { display: 'flex', justifyContent: 'flex-end' } },
              h(a.Pagination, {
                simple: true, showSizeChanger: false, current: pag.current, pageSize: pag.pageSize,
                total: props.total, onChange: pag.onChange,
              }),
            ),
          ),
    );
  }

  GravityEntityPickerDrawer.facetItems = facetItems;
  GravityEntityPickerDrawer.cascade = cascade;
  window.GravityEntityPickerDrawer = GravityEntityPickerDrawer;
})();
