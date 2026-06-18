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
  // US#1 — Lista Pianificazioni (GRP-417) · Planner / Operations Manager · Lista
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'lista-pianificazioni',
    title:       'US#1 — Lista Pianificazioni',
    description: '(GRP-417) Come **pianificatore** voglio una lista di tutte le pianificazioni con le informazioni essenziali e strumenti di filtro, così da orientarmi nel carico di lavoro e raggiungere rapidamente la pianificazione su cui lavorare.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'lista',
    steps: [
      {
        title:       'Panoramica carichi di lavoro',
        description: 'Tre card in cima alla pagina riassumono il carico di lavoro: **pianificazioni non assegnate**, **mie bozze** e **mie pianificazioni in trattativa**. I counter si aggiornano in tempo reale.',
        selector:    '.gv-kpi-cards',
        placement:   'bottom',
        dev: [
          { label: 'Componente', value: 'DataCard ×3 (System Card DS)' },
          { label: 'Counter', value: 'libere / mie bozze / mie in trattativa\n(derivati dal dataset)' },
        ],
      },
      {
        title:       'Header pagina',
        description: 'L\'header mostra il **titolo**, l\'**area di competenza** del planner (area + province + canali abilitati) e la CTA **"Nuova Pianificazione"**.',
        selector:    '.gv-page-header',
        placement:   'bottom',
        dev: [
          { label: 'Componente', value: 'Header (DS) — Variant=Lista\nnode 91-35550' },
        ],
      },
      {
        title:       'Struttura della tabella',
        description: 'La tabella mostra **nome, canale (OOH/DOOH), inserzionista, pianificatore, stato, n° spazi, data creazione, ultimo aggiornamento, tipo di vendita, inizio e fine campagna**. Il **clic su una riga** apre il dettaglio (→ US#2). Si filtra per **canale, inserzionista, pianificatore, stato** e si cerca per **nome** con campo testuale inline sulla colonna.',
        selector:    '.ant-table-wrapper',
        placement:   'top',
        dev: [
          { label: 'Componente', value: '<Table dataSource={pianificazioni}\n  columns={columns} rowKey="id" />' },
          { label: 'Filtri', value: 'column filter: canale, inserzionista,\nplanner, stato + search inline "nome"' },
          { label: 'Riga → dettaglio', value: 'onRow.onClick → US#2' },
        ],
      },
      {
        title:       'Colonna "Pianificatore" e assegnazione',
        description: 'Le pianificazioni **assegnate a me** mostrano il mio nome con **"(tu)"**. Quelle **non assegnate** espongono l\'azione inline **"Prendi in carico"** (→ US#1.1).',
        colIndex:    4,
        placement:   'left',
        dev: [
          { label: 'Render cella', value: 'planner===me → nome + "(tu)"\n!planner → "Prendi in carico"\naltro → nome planner' },
          { label: 'Ruoli', value: 'Planner e Operations Manager\n(assegna a me / ad altri)' },
          { label: 'Stati', value: 'Bozza · In trattativa · Completata\n(3° stato "In trattativa" nuovo)' },
        ],
      },
    ],
  },

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

  // ──────────────────────────────────────────────────────────────────────────
  // US#1.1 — Presa in carico (dal dettaglio) (GRP-432) · Schermata: Dettaglio
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'presa-in-carico-dettaglio',
    title:       'US#1.1 — Assegnazione Pianificazione (dal dettaglio)',
    description: '(GRP-432) Come **pianificatore** voglio prendere in carico una pianificazione non assegnata **dal suo dettaglio**, così da poter lavorare sulla selezione degli spazi.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'selezione-spazi',
    steps: [
      {
        title:       'Sola lettura + box informativo',
        description: 'Finché non è presa in carico, il dettaglio è in **sola lettura**: non si possono selezionare impianti. Un **box informativo** invita a prenderla in carico per lavorare sulla selezione.',
        selector:    '.ant-alert',
        placement:   'bottom',
        dev: [
          { label: 'Stato', value: 'readOnly = !isMine ||\n  state === "Completata"' },
        ],
      },
      {
        title:       'Bottone "Prendi in carico"',
        description: 'Nell\'**header** del dettaglio il bottone **"Prendi in carico"** appare se la pianificazione non ha un planner. Il click apre una **popconfirm** di conferma.',
        selector:    '.gv-btn-takecharge',
        placement:   'bottom',
        dev: [
          { label: 'Componente', value: 'PlanningHeaderNR → onTakeInCharge' },
          { label: 'API', value: 'PATCH /api/pianificazioni/:id\n{ planner: currentUser }' },
        ],
      },
      {
        title:       'Conferma e aggiornamento',
        description: 'Dopo la conferma: il **nome compare nell\'header**, il pulsante scompare, un **toast** conferma l\'operazione e la card **"Da prendere in carico"** nella lista aggiorna il counter.',
        selector:    '.gv-detail-header',
        placement:   'bottom',
        dev: [
          { label: 'On success', value: 'message.success(...)\n+ header avatar+nome\n+ counter card −1' },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // US#1.2 — Stato "In Trattativa" e cambio stato (GRP-460) · Dettaglio
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'stato-in-trattativa',
    title:       'US#1.2 — Stato "In Trattativa" e cambio stato',
    description: '(GRP-460) Come **pianificatore** voglio far avanzare lo stato di una pianificazione, così da coordinare il lavoro con il commerciale in modo trasparente.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'selezione-spazi',
    steps: [
      {
        title:       'Collega a una trattativa',
        description: 'Nell\'header del dettaglio il button **"Collega"** apre un dropdown con una **select** per scegliere la trattativa commerciale.',
        selector:    '.gv-btn-collega',
        placement:   'bottom',
        onEnter: function () {
          var b = document.querySelector('.gv-btn-collega');
          if (b) b.click();
        },
        delay: 220,
        dev: [
          { label: 'Naming', value: '"Allega a trattativa" → "Collega trattativa"' },
        ],
      },
      {
        title:       'Trattativa collegata',
        description: 'Al collegamento riuscito appare un **toast** e la trattativa compare nell\'header come **link button**. Senza trattativa collegata il pulsante di consegna è **disabilitato**.',
        selector:    '.gv-detail-header',
        placement:   'bottom',
      },
      {
        title:       'Consegna in trattativa',
        description: 'Con trattativa collegata e **almeno uno spazio** selezionato, **"Consegna in trattativa"** è attivo. Una **popconfirm** chiede conferma; alla conferma lo stato passa da **Bozza → In trattativa**, viene registrata la **data di consegna** e appare un **toast**.',
        selector:    '.gv-btn-consegna',
        placement:   'bottom',
        dev: [
          { label: 'Transizione', value: 'Bozza → In trattativa\n+ deliveredAt = now' },
        ],
      },
      {
        title:       'Aggiorna consegna',
        description: 'Se dopo la consegna gli spazi cambiano, il pulsante diventa **"Aggiorna consegna"**. Prima di aggiornare una **modale** mostra le **differenze**: facce aggiunte, rimosse e con cambio di stato di disponibilità.',
        selector:    '.gv-btn-consegna',
        placement:   'bottom',
        dev: [
          { label: 'Diff', value: 'added / removed / statusChanged' },
        ],
      },
      {
        title:       'Sola lettura',
        description: 'Le pianificazioni **Confermata** o **assegnate ad altri** sono visibili ma non modificabili: un **banner** segnala la modalità sola lettura.',
        selector:    '.ant-alert',
        placement:   'bottom',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // US#2 — Dettaglio Pianificazione (GRP-467) · Dettaglio
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'dettaglio-pianificazione',
    title:       'US#2 — Dettaglio Pianificazione',
    description: '(GRP-467) Come **pianificatore** voglio lavorare sugli spazi in una schermata dedicata con brief e mappa, così da costruire la proposta con tutto il contesto a portata di mano.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'selezione-spazi',
    steps: [
      {
        title:       'Header del dettaglio',
        description: 'L\'header mostra **nome, canale, data creazione, ultimo aggiornamento, trattativa, pianificatore e stato**, con i button **"Condividi"** e **"Consegna in trattativa"**.',
        selector:    '.gv-detail-header',
        placement:   'bottom',
        dev: [
          { label: 'Fuori scope', value: '"Condividi" per ora non attivo' },
        ],
      },
      {
        title:       'Pannello brief',
        description: 'Il pannello laterale mostra **inserzionista, budget, calendario** col periodo di esposizione evidenziato. Il **box informativo** appare solo se la pianificazione non è ancora presa in carico.',
        selector:    '.ss-brief-bar',
        placement:   'right',
        dev: [
          { label: 'Fuori scope', value: 'la card "Obiettivo" NON va implementata' },
        ],
      },
      {
        title:       'Mappa impianti',
        description: 'La mappa occupa l\'area principale e mostra gli impianti come **marker colorati per stato di disponibilità**. È **espandibile in fullscreen** senza perdere filtri e selezione.',
        selector:    '.ss-card-map',
        placement:   'left',
      },
      {
        title:       'Search bar',
        description: 'Sopra la mappa una **search bar** sempre visibile supporta due modalità: **zona/indirizzo** (→ US#2.1) e **punti di interesse**. Il pulsante **"Filtri"** apre i filtri avanzati (→ US#2.2). Le ricerche compaiono come **tag closable** nella barra; filtri e zone attive come **chip rimovibili** sotto la barra. Funziona anche in fullscreen.',
        selector:    '.ss-search-pill',
        placement:   'bottom',
      },
      {
        title:       'Risultati e budget',
        description: 'Il **totale** degli spazi trovati è aggiornato in tempo reale; si **switcha** tra "Risultati" e "Selezionati" (→ US#3). Se il costo dei selezionati supera il budget, il valore appare in **rosso** nella card "Budget". Ogni impianto selezionato può ricevere **etichette colorate** cliccando l\'icona accanto al nome.',
        selector:    '.ss-panel-tab',
        placement:   'left',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // US#2.2 — Ricerca avanzata (drawer filtri) (GRP-419) · Dettaglio
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'ricerca-avanzata-drawer',
    title:       'US#2.2 — Ricerca avanzata (drawer filtri)',
    description: '(GRP-419) Come **pianificatore** voglio affinare la ricerca tramite filtri avanzati in un drawer dedicato, così da vedere solo gli impianti interessanti per la pianificazione.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'selezione-spazi',
    steps: [
      {
        title:       'Apri i filtri',
        description: 'Il pulsante **"Filtri"** nella search bar apre il **drawer** dei filtri avanzati.',
        selector:    '.gv-btn-filtri',
        placement:   'bottom',
      },
      {
        title:       'Opzioni di filtraggio',
        description: 'Il drawer espone: **stato disponibilità** (Disponibile / In Opzione / Riservato), **tipologia impianto**, **n° minimo di facce**, **illuminazione**, **formato**, **modello di vendita**, **prezzo massimo per faccia**.',
        selector:    '.ant-drawer-content',
        placement:   'left',
        onEnter: function () {
          var b = document.querySelector('.gv-btn-filtri');
          if (b) b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        },
        delay: 300,
        dev: [
          { label: 'Componente', value: 'filter-drawer.js (drawer condiviso\nPlanning + Inventory)' },
        ],
      },
      {
        title:       'Chip filtri attivi',
        description: 'I filtri attivi generano **chip rimovibili** sotto la search bar, visibili senza riaprire il drawer.',
        selector:    '.filter-active-chip',
        placement:   'bottom',
      },
      {
        title:       'Risultati in tempo reale',
        description: 'Il **totale** degli spazi che soddisfano i filtri è aggiornato in tempo reale; si switcha tra "Risultati" e "Selezionati" (→ US#3).',
        selector:    '.ss-panel-tab',
        placement:   'left',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // US#3 — Sidebar risultati e spazi selezionati (GRP-459) · Dettaglio
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'sidebar-risultati-selezionati',
    title:       'US#3 — Sidebar risultati e spazi selezionati',
    description: '(GRP-459) Come **pianificatore** voglio un pannello laterale sulla mappa con due tab, "Risultati" e "Selezionati", così da esplorare gli impianti trovati e rivedere la selezione senza uscire dalla mappa.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'selezione-spazi',
    steps: [
      {
        title:       'Pannello a due tab',
        description: 'Il pannello ha due tab: **"Risultati"** e **"Selezionati"**. In **Bozza** e **In trattativa** si apre su "Risultati"; in **Confermata** mostra **solo "Selezionati"**. Il **badge** sulla tab Selezionati mostra il numero di impianti inclusi.',
        selector:    '.ss-panel-tab',
        placement:   'left',
        dev: [
          { label: 'Stato', value: 'Confermata → solo tab Selezionati\n(.ss-panel--completata)' },
        ],
      },
      {
        title:       'Toggle e toolbar',
        description: 'Il pannello è **collassabile** tramite un toggle laterale. Una **toolbar** sopra la lista permette di **selezionare/deselezionare tutti** gli elementi visibili in un\'azione.',
        selector:    '.ss-panel-toggle',
        placement:   'left',
      },
      {
        title:       'Dettaglio impianto',
        description: 'Al click sul **record** o sul **marker** avviene uno **zoom** sul punto e si apre un **dropdown di dettaglio** con nome, tipologia, formato, indirizzo, disponibilità, n° facce, prezzo stimato e un **button per aggiungere** l\'impianto alla pianificazione.',
        selector:    '.ss-card-map',
        placement:   'left',
      },
      {
        title:       'Aggiunta alla proposta',
        description: 'Al click sulla **checkbox** del record o sul **button** del dropdown, l\'impianto viene **aggiunto** alla pianificazione e compare nella tab "Selezionati".',
        selector:    '.ss-panel-toolbar-action',
        placement:   'left',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // US#1.2 — Stato "In Trattativa" (in tabella) (GRP-460) · Schermata: Lista
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'stato-in-trattativa-lista',
    title:       'US#1.2 — Stato "In Trattativa" (in tabella)',
    description: '(GRP-460) Come **pianificatore** voglio riconoscere lo stato di avanzamento delle pianificazioni dalla lista, così da capire a colpo d\'occhio cosa è in lavorazione, in trattativa o concluso.',
    roles:       ['Planner', 'Operations Manager'],
    startScreen: 'lista',
    steps: [
      {
        title:       'Colonna "Stato"',
        description: 'La colonna **Stato** mostra i tre stati: **Bozza**, **In trattativa** e **Completata**. "In trattativa" (3° stato, nuovo) indica che la pianificazione è stata consegnata al commerciale ma **può ancora essere modificata**. La colonna è **filtrabile** per stato.',
        colIndex:    14,
        placement:   'left',
        dev: [
          { label: 'Componente', value: 'StateBadge — Bozza /\nIn trattativa / Completata' },
          { label: 'Filtro', value: 'column filter su effectiveState(record)' },
        ],
      },
      {
        title:       'Riflesso sui carichi di lavoro',
        description: 'La card **"mie pianificazioni in trattativa"** in cima alla lista conta le pianificazioni in questo stato: l\'avanzamento di stato aggiorna i counter.',
        selector:    '.gv-kpi-cards .data-card:nth-child(3)',
        placement:   'bottom',
      },
      {
        title:       'Azioni vincolate dallo stato',
        description: 'Apri il menu **Azioni** della riga.',
        selector:    '.ant-dropdown-menu',
        placement:   'left',
        onEnter: function () {
          var b = document.querySelector('.gv-row-actions');
          if (b) b.click();
        },
        delay: 260,
        table: {
          headers: ['Stato', 'Vis.', 'Mod.', 'Dup.', 'Elim.'],
          rows: [
            ['Bozza · no trat.', '✓', '✓', '◐', '✓'],
            ['Bozza · trat.',    '✓', '✓', '◐', '✗'],
            ['In trattativa',    '✓', '✗', '✓', '✗'],
            ['Completata',       '✓', '✗', '◐', '✗'],
          ],
          note: '◐ = solo se facce > 0 · Visualizza sempre attiva',
        },
      },
    ],
  },

];

// ════════════════════════════════════════════════════════════════════════════
// Registro componenti per l'inspector dev (da COMPONENTI.md)
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_COMPONENTS = [

  // ── Atomi Ant Design (senza descrizione: variante/colore rilevati a runtime) ─
  { selector: '.ant-btn', name: 'Button', level: 'Atomo', figma: '*Button*' },
  { selector: '.ant-select', name: 'Select', level: 'Atomo', figma: '*Select*' },
  { selector: '.ant-input-affix-wrapper, .ant-input', name: 'Input', level: 'Atomo', figma: '*Input*' },
  { selector: '.ant-input-number', name: 'InputNumber', level: 'Atomo', figma: '*InputNumber* Size=Small' },
  { selector: '.ant-checkbox-wrapper', name: 'Checkbox', level: 'Atomo', figma: '*Checkbox*' },
  { selector: '.ant-radio-group', name: 'Radio Group', level: 'Atomo', figma: '*Radio* (optionType default)' },
  { selector: '.ant-switch', name: 'Switch', level: 'Atomo', figma: '*Switch*' },
  { selector: '.ant-picker', name: 'DatePicker', level: 'Atomo', figma: '*DatePicker* (RangePicker)' },
  { selector: '.ant-slider', name: 'Slider', level: 'Atomo', figma: '*Slider* Direction=Horizontal' },
  { selector: '.ant-tag', name: 'Tag', level: 'Atomo', tag: true, figma: '*Tag*' },
  { selector: '.ant-badge', name: 'Badge', level: 'Atomo', figma: '*Badge*' },
  { selector: '.ant-avatar', name: 'Avatar', level: 'Atomo', figma: '*Avatar* Shape=Circle' },
  { selector: '.ant-progress', name: 'Progress', level: 'Atomo', figma: '*Progress* Type=Line ShowInfo=False' },
  { selector: '.ant-divider', name: 'Divider', level: 'Atomo', figma: '*Divider Horizontal*' },
  { selector: '.ant-empty', name: 'Empty', level: 'Atomo', figma: '*Empty* Type=Simple' },

  // ── Molecole Ant Design ────────────────────────────────────────────────────
  { selector: '.ant-form-item', name: 'Form Item', level: 'Molecola',
    funzione: 'Campo del form:\n- **label** + **descrizione** (extra)\n- **stato di errore**',
    figma: '*Form Item* Layout=Vertical',
    composizione: 'Text (label) + controllo (Input / Select / DatePicker / …) + Text (help/errore)' },
  { selector: '.ant-pagination', name: 'Pagination', level: 'Molecola',
    funzione: 'Paginazione della tabella.\n- a sinistra: **conteggio totale** (showTotal)\n- ⚠ **aggiungi/rimuovi colonne: ESCLUSIVA DEL PROTOTIPO** (non nel prodotto)',
    figma: '*Pagination*',
    composizione: 'Button (pagine, frecce) + Select (page size) + Text (totale)' },
  { selector: '.ant-alert', name: 'Alert', level: 'Molecola',
    funzione: 'Banner di stato del workspace:\n- **presa in carico**\n- **sola lettura**\n- **conferma**',
    figma: '*Alert* ShowIcon=True',
    composizione: 'Icon + Text (messaggio) + Text (descrizione) + Button (chiudi, opz.)' },
  { selector: '.ant-dropdown-menu', name: 'Dropdown menu', level: 'Molecola',
    funzione: 'Menu azioni di riga: **Visualizza · Modifica · Duplica · Elimina**, con **vincoli per stato**.',
    figma: '*Dropdown* Placement=BottomRight',
    composizione: 'voci = Icon + Text (+ Divider tra i gruppi)' },
  { selector: '.ant-popover-inner', name: 'Popover', level: 'Molecola',
    funzione: 'Pannello contestuale:\n- **collega trattativa**\n- **consegna**\n- **gestione colonne** (⚠ esclusiva del prototipo)',
    figma: '*Popover*',
    composizione: 'Title (opz.) + contenuto (Text / Select / Checkbox) + Button' },
  { selector: '.ant-menu-horizontal', name: 'Menu (navbar)', level: 'Molecola',
    funzione: 'Navigazione principale dei **moduli**.',
    figma: '*Menu* Mode=Horizontal',
    composizione: 'voci Menu = Icon (opz.) + Text' },

  // ── Organismi Ant Design ───────────────────────────────────────────────────
  { selector: '.ant-table-wrapper', name: 'Table pianificazioni', level: 'Organismo',
    funzione: 'Tabella con **14 colonne**: sorter, filtri e azioni di riga.\n- **Pianificazione** fixed left · **Stato/Azioni** fixed right\n- ⚠ **aggiungi/rimuovi colonne: ESCLUSIVA DEL PROTOTIPO** (non nel prodotto)',
    figma: '*Table* + *Table Header Cell* + *Table Body Cell*',
    composizione: 'Header Cell (Text + Icon sorter/filtro) + Body Cell (Text / Tag / Avatar / Checkbox / Button) + Pagination' },
  { selector: '.ant-modal-content', name: 'Modal', level: 'Organismo',
    funzione: 'Dialoghi:\n- **duplica** pianificazione\n- **conferma eliminazione**\n- **audience · KPI · modifiche consegna**',
    figma: '*Modal*',
    composizione: 'Title + contenuto (Text / Form) + footer (Button ×2)' },
  { selector: '.ant-drawer-content', name: 'Drawer', level: 'Organismo',
    funzione: 'Pannello laterale:\n- **crea/modifica** pianificazione (Salva nell\'header, X per annullare)\n- **filtri avanzati**\n- **POI**',
    figma: '*Drawer* Placement=Right',
    composizione: 'header (Title + Button X) + body (Form: Input / Select / DatePicker / Checkbox) + footer (Button)' },

  // ── Atomi custom (senza descrizione) ─────────────────────────────────────────
  { selector: '.gv-channel-chip', name: 'Tag', level: 'Atomo', tag: true,
    figma: '*Tag*',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.gv-category-tag', name: 'Tag', level: 'Atomo', tag: true,
    figma: '*Tag*',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.filter-active-chip', name: 'Tag', level: 'Atomo', tag: true,
    figma: '*Tag* Closable=True' },
  { selector: '.gv-state-badge', name: 'StateBadge', level: 'Atomo', custom: true,
    figma: '*Badge* Type=Dot — Status=Warning/Processing/Success',
    composizione: 'dot 7px + Text',
    variant: function (el) { return el.textContent.trim(); } },
  { selector: '.gv-agent-avatar', name: 'AgentAvatar', level: 'Atomo', custom: true,
    figma: '*Avatar* Shape=Circle Type=Text',
    composizione: 'Avatar AntD + palette per agente' },
  { selector: '.gv-advertiser-avatar', name: 'AdvertiserAvatar', level: 'Atomo', custom: true,
    figma: '*Avatar* Type=Image / Type=Text',
    composizione: 'img favicon + fallback Avatar' },

  // ── Molecole custom ────────────────────────────────────────────────────────
  { selector: '.gv-inherited-box', name: 'Box dati ereditati', level: 'Molecola', custom: true,
    funzione: 'Dati che la **campagna collegata** impone alla pianificazione:\n- **inserzionista** · **canale**\n- **periodo** · **tipo di vendita**',
    figma: 'Frame Auto Layout (bg subtle, radius 8)',
    composizione: 'Avatar (inserzionista) + Tag (canale) + Text (periodo, tipo vendita)' },
  { selector: '.data-card', name: 'DataCard', level: 'Molecola', custom: true,
    funzione: 'Card informativa **icona + label + valore**.\n- KPI della lista\n- brief del dettaglio',
    figma: 'System Card (componente DS Gravity, 5 varianti)',
    composizione: 'Icon + Text (label) + Text (valore) + Button (link, opz.)' },
  { selector: '.mini-cal', name: 'MiniCalendar', level: 'Molecola', custom: true,
    funzione: 'Calendario compatto con il **periodo di esposizione** evidenziato.',
    figma: 'Componente nuovo *Mini Calendar* (default, in-range, today, outside-month)',
    composizione: 'Button (navigazione mese) + Text (giorni) + Text (date footer)' },
  { selector: '.ss-search-pill', name: 'Pill di ricerca luogo', level: 'Molecola', custom: true,
    funzione: 'Ricerca geografica:\n- **suggerimenti** zona/indirizzo\n- accesso alle **collezioni POI**',
    figma: 'Frame pill custom con *Input* interno',
    composizione: 'Input + Divider + Button (POI)' },
  { selector: '.ss-panel-tab', name: 'Tab pannello', level: 'Molecola', custom: true,
    funzione: 'Alterna **Risultati / Selezionati** nel pannello impianti.',
    figma: '*Tabs* Type=Line (nel codice è custom)',
    composizione: 'Text (tab) + Badge (counter)' },
  { selector: '.sugg-dropdown', name: 'Suggerimenti geo', level: 'Molecola', custom: true,
    funzione: 'Risultati di ricerca raggruppati: **regione · provincia · città · POI**.',
    figma: 'Frame lista custom (simile a *Select* Open con gruppi)',
    composizione: 'Text (titolo gruppo) + voci (Icon + Text)' },
  { selector: '.ss-radius-map-ctrl', name: 'Radius control POI', level: 'Molecola', custom: true,
    funzione: 'Regola il **raggio di ricerca** attorno ai POI attivi.',
    figma: 'Frame overlay con *Slider* + *InputNumber* + *Select*',
    composizione: 'Slider + InputNumber + Select (unità)' },
  { selector: '.ss-map-infobox', name: 'Infobox mappa', level: 'Molecola', custom: true,
    funzione: 'Riepilogo del contesto: **impianti visibili · canale · periodo · stati**.',
    figma: 'Frame overlay custom',
    composizione: 'Text (totale) + per stato (dot + Text)' },
  { selector: '.gv-competency', name: 'Area di competenza', level: 'Molecola', custom: true,
    funzione: 'Ambito del planner:\n- **area** geografica + province\n- **canali** abilitati (OOH/DOOH)',
    figma: 'Frame Auto Layout orizzontale',
    composizione: 'Text (Title) + Text (label Area/Canali) + Tag (province) + Tag (canali)' },
  { selector: '#gravity-bell-btn', name: 'Notifiche', level: 'Molecola', custom: true,
    funzione: 'Campanella con **badge non lette**; apre il pannello notifiche.',
    figma: '*Badge* + *Dropdown* (icona BellOutlined)',
    composizione: 'Icon (Bell) + Badge (count) + Dropdown (lista: Text)' },
  { selector: '#gravity-role-switcher', name: 'Avatar / Cambio ruolo', level: 'Molecola', custom: true,
    funzione: 'Avatar con iniziali del **ruolo corrente**.\n- ⚠ **cambio ruolo: ESCLUSIVA DEL PROTOTIPO** (nel prodotto il ruolo è fisso)',
    figma: '*Avatar* Shape=Circle Type=Text + *Dropdown*',
    composizione: 'Avatar iniziali + Dropdown menu ruoli' },

  // ── Organismi custom ───────────────────────────────────────────────────────
  { selector: '.ss-card-map', name: 'Area mappa', level: 'Organismo', custom: true,
    funzione: 'Mappa interattiva degli impianti:\n- **pin per stato**\n- **cluster**\n- **overlay**',
    figma: 'Frame statica con pin (Google Maps — nessun equivalente AntD)',
    composizione: 'Google Maps + pin SVG + Infobox (Text/dot) + Radius control (Slider/InputNumber/Select)' },
  { selector: '.gv-page-header', name: 'Header', level: 'Organismo', custom: true,
    funzione: 'Card titolo sotto la navbar (contesto schermata).\n- **titolo · area di competenza/canali · CTA**\n- componente DS con varianti **Lista · Detail · avatar**\n- qui: variante **Lista**',
    figma: '*Header* (DS, node 91-35550) — Variant=Lista',
    composizione: 'Title + Text (Area) + Tag (province/canali) + Button (CTA primary)' },
  { selector: '#gravity-navbar', name: 'Navbar', level: 'Organismo', custom: true,
    funzione: 'Header globale sticky (condivisa tra moduli):\n- **logo** · **navigazione moduli**\n- **notifiche** · **cambio ruolo**',
    figma: '*Navbar* (vedi components/navbar.md)',
    composizione: 'Logo (img) + Menu (Text) + Icon+Badge (notifiche) + Avatar (ruolo)' },

  { selector: '#gravity-navbar a[href]', name: 'Logo Gravity', level: 'Atomo', custom: true,
    figma: 'Logo / Typo — brand/Gravity_type.svg',
    composizione: 'img SVG (solo logotipo, mai il mark da solo)' },

  { selector: '.page-content', name: 'Pagina lista', level: 'Pagina', custom: true,
    funzione: 'Pattern **List**:\n- header pagina\n- KPI cards\n- tabella pianificazioni',
    figma: 'Template di schermata Lista (LAYOUT.md §5.1)',
    composizione: 'Header + DataCard ×3 (KPI) + Table' },

];

// ════════════════════════════════════════════════════════════════════════════
// Dipendenze tra entità (pannello "Dipendenze" in navbar)
// Ogni voce ha un titolo, una descrizione e una tabella (headers / rows / note).
// Marche tabella: ✓ attivo · ✗ non attivo · ◐ condizionale.
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_DEPENDENCIES = [
  {
    id:    'stato-azioni',
    screen: 'Lista',
    title: 'Stato pianificazione × Azioni di riga',
    description: 'Quali azioni del menu di riga (lista) sono attive in base allo stato, alla trattativa e alle facce.',
    table: {
      headers: ['Stato', 'Vis.', 'Mod.', 'Dup.', 'Elim.'],
      rows: [
        ['Bozza · no trat.', '✓', '✓', '◐', '✓'],
        ['Bozza · trat.',    '✓', '✓', '◐', '✗'],
        ['In trattativa',    '✓', '✗', '✓', '✗'],
        ['Completata',       '✓', '✗', '◐', '✗'],
      ],
      note: '◐ = solo se facce > 0 · Visualizza sempre attiva',
    },
  },
  {
    id:    'stato-modificabilita',
    screen: 'Dettaglio',
    title: 'Stato × Modificabilità (dettaglio)',
    description: 'Cosa è modificabile nel dettaglio in base a stato e assegnatario.',
    table: {
      headers: ['Stato', 'Modifica form', 'Seleziona spazi'],
      rows: [
        ['Bozza (mia)',         '✓', '✓'],
        ['In trattativa (mia)', '✗', '✓'],
        ['Completata',          '✗', '✗'],
        ['Assegnata ad altri',  '✗', '✗'],
      ],
      note: 'Modifica form (metadati) solo in Bozza · sola lettura se Completata o di altri',
    },
  },
  {
    id:    'trattativa-consegna',
    screen: 'Dettaglio',
    title: 'Trattativa × Consegna',
    description: 'Stato del pulsante di consegna in base a trattativa collegata e spazi selezionati.',
    table: {
      headers: ['Condizione', 'Pulsante consegna'],
      rows: [
        ['Nessuna trattativa',     'Disabilitato'],
        ['Trattativa · 0 spazi',   'Disabilitato'],
        ['Trattativa · ≥1 spazio', 'Consegna in trattativa'],
        ['Consegnata · modifiche', 'Aggiorna consegna'],
      ],
      note: 'Senza trattativa collegata la consegna è bloccata',
    },
  },
  {
    id:    'stato-disponibilita',
    screen: 'Dettaglio (mappa)',
    title: 'Stato pianificazione × Stati disponibilità visibili',
    description: 'Quali stati di disponibilità degli impianti sono mostrati/selezionabili sulla mappa.',
    table: {
      headers: ['Stato', 'Disponibile', 'In Opzione', 'Riservato'],
      rows: [
        ['Bozza',         '✓', '✗', '✗'],
        ['In trattativa', '✓', '✓', '✗'],
        ['Completata',    '✗', '✗', '✗'],
      ],
      note: 'Completata: sola lettura, nessuna selezione',
    },
  },
];
