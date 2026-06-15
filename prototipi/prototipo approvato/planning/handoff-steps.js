/**
 * Handoff tours — Planning
 * Ogni tour = una user story. Aggiungere nuovi tour all'array HANDOFF_TOURS.
 *
 * HANDOFF_COMPONENTS: registro per l'inspector dev (hover sui componenti).
 * Derivato da COMPONENTI.md — name, level (Atomo/Molecola/Organismo),
 * custom?, funzione, figma, composizione?, variant?(el).
 * Il matching usa closest(selector): vince l'elemento più profondo.
 */

window.HANDOFF_META = {
  title:   'Planning',
  version: '1.0',
  date:    'Giugno 2026',
  author:  'Gloria Bonanno',
};

window.HANDOFF_SCREENS = {
  'lista': {
    label:  'Lista pianificazioni',
    detect: function () {
      return !!document.querySelector('.page-content') && !document.querySelector('.ss-card-map');
    },
  },
  'selezione-spazi': {
    label:  'Selezione spazi',
    detect: function () { return !!document.querySelector('.ss-card-map'); },
  },
};

window.HANDOFF_TOURS = [

  // ──────────────────────────────────────────────────────────────────────────
  // US: Presa in carico (da lista)
  // Ruolo: Planner
  // Schermata di partenza: Lista pianificazioni
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'presa-in-carico-lista',
    title:       'US#1.1 — Assegnazione Pianificazione (Presa in carico)',
    description: '(GRP-432) Come **pianificatore**, voglio poter prendere in carico una pianificazione non assegnata così da assegnarmi il lavoro senza intermediari.',
    roles:       ['Planner'],
    startScreen: 'lista',
    steps: [

      {
        title:       'Lista pianificazioni',
        description: 'Questa è la lista di tutte le pianificazioni accessibili al Planner. Le pianificazioni **non ancora assegnate** (senza planner) sono identificabili dalla **colonna "Pianificatore"**.',
        selector:    '.ant-table-wrapper',
        placement:   'top',
        dev: [
          { label: 'Componente', value: '<Table\n  dataSource={pianificazioni}\n  columns={columns}\n  rowKey="id"\n/>' },
          { label: 'Tipo dato', value: 'Pianificazione {\n  id: string\n  nome: string\n  canale: string\n  inserzionista: string\n  planner: User | null\n}' },
        ],
      },

      {
        title:       'Colonna "Pianificatore"',
        description: 'La colonna mostra **tre stati possibili**: il nome del planner assegnato (se già presa in carico), il bottone **"Prendi in carico"** (se non assegnata e il ruolo è **Planner**), oppure **"—"** (se non assegnata ma il ruolo non è Planner).',
        colIndex:    4,
        placement:   'left',
        dev: [
          { label: 'Logica render cella', value: 'if (record.planner)\n  → <Avatar /> + nome\nelse if (role === "Planner")\n  → <Button type="dashed" />\nelse\n  → "—"' },
          { label: 'Definizione colonna', value: '{\n  key: "planner",\n  title: "Pianificatore",\n  render: (_, record) => ...\n}' },
        ],
      },

      {
        title:       'Bottone "Prendi in carico"',
        description: 'Bottone **dashed** con icona **UserAdd**. Renderizzato solo se la pianificazione **non ha un planner assegnato** AND il **ruolo corrente è Planner**. Altrimenti la cella mostra il nome del planner o "—".',
        selector:    '.ant-table-tbody .ant-btn-dashed',
        placement:   'left',
        dev: [
          { label: 'Componente', value: '<Button\n  type="dashed"\n  icon={<UserAddOutlined />}\n>\n  Prendi in carico\n</Button>' },
          { label: 'Condizione render', value: '!record.planner\n&& currentUser.role === "Planner"' },
        ],
      },

      {
        title:       'Popconfirm di conferma',
        description: 'Il click apre un **Popconfirm**. Titolo: "Prendere in carico la pianificazione?". Azioni: **"Prendi in carico"** (okText) e "Annulla". **Non blocca** il resto dell\'interfaccia.',
        selector:    '.ant-popover.ant-popconfirm',
        placement:   'left',
        onEnter: function () {
          var btn = document.querySelector('.ant-table-tbody .ant-btn-dashed');
          if (btn) btn.click();
        },
        delay: 180,
        dev: [
          { label: 'Componente', value: '<Popconfirm\n  title="Prendere in carico\n         la pianificazione?"\n  okText="Prendi in carico"\n  cancelText="Annulla"\n  onConfirm={handleAssign}\n>' },
          { label: 'API', value: 'PATCH /api/pianificazioni/:id\n{ planner: { id: currentUser.id } }' },
          { label: 'On success', value: 'message.success("Pianificazione\npresa in carico")\n+ aggiorna record in state' },
          { label: 'On error', value: 'message.error("Errore...")\n+ nessun aggiornamento UI' },
        ],
      },

      {
        title:       'Feedback: message.success',
        description: 'Alla conferma appare un **message.success** in cima alla pagina. Scompare automaticamente dopo **3 secondi**.',
        selector:    '.ant-message-notice',
        placement:   'bottom',
        onEnter: function () {
          var okBtn = document.querySelector('.ant-popconfirm .ant-btn-primary');
          if (okBtn) okBtn.click();
        },
        delay: 220,
        dev: [
          { label: 'Chiamata', value: 'message.success(\n  "Pianificazione presa in carico"\n)' },
          { label: 'Durata default', value: '3 secondi (antd default)\nSe serve più tempo: message.success(testo, 6)' },
          { label: 'Posizione', value: 'Fixed, top center — gestito\nautomaticamente da antd' },
        ],
      },

      {
        title:       'Risultato: colonna aggiornata',
        description: 'La colonna Pianificatore si aggiorna con **avatar + nome** del planner assegnato. Aggiornamento **in-memory** — non persiste tra navigazioni nel prototipo.',
        colIndex:    4,
        placement:   'left',
        dev: [
          { label: 'Stato aggiornato', value: 'record.planner = {\n  id: currentUser.id,\n  nome: currentUser.nome,\n  avatar: currentUser.avatarUrl\n}' },
          { label: 'Rollback su errore', value: 'Ripristina planner: null\nmessage.error("Operazione\nnon riuscita")' },
          { label: 'Nota prototipo', value: 'L\'aggiornamento è in-memory.\nNon persiste tra navigazioni.' },
        ],
      },

    ],
  },

];

// ════════════════════════════════════════════════════════════════════════════
// Registro componenti per l'inspector dev (da COMPONENTI.md)
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_COMPONENTS = [

  // ── Atomi Ant Design (variante rilevata automaticamente dalle classi) ──────
  { selector: '.ant-btn', name: 'Button', level: 'Atomo',
    funzione: 'Azione dell\'interfaccia: CTA, azioni di riga, conferme.',
    figma: '*Button*' },
  { selector: '.ant-select', name: 'Select', level: 'Atomo',
    funzione: 'Selezione da elenco: cascata trattativa→campagna, unità raggio POI.',
    figma: '*Select*' },
  { selector: '.ant-input-affix-wrapper, .ant-input', name: 'Input', level: 'Atomo',
    funzione: 'Inserimento testo: nome pianificazione, ricerca, etichette.',
    figma: '*Input*' },
  { selector: '.ant-input-number', name: 'InputNumber', level: 'Atomo',
    funzione: 'Valori numerici: min facce, prezzo massimo, raggio POI.',
    figma: '*InputNumber* Size=Small' },
  { selector: '.ant-checkbox-wrapper', name: 'Checkbox', level: 'Atomo',
    funzione: 'Selezione multipla: colonne tabella, impianti e facce.',
    figma: '*Checkbox*' },
  { selector: '.ant-radio-group', name: 'Radio Group', level: 'Atomo',
    funzione: 'Scelta esclusiva: canale OOH/DOOH, tipo di vendita.',
    figma: '*Radio* (optionType default)' },
  { selector: '.ant-switch', name: 'Switch', level: 'Atomo',
    funzione: 'Attiva/disattiva un filtro o una modalità.',
    figma: '*Switch*' },
  { selector: '.ant-picker', name: 'DatePicker', level: 'Atomo',
    funzione: 'Periodo della pianificazione: il tipo di vendita vincola le date selezionabili.',
    figma: '*DatePicker* (RangePicker)' },
  { selector: '.ant-slider', name: 'Slider', level: 'Atomo',
    funzione: 'Regola il raggio dei POI sulla mappa.',
    figma: '*Slider* Direction=Horizontal' },
  { selector: '.ant-tag', name: 'Tag', level: 'Atomo',
    funzione: 'Etichetta informativa: tipologie, settore, conteggi.',
    figma: '*Tag*' },
  { selector: '.ant-badge', name: 'Badge', level: 'Atomo',
    funzione: 'Stato con dot colorato o counter.',
    figma: '*Badge*' },
  { selector: '.ant-avatar', name: 'Avatar', level: 'Atomo',
    funzione: 'Identità visiva di persone e inserzionisti.',
    figma: '*Avatar* Shape=Circle' },
  { selector: '.ant-progress', name: 'Progress', level: 'Atomo',
    funzione: 'Avanzamento: budget impegnato, raggiungimento KPI.',
    figma: '*Progress* Type=Line ShowInfo=False' },
  { selector: '.ant-divider', name: 'Divider', level: 'Atomo',
    funzione: 'Separa le sezioni del form.',
    figma: '*Divider Horizontal*' },
  { selector: '.ant-empty', name: 'Empty', level: 'Atomo',
    funzione: 'Stato vuoto del pannello risultati/selezionati.',
    figma: '*Empty* Type=Simple' },

  // ── Molecole Ant Design ────────────────────────────────────────────────────
  { selector: '.ant-form-item', name: 'Form Item', level: 'Molecola',
    funzione: 'Campo del form con label, descrizione (extra) e stato di errore.',
    figma: '*Form Item* Layout=Vertical' },
  { selector: '.ant-pagination', name: 'Pagination', level: 'Molecola',
    funzione: 'Paginazione tabella; a sinistra counter e gestione colonne (showTotal).',
    figma: '*Pagination*' },
  { selector: '.ant-alert', name: 'Alert', level: 'Molecola',
    funzione: 'Banner di stato del workspace: presa in carico, sola lettura, conferma.',
    figma: '*Alert* ShowIcon=True' },
  { selector: '.ant-dropdown-menu', name: 'Dropdown menu', level: 'Molecola',
    funzione: 'Menu azioni: Visualizza / Modifica / Duplica / Elimina con vincoli di stato.',
    figma: '*Dropdown* Placement=BottomRight' },
  { selector: '.ant-popover-inner', name: 'Popover', level: 'Molecola',
    funzione: 'Pannello contestuale: collega trattativa, consegna, gestione colonne.',
    figma: '*Popover*' },
  { selector: '.ant-menu-horizontal', name: 'Menu (navbar)', level: 'Molecola',
    funzione: 'Navigazione principale dei moduli.',
    figma: '*Menu* Mode=Horizontal' },

  // ── Organismi Ant Design ───────────────────────────────────────────────────
  { selector: '.ant-table-wrapper', name: 'Table pianificazioni', level: 'Organismo',
    funzione: '14 colonne con sorter, filtri e azioni di riga; colonne mostrabili/nascondibili. Pianificazione fixed left, Stato e Azioni fixed right.',
    figma: '*Table* + *Table Header Cell* + *Table Body Cell*' },
  { selector: '.ant-modal-content', name: 'Modal', level: 'Organismo',
    funzione: 'Dialoghi: duplica pianificazione, conferma eliminazione, audience, KPI, modifiche consegna.',
    figma: '*Modal*' },
  { selector: '.ant-drawer-content', name: 'Drawer', level: 'Organismo',
    funzione: 'Pannello laterale: crea/modifica pianificazione (CTA Salva nell\'header, annulla con la X), filtri avanzati, POI.',
    figma: '*Drawer* Placement=Right' },

  // ── Atomi custom ───────────────────────────────────────────────────────────
  { selector: '.gv-channel-chip', name: 'ChannelChip', level: 'Atomo', custom: true,
    funzione: 'Canale della pianificazione: OOH (verde) o DOOH (magenta). Usato anche come label dei radio.',
    figma: '*Tag* — Color=Success (OOH) / Magenta (DOOH)',
    composizione: 'span + dot colorato',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.gv-category-tag', name: 'CategoryTag', level: 'Atomo', custom: true,
    funzione: 'Tag canale nell\'header del dettaglio.',
    figma: '*Tag* — Color=Success (OOH) / Color=Error (DOOH)',
    composizione: 'Tag AntD con palette per canale',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.gv-state-badge', name: 'StateBadge', level: 'Atomo', custom: true,
    funzione: 'Stato della pianificazione: Bozza / In trattativa / Completata.',
    figma: '*Badge* Type=Dot — Status=Warning/Processing/Success',
    composizione: 'dot 7px + Text',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.gv-agent-avatar', name: 'AgentAvatar', level: 'Atomo', custom: true,
    funzione: 'Avatar del pianificatore con iniziali.',
    figma: '*Avatar* Shape=Circle Type=Text',
    composizione: 'Avatar AntD + palette per agente' },
  { selector: '.gv-advertiser-avatar', name: 'AdvertiserAvatar', level: 'Atomo', custom: true,
    funzione: 'Logo dell\'inserzionista con fallback a iniziali. Esiste solo se la pianificazione è collegata a una trattativa.',
    figma: '*Avatar* Type=Image / Type=Text',
    composizione: 'img favicon + fallback Avatar' },

  // ── Molecole custom ────────────────────────────────────────────────────────
  { selector: '.gv-inherited-box', name: 'Box dati ereditati', level: 'Molecola', custom: true,
    funzione: 'Riepiloga i dati che la campagna collegata impone alla pianificazione: inserzionista, canale, periodo, tipo di vendita.',
    figma: 'Frame Auto Layout (bg subtle, radius 8)',
    composizione: 'AdvertiserAvatar + ChannelChip + Text' },
  { selector: '.data-card', name: 'DataCard', level: 'Molecola', custom: true,
    funzione: 'Card informativa con icona, label e valore: KPI della lista e brief del dettaglio.',
    figma: 'System Card (componente DS Gravity, 5 varianti)',
    composizione: 'icona + label + valore + azione link' },
  { selector: '.mini-cal', name: 'MiniCalendar', level: 'Molecola', custom: true,
    funzione: 'Calendario compatto con il periodo di esposizione evidenziato.',
    figma: 'Componente nuovo *Mini Calendar* (default, in-range, today, outside-month)',
    composizione: 'griglia 7 colonne + header navigazione + footer date' },
  { selector: '.ss-search-pill', name: 'Pill di ricerca luogo', level: 'Molecola', custom: true,
    funzione: 'Ricerca geografica con suggerimenti e accesso alle collezioni POI.',
    figma: 'Frame pill custom con *Input* interno',
    composizione: 'Input borderless + divider + bottone POI' },
  { selector: '.ss-panel-tab', name: 'Tab pannello', level: 'Molecola', custom: true,
    funzione: 'Alterna Risultati / Selezionati nel pannello impianti.',
    figma: '*Tabs* Type=Line (nel codice è custom)',
    composizione: 'tab testuali con stato attivo' },
  { selector: '.filter-active-chip', name: 'Chip filtro attivo', level: 'Molecola', custom: true,
    funzione: 'Filtro applicato, rimovibile con la X.',
    figma: '*Tag* Closable=True' },
  { selector: '.sugg-dropdown', name: 'Suggerimenti geo', level: 'Molecola', custom: true,
    funzione: 'Risultati di ricerca raggruppati: regione, provincia, città, POI.',
    figma: 'Frame lista custom (simile a *Select* Open con gruppi)' },
  { selector: '.ss-radius-map-ctrl', name: 'Radius control POI', level: 'Molecola', custom: true,
    funzione: 'Controlla il raggio di ricerca attorno ai POI attivi.',
    figma: 'Frame overlay con *Slider* + *InputNumber* + *Select*',
    composizione: 'Slider + InputNumber + Select unità' },
  { selector: '.ss-map-infobox', name: 'Infobox mappa', level: 'Molecola', custom: true,
    funzione: 'Riepilogo del contesto: impianti visibili, canale, periodo, stati.',
    figma: 'Frame overlay custom' },

  // ── Organismi custom ───────────────────────────────────────────────────────
  { selector: '.ss-card-map', name: 'Area mappa', level: 'Organismo', custom: true,
    funzione: 'Mappa interattiva degli impianti con pin per stato, cluster e overlay.',
    figma: 'Frame statica con pin (Google Maps — nessun equivalente AntD)',
    composizione: 'Google Maps + pin + infobox + radius control' },
  { selector: '.page-content', name: 'Pagina lista', level: 'Pagina', custom: true,
    funzione: 'Pattern List: header pagina, KPI cards, tabella pianificazioni.',
    figma: 'Template di schermata Lista (LAYOUT.md §5.1)' },

];
