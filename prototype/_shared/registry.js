/**
 * Registro dei prototipi Gravity — unica fonte di verità per stato e collegamenti.
 *
 * Un prototipo = una cartella sotto prototype/, per tutto il suo ciclo di vita:
 * lo stato si cambia QUI, non spostando la cartella (gli URL non cambiano mai).
 *
 *   status  : 'approved'     → validato (chip verde in navbar)
 *             'in-progress'  → in lavorazione (chip blu in navbar)
 *   entry   : pagina d'ingresso in modalità demo (prototipo pulito), relativa a prototype/
 *   handoff : pagina d'ingresso in modalità handoff (stub verso la versione annotata
 *             approvata), relativa a prototype/ — opzionale, solo sui prototipi che
 *             hanno un layer handoff (vedi components/handoff-engine.md)
 *   nav     : { section, item } — voce della navbar collegata al prototipo (opzionale);
 *             navbar.js la usa per costruire i link del menu, scegliendo entry o handoff
 *             in base alla modalità corrente della pagina (mode-aware, vedi navbar.js).
 */
window.GRAVITY_PROTOTYPES = {
  'single-signon': {
    label: 'Single sign-on', status: 'approved',
    entry: 'single-signon/index.html',
  },
  'planning': {
    label: 'Pianificazioni', status: 'approved',
    entry: 'planning/index.html',
    handoff: 'planning/index--handoff.html',
    nav: { section: 'Delivery', item: 'Plannings' },
  },
  'inventory-systems': {
    label: 'Inventario impianti', status: 'approved',
    entry: 'inventory-systems/index.html',
    handoff: 'inventory-systems/index--handoff.html',
    nav: { section: 'Inventory', item: 'Systems' },
  },
  'poi-collections': {
    label: 'Collezioni POI', status: 'approved',
    entry: 'poi-collections/index.html',
    handoff: 'poi-collections/index--handoff.html',
    nav: { section: 'Delivery', item: 'Collections' },
  },
  'negotiations': {
    label: 'Trattative', status: 'in-progress',
    entry: 'negotiations/index.html',
    handoff: 'negotiations/index--handoff.html',
    nav: { section: 'Commercial', item: 'Negotiations' },
  },
  'campaign-delivery': {
    label: 'Espletamento campagna', status: 'in-progress',
    entry: 'campaign-delivery/index.html',
    handoff: 'campaign-delivery/index--handoff.html',
    nav: { section: 'Delivery', item: 'Campaigns' },
  },
  'user-profile': {
    label: 'Profilo utente', status: 'in-progress',
    entry: 'user-profile/index.html',
  },
  'inventory-map': {
    label: 'Inventario mappa', status: 'in-progress',
    entry: 'inventory-map/index.html',
  },
  'inventory-system-detail--administrative': {
    label: 'Dettaglio impianto (amministrativi)', status: 'in-progress',
    entry: 'inventory-system-detail--administrative/index.html',
  },
  'app-sales': {
    label: 'App Sales', status: 'in-progress',
    entry: 'app-sales/index.html',
  },
};
