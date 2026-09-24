/**
 * Handoff — Permessi (Concessioni e Autorizzazioni)
 * V1 — nessun tour guidato: questo prototipo è stato creato a posteriori per
 * tracciare lo stato dell'arte di una funzionalità già pubblicata (vedi la nota
 * accanto al titolo "Lista Permessi" nella pagina). Il layer handoff qui si
 * limita a:
 * - Inspector componenti (switch in dev bar)
 * - Modello di dominio (Dipendenze/Relazioni/Scenari)
 * - Interfaccia semplificata (evidenzia "Modifica", non sviluppata)
 * - Note di design inline (icona caffè)
 */

// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_META = {
  title: 'Permessi — Concessioni e Autorizzazioni',
  version: 'V1',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
  // Storico versioni dell'handoff (il prototipo resta unico: index.html + ?handoff=vX).
  // `current` è SEMPRE self-referenziale (riflette il file effettivamente
  // caricato, non "su cosa stiamo lavorando" — quello lo dice `note`/`approved`):
  // qui è V1 a essere true perché questo È il file V1.
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: true, current: true, note: 'Versione approvata' },
    { id: 'V2', file: 'index.html?handoff=v2', approved: false, current: false, note: 'In lavorazione' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// Interfaccia semplificata (toggle nel pannello Sprint Jira).
// L'unica funzionalità non sviluppata in questo prototipo è la MODIFICA di un
// permesso esistente.
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_OUT_OF_SPRINT = [
  { selector: '#grav-tour-permit-modifica-btn', note: 'Non sviluppata — la modifica di un permesso esistente non è coperta da questo prototipo, solo la creazione' },
  { selector: '.ant-dropdown-menu-item', text: 'Modifica', note: 'Non sviluppata — stessa esclusione del pulsante "Modifica" nel dettaglio permesso' },
];

window.HANDOFF_TOURS = [];

// Tabella riusata anche nel pannello Modello (tab Scenari).
var STATO_SCENARIO_TABLE = {
  headers: ['Condizione', 'Stato assegnato'],
  rows: [
    ['Data Scadenza oggi o nel futuro', '✓ Attiva'],
    ['Data Scadenza nel passato', '✗ Scaduta'],
  ],
  note: 'Calcolato automaticamente al salvataggio (creazione), non è un campo editabile manualmente.',
};

// Tabella riusata in HANDOFF_DEPENDENCIES.
var ROLE_ACTION_MATRIX = {
  headers: ['Ruolo', 'Vedi lista', 'Crea', 'Modifica', 'Elimina', 'Collega Spazi'],
  rows: [
    ['Inventory Manager', '✓', '✓', '◐', '✓', '✓'],
    ['Tenant Admin', '✓', '✓', '◐', '✓', '✓'],
    ['Altri ruoli', '✗', '✗', '✗', '✗', '✗'],
  ],
  note: '◐ = form di modifica non sviluppato in questo prototipo (vedi Interfaccia semplificata). Basato su docs/product/role-matrix.md — "Gestione Permessi" è assegnata solo a Inventory Manager, Admin Tenant e Super Admin.',
};

// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_COMPONENTS = [
  { selector: '#grav-tour-new-permit-btn', name: 'Button "Nuovo Permesso"', level: 'Atomo', figma: 'Button — Type=Primary · Size=Large · con Dropdown menu (Nuova Concessione/Nuova Autorizzazione)' },
  { selector: '.grav-permit-table-card', name: 'Card tabella permessi', level: 'Organismo', custom: true,
    funzione: 'Card bianca con header "Totale: N" e Table sottostante — stesso pattern della lista impianti in Inventory · Impianti.',
    composizione: 'div custom + Table (AntD)',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-permit-tipo-field', name: 'Campo Tipo (Concessione/Autorizzazione)', level: 'Molecola', figma: 'Form.Item — Layout=Vertical, con Radio.Group o Select a seconda del tipo di permesso' },
  { selector: '.grav-permit-utenze-section', name: 'Sezione "Numeri Utenza"', level: 'Organismo', custom: true,
    funzione: 'Sezione ripetibile add/remove — ogni riga ha Numero Utenza e Canone Patrimoniale, zero righe è uno stato valido.',
    composizione: 'Input + InputNumber per riga + Button "Aggiungi numero" (dashed) + Button "Rimuovi" (link, danger)',
    figma: 'Da definire — pattern "Account Numbers" di LAYOUT.md §3.2' },
  { selector: '.grav-permit-promemoria-field', name: 'Campo Promemoria', level: 'Molecola', custom: true,
    funzione: 'Select disabilitato (con Tooltip esplicativo) finché la Data Scadenza non è impostata — pattern "disabilitato con motivo in hover" di LAYOUT.md §6.2.',
    composizione: 'Form.Item + Tooltip (icona ?) + Select',
    figma: 'Da definire — pattern custom' },
  { selector: '#grav-tour-permit-save-btn', name: 'Button "Salva" (drawer permesso)', level: 'Atomo', figma: 'Button — Type=Primary · Icon=Save · State=Disabled finché il form non è valido' },
  { selector: '.grav-detail-kpi-row', name: 'Riga KPI dettaglio', level: 'Organismo', figma: 'Row/Col (4× span 6) + Card + Statistic (AntD) — pattern Detail View di LAYOUT.md §3.4' },
  { selector: '.gec-card', name: 'EntityCard — Spazio collegato', level: 'Organismo', custom: true,
    funzione: 'Card condivisa (window.GravityEntityCard, prototype/_shared/entity-card.js) già in uso in Inventory · Impianti per le concessioni collegate a un impianto — qui riusata per gli spazi collegati a un permesso.',
    composizione: 'Header (titolo + badge) + body (righe icona/label/valore) + footer (azione)',
    figma: 'Da definire — pattern custom condiviso' },
  { selector: '#grav-tour-collega-spazi-btn', name: 'Button "Collega Spazi"', level: 'Atomo', figma: 'Button — Type=Primary · Icon=Link' },
  { selector: '.grav-connetti-table-area', name: 'Tabella selezione impianti (Connetti Impianti)', level: 'Organismo', custom: true,
    funzione: 'Tabella con rowSelection (checkbox multiplo + seleziona tutti di pagina), filtri su Canale/Suolo, ordinamento su Facce, paginazione — esclude gli impianti già collegati al permesso.',
    composizione: 'Table (AntD) con rowSelection controllato',
    figma: 'Da definire — pattern custom' },
  { selector: '#grav-tour-connetti-btn', name: 'Button "Connetti"', level: 'Atomo', figma: 'Button — Type=Primary quando la selezione non è vuota, altrimenti Default disabilitato' },
];

// ════════════════════════════════════════════════════════════════════════════
// Dipendenze tra entità (pannello "Dipendenze" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_DEPENDENCIES = [
  {
    id: 'ruolo-azione',
    title: 'Ruolo × Azione',
    description: 'Chi può fare cosa nel modulo Permessi.',
    table: ROLE_ACTION_MATRIX,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Relazioni tra entità (pannello "Relazioni" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_RELATIONS = [
  {
    id: 'entita',
    title: 'Relazioni tra entità',
    description: 'Cardinalità principali del dominio Permessi.',
    table: {
      headers: ['Da', '', 'A', 'Cardinalità'],
      rows: [
        ['Concessione', '→', 'Spazio pubblicitario', 'N : N'],
        ['Autorizzazione', '→', 'Spazio pubblicitario', 'N : N'],
        ['Concessione', '→', 'Numero Utenza', '1 : N'],
      ],
      note: 'Cardinalità a livello di design, da confermare in fase backend. Il collegamento a uno spazio (Collega Spazi) è lo stesso per Concessioni e Autorizzazioni.',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Scenari (tab "Scenari" nel pannello Modello)
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_SCENARIOS = [
  {
    id: 'stato-permesso',
    title: 'Come si determina lo Stato del permesso',
    description: 'Alla creazione, lo Stato non è un campo compilabile: si deriva dalla Data Scadenza.',
    table: STATO_SCENARIO_TABLE,
  },
];

// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_NOTES = [
  {
    id: 'prototipo-a-posteriori',
    title: 'Perché esiste questo prototipo',
    body: 'Creato **a posteriori**, sulla base della funzionalità già pubblicata in ambiente di sviluppo, al solo scopo di tracciare i cambiamenti nel tempo.\n==La UI qui non segue le regole di layout di Gravity==: l\'obiettivo era tracciare lo stato dell\'arte dei dati gestiti e della UX di base, non la conformità visiva del design system.',
  },
  {
    id: 'permit-modifica-non-sviluppata',
    title: 'Modifica permesso — sviluppo futuro',
    body: 'Il pulsante è presente per completezza del layout (coerente con il pattern Detail View di LAYOUT.md §3.4) ma **non è ancora sviluppato**.\n- Solo la creazione è coperta da questo prototipo\n- Vedi il toggle "Interfaccia semplificata" nel pannello Sprint Jira per evidenziarlo nell\'interfaccia',
  },
  {
    id: 'cup-canone-unico-patrimoniale',
    title: 'CUP — chiarimento sul campo',
    body: 'CUP qui sta per **Canone Unico Patrimoniale**: un importo annuo in euro, non un codice identificativo di progetto.\n- È stato inizialmente implementato come codice alfanumerico nella tabella di lista (Fase 1), poi corretto a valore monetario dopo aver definito i campi del form (Fase 2) — coerenza verificata tra lista e form',
  },
  {
    id: 'numeri-utenza-zero-valido',
    title: 'Numeri Utenza — zero righe è valido',
    body: 'Una Concessione può esistere senza numeri utenza collegati: la sezione parte vuota e "Aggiungi numero" è opzionale, non obbligatorio per salvare.\n- Se una riga viene aggiunta, i suoi due campi diventano obbligatori\n- Il Totale Canone in lista è la somma dei canoni delle righe presenti (0 € se non ce ne sono)',
  },
];
