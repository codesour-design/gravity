/**
 * Gravity Prototype Navbar
 * Componente condiviso — caricarlo dopo React, ReactDOM, antd, @ant-design/icons e tokens.js
 *
 * Utilizzo in ogni prototipo:
 *   1. Prima del tag <script> del prototipo:
 *        window.GRAVITY_NAV = { section: 'Inventory', item: 'Systems' };
 *   2. Caricare questo file:
 *        <script src="../navbar.js"></script>
 *   3. Nel render, usare: React.createElement(window.GravityNavbar, null)
 *
 * Sezioni e voci disponibili (dal DS Figma):
 *   Overview   → Per te | Dashboard finance | Dashboard analytics   (sempre presente per ogni ruolo)
 *   Inventory  → Systems | Licenses | Supplier
 *   Commercial → Wallet | Activities | Negotiations | Orders
 *   Delivery   → Campaigns | Plannings
 *   Settings   → Users | Tenants
 */
(function () {
  if (window.GravityNavbar) return;

  var h          = React.createElement;
  var useState   = React.useState;
  var useEffect  = React.useEffect;
  var Fragment   = React.Fragment;

  // ── Dati ruoli (source of truth: Figma node 48-1331) ──────────────────────

  var ROLES = [
    'Tenant Admin',
    'Inventory Manager',
    'Operation Manager',
    'Planner',
    'Sales',
  ];

  var ROLE_NAV = {
    'Tenant Admin':      ['Overview', 'Inventory', 'Commercial', 'Delivery', 'Settings'],
    'Inventory Manager': ['Overview', 'Inventory'],
    'Operation Manager': ['Overview', 'Inventory', 'Commercial', 'Delivery'],
    'Planner':           ['Overview', 'Inventory', 'Delivery'],
    'Sales':             ['Commercial', 'Delivery'],
  };

  // Voci di navigazione e link ai prototipi (Figma node 3261-3147)
  var NAV = {
    Overview:   { items: ['Per te', 'Dashboard finance', 'Dashboard analytics'], links: {} },
    Inventory:  { items: ['Systems', 'Licenses', 'Supplier'],
                  links: { Systems: '../prototipo%20approvato/inventory-systems/index.html' } },
    Commercial: { items: ['Wallet', 'Activities', 'Negotiations', 'Orders'],
                  links: { Negotiations: '../test/trattative/index.html' } },
    Delivery:   { items: ['Campaigns', 'Plannings', 'Collections'],
                  links: { Plannings: '../prototipo%20approvato/planning/index--handoff.html', Collections: '../prototipo%20approvato/poi-collections/index.html' } },
    Settings:   { items: ['Users', 'Tenants'], links: {} },
  };

  // Label italiani per il display (le chiavi restano in inglese per window.GRAVITY_NAV)
  var SECTION_LABEL = {
    Overview:   'Panoramica',
    Inventory:  'Inventario',
    Commercial: 'Commerciale',
    Delivery:   'Espletamento',
    Settings:   'Impostazioni',
  };

  var ITEM_LABEL = {
    'Per te':              'Per te',
    'Dashboard finance':   'Dashboard Finance',
    'Dashboard analytics': 'Dashboard Analytics',
    'Systems':             'Impianti',
    'Licenses':            'Permessi',
    'Supplier':            'Fornitori',
    'Wallet':              'Portafoglio',
    'Activities':          'Attività',
    'Negotiations':        'Trattative',
    'Orders':              'Ordini',
    'Campaigns':           'Campagne',
    'Plannings':           'Pianificazioni',
    'Collections':         'Collezioni POI',
    'Users':               'Utenti',
    'Tenants':             'Tenant',
  };

  var ROLE_USER = {
    'Tenant Admin':      { nome: 'Sofia',   cognome: 'Marchetti' },
    'Inventory Manager': { nome: 'Tommaso', cognome: 'Ferrara'   },
    'Operation Manager': { nome: 'Davide',  cognome: 'Serra'     },
    'Planner':           { nome: 'Giulia',  cognome: 'Romano'    },
    'Sales':             { nome: 'Lorenzo', cognome: 'Bianchi'   },
  };

  var AVATAR_PALETTE = [
    { bg: '#F0EAFF', fg: '#3E00FB' },
    { bg: '#E6F7FF', fg: '#0958D9' },
    { bg: '#FFF7E6', fg: '#D46B08' },
    { bg: '#F6FFED', fg: '#389E0D' },
    { bg: '#FFF1F0', fg: '#CF1322' },
    { bg: '#E8F5E9', fg: '#2E7D32' },
  ];

  function nameColor(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
  }

  // ── CSS injection (override altezza antd Menu horizontal) ─────────────────

  var _style = document.createElement('style');
  _style.textContent = [
    '.gv-nav-menu.ant-menu-horizontal{border-bottom:none!important;height:64px!important;line-height:64px!important;}',
    '.gv-nav-menu.ant-menu-horizontal>.ant-menu-item,',
    '.gv-nav-menu.ant-menu-horizontal>.ant-menu-submenu{height:64px!important;line-height:64px!important;top:0!important;}',
    '.gv-nav-menu.ant-menu-horizontal>.ant-menu-item::after,',
    '.gv-nav-menu.ant-menu-horizontal>.ant-menu-submenu::after{bottom:0!important;border-bottom-width:2px!important;}',
    '.gv-nav-menu.ant-menu-horizontal>.ant-menu-overflow{height:64px;}',
  ].join('');
  document.head.appendChild(_style);

  // ── Notifiche mock per ruolo Sales ────────────────────────────────────────
  var NOTIFICHE_SALES = [
    { id: 1, da: 'Sofia Marchetti', trattativa: 'Digital OOH aeroporti estate 2026 — 3 schermi nazionali',          tempo: '2 ore fa',    letta: false },
    { id: 2, da: 'Davide Serra',    trattativa: 'Campagna lancio prodotto primavera — OOH Milano e Roma',            tempo: 'Ieri',        letta: false },
    { id: 3, da: 'Sofia Marchetti', trattativa: 'Rebranding istituzionale — piano awareness Q3/Q4 2026',             tempo: '3 giorni fa', letta: false },
  ];

  // ── NotifichePannel ────────────────────────────────────────────────────────
  function NotifichePanel({ notifiche, onLeggiTutte }) {
    var palette = nameColor;
    return h('div', {
      style: {
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        width: 340,
        overflow: 'hidden',
      },
    },
      // Header
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        },
      },
        h('span', { style: { fontWeight: 600, fontSize: 14, color: 'rgba(0,0,0,0.88)' } }, 'Notifiche'),
        h('span', {
          style: { fontSize: 12, color: '#3E00FB', cursor: 'pointer' },
          onClick: onLeggiTutte,
        }, 'Segna tutte come lette')
      ),
      // Lista
      notifiche.map(function (n) {
        var col = nameColor(n.da);
        var initials = n.da.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
        return h('div', {
          key: n.id,
          style: {
            display: 'flex', gap: 10, padding: '12px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            background: n.letta ? 'transparent' : 'rgba(62,0,251,0.03)',
          },
        },
          // Avatar assegnante
          h('div', {
            style: {
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: col.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: col.fg,
            },
          }, initials),
          // Testo
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('div', { style: { fontSize: 13, color: 'rgba(0,0,0,0.88)', lineHeight: 1.5 } },
              h('span', { style: { fontWeight: 600 } }, n.da),
              ' ti ha assegnato una trattativa'
            ),
            h('div', {
              style: {
                fontSize: 12, color: 'rgba(0,0,0,0.55)', marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              },
            }, n.trattativa),
            h('div', { style: { fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 4 } }, n.tempo)
          ),
          // Pallino non letta
          !n.letta && h('div', {
            style: {
              width: 7, height: 7, borderRadius: '50%',
              background: '#3E00FB', flexShrink: 0, marginTop: 5,
            },
          })
        );
      })
    );
  }

  // ── Componente ────────────────────────────────────────────────────────────

  function GravityNavbar() {
    var cfg           = window.GRAVITY_NAV || {};
    var activeSection = cfg.section  || null;
    var activeItem    = cfg.item     || null;
    var logoSrc       = cfg.logoSrc  || '../../brand/Gravity_type.svg';
    var appHref       = cfg.appHref  || '../test/user%20profile/index.html';
    var cfgLinks      = cfg.links    || {};

    var _r1     = useState(function () { return localStorage.getItem('gravity_proto_role') || null; });
    var role    = _r1[0]; var setRole = _r1[1];

    var isSales  = (role || 'Tenant Admin') === 'Sales';
    var _r2      = useState(NOTIFICHE_SALES);
    var notifiche = _r2[0]; var setNotifiche = _r2[1];
    var _r3      = useState(false);
    var bellOpen  = _r3[0]; var setBellOpen = _r3[1];

    var nonLette = isSales ? notifiche.filter(function (n) { return !n.letta; }).length : 0;

    function handleLeggiTutte() {
      setNotifiche(notifiche.map(function (n) { return Object.assign({}, n, { letta: true }); }));
    }
    function handleBellOpen(open) {
      setBellOpen(open);
      if (open && isSales) {
        // segna come lette all'apertura
        setNotifiche(notifiche.map(function (n) { return Object.assign({}, n, { letta: true }); }));
      }
    }

    useEffect(function () { if (role) localStorage.setItem('gravity_proto_role', role); }, [role]);

    var cur      = role || 'Tenant Admin';
    var user     = ROLE_USER[cur] || { nome: 'U', cognome: '' };
    var abbr     = (user.nome[0] + (user.cognome[0] || '')).toUpperCase();
    var palette  = nameColor(user.nome + ' ' + user.cognome);
    // "Panoramica" (con "Per te") è l'area personale: sempre disponibile per ogni
    // ruolo, anche dove ROLE_NAV non la elenca (es. Sales). La forziamo come prima sezione.
    var roleSections = ROLE_NAV[cur] || [];
    var sections = ['Overview'].concat(roleSections.filter(function (s) { return s !== 'Overview'; }));

    // Voci Menu antd
    var menuItems = sections.map(function (sec) {
      var conf = NAV[sec];
      return {
        key: sec,
        label: SECTION_LABEL[sec] || sec,
        children: conf.items.map(function (item) {
          var link   = cfgLinks[item] !== undefined ? cfgLinks[item] : conf.links[item];
          // "Per te" punta sempre alla pagina profilo (percorso relativo per-pagina via appHref)
          if (item === 'Per te') link = appHref;
          var isAct  = item === activeItem;
          var lbl    = ITEM_LABEL[item] || item;
          return {
            key: sec + '/' + item,
            label: link
              ? h('a', { href: link, style: { color: isAct ? '#3e00fb' : undefined } }, lbl)
              : h('span', { style: { color: 'rgba(0,0,0,0.25)', cursor: 'default' } }, lbl),
          };
        }),
      };
    });

    var selectedKeys = [];
    if (activeSection && activeItem) selectedKeys = [activeSection + '/' + activeItem];
    else if (activeSection)          selectedKeys = [activeSection];

    // La sezione corrente è accessibile per il ruolo attivo?
    var accessible = !activeSection || sections.indexOf(activeSection) !== -1;

    // Dropdown avatar — cambio ruolo
    var avatarMenuItems = [
      { key: '_user', disabled: true, label: h('div', { style: { padding: '4px 0 8px', minWidth: 220 } },
          h('div', { style: { fontWeight: 600, fontSize: 14, color: 'rgba(0,0,0,0.88)', lineHeight: '22px' } },
            user.nome + ' ' + user.cognome
          ),
          h('div', { style: { fontSize: 12, color: 'rgba(0,0,0,0.45)', lineHeight: '20px' } }, cur)
        )
      },
      { type: 'divider' },
      { key: '_hd', label: h('span', { style: { fontSize: 11, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Vista ruolo'), disabled: true },
    ].concat(ROLES.map(function (r) {
      return {
        key: r,
        label: h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, minWidth: 200 } },
          h('span', { style: { fontWeight: r === cur ? 600 : 400 } }, r),
          r === cur ? h(icons.CheckOutlined, { style: { color: '#3e00fb', fontSize: 12 } }) : null
        ),
        onClick: function () { setRole(r); },
      };
    }));

    return h(Fragment, null,

      // ── Navbar ────────────────────────────────────────────────────────────
      h('nav', {
        id: 'gravity-navbar',
        style: {
          background: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        },
      },

        // Sinistra: logo + menu
        h('div', { style: { display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, minWidth: 0 } },
          h('a', {
            href: appHref,
            style: {
              padding: '0 24px', display: 'flex', alignItems: 'center',
              textDecoration: 'none', flexShrink: 0,
            },
          },
            h('img', {
              src: logoSrc,
              alt: 'Gravity',
              style: { height: 26 },
              onError: function (e) { e.target.style.display = 'none'; },
            })
          ),
          h(antd.Menu, {
            mode: 'horizontal',
            selectedKeys: selectedKeys,
            items: menuItems,
            className: 'gv-nav-menu',
            style: { border: 'none', flex: 1, minWidth: 0 },
          })
        ),

        // Destra: campana + avatar
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', flexShrink: 0 } },

          h('span', { id: 'gravity-bell-btn' },
          h(antd.Dropdown, {
            open: bellOpen,
            onOpenChange: handleBellOpen,
            trigger: ['click'],
            placement: 'bottomRight',
            dropdownRender: function () {
              return isSales
                ? h(NotifichePanel, { notifiche: notifiche, onLeggiTutte: handleLeggiTutte })
                : h('div', {
                    style: {
                      background: '#fff', borderRadius: 8, padding: '24px 32px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                      color: 'rgba(0,0,0,0.35)', fontSize: 13, textAlign: 'center',
                    },
                  }, 'Nessuna notifica');
            },
          },
            h(antd.Badge, { count: nonLette, size: 'small', offset: [-2, 2] },
              h(icons.BellOutlined, { style: { fontSize: 18, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' } })
            )
          )),

          // Avatar con dropdown cambio ruolo
          h(antd.Dropdown, {
            menu: { items: avatarMenuItems },
            trigger: ['click'],
            placement: 'bottomRight',
          },
            h('div', {
              id: 'gravity-role-switcher',
              style: {
                width: 32, height: 32, borderRadius: '50%',
                background: palette.bg,
                border: '1.5px solid ' + palette.fg + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, userSelect: 'none',
              },
            },
              h('span', { style: { color: palette.fg, fontSize: 11, fontWeight: 700 } }, abbr)
            )
          )
        )
      ),

      // ── Empty state overlay (sezione non accessibile per il ruolo corrente) ──
      accessible ? null : h('div', {
        style: {
          position: 'fixed',
          top: 64,
          left: 0, right: 0, bottom: 0,
          zIndex: 99,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
        h(antd.Empty, {
          description: h('span', { style: { color: 'rgba(0,0,0,0.45)' } },
            'Il ruolo ',
            h('strong', { style: { color: 'rgba(0,0,0,0.65)', fontWeight: 600 } }, cur),
            ' non ha accesso a questa sezione'
          ),
        })
      )
    );
  }

  window.GravityNavbar = GravityNavbar;
}());
