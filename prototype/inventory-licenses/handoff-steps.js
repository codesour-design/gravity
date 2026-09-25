/**
 * Handoff — Permessi: V2 (modello dati Autorizzazione/Concessione/Contratto Privato)
 * Recepisce i gap tra modello dati e realtà normativa italiana in materia di pubblicità
 * esterna (analisi giuridica del dominio). Attiva SOLO con ?handoff=v2 — vedi eccezione
 * documentata "switch UI reale v1/v2" in components/handoff-engine.md: V1
 * (handoff-steps-v1.js) resta l'unica versione approvata e non viene toccata da questo
 * lavoro, che vive interamente dietro window.__PERMESSI_UI_VERSION === 'v2'.
 * `current` in versions è SEMPRE self-referenziale (riflette il file effettivamente
 * caricato, non "su cosa stiamo lavorando" — quello lo dice `note`/`approved`): qui è V2 a
 * essere true, mai V1, altrimenti il VersionBadge crede di essere già su V1 e il click su
 * "V1" non naviga più.
 */

window.HANDOFF_META = {
  title: 'Permessi — Autorizzazioni, Concessioni e Contratti Privati',
  version: 'V2',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: true, current: false, note: 'Versione approvata' },
    { id: 'V2', file: 'index.html?handoff=v2', approved: false, current: true, note: 'In lavorazione' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// Interfaccia semplificata (toggle nel pannello Sprint Jira) — stessa esclusione di V1:
// la Modifica di un permesso esistente non è coperta neanche da questo giro di lavoro.
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_OUT_OF_SPRINT = [
  { selector: '#grav-tour-permit-modifica-btn', note: 'Non sviluppata — la modifica di un permesso esistente non è coperta da questo prototipo, solo la creazione' },
  { selector: '.ant-dropdown-menu-item', text: 'Modifica', note: 'Non sviluppata — stessa esclusione del pulsante "Modifica" nel dettaglio permesso' },
];

window.HANDOFF_TOURS = [];

// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_COMPONENTS = [
  { selector: '.grav-autorizzazione-origine-section', name: 'Sezione "Origine" (Autorizzazione v2)', level: 'Organismo', custom: true,
    funzione: 'Seconda sezione del drawer Nuova Autorizzazione (nota \'concessione-contratto-impianti-collegati\'), estratta da "Informazioni" per coerenza con Concessione — Include concessione suolo pubblico + Concessione o Contratto di riferimento, quest\'ultimo collegato tramite drawer invece di una Select (nota \'permessi-collegamento-drawer-card\'). Rinominata da "Provenienza" (termine ritenuto poco chiaro) su richiesta esplicita. Disabilitata (non nascosta) finché il Tipo Autorizzazione non è "Esposizione pubblicitaria".',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Checkbox + stato vuoto illustrato/GravityEntityCard con drawer "Collega atto di provenienza"',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-concessione-origine-section', name: 'Sezione "Origine" (Concessione)', level: 'Organismo', custom: true,
    funzione: 'Seconda sezione del drawer Nuova Concessione (nota \'concessione-contratto-drawer-a-sezioni\'): Modalità di attribuzione (Bando pubblico/Affidamento diretto/Rinnovo) con campi condizionali quando "Bando pubblico". Nessuna condizione di sblocco: sempre raggiungibile.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Select + Input/DatePicker/TextArea condizionali',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-autorizzazione-impianti-tab', name: 'Sezione "Cimasa e CUP" (Autorizzazione v2)', level: 'Organismo', custom: true,
    funzione: 'Terza sezione del drawer Nuova Autorizzazione (nota \'autorizzazione-impianti-tab-dedicata\'), ispirata al Nuovo Impianto di inventory-systems — elenco a righe, una per impianto, popolato dal drawer "Collega impianti" (nota \'permessi-collegamento-drawer-card\', esclude gli impianti già autorizzati per lo stesso Tipo): colonna Impianto sola lettura (icona tipologia + ID + indirizzo, popover Ⓘ con Tipo/Formato/Suolo/Superficie per riconoscerli) + Input codice cimasa + InputNumber CUP editabili inline. Disabilitata finché il Tipo Autorizzazione non è scelto nella sezione "Informazioni". Zero impianti collegati è uno stato valido, mostrato con stato vuoto illustrato.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Row/Col a righe (9/7/5/3) + Popover di riconoscimento + Drawer "Collega impianti" (ricerca, checkbox multiple) + azione secondaria "Aggiungi senza impianto" (diretta, fuori dal drawer)',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-concessione-impianti-tab', name: 'Sezione "Canone Patrimoniale" (Concessione v2)', level: 'Organismo', custom: true,
    funzione: 'Terza sezione del drawer Nuova Concessione (nota \'concessione-contratto-impianti-collegati\'), stesso elenco a righe dell\'Autorizzazione — drawer "Collega impianti" filtrato al solo suolo Pubblico, con Input Numero Utenza + InputNumber Canone Patrimoniale editabili inline. Nessuna condizione di sblocco. Zero impianti collegati è uno stato valido, mostrato con stato vuoto illustrato.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Row/Col a righe (9/7/5/3) + Popover di riconoscimento + Drawer "Collega impianti" (ricerca, checkbox multiple) + azione secondaria "Aggiungi senza impianto" (diretta, fuori dal drawer)',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-contratto-impianti-tab', name: 'Sezione "Canone Locazione" (Contratto Privato)', level: 'Organismo', custom: true,
    funzione: 'Terza sezione del drawer Nuovo Contratto Privato (nota \'concessione-contratto-impianti-collegati\'), stesso elenco a righe di Concessione/Autorizzazione — drawer "Collega impianti" filtrato al solo suolo Privato, con Input Numero Utenza + InputNumber Canone Locazione editabili inline. Nessuna condizione di sblocco. Zero impianti collegati è uno stato valido, mostrato con stato vuoto illustrato.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Row/Col a righe (9/7/5/3) + Popover di riconoscimento + Drawer "Collega impianti" (ricerca, checkbox multiple) + azione secondaria "Aggiungi senza impianto" (diretta, fuori dal drawer)',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-contratto-catastale-section', name: 'Sezione "Riferimento Catastale" (Contratto Privato)', level: 'Molecola', custom: true,
    funzione: 'Seconda sezione del drawer Nuovo Contratto Privato (nota \'concessione-contratto-drawer-a-sezioni\'): Foglio/Particella/Subalterno, tutti facoltativi — non disabilitata, sono solo dati di natura diversa dalle altre due sezioni.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → 3× Form.Item + Input in Row',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-contratto-bridge-alert', name: 'Alert "Autorizzazione mancante" (dettaglio Contratto)', level: 'Molecola', figma: 'Alert — Type=Warning · ShowIcon=true, non chiudibile, non bloccante' },
  // v2 — nota di manutenzione doc↔codice: il dettaglio Permesso è stato consolidato in un
  // componente condiviso InfoCard (card laterali "Origine"/"Copertura"/"Riferimento
  // Catastale" via l'array sideCards, card principale "Impianti collegati" via un unico
  // mainCardNode con spec per kind) — non più un div con className dedicata per ciascun
  // blocco. Le voci sotto riflettono i selettori CSS realmente presenti oggi.
  { selector: '.grav-detail-side-cards .info-card', name: 'Card laterali dettaglio (Origine/Copertura/Riferimento Catastale/Autorizzazioni collegate)', level: 'Organismo', custom: true,
    funzione: 'Griglia responsive (auto-fit, min 320px) di card InfoCard, una per dettaglio secondario specifico del kind: "Origine" (Concessione, modalità di attribuzione), "Copertura" (Autorizzazione, solo Esposizione pubblicitaria), "Riferimento Catastale" + "Autorizzazioni collegate" (Contratto Privato). Nessuna classe dedicata per singola card: si riconoscono dalla label nell\'header (icona + testo).',
    composizione: 'div.grav-detail-side-cards (CSS grid) → InfoCard (icona + label + Descriptions)',
    figma: 'Descriptions — Bordered=false · Column=1, dentro una Card, pattern Detail View di LAYOUT.md §3.4' },
  { selector: '.grav-detail-main-card', name: 'Card principale "Impianti collegati" (dettaglio, tutti i tipi v2)', level: 'Organismo', custom: true,
    funzione: 'Unica card a piena larghezza, con spec (dati/colonne/tip/nota) per kind: Impianto/Codice Autorizzazione per cimasa/CUP (Autorizzazione, nota \'autorizzazione-impianti-tab-dedicata\'), Impianto/Numero Utenza/Canone Patrimoniale (Concessione) o Canone Locazione (Contratto) — entrambe nota \'concessione-contratto-impianti-collegati\'.',
    composizione: 'div.grav-detail-main-card → InfoCard (icona + label con tip + Table)',
    figma: 'Title + Table, pattern Detail View di LAYOUT.md §3.4' },
];

// ════════════════════════════════════════════════════════════════════════════
// Dipendenze tra entità (pannello "Dipendenze" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════
var ROLE_ACTION_MATRIX_V2 = {
  headers: ['Ruolo', 'Vedi lista', 'Crea', 'Modifica', 'Elimina', 'Collega Spazi'],
  rows: [
    ['Inventory Manager', '✓', '✓', '◐', '✓', '✓'],
    ['Tenant Admin', '✓', '✓', '◐', '✓', '✓'],
    ['Altri ruoli', '✗', '✗', '✗', '✗', '✗'],
  ],
  note: '◐ = form di modifica non sviluppato in questo prototipo (vedi Interfaccia semplificata). Basato su docs/product/role-matrix.md — "Gestione Permessi" è assegnata solo a Inventory Manager, Admin Tenant e Super Admin. Invariata rispetto a V1: il nuovo Contratto Privato è sibling di Concessione/Autorizzazione, stessa matrice ruolo × azione.',
};
window.HANDOFF_DEPENDENCIES = [
  {
    id: 'ruolo-azione',
    title: 'Ruolo × Azione',
    description: 'Chi può fare cosa nel modulo Permessi (inclusi i Contratti Privati).',
    table: ROLE_ACTION_MATRIX_V2,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Relazioni tra entità (pannello "Relazioni" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_RELATIONS = [
  {
    id: 'entita',
    title: 'Relazioni tra entità',
    description: 'Cardinalità principali del dominio Permessi — Contratto Privato è sibling di Concessione/Autorizzazione, non un suo sottotipo (regime giuridico e ciclo di vita diversi). Impianto è il perno fisico: ogni suo collegamento è mutuamente esclusivo Concessione/Contratto (nota "impianto-suolo-esclusivo-concessione-contratto") e le relazioni con Contratto/Autorizzazione sono VISTE DERIVATE (nota "contratto-vista-derivata" / "relazioni-derivate-impianti"), non FK dirette.',
    table: {
      headers: ['Da', '', 'A', 'Cardinalità'],
      rows: [
        ['Concessione', '→', 'Impianto', '1 : N — diretto (Collega Spazi), solo se Impianto su suolo Pubblico'],
        ['Contratto Privato', '→', 'Impianto', '1 : N — diretto (Collega Spazi), solo se Impianto su suolo Privato'],
        ['Impianto', '↔', 'Autorizzazione', 'N : N — diretto (Collega Spazi dal lato Autorizzazione)'],
        ['Autorizzazione', '→', 'Concessione / Contratto Privato', 'N : 1 — DICHIARATO, solo se Tipo = "Esposizione pubblicitaria" e Include concessione suolo pubblico = No (campo attoProvenienzaId, nota "autorizzazione-atto-provenienza-scollegato") — mutuamente esclusivo col check, non un suo dettaglio'],
        ['Contratto Privato', '⇢', 'Autorizzazione', 'N : N — DERIVATA tramite gli Impianti in comune, nessun FK (getAutorizzazioniDerivate)'],
        ['Concessione', '⇢', 'Autorizzazione', 'N : N — DERIVATA tramite gli Impianti in comune, stessa logica'],
      ],
      note: 'Cardinalità a livello di design, da confermare in fase backend. "→" = FK diretta; "⇢" = vista derivata via impianti in comune, calcolata a runtime, non salvata.',
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
    description: 'Alla creazione, lo Stato non è un campo compilabile: si deriva dalla Data Scadenza. Vale per tutte e tre le entità, incluso il nuovo Contratto Privato.',
    table: {
      headers: ['Condizione', 'Stato assegnato'],
      rows: [
        ['Data Scadenza oggi o nel futuro', '✓ Attiva'],
        ['Data Scadenza nel passato', '✗ Scaduta'],
      ],
      note: 'Calcolato automaticamente al salvataggio (creazione), non è un campo editabile manualmente.',
    },
  },
  {
    id: 'campi-condizionali-copertura',
    title: 'Campi condizionali per Sezione e Tipo (Autorizzazione, v2)',
    description: 'Il drawer Nuova Autorizzazione v2 (GravitySectionDrawer, components/section-drawer.md) ha tre sezioni: "Informazioni" (dati generali), "Origine" (disabilitata finché il Tipo non è "Esposizione pubblicitaria") e "Cimasa e CUP" (elenco a righe, disabilitata finché il Tipo non è scelto — nome specifico invece del generico "Impianti collegati", nota "autorizzazione-impianti-tab-dedicata") — nota "autorizzazione-impianti-tab-dedicata". Tipo Autorizzazione (solo Esposizione pubblicitaria) sblocca la sezione "Origine" — vedi nota "autorizzazione-tipologia-overhaul".',
    table: {
      headers: ['Condizione', 'Campi sbloccati'],
      rows: [
        ['Informazioni — nessun Tipo scelto', 'Solo il campo Tipo Autorizzazione; sezioni Origine e Cimasa e CUP disabilitate'],
        ['Origine — Tipo = Esposizione pubblicitaria (Comunale)', 'Sezione sbloccata: Include concessione suolo pubblico + Concessione o Contratto di riferimento'],
        ['↳ e Include concessione suolo pubblico = Sì', 'Concessione o Contratto di riferimento resta visibile ma disabilitato (l\'Autorizzazione la include già, non c\'è un atto da collegare)'],
        ['↳ e Include concessione suolo pubblico = No', 'Concessione o Contratto di riferimento attivo — l\'atto che ha dato il bene poi autorizzato'],
        ['Cimasa e CUP — un Tipo è stato scelto', 'Elenco a righe popolato dal drawer "Collega impianti" (nota "permessi-collegamento-drawer-card", esclude impianti già autorizzati per lo stesso Tipo, facoltativo — si può collegare in un secondo momento) con Codice Autorizzazione per cimasa + CUP editabili inline — zero impianti collegati è uno stato valido, mostrato con stato vuoto illustrato'],
      ],
      note: 'Cambiare Tipo Autorizzazione pulisce Ente Emittente e gli impianti già collegati nella sezione Cimasa e CUP (potrebbero non essere validi per il nuovo tipo), così il salvataggio non porta con sé dati fantasma.',
    },
  },
  {
    id: 'sezioni-concessione-contratto',
    title: 'Sezioni del drawer — Autorizzazione, Concessione e Contratto Privato (v2)',
    description: 'Stesso pattern UX su tutti e tre i tipi di Permesso (GravitySectionDrawer, note "concessione-contratto-drawer-a-sezioni" e "concessione-contratto-impianti-collegati"): drawer a più sezioni invece di un unico pannello Drawer semplice (quello di V1). La sezione "Impianti collegati" (elenco a righe, drawer "Collega impianti") è sempre la terza, per coerenza strutturale tra i tre tipi — ma il suo nome nella sidebar è specifico per tipo (non più "Impianti collegati" identico ovunque), per comunicare da subito cosa si autorizza lì dentro invece di scoprirlo solo aprendo la sezione.',
    table: {
      headers: ['Entità', 'Sezioni (in ordine)'],
      rows: [
        ['Autorizzazione', 'Informazioni (dati generali dell\'atto) · Origine (disabilitata se il Tipo non è Esposizione pubblicitaria) · Cimasa e CUP (disabilitata finché il Tipo non è scelto)'],
        ['Concessione', 'Informazioni (dati dell\'atto + area concessa) · Origine (modalità di attribuzione) · Canone Patrimoniale (numero utenza + canone patrimoniale per impianto)'],
        ['Contratto Privato', 'Informazioni (dati del contratto) · Riferimento Catastale (facoltativo) · Canone Locazione (numero utenza + canone di locazione per impianto)'],
      ],
      note: 'A differenza di Autorizzazione, in Concessione e Contratto Privato nessuna sezione è disabilitata: tutti i campi restano raggiungibili senza una scelta preliminare in un\'altra sezione.',
    },
  },
  {
    id: 'impianti-collegati-concessione-contratto',
    title: 'Impianti collegati — righe per Concessione e Contratto Privato (v2)',
    description: 'Nota "concessione-contratto-impianti-collegati": ogni riga collega un impianto, con numero utenza e canone specifici modificabili direttamente nella riga. Gli impianti proposti nel drawer "Collega impianti" (nota "permessi-collegamento-drawer-card") sono filtrati per natura del suolo (nota "impianto-suolo-esclusivo-concessione-contratto"), coerente col vincolo già applicato in "Collega Spazi".',
    table: {
      headers: ['Entità', 'Suolo proposto nel drawer', 'Campo canone per riga', 'Totale mostrato in lista/dettaglio'],
      rows: [
        ['Concessione', 'Pubblico', 'Canone Patrimoniale', 'Somma delle righe collegate (fallback su totaleCanone se nessun impianto collegato)'],
        ['Contratto Privato', 'Privato', 'Canone Locazione', 'Somma delle righe collegate (fallback su canoneLocazioneAnnuo se nessun impianto collegato)'],
      ],
      note: 'Zero impianti collegati è uno stato valido (stessa regola di Autorizzazione), mostrato con stato vuoto illustrato: il canone totale resta comunque visibile grazie al fallback, non sparisce né va a zero per i record creati prima di questo giro di lavoro.',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_NOTES = [
  {
    id: 'permit-modifica-non-sviluppata',
    title: 'Modifica permesso — sviluppo futuro',
    body: 'Presente per completezza del layout (LAYOUT.md §3.4) ma **non ancora sviluppato**: solo la creazione è coperta da questo prototipo.\n- Vedi il toggle "Interfaccia semplificata" nel pannello Sprint Jira per evidenziarlo',
  },
  {
    id: 'ente-emittente-crud-fornitori',
    title: 'Ente Emittente — sostituisce i vecchi campi',
    body: '==Partita IVA rimossa== dal form: Ente Emittente non è più testo libero + IVA facoltativa, ma una **select su un\'anagrafica fornitori mockata**.\n- In produzione arriverà dal **CRUD Fornitori** (non ancora esistente), che porta con sé IVA e gli altri dati dell\'ente\n- Nessuna perdita dati: la vecchia IVA non veniva mai salvata sul record',
  },
  {
    id: 'ente-emittente-filtrato-per-tipo',
    title: 'Ente Emittente — filtrato dal Tipo Autorizzazione',
    body: 'L\'anagrafica Ente Emittente ora **dipende** dal Tipo Autorizzazione (ENTI_PER_TIPO_AUTORIZZAZIONE) invece di essere un elenco unico indipendente.\n- Il campo resta **nascosto** (non solo disabilitato) finché il Tipo non è scelto; cambiare Tipo dopo averne scelto uno lo **azzera**\n- Sulla Concessione l\'elenco resta fisso (Comuni + Città Metropolitana/Consorzio/ANAS): niente tipologia da categorizzare, niente società private (ora solo su Contratto Privato)\n- ==Enum tipologia rifatto da zero==: da 4 valori a **7 categorie complete** — vive in `tipologiaV2`, parallelo al vecchio `tipologia` che V1 legge invariato. Il CUP resta condizionale solo a "Esposizione pubblicitaria (Comunale)"\n- **Solo "Esposizione pubblicitaria (Comunale)" è selezionabile in questo giro**: le altre 6 restano nell\'enum ma **disabilitate in Select con motivo in hover**, non rimosse — modello a 7 categorie in vista di sviluppo futuro',
  },
  {
    id: 'autorizzazione-impianti-tab-dedicata',
    title: 'Autorizzazione v2 — drawer a sezioni, Impianti collegati sostituisce Impianti coperti',
    body: '**Ristrutturazione completa** del drawer Nuova Autorizzazione (v2), ispirata al Nuovo Impianto di inventory-systems: navigazione verticale a sezioni (`GravitySectionDrawer`) invece di un unico pannello — Informazioni, Origine (estratta in una sezione propria in un giro successivo, rinominata da "Provenienza" perché ritenuto un termine poco chiaro) e Impianti collegati nell\'ordine comune ai tre tipi di Permesso (nota "concessione-contratto-impianti-collegati"). Deprecata l\'intera logica "Impianti coperti" (Singolo/Più impianti, Codice Autorizzazione a valore singolo, allegato con lettura OCR simulata, drawer `CanonePerImpiantoDrawer`): il modello vive ora per-impianto in `impiantiAutorizzati` (`{ impiantoId, codiceAutorizzazione, cup }`), popolato riga per riga in "Impianti collegati". Il CUP mostrato in lista e nel dettaglio è la **somma** di quelle righe (`cupTotale`), non più il vecchio campo singolo `cup` (che V1 continua a leggere invariato).',
  },
  {
    id: 'concessione-contratto-drawer-a-sezioni',
    title: 'Concessione e Contratto Privato — stesso drawer a sezioni di Autorizzazione',
    body: '**Unificazione dell\'esperienza di creazione** tra i tre tipi di Permesso in v2: Concessione e Contratto Privato passano dal pannello Drawer semplice (unico, a scroll lungo) allo stesso `GravitySectionDrawer` già usato per Autorizzazione (nota "concessione-contratto-impianti-collegati" per l\'ordine finale delle sezioni). Nessun campo nuovo o rimosso in questo passaggio: sono gli stessi dati di prima, solo raggruppati in sezioni (`GravityFormArea`) invece che in un unico Form lineare. A differenza di Autorizzazione, in Concessione e Contratto Privato nessuna sezione è disabilitata: non c\'è un campo che ne sblocca un altro. **V1 resta invariata** (Concessione V1 e Autorizzazione V1 restano sul Drawer semplice a 640px; Contratto Privato non esiste in V1).',
  },
  {
    id: 'concessione-contratto-impianti-collegati',
    title: 'Impianti collegati — stesso pattern e stesso ordine su Autorizzazione, Concessione e Contratto Privato',
    body: '**Terza sezione, sempre**: in tutti e tre i tipi di Permesso v2 il drawer segue lo stesso ordine — **Informazioni**, poi la sezione specifica del tipo (**Origine** per Autorizzazione e Concessione, **Riferimento Catastale** per Contratto Privato), infine **Impianti collegati**. Stessa struttura in ogni tab: un elenco **a righe** (non una griglia di card, nota "permessi-collegamento-drawer-card" — a 20.000+ impianti in scala reale serve restare leggibili in verticale, una riga per impianto), popolato dal drawer "Collega impianti" invece che da una Select per riga — ogni riga ha una colonna Impianto sola lettura (icona tipologia + ID + indirizzo, con un popover Ⓘ per riconoscerlo tra impianti simili) e i campi propri del tipo modificabili direttamente: Codice Autorizzazione per cimasa e CUP per Autorizzazione, Numero Utenza e Canone Patrimoniale per Concessione, Numero Utenza e Canone Locazione per Contratto Privato. Gli impianti proposti nel drawer sono filtrati per natura del suolo dove il vincolo si applica (Pubblico su Concessione, Privato su Contratto Privato, nessun filtro su Autorizzazione — nota "impianto-suolo-esclusivo-concessione-contratto"). Zero impianti collegati è sempre uno stato valido, mostrato con uno stato vuoto illustrato: il permesso può esistere prima ancora che l\'impianto sia censito in Inventario · Impianti, e si collega in un secondo momento — oppure si dichiara esplicitamente "non ancora censito" dallo stesso drawer, ottenendo comunque una riga da completare.\n\n**Concessione reintroduce Numero Utenza**, rimosso in un giro precedente (nota "concessione-campi-estesi") quando viveva solo come vista derivata sull\'Impianto: ora torna compilabile, ma per impianto invece che come lista piatta sul record. Su entrambe Concessione e Contratto Privato il vecchio importo unico (Canone Concessorio, Canone Locazione) diventa la **somma delle righe**, con un fallback sul valore storico per i record creati prima di questo giro di lavoro: il totale resta sempre visibile in lista e nel dettaglio, non sparisce né va a zero. Gli impianti scelti popolano anche `spaziCollegati`, quindi compaiono subito in "Spazi collegati" nel dettaglio dopo il salvataggio, coerente col comportamento già in uso su Autorizzazione.',
  },
  {
    id: 'permessi-collegamento-drawer-card',
    title: 'Impianti collegati e Origine — collegamento entità via drawer, non più Select',
    body: 'Pattern ripreso dal drawer "Nuovo Impianto" di inventory-systems (empty state illustrato e collegamento Moduli tramite drawer dedicato), applicato qui a "Impianti collegati" (Autorizzazione, Concessione, Contratto Privato) e a "Concessione o Contratto di riferimento" nella sezione Origine dell\'Autorizzazione — non più una Select, in entrambi i casi: a 20.000+ impianti con nomi simili una Select semplice non basta a trovarli e riconoscerli. Prima di qualunque collegamento la sezione mostra uno stato vuoto con illustrazione, testo e un pulsante d\'azione ("Collega impianti" o "Collega atto di provenienza"). Il pulsante apre un drawer con ricerca e un elenco selezionabile — checkbox e selezione multipla per gli impianti, un unico elemento evidenziabile per l\'atto di provenienza — già pre-selezionato con quanto risulta collegato.\n\nIl risultato del collegamento non ha però la stessa forma nei due casi. L\'atto di provenienza (un solo legame possibile) diventa una card (`GravityEntityCard`, lo stesso componente condiviso delle card in "Spazi collegati") con un\'azione "Scollega". Gli impianti collegati (potenzialmente molti) restano invece un elenco **a righe**, non una griglia di card: ogni riga ha una colonna identità sola lettura (icona tipologia + ID + indirizzo, non più editabile qui — si cambia impianto scollegando e ricollegando dal drawer) e le colonne dei campi propri del tipo, editabili inline, esattamente come nell\'editor a righe che questo pattern sostituisce. Per riconoscere impianti diversi con nomi simili, un\'icona Ⓘ accanto all\'identità apre in hover un popover con Tipo/Formato/Suolo/Superficie (dati reali dell\'impianto, non una foto: `FOTO_IMPIANTO` altrove nel repo è un\'assegnazione pseudo-casuale per id, non una vera foto per impianto, quindi fuorviante per il riconoscimento). Accanto a "Collega impianti" c\'è una seconda azione, diretta e fuori dal drawer: "Aggiungi senza impianto" — segnare cimasa/CUP (o numero utenza/canone) prima ancora che l\'impianto sia censito in Inventario è un caso d\'uso tanto frequente quanto collegarne uno esistente, quindi ha il proprio punto di ingresso a un click invece di essere sepolto in fondo al drawer di ricerca. La riga risultante mostra un Tag "Da censire" al posto dell\'identità, con gli stessi campi editabili delle altre righe. Quando l\'impianto viene poi censito, un\'azione "Seleziona impianto" accanto al Tag riapre lo stesso drawer in scelta singola (Radio, nessuna preselezione, candidati già collegati altrove esclusi) e **aggiorna quella riga specifica** con l\'impianto scelto — i campi già compilati non si perdono, non è un\'aggiunta di riga ma una risoluzione della stessa.',
  },
  {
    id: 'autorizzazione-atto-provenienza-scollegato',
    title: 'Atto di provenienza — scollegato da "Include concessione suolo pubblico"',
    body: '**Correzione al modello**: "Concessione o Contratto di riferimento" non dipende più da "Include concessione suolo pubblico" — sono situazioni **mutuamente esclusive**, non una il dettaglio dell\'altra. Con il check spuntato l\'atto include già la concessione di suolo pubblico: il campo resta visibile ma **disabilitato con motivo in tooltip** (LAYOUT.md §6.2), valore azzerato. Con il check non spuntato il campo si popola tramite il drawer "Collega atto di provenienza" (nota "permessi-collegamento-drawer-card"), che collega la Concessione o il **Contratto Privato** che ha dato il bene su cui insiste l\'impianto. ==Campo "Estensione occupazione" (mq) rimosso==: col check spuntato non resta nulla da compilare. Facoltativo: molti record storici non hanno né check né atto collegato.',
  },
  {
    id: 'cup-canone-unico-patrimoniale',
    title: 'CUP — chiarimento sul campo',
    body: 'CUP = **Canone Unico Patrimoniale**, un importo annuo in euro — non un codice identificativo di progetto.\n- ==Campo "Numero Pratica CUP" rimosso==: resta solo l\'importo in `cup`',
  },
  {
    id: 'concessione-solo-pubblica',
    title: 'Concessione — solo atto di diritto pubblico',
    body: '**Correzione al modello**: rimosso il campo `tipologia` (Pubblico/Privato) dalla Concessione — ha senso giuridico solo come atto con cui un ente pubblico concede un bene demaniale/patrimoniale.\n- Un rapporto con un privato è un affitto: ora vive solo su **Contratto Privato**; "Contratto di locazione" rimosso dall\'enum Tipo Documento\n- I 3 record storici `tipologia = Privato` sono migrati su Contratto Privato (nota "migrazione-concessioni-privato")',
  },
  {
    id: 'migrazione-concessioni-privato',
    title: 'Migrazione dati — Concessioni Privato → Contratto Privato',
    body: '3 record migrati (badge **Migrata** in Contratti Privati, tooltip con la Concessione di provenienza).\n- ==Mappati direttamente==: proprietario/locatore, identificativo, date, canone\n- ==Da completare a mano==: Tipo Contratto (default "Locazione"), Riferimento Catastale, Autorizzazione collegata — Alert non bloccante nel dettaglio\n- Nessuna rimozione dati: i record originali restano in Concessioni (V1 li mostra invariati), in V2 solo filtrati dalla vista',
  },
  {
    id: 'data-decorrenza-campo-comune',
    title: 'Data Decorrenza — campo comune alle 3 entità',
    body: '**Data Decorrenza** = da quando il permesso è effettivamente valido, distinta dalla **Data Stipula** (solo la firma dell\'atto) — spesso diverse.\n- Campo **comune** a tutte e 3 le entità, obbligatorio come Data Stipula/Scadenza\n- Preset "Come Data Stipula" quando le due date coincidono\n- Campo nuovo: **non esiste in V1**',
  },
  {
    id: 'promemoria-campo-comune',
    title: 'Promemoria — spostato nella base comune alle 3 entità',
    body: '**Correzione**: Promemoria viveva solo su Concessione/Autorizzazione e non veniva mai salvato nel record — di fatto inutilizzabile.\n- Ora presente, salvato e mostrato nel dettaglio (accanto a Stato) su tutte e 3 le entità\n- Caso d\'uso critico: dimenticare la scadenza di una concessione o un contratto ha le stesse conseguenze di un\'autorizzazione',
  },
  {
    id: 'numeri-utenza-zero-valido',
    title: 'Numeri Utenza — zero righe è valido',
    body: 'Una Concessione può non avere numeri utenza: la sezione parte vuota, "Aggiungi numero" è opzionale.\n- Se una riga viene aggiunta, i suoi 2 campi diventano obbligatori\n- Totale Canone in lista = somma dei canoni delle righe presenti (0 € se nessuna)',
  },
  {
    id: 'contratto-vista-derivata',
    title: 'Contratto → Autorizzazioni: da FK diretta a vista derivata',
    body: 'Rimosso l\'FK diretto `autorizzazioneComunaleCollegata`: le Autorizzazioni collegate a un Contratto si deducono ora dagli **impianti in comune** (stessa logica per Concessione ↔ Autorizzazione).\n- Calcolo a runtime (`getAutorizzazioniDerivate`/`getConcessioneDerivata`), nessun campo salvato\n- Seed dimostrativo: contr-001↔aut-001 e contr-002↔aut-006 condividono un impianto\n- Alert "Nessuna Autorizzazione collegata" ora si basa sulla vista derivata vuota, mai blocca il salvataggio',
  },
  {
    id: 'concessione-campi-estesi',
    title: 'Concessione — campi estesi, Numeri Utenza diventato vista derivata',
    body: 'Aggiunti **Ubicazione**, **Superficie (mq)** e **Canone Concessorio** (importo diretto). Tipo Documento allineato ai valori reali già in uso nei record storici.\n- **Numeri Utenza rimosso dal form v2**: vive ora sull\'Impianto, l\'elenco è una vista derivata negli Spazi collegati\n- `totaleCanone` = `canoneConcessorio` diretto, non più somma di righe utenza\n- **V1 resta invariata**',
  },
  {
    id: 'stato-engine-base-comune',
    title: 'Stato — enum a 7 valori, calcolato + override manuale',
    body: 'Stato passa da 2 a **7 valori**: In istruttoria/Attiva/In scadenza/Scaduta sono CALCOLATI (da date + soglia Promemoria); In rinnovo/Revocata-Decaduta/Cessata sono un **override manuale** che prevale sempre.\n- Nuovo campo `statoOverride` + Select nel dettaglio per impostarlo, bypassa lo stub "Modifica"\n- Icona matita accanto al badge quando lo stato è manuale\n- **V1 resta invariata** (vecchio campo `stato` a 2 valori)\n- Demo: conc-006 (Cessata), aut-002 (In rinnovo), contr-004 (Revocata/Decaduta)',
  },
  {
    id: 'stato-gestione-form-creazione-edit',
    title: 'Stato — gestione anche da form di creazione/modifica',
    body: '==Idea da approfondire, non ancora sviluppata a questa data==: oggi l\'override manuale (In rinnovo, Revocata/Decaduta, Cessata — nota \'stato-engine-base-comune\') si imposta solo dal dettaglio, mai dal form di creazione o modifica del permesso.\n- Permetterebbe di impostare uno stato non automatico già in fase di creazione/modifica, senza dover prima salvare e poi passare dal dettaglio\n- Da valutare: quali dei 3 valori manuali ha senso esporre nel form, dato che alla creazione lo stato calcolato dalle date è quasi sempre quello corretto',
  },
  {
    id: 'impianto-suolo-esclusivo-concessione-contratto',
    title: 'Impianto — suolo Pubblico/Privato esclusivo tra Concessione e Contratto',
    body: 'Un Impianto è o su suolo Pubblico o Privato: può avere o una Concessione o un Contratto, mai entrambi (Autorizzazione non ha questo vincolo).\n- "Collega Spazi" filtra di conseguenza (`naturaSuoloRichiesta`) — non un errore di validazione, gli impianti del suolo sbagliato semplicemente non compaiono in elenco',
  },
  {
    id: 'impianto-bidirezionale-solo-su-card',
    title: 'Impianto — bidirezionalità parziale, nessuna scheda dedicata',
    body: '==Decisione di scope, da confermare==: nessuna scheda Impianto dedicata in questo prototipo (vive solo come card in "Spazi collegati"; l\'anagrafica è in `inventory-systems`, fuori scope).\n- Implementata solo la metà praticabile: ogni card impianto mostra anche **l\'altro lato** della relazione (Concessione/Contratto per un\'Autorizzazione, e viceversa)\n- Una vera scheda Impianto bidirezionale resta un\'estensione futura, più naturale in `inventory-systems`',
  },
  {
    id: 'promemoria-aggiorna-cimasa',
    title: 'Promemoria "Aggiorna cimasa" — non implementato come trigger reale',
    body: '==Non implementato==: un promemoria dovrebbe generarsi quando la Concessione/Autorizzazione di un impianto viene rinnovata — ma la **Modifica** è uno stub e non esiste un centro notifiche a cui agganciarlo.\n- Da scegliere in futuro: toast puntuale, badge persistente sulla card, o entrambi',
  },
  {
    id: 'impianto-campi-trasversali-scope',
    title: 'Campi trasversali su Impianto — solo qui, non in Inventory · Impianti',
    body: 'I campi `codiceCimasa`/`statoCimasa`/`utenzaElettrica`/`codiceInterno`/`codiceGestionaleEsterno` arricchiscono **solo il mock di questo prototipo** (MOCK_SPAZI).\n==Non toccano `inventory-systems`==, dove esiste già un campo `cimasa` a un livello diverso, bloccato da una nota sospesa (`iter-cimasa-sospeso`) — intervento separato, futuro',
  },
];
