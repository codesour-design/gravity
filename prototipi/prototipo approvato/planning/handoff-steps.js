/**
 * Handoff tours — Planning
 * Ogni tour = una user story. Aggiungere nuovi tour all'array HANDOFF_TOURS.
 *
 * HANDOFF_COMPONENTS: registro per l'inspector dev (hover sui componenti).
 * Derivato da COMPONENTI.md — name, level (Atomo/Molecola/Organismo),
 * custom?, funzione, figma, composizione?, variant?(el).
 * Il matching usa closest(selector): vince l'elemento più profondo.
 */

// Helper di navigazione: aprono dalla lista la pianificazione adatta alla casistica.
function _ghfOpenRow(row) { if (!row) return; var c = row.querySelector('.ant-table-cell'); (c || row).click(); }
function ghfOpenMinePlanning() {
  // pianificazione già presa in carico (mia): riga con "(tu)" nel pianificatore
  var rows = document.querySelectorAll('.ant-table-tbody .ant-table-row');
  for (var i = 0; i < rows.length; i++) { if (/\(tu\)/i.test(rows[i].textContent || '')) { _ghfOpenRow(rows[i]); return; } }
  _ghfOpenRow(rows[0]);
}
function ghfOpenUnassignedPlanning() {
  // pianificazione NON assegnata: riga col pulsante "Prendi in carico"
  var btn = document.querySelector('.ant-table-tbody .ant-btn-dashed');
  if (btn && btn.closest) { _ghfOpenRow(btn.closest('.ant-table-row')); return; }
  _ghfOpenRow(document.querySelector('.ant-table-tbody .ant-table-row'));
}
function ghfOpenMineDraft() {
  // pianificazione mia (Bozza) SENZA trattativa: riga "(tu)" con "Collega Trattativa"
  var rows = document.querySelectorAll('.ant-table-tbody .ant-table-row');
  for (var i = 0; i < rows.length; i++) {
    var t = rows[i].textContent || '';
    if (/\(tu\)/i.test(t) && /Collega Trattativa/i.test(t)) { _ghfOpenRow(rows[i]); return; }
  }
  ghfOpenMinePlanning();
}

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
    // Torna alla lista dal dettaglio
    goTo: function () {
      var back = document.querySelector('.plh-back');
      if (back) back.click();
    },
  },
  'selezione-spazi': {
    label:  'Selezione spazi',
    detect: function () { return !!document.querySelector('.ss-card-map'); },
    // Apre una pianificazione già presa in carico (mia) per entrare nella selezione spazi
    goTo: ghfOpenMinePlanning,
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
        description: 'Tre card in cima alla pagina riassumono il carico di lavoro: **pianificazioni non assegnate**, **mie bozze** e **mie pianificazioni in trattativa**. I counter si aggiornano in tempo reale.\n- ==⚠ Le card e i conteggi cambiano in base al ruolo== (Planner / Operations Manager)',
        selector:    '.gv-kpi-cards',
        placement:   'bottom',
        dev: [
          { label: 'Componente', value: 'DataCard ×3 (System Card DS)' },
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
          { label: 'Componente', value: 'Table (AntD)' },
        ],
      },
      {
        title:       'Colonna "Pianificatore" e assegnazione',
        description: 'Le pianificazioni **assegnate a me** mostrano il mio nome con **"(tu)"**. Quelle **non assegnate** espongono l\'azione inline **"Prendi in carico"** (→ US#1.1).',
        colIndex:    4,
        placement:   'left',
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
          { label: 'Componente', value: 'Table (AntD)' },
        ],
      },

      {
        title:       'Colonna "Pianificatore"',
        description: 'La colonna mostra **tre stati possibili**: il nome del planner assegnato (se già presa in carico), il bottone **"Prendi in carico"** (se non assegnata e il ruolo è **Planner**), oppure **"—"** (se non assegnata ma il ruolo non è Planner).',
        colIndex:    4,
        placement:   'left',
      },

      {
        title:       'Bottone "Prendi in carico"',
        description: 'Bottone **dashed** con icona **UserAdd**. Renderizzato solo se la pianificazione **non ha un planner assegnato** AND il **ruolo corrente è Planner**. Altrimenti la cella mostra il nome del planner o "—".',
        selector:    '.ant-table-tbody .ant-btn-dashed',
        placement:   'left',
        dev: [
          { label: 'Componente', value: 'Button — Type=Dashed, icona UserAdd' },
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
          { label: 'Componente', value: 'Popconfirm — okText "Prendi in carico", cancelText "Annulla"' },
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
          { label: 'Componente', value: 'Message — Type=Success' },
        ],
      },

      {
        title:       'Risultato: colonna aggiornata',
        description: 'La colonna Pianificatore si aggiorna con **avatar + nome** del planner assegnato. Aggiornamento **in-memory** — non persiste tra navigazioni nel prototipo.',
        colIndex:    4,
        placement:   'left',
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
    goTo:        ghfOpenUnassignedPlanning,
    steps: [
      {
        title:       'Sola lettura + box informativo',
        description: 'Finché non è presa in carico, il dettaglio è in **sola lettura**: non si possono selezionare impianti. Un **box informativo** invita a prenderla in carico per lavorare sulla selezione.',
        selector:    '.ant-alert',
        placement:   'bottom',
      },
      {
        title:       'Bottone "Prendi in carico"',
        description: 'Nell\'**header** del dettaglio il bottone **"Prendi in carico"** appare se la pianificazione non ha un planner.',
        selector:    '.gv-btn-takecharge',
        placement:   'bottom',
        dev: [
          { label: 'Componente', value: 'Button "Prendi in carico" (header dettaglio)' },
        ],
      },
      {
        title:       'Popconfirm di conferma',
        description: 'Il click apre una **popconfirm**: "Prendere in carico la pianificazione?" con le azioni **"Prendi in carico"** e "Annulla".',
        selector:    '.ant-popover.ant-popconfirm',
        placement:   'bottom',
        onEnter: function () { var b = document.querySelector('.gv-btn-takecharge'); if (b) b.click(); },
        delay: 200,
      },
      {
        title:       'Feedback: toast',
        description: 'Alla conferma un **toast** comunica l\'avvenuta presa in carico.',
        selector:    '.ant-message-notice',
        placement:   'bottom',
        onEnter: function () { var ok = document.querySelector('.ant-popconfirm .ant-btn-primary'); if (ok) ok.click(); },
        delay: 240,
      },
      {
        title:       'Risultato: dettaglio editabile',
        description: 'Il **nome del planner compare nell\'header**, il pulsante scompare e la pianificazione diventa **editabile** (selezione impianti attiva). In lista la card "Da prendere in carico" aggiorna il counter.',
        selector:    '.gv-detail-header',
        placement:   'bottom',
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
    goTo:        ghfOpenMineDraft,
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
      },
      {
        title:       'Aggiorna consegna',
        description: 'Se dopo la consegna gli spazi cambiano, il pulsante diventa **"Aggiorna consegna"**. Prima di aggiornare una **modale** mostra le **differenze**: facce aggiunte, rimosse e con cambio di stato di disponibilità.',
        selector:    '.gv-btn-consegna',
        placement:   'bottom',
      },
      {
        title:       'Sola lettura (altri stati)',
        description: 'Quando la pianificazione è **Completata** o **assegnata ad altri**, il dettaglio è in **sola lettura**: un **banner** lo segnala e le azioni di modifica/consegna sono disattivate. (Qui sei su una tua bozza, quindi editabile.)',
        selector:    '.gv-detail-header',
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
        selector:    '.bpn',
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
        selector:    '.ss-searchbar-wrap',
        placement:   'bottom',
      },
      {
        title:       'Risultati e budget',
        description: 'Il **totale** degli spazi trovati è aggiornato in tempo reale; si **switcha** tra "Risultati" e "Selezionati" (→ US#3).\n- ==Fuori MVP== se il costo dei selezionati supera il budget, il valore appare in **rosso** nella card "Budget"\n- ==Fuori MVP== ogni impianto selezionato può ricevere **etichette colorate** cliccando l\'icona accanto al nome',
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
        description: 'Chiuso il drawer, i filtri applicati restano visibili come **chip rimovibili** subito **sotto la search bar**, senza doverlo riaprire.',
        selector:    '.ss-search-area',
        placement:   'bottom',
        onEnter: function () {
          var c = document.querySelector('.ant-drawer-close');
          if (c) c.click();
        },
        delay: 240,
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
        description: 'Al click sulla **checkbox** del record (o sul button **"Aggiungi alla pianificazione"** nel dropdown del marker) l\'impianto viene **aggiunto** alla pianificazione e compare nella tab "Selezionati".',
        selector:    '.ss-sys-head',
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
          { label: 'Componente', value: 'StateBadge — Bozza / In trattativa / Completata' },
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
            ['Bozza · senza trattativa',     '✓', '✓', '◐', '✓'],
            ['Bozza · trattativa collegata', '✓', '✓', '◐', '✗'],
            ['In trattativa',                '✓', '✗', '✓', '✗'],
            ['Completata',                   '✓', '✗', '✓', '✗'],
          ],
          note: '◐ = solo se facce > 0 · Visualizza sempre attiva · Duplica sempre attiva in Completata',
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
  { selector: '.ant-btn-link', name: 'Link button', level: 'Molecola', figma: '*Button* Type=Link',
    composizione: 'Icon (opz.) + Text' },
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
  { selector: '.anticon', name: 'Icon', level: 'Atomo', icon: true },

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
  { selector: '.gv-state-badge', name: 'Badge', level: 'Atomo', tag: true,
    figma: '*Badge* status — Bozza=warning · In trattativa=processing · Completata=success',
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
  { selector: '.ss-searchbar-wrap', name: 'Pill di ricerca luogo', level: 'Molecola', custom: true,
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
  { selector: '.gv-detail-header', name: 'Header', level: 'Organismo', custom: true,
    funzione: 'Card titolo del dettaglio (sotto la navbar, schermata Selezione spazi).\n- **back · titolo + categoria · azioni** (Collega / Consegna / Condividi)\n- componente DS con varianti **Lista · Detail · avatar**\n- qui: variante **Detail**',
    figma: '*Header* (DS, node 91-35550) — Variant=Detail',
    composizione: 'Link (back) + Title + Tag (categoria) + Button (azioni)' },
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
    title: 'Stato pianificazione × Azioni di riga',
    description: 'Quali azioni del menu di riga (lista) sono attive in base allo stato, alla trattativa e alle facce.',
    table: {
      headers: ['Stato', 'Vis.', 'Mod.', 'Dup.', 'Elim.'],
      rows: [
        ['Bozza · senza trattativa',     '✓', '✓', '◐', '✓'],
        ['Bozza · trattativa collegata', '✓', '✓', '◐', '✗'],
        ['In trattativa',                '✓', '✗', '✓', '✗'],
        ['Completata',                   '✓', '✗', '✓', '✗'],
      ],
      note: '◐ = solo se facce > 0 · Visualizza sempre attiva · Duplica sempre attiva in Completata',
    },
  },
  {
    id:    'stato-modificabilita',
    title: 'Stato × Modificabilità pianificazione',
    description: 'Cosa è modificabile in base a stato e assegnatario.',
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
    title: 'Consegna Pianificazione',
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
    title: 'Stati impianto visibili in base a stato pianificazione',
    description: 'Quali stati di disponibilità degli impianti sono mostrati/selezionabili sulla mappa.',
    table: {
      headers: ['Stato', 'Disponibile', 'In Opzione', 'Riservato'],
      rows: [
        ['Bozza',         '✓', '✗', '✗'],
        ['In trattativa', '✓', '✓', '✗'],
        ['Completata',    '✓', '✓', '✓'],
      ],
      note: 'Completata: sola lettura, nessun filtro, tutti gli stati visibili',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Note interne (pannello "Note" in navbar) — appunti di design per lo sviluppo.
// body supporta **grassetto**, righe "- " (lista) e ==evidenziato==.
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_NOTES = [
  {
    id: 'tipo-vendita',
    title: 'Tipo vendita · modello & quattordicine',
    body: 'In questa fase il **modello di vendita** è già configurato:\n- **Standard** — 7 giorni\n- **Quattordicina** — 14 giorni\n- **LT (long term)** — da 1 mese in su (illimitato)\n- **Custom** — libero, da 1 giorno in su\n\nLa somma di più quattordicine è oggi solo una **valutazione di design** e potrebbe richiedere un ripensamento delle trattative.\n- ==Per ora ogni campagna ha una sola quattordicina assegnata e ogni pianificazione è limitata a una sola==',
  },
  {
    id: 'card-ruolo',
    title: 'Card KPI per ruolo',
    body: 'Le card in cima alla lista (e i relativi conteggi) **cambiano in base al ruolo**.\n- ==Per i ruoli diversi dal Planner il design delle card è ancora da definire==',
  },
  {
    id: 'assegnazione-futura',
    title: 'Assegnazione pianificazioni (sprint futuri)',
    body: 'In sprint successivi si valuterà l\'**assegnazione delle pianificazioni ai Planner da parte degli Operation Manager**. Oggi non è prevista.',
  },
  {
    id: 'campagna-senza-trattativa',
    title: 'Pianificazione ↔ campagna senza trattativa (sprint futuri)',
    body: 'Il flusso in cui una pianificazione viene collegata a una **campagna senza trattativa** sarà progettato in sprint successivi, dopo un **redesign della funzionalità Campagne**.',
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Relazioni tra entità del dominio (tab "Relazioni" nel pannello Modello).
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_RELATIONS = [
  {
    id: 'entita',
    title: 'Relazioni tra entità',
    description: 'Cardinalità principali del dominio Planning.',
    table: {
      headers: ['Da', '', 'A', 'Cardinalità'],
      rows: [
        ['Trattativa',     '→', 'Inserzionista',  'N : 1'],
        ['Trattativa',     '→', 'Campagna',       '1 : N'],
        ['Campagna',       '→', 'Pianificazione', '1 : 1'],
        ['Campagna',       '→', 'Quattordicina',  '1 : 1'],
        ['Pianificazione', '→', 'Planner',        'N : 1'],
        ['Pianificazione', '→', 'Impianto',       '1 : N'],
        ['Impianto',       '→', 'Faccia',         '1 : N'],
      ],
      note: 'Cardinalità a livello di design, da confermare in fase backend.',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Scenari Pianificazione (tab "Scenari" nel pannello Modello):
// combinazioni valide tra stato, trattativa, entità collegate e impianti.
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_SCENARIOS = [
  {
    id: 'dati-trattativa',
    title: 'Dati che arrivano dalla trattativa',
    description: 'Se la pianificazione è collegata a una trattativa, questi campi sono **ereditati e read-only**. Senza trattativa non esistono inserzionista/campagna e gli altri si impostano a mano.',
    table: {
      headers: ['Campo', 'Da trattativa', 'Senza trattativa'],
      rows: [
        ['Inserzionista',     '✓', '✗'],
        ['Campagna',          '✓', '✗'],
        ['Canale (OOH/DOOH)', '✓', 'manuale'],
        ['Periodo',           '✓', 'manuale'],
        ['Tipo vendita',      '✓', 'manuale'],
      ],
      note: '✓ = ereditato e read-only · "manuale" = impostato a mano · ✗ = non esiste',
    },
  },
  {
    id: 'scenari',
    title: 'Scenari (stato × collegamenti)',
    description: 'Una **Bozza** può non avere trattativa (quindi né inserzionista né campagna) e avere comunque impianti selezionati.',
    table: {
      headers: ['Scenario', 'Tratt.', 'Inserz./Camp.', 'Impianti', 'Azione chiave'],
      rows: [
        ['Bozza libera · mia',                 '✗', '✗', '◐', 'Seleziona · Collega'],
        ['Bozza da trattativa · non assegnata','✓', '✓', '✗', 'Prendi in carico'],
        ['Bozza da trattativa · mia',          '✓', '✓', '◐', 'Seleziona · Consegna'],
        ['In trattativa',                      '✓', '✓', '✓', 'Aggiorna consegna'],
        ['Completata',                         '✓', '✓', '✓', 'Sola lettura'],
        ['Assegnata ad altri',                 '◐', '◐', '◐', 'Sola lettura'],
      ],
      note: '✓ presente · ✗ assente · ◐ opzionale/variabile · "Bozza libera non assegnata" non è un caso possibile (nemmeno via Operation Manager) · Prendi in carico solo su Bozza da trattativa non assegnata · Completata e "di altri" = sola lettura',
    },
  },
];
