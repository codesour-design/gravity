// ─────────────────────────────────────────────────────────────
// GravitySectionDrawer / GravityFormArea — drawer con navigazione verticale a
// sezioni (LAYOUT.md §3.9, components/section-drawer.md)
//
// Estratto e componentizzato dal drawer "Nuovo Impianto" di inventory-systems
// (NewImpiantoFullDrawer): sidebar verticale a sinistra con l'elenco delle
// sezioni, area di contenuto scrollabile a destra su sfondo grigio
// (--gravity-bg, lo stesso token dello sfondo pagina), campi raggruppati in
// "aree" (card bianche, GravityFormArea). Da usare per form con troppi campi
// per un pannello Drawer semplice (LAYOUT.md §3.2) — non ricostruire il
// pattern inline per-prototipo.
//
// Uso:
//   <script src="../_shared/section-drawer.js"></script>
//   const { GravitySectionDrawer, GravityFormArea } = window;
//
//   React.createElement(GravitySectionDrawer, {
//     open, title, extra,            // stessi props del Drawer AntD "semplice":
//     dirty, onClose,                // title/extra già costruiti dal chiamante
//                                     // (DiscardCloseIcon/DiscardButton restano
//                                     // locali al prototipo, non condivisi qui)
//     width,                         // default '90%' (styles.wrapper.width, stesso pattern
//                                     // di ConnettiImpiantiDrawer che però usa 70%), non i
//                                     // 640px dei drawer semplici — px o percentuale, passato
//                                     // a styles.wrapper.width
//     navLabel: 'Sezioni',           // facoltativo, default 'Sezioni'
//     activeKey, onActiveKeyChange,  // sezione attiva — controllata dal chiamante
//     sections: [
//       { key, label, title, description, disabled, children },
//       ...
//     ],
//   })
//
//   React.createElement(GravityFormArea, { title, description, extra, children })
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  const CSS = `
    .grav-section-drawer-body { display: flex; height: 100%; }
    .grav-section-drawer-nav {
      width: 220px; flex-shrink: 0; padding: var(--gravity-space-lg, 24px) var(--gravity-space, 16px);
      background: var(--gravity-bg-container, #fff);
      border-right: 1px solid var(--gravity-border-secondary, #F0F0F0);
      overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--gravity-border, #D9D9D9) transparent;
    }
    .grav-section-drawer-nav::-webkit-scrollbar { width: 8px; }
    .grav-section-drawer-nav::-webkit-scrollbar-track { background: transparent; }
    .grav-section-drawer-nav::-webkit-scrollbar-thumb { background: var(--gravity-border, #D9D9D9); border-radius: 4px; }
    .grav-section-drawer-nav-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
      color: var(--gravity-text-disabled, rgba(0,0,0,0.3));
      padding: 0 10px; margin-bottom: 8px;
    }
    .grav-section-drawer-nav-item {
      display: block; padding: 7px 12px; border-radius: var(--gravity-radius, 6px);
      font-size: 13px; color: var(--gravity-text-secondary, rgba(0,0,0,0.65));
      cursor: pointer; margin-bottom: 2px; user-select: none;
      transition: background 0.12s, color 0.12s;
    }
    .grav-section-drawer-nav-item:hover { background: rgba(0,0,0,0.04); color: var(--gravity-text, rgba(0,0,0,0.88)); }
    .grav-section-drawer-nav-item.active {
      background: var(--gravity-primary-bg, #F0EAFF); color: var(--gravity-primary, #3E00FB); font-weight: 500;
    }
    .grav-section-drawer-nav-item.disabled {
      color: var(--gravity-text-disabled, rgba(0,0,0,0.25)); cursor: not-allowed;
    }
    .grav-section-drawer-nav-item.disabled:hover { background: transparent; color: var(--gravity-text-disabled, rgba(0,0,0,0.25)); }
    .grav-section-drawer-scroll {
      flex: 1; min-width: 0; overflow-y: auto; background: var(--gravity-bg, #F5F5F5);
      display: flex; justify-content: center; align-items: flex-start; scroll-behavior: smooth;
      scrollbar-width: thin; scrollbar-color: var(--gravity-border, #D9D9D9) transparent;
    }
    .grav-section-drawer-scroll::-webkit-scrollbar { width: 8px; }
    .grav-section-drawer-scroll::-webkit-scrollbar-track { background: transparent; }
    .grav-section-drawer-scroll::-webkit-scrollbar-thumb { background: var(--gravity-border, #D9D9D9); border-radius: 4px; }
    .grav-section-drawer-scroll::-webkit-scrollbar-thumb:hover { background: var(--gravity-text-disabled, rgba(0,0,0,0.25)); }
    .grav-section-drawer-content { width: 90%; max-width: 960px; padding: var(--gravity-space-xl, 32px) var(--gravity-space-lg, 24px) 96px; }
    .grav-section-drawer-title { font-size: 20px; font-weight: 600; color: var(--gravity-text, rgba(0,0,0,0.88)); margin-bottom: 6px; letter-spacing: -0.01em; }
    .grav-section-drawer-description { font-size: 13px; color: var(--gravity-text-tertiary, rgba(0,0,0,0.45)); line-height: 20px; }
    .grav-form-area {
      background: var(--gravity-bg-container, #fff);
      border: 1px solid var(--gravity-border-oncanvas, #E8E8E8);
      border-radius: var(--gravity-radius-lg, 8px);
      overflow: hidden; margin-bottom: var(--gravity-space, 16px);
    }
    .grav-form-area-header {
      padding: 20px 24px 18px; border-bottom: 1px solid var(--gravity-border-secondary, #F0F0F0);
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
    }
    .grav-form-area-title { font-size: 15px; font-weight: 600; color: var(--gravity-text, rgba(0,0,0,0.88)); margin-bottom: 4px; }
    .grav-form-area-description { font-size: 13px; color: var(--gravity-text-tertiary, rgba(0,0,0,0.45)); line-height: 20px; }
    .grav-form-area-extra { flex-shrink: 0; }
    .grav-form-area-body { padding: 20px 24px 24px; }
  `;
  function ensureStyles() {
    if (document.getElementById('gravity-section-drawer-css')) return;
    const el = document.createElement('style');
    el.id = 'gravity-section-drawer-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  function GravitySectionDrawer(props) {
    ensureStyles();
    const {
      open, title, extra, dirty, onClose, width = '90%', navLabel = 'Sezioni',
      sections, activeKey, onActiveKeyChange,
    } = props;
    const active = sections.find(s => s.key === activeKey) || sections[0];

    // Cambiare sezione riparte dall'inizio dello scroll — senza reset l'utente atterra a metà
    // (o oltre la fine) del contenuto della nuova sezione se aveva scrollato in quella precedente.
    const scrollRef = React.useRef(null);
    React.useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [active.key]);

    return React.createElement(antd.Drawer, {
      title, extra, placement: 'right', destroyOnClose: true,
      closable: false, maskClosable: !dirty, keyboard: !dirty,
      onClose, open,
      styles: { body: { padding: 0 }, wrapper: { width } },
    },
      React.createElement('div', { className: 'grav-section-drawer-body' },
        React.createElement('nav', { className: 'grav-section-drawer-nav' },
          React.createElement('div', { className: 'grav-section-drawer-nav-label' }, navLabel),
          sections.map(s => React.createElement('div', {
            key: s.key,
            className: 'grav-section-drawer-nav-item'
              + (s.key === active.key ? ' active' : '')
              + (s.disabled ? ' disabled' : ''),
            onClick: s.disabled ? undefined : () => onActiveKeyChange(s.key),
          }, s.label)),
        ),
        React.createElement('div', { className: 'grav-section-drawer-scroll', ref: scrollRef },
          React.createElement('div', { className: 'grav-section-drawer-content' },
            (active.title || active.description) && React.createElement('div', { style: { marginBottom: 28 } },
              active.title && React.createElement('div', { className: 'grav-section-drawer-title' }, active.title),
              active.description && React.createElement('div', { className: 'grav-section-drawer-description' }, active.description),
            ),
            active.children,
          ),
        ),
      ),
    );
  }

  function GravityFormArea({ title, description, extra, children }) {
    return React.createElement('div', { className: 'grav-form-area' },
      (title || description || extra) && React.createElement('div', { className: 'grav-form-area-header' },
        React.createElement('div', null,
          title && React.createElement('div', { className: 'grav-form-area-title' }, title),
          description && React.createElement('div', { className: 'grav-form-area-description' }, description),
        ),
        extra && React.createElement('div', { className: 'grav-form-area-extra' }, extra),
      ),
      React.createElement('div', { className: 'grav-form-area-body' }, children),
    );
  }

  window.GravitySectionDrawer = GravitySectionDrawer;
  window.GravityFormArea = GravityFormArea;
})();
