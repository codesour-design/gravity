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
  { selector: '.grav-concessione-provenienza-section', name: 'Sezione "Provenienza" (Concessione)', level: 'Organismo', custom: true,
    funzione: 'Modalità di attribuzione (Bando pubblico/Affidamento diretto/Rinnovo) con campi condizionali quando "Bando pubblico".',
    composizione: 'Select + Input/DatePicker/TextArea condizionali',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-autorizzazione-impianti-tab', name: 'Sezione "Impianti autorizzati" (Autorizzazione v2)', level: 'Organismo', custom: true,
    funzione: 'Seconda sezione del drawer Nuova Autorizzazione (nota \'autorizzazione-impianti-tab-dedicata\'), ispirata al Nuovo Impianto di inventory-systems — editor a N righe, una per impianto, ciascuna con Select impianto (esclude quelli già autorizzati per lo stesso Tipo) + Input codice cimasa + InputNumber CUP. Disabilitata finché il Tipo Autorizzazione non è scelto nella sezione "Informazioni". Zero righe è uno stato valido.',
    composizione: 'GravitySectionDrawer + GravityFormArea (components/section-drawer.md) → Row/Col a 3 colonne per riga + Button "Aggiungi impianto" (dashed) + Button "Rimuovi" (link, danger)',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-contratto-catastale-section', name: 'Sezione "Riferimento Catastale" (Contratto Privato)', level: 'Molecola', custom: true,
    funzione: 'Foglio/Particella/Subalterno, tutti facoltativi.',
    composizione: '3× Form.Item + Input in Row',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-contratto-bridge-alert', name: 'Alert "Autorizzazione mancante" (dettaglio Contratto)', level: 'Molecola', figma: 'Alert — Type=Warning · ShowIcon=true, non chiudibile, non bloccante' },
  { selector: '.grav-detail-provenienza', name: 'Blocco "Provenienza" (dettaglio Concessione)', level: 'Organismo', figma: 'Descriptions — Bordered=true · Column=3, pattern Detail View di LAYOUT.md §3.4' },
  { selector: '.grav-detail-copertura', name: 'Blocco "Copertura" (dettaglio Autorizzazione)', level: 'Organismo', figma: 'Descriptions bordered — solo "Esposizione pubblicitaria" (Concessione suolo pubblico incl. + Concessione o Contratto di riferimento)' },
  { selector: '.grav-detail-impianti-autorizzati', name: 'Blocco "Impianti autorizzati" (dettaglio Autorizzazione)', level: 'Organismo', figma: 'Title + Table (Impianto/Codice Autorizzazione per cimasa/CUP) da record.impiantiAutorizzati, nota \'autorizzazione-impianti-tab-dedicata\'' },
  { selector: '.grav-detail-catastale', name: 'Blocco "Riferimento Catastale" (dettaglio Contratto)', level: 'Organismo', figma: 'Descriptions — Bordered=true · Column=3' },
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
    description: 'Il drawer Nuova Autorizzazione v2 (GravitySectionDrawer, components/section-drawer.md) ha due sezioni (nota "autorizzazione-impianti-tab-dedicata"): "Informazioni" (dati generali) e "Impianti autorizzati" (editor a righe, disabilitata finché il Tipo non è scelto). Tipo Autorizzazione (solo Esposizione pubblicitaria) sblocca campi aggiuntivi in "Informazioni" — vedi nota "autorizzazione-tipologia-overhaul".',
    table: {
      headers: ['Condizione', 'Campi sbloccati'],
      rows: [
        ['Informazioni — nessun Tipo scelto', 'Solo il campo Tipo Autorizzazione; sezione Impianti autorizzati disabilitata'],
        ['Informazioni — Tipo = Esposizione pubblicitaria (Comunale)', 'Include concessione suolo pubblico + Concessione o Contratto di riferimento'],
        ['↳ e Include concessione suolo pubblico = Sì', 'Concessione o Contratto di riferimento resta visibile ma disabilitato (l\'Autorizzazione la include già, non c\'è un atto da collegare)'],
        ['↳ e Include concessione suolo pubblico = No', 'Concessione o Contratto di riferimento attivo — l\'atto che ha dato il bene poi autorizzato'],
        ['Impianti autorizzati — un Tipo è stato scelto', 'Editor a N righe: Impianto (Select, esclude impianti già autorizzati per lo stesso Tipo, facoltativo — si può collegare in un secondo momento) + Codice Autorizzazione per cimasa + CUP — una riga è valida con almeno un campo compilato, zero righe è uno stato valido'],
      ],
      note: 'Cambiare Tipo Autorizzazione pulisce Ente Emittente e le righe della sezione Impianti autorizzati (impianti già scelti potrebbero non essere validi per il nuovo tipo), così il salvataggio non porta con sé dati fantasma.',
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
    title: 'Autorizzazione v2 — drawer a due sezioni, Impianti autorizzati sostituisce Impianti coperti',
    body: '**Ristrutturazione completa** del drawer Nuova Autorizzazione (v2), ispirata al Nuovo Impianto di inventory-systems: due sezioni con navigazione verticale (`GravitySectionDrawer`) invece di un unico pannello.\n- **Informazioni**: gli stessi campi di prima (Tipo, Ente Emittente, Protocollo, date, Promemoria, Provenienza), solo raggruppati in aree (`GravityFormArea`)\n- **Impianti autorizzati** (nuova, disabilitata finché il Tipo non è scelto): editor a N righe — Select impianto (esclude quelli già autorizzati per lo stesso Tipo) + Codice cimasa + CUP. Zero righe è valido\n\n==Deprecata l\'intera logica "Impianti coperti"==: Singolo/Più impianti, Codice Autorizzazione a valore singolo, allegato + lettura OCR simulata, drawer `CanonePerImpiantoDrawer` — tutto rimosso, il modello vive per-impianto in `impiantiAutorizzati` (`{ impiantoId, codiceAutorizzazione, cup }`)\n- ==L\'impianto NON è più obbligatorio per riga==: l\'autorizzazione spesso arriva prima che l\'impianto sia censito in Inventario · Impianti, quindi cimasa e/o CUP vanno segnabili comunque — una riga è valida se ha almeno un campo compilato, l\'impianto si collega in un secondo momento (mostra "Da collegare" in lista/dettaglio)\n- Gli impianti scelti popolano anche `spaziCollegati`: compaiono subito in "Spazi collegati" nel dettaglio\n- CUP in lista/dettaglio è ora la **somma** delle righe (`cupTotale`), non più il vecchio campo singolo `cup` (che V1 legge invariato)',
  },
  {
    id: 'autorizzazione-atto-provenienza-scollegato',
    title: 'Atto di provenienza — scollegato da "Include concessione suolo pubblico"',
    body: '**Correzione al modello**: "Concessione o Contratto di riferimento" non dipende più da "Include concessione suolo pubblico" — sono situazioni **mutuamente esclusive**, non una il dettaglio dell\'altra.\n- **Check spuntato** → l\'atto include già la concessione di suolo pubblico: il campo resta visibile ma **disabilitato con motivo in tooltip** (LAYOUT.md §6.2), valore azzerato\n- **Check non spuntato** → campo attivo, collega la Concessione o il **Contratto Privato** che ha dato il bene su cui insiste l\'impianto\n- ==Campo "Estensione occupazione" (mq) rimosso==: col check spuntato non resta nulla da compilare\n- Facoltativo: molti record storici non hanno né check né atto collegato',
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
