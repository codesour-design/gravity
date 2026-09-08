/**
 * Handoff — Inventory Systems: flusso "Nuovo impianto"
 * Copre SOLO la creazione di un impianto dal drawer a pagina intera
 * (NewImpiantoFullDrawer): apertura, navigazione tra le sezioni, compilazione
 * reale dei campi obbligatori e il pattern "aggiungi un elemento alla volta"
 * nei sotto-drawer di Cespiti/Dispositivi e Squadre — con salvataggio reale,
 * non solo apertura/chiusura. Il resto del prototipo (mappa, filtri,
 * dettaglio impianto…) non è documentato in questo handoff.
 */

// ── Helper di navigazione ───────────────────────────────────────────────
// Ogni step è AUTOSUFFICIENTE: il suo onEnter forza lo stato esatto che gli
// serve (drawer aperto/chiuso, sezione attiva, sotto-drawer aperto/chiuso,
// campi compilati), senza assumere che lo step precedente sia stato
// eseguito. Così il tour funziona sia scorrendo in sequenza, sia saltando da
// "Indice", sia avviandolo con il drawer già aperto (magari su un'altra
// sezione o con dati già inseriti).
function ghfClick(selector) {
  var el = document.querySelector(selector);
  if (el) el.click();
}
function ghfCloseSubDrawer(rootClass) {
  var el = document.querySelector('.' + rootClass + ' .ant-drawer-close');
  if (el) el.click();
}
function ghfIsMainDrawerOpen() {
  return !!document.getElementById('grav-tour-form-save');
}
function ghfCloseAllSubDrawers() {
  ghfCloseSubDrawer('grav-squadra-drawer');
  ghfCloseSubDrawer('grav-cespite-drawer');
}
// Il balloon del tour ricalcola la sua posizione solo al mount dello step + un
// resize/scroll: se il target è ancora a metà di una transizione CSS (cambio
// sezione, apertura/chiusura drawer) quando lo step appare, resta bloccato
// fuori schermo. Un resize sintetico dopo la fine dell'animazione lo corregge.
function ghfNudge() {
  [150, 350, 600, 900, 1300].forEach(function (ms) {
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, ms);
  });
}
// Step "Punto di ingresso": deve inquadrare il pulsante sulla lista, quindi
// chiude tutto (sotto-drawer + drawer principale) se qualcosa è aperto.
function ghfEnsureClosed() {
  ghfCloseAllSubDrawers();
  ghfCloseSubDrawer('grav-main-drawer');
  ghfNudge();
}
// Drawer principale aperto, sezione non rilevante (es. per il pulsante Salva,
// sempre visibile nell'header a prescindere dalla sezione attiva).
function ghfEnsureOpen() {
  ghfCloseAllSubDrawers();
  if (!ghfIsMainDrawerOpen()) ghfClick('#grav-tour-new-btn');
  ghfNudge();
}
// Drawer principale aperto E sezione specifica attiva — chiude anche eventuali
// sotto-drawer rimasti aperti da uno step precedente o da un salto diretto.
function ghfEnsureOpenAtSection(sectionId) {
  ghfCloseAllSubDrawers();
  if (!ghfIsMainDrawerOpen()) {
    ghfClick('#grav-tour-new-btn');
    setTimeout(function () { ghfClick('[data-section="' + sectionId + '"]'); ghfNudge(); }, 380);
  } else {
    ghfClick('[data-section="' + sectionId + '"]');
    ghfNudge();
  }
}
// Drawer principale aperto, sezione corretta attiva, sotto-drawer di
// aggiunta (cespite o squadra) aperto — chiude prima l'ALTRO sotto-drawer.
// `after`, se passato, viene richiamato non appena il sotto-drawer è aperto
// (usato per selezionare automaticamente un valore al suo interno).
function ghfEnsureSubdrawerOpen(sectionId, addBtnSelector, otherSubdrawerClass, after) {
  ghfCloseSubDrawer(otherSubdrawerClass);
  var openSub = function () {
    setTimeout(function () {
      ghfClick(addBtnSelector);
      ghfNudge();
      if (after) setTimeout(after, 200);
    }, 100);
  };
  if (!ghfIsMainDrawerOpen()) {
    ghfClick('#grav-tour-new-btn');
    setTimeout(function () { ghfClick('[data-section="' + sectionId + '"]'); openSub(); }, 380);
  } else {
    ghfClick('[data-section="' + sectionId + '"]');
    openSub();
  }
}

// ── Helper di compilazione campi (per rendere reale la demo) ─────────────
// Gli Select di Ant Design non rispondono a eventi mouse sintetici (serve un
// click reale del sistema operativo) — il tour non può quindi "cliccarli"
// via JS. Il prototipo (solo nel file di handoff, vedi commenti su
// window.__ghfIdentita / __ghfCespite / __ghfSquadra) espone i setter React
// direttamente: qui li richiamiamo in sequenza, con una pausa tra l'uno e
// l'altro per lasciare a React il tempo di ricalcolare le opzioni a cascata
// (Tipologia dipende da Canale, Formato da Tipologia).
function ghfCall(path) {
  var fn = window[path[0]] && window[path[0]][path[1]];
  if (fn) fn();
}
// Compila davvero i 6 campi obbligatori dell'Anagrafica, in cascata.
function ghfFillAnagrafica(cb) {
  ghfCall(['__ghfIdentita', 'pickCanale']);
  setTimeout(function () {
    ghfCall(['__ghfIdentita', 'pickTipologia']);
    setTimeout(function () {
      ghfCall(['__ghfIdentita', 'pickFormato']);
      setTimeout(function () {
        ghfCall(['__ghfIdentita', 'pickStato']);
        if (window.__ghfIdentita) {
          window.__ghfIdentita.setVia('Via Roma 12');
          window.__ghfIdentita.setCitta('Palermo');
        }
        ghfNudge();
        cb && cb();
      }, 250);
    }, 250);
  }, 250);
}
function ghfFillAnagraficaAtSection() {
  var run = function () { ghfFillAnagrafica(); };
  if (!ghfIsMainDrawerOpen()) {
    ghfClick('#grav-tour-new-btn');
    setTimeout(function () { ghfClick('[data-section="identita"]'); setTimeout(run, 150); }, 380);
  } else {
    ghfClick('[data-section="identita"]');
    setTimeout(run, 150);
  }
}

window.HANDOFF_META = {
  title: 'Inventory — Nuovo impianto',
  version: '1.0',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
};

window.HANDOFF_SCREENS = {
  'lista': {
    label: 'Parco Impianti',
    detect: function () { return !!document.getElementById('grav-tour-new-btn'); },
    goTo: function () { ghfEnsureClosed(); },
  },
};

window.HANDOFF_TOURS = [
  {
    id: 'nuovo-impianto',
    title: 'US#1 — Creazione nuovo impianto',
    description: 'Come **Inventory Manager**, voglio creare un nuovo impianto dal Parco Impianti così da registrarlo in piattaforma anche compilando solo i dati che conosco al momento.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: "Nuovo Impianto"',
        description: 'Dal Parco Impianti (mappa o lista) il pulsante primario apre il form di creazione a pagina intera. ==Non serve compilare tutto subito==: i dati mancanti si aggiungono in seguito modificando l\'impianto.',
        selector: '#grav-tour-new-btn',
        placement: 'bottomRight',
        onEnter: function () { ghfEnsureClosed(); },
        delay: 420,
        dev: [{ label: 'Trigger', value: "onClick: () => setFullFormOpen(true)" }],
      },
      {
        title: 'Il form si apre a pagina intera',
        description: 'Il drawer occupa **tutta la larghezza** (non un pannello laterale come gli altri form): a sinistra la navigazione tra sezioni, a destra il contenuto della sezione attiva. Il selettore "Ruolo (demo)" sopra le sezioni serve solo a questo prototipo per mostrare l\'RBAC — non è un campo reale del form.',
        selector: '#grav-tour-form-nav',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('identita'); },
        delay: 500,
        table: {
          headers: ['Ruolo (demo)', 'Anagrafica e ubicazione', 'Iter autorizzativo', 'Dati tecnici', 'Cespiti e dispositivi', 'Squadre', 'Commerciale'],
          rows: [
            ['Admin tenant', '✓', '✓', '✓', '✓', '✓', '✓'],
            ['Inventory Manager', '✓', '✓', '✓', '✓', '✓', '✗'],
            ['Operation Manager', '✓', '✓', '✓', '✗', '✗', '✓'],
          ],
          note: '✓ = sezione abilitata · ✗ = sezione disabilitata (lucchetto, non cliccabile) per quel ruolo',
        },
      },
      {
        title: 'Sezione 1 — Anagrafica e ubicazione',
        description: 'Unica sezione con campi realmente **obbligatori** per salvare: Canale, Tipologia, Formato, Via, Città e Stato (contrassegnati con ** * ** nel menu sezioni). Tutto il resto del form è facoltativo.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('identita'); },
        delay: 500,
      },
      {
        title: 'Compiliamo i campi obbligatori',
        description: 'Per rendere concreta la demo, compiliamo davvero i 6 campi: **Canale**, **Tipologia** e **Formato** in cascata (ognuno sblocca il successivo), poi **Stato**, **Via** e **Città**. ==Con questi valorizzati, "Crea Impianto" si attiva davvero.==',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () { ghfFillAnagraficaAtSection(); },
        delay: 1900,
      },
      {
        title: 'Sezione 2 — Iter autorizzativo',
        description: 'Percorso amministrativo dell\'impianto: concessione/autorizzazione, date e — se il tenant ha configurato i modelli per la regione — i documenti del Genio Civile pronti da scaricare precompilati.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('dati-amministrativi'); },
        delay: 500,
      },
      {
        title: 'Sezione 3 — Dati tecnici',
        description: 'Misure fisiche del pannello (larghezza, altezza, profondità — l\'area espositiva si **calcola in automatico**) ed esposizione del sito. In fondo alla sezione, le **Facce** dell\'impianto si aggiungono una alla volta con lo stesso pattern che vedremo tra poco per Cespiti e Squadre.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('caratteristiche'); },
        delay: 500,
      },
      {
        title: 'Sezione 4 — Cespiti e dispositivi',
        description: 'Componenti strutturali (fondazione, pali, cornice, pannelli…) e dispositivi connessi (player, modem, sensori…) montati sull\'impianto. Ogni elemento si registra **uno alla volta** in un sotto-drawer dedicato: il pulsante "Aggiungi" lo apre.',
        selector: '#grav-tour-add-cespite-btn',
        placement: 'left',
        onEnter: function () { ghfEnsureOpenAtSection('struttura'); },
        delay: 500,
      },
      {
        title: 'Sotto-drawer: scegli il tipo',
        description: 'Il sotto-drawer si apre **sopra** il form principale (resta aperto dietro). La select "Tipo cespite" determina quali campi compaiono sotto: es. Fondazione mostra tipo/dimensione/date, Pali mostra diametro/interasse/ditta — ogni tipo ha il suo set di campi coerente.',
        selector: '.grav-cespite-drawer .ant-select',
        placement: 'left',
        onEnter: function () { ghfEnsureSubdrawerOpen('struttura', '#grav-tour-add-cespite-btn', 'grav-squadra-drawer'); },
        delay: 800,
        dev: [{ label: 'Sorgente campi', value: "ASSET_TYPES.find(t => t.value === tipo).fields" }],
      },
      {
        title: 'Un tipo selezionato, i campi cambiano',
        description: 'Scegliendo un tipo (qui il primo della lista) compaiono i campi coerenti con quella scelta. Il pulsante "Aggiungi" è pronto: salverà questo cespite con i dati inseriti finora.',
        selector: '.grav-cespite-drawer .ant-btn-primary',
        placement: 'left',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('struttura', '#grav-tour-add-cespite-btn', 'grav-squadra-drawer', function () { ghfCall(['__ghfCespite', 'pickTipo']); });
        },
        delay: 900,
      },
      {
        title: 'Aggiunto: ora è una card',
        description: '"Aggiungi" salva **davvero** questo cespite: il sotto-drawer si chiude e l\'elemento compare qui come **card** (espandibile per rivederne i dettagli, rimovibile con il cestino). Il pulsante "Aggiungi cespite" resta disponibile per aggiungerne altri — ==stesso identico pattern per Dispositivi, Squadre e Facce==.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('struttura', '#grav-tour-add-cespite-btn', 'grav-squadra-drawer', function () {
            ghfCall(['__ghfCespite', 'pickTipo']);
            setTimeout(function () { ghfClick('.grav-cespite-drawer .ant-btn-primary'); ghfNudge(); }, 250);
          });
        },
        delay: 1500,
      },
      {
        title: 'Sezione 5 — Squadre',
        description: 'Squadre di affissione e di manutenzione assegnate di default all\'impianto. Stesso pattern add-one-at-a-time: "Aggiungi squadra" apre un sotto-drawer con un solo record da compilare.',
        selector: '#grav-tour-add-squadra-btn',
        placement: 'left',
        onEnter: function () { ghfEnsureOpenAtSection('affissione'); },
        delay: 500,
      },
      {
        title: 'Selezione squadra',
        description: 'Scegliendo la squadra dall\'anagrafica (qui la prima disponibile, codice + nome, ricercabile) si sbloccano i campi successivi — tipo di affissione e costi per l\'affissione, tipo di intervento e oggetto per la manutenzione.',
        selector: '.grav-squadra-drawer .ant-select',
        placement: 'left',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('affissione', '#grav-tour-add-squadra-btn', 'grav-cespite-drawer', function () { ghfCall(['__ghfSquadra', 'pickSquadra']); });
        },
        delay: 900,
      },
      {
        title: 'Salva la squadra',
        description: 'Anche qui "Salva" registra **davvero una sola squadra** e richiude il sotto-drawer. Nota: a differenza del drawer Cespiti, questo non ha un pulsante "Annulla" esplicito — si chiude con la ✕ in alto.',
        selector: '.grav-squadra-drawer .ant-btn-primary',
        placement: 'left',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('affissione', '#grav-tour-add-squadra-btn', 'grav-cespite-drawer', function () { ghfCall(['__ghfSquadra', 'pickSquadra']); });
        },
        delay: 900,
      },
      {
        title: 'Aggiunta: ora è una card',
        description: '"Salva" registra la squadra e torna alla sezione, ora con la sua card (squadra, tipo di affissione, costi). Stesso pattern di Cespiti e Dispositivi: si ripete per ogni squadra da assegnare.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('affissione', '#grav-tour-add-squadra-btn', 'grav-cespite-drawer', function () {
            ghfCall(['__ghfSquadra', 'pickSquadra']);
            setTimeout(function () { ghfClick('.grav-squadra-drawer .ant-btn-primary'); ghfNudge(); }, 250);
          });
        },
        delay: 1500,
      },
      {
        title: 'Crea l\'impianto',
        description: 'Con i 6 campi obbligatori dell\'Anagrafica compilati, il pulsante finale è ora **attivo davvero**: cliccandolo l\'impianto viene creato con tutti i dati inseriti in questa demo (identità, cespite e squadra appena aggiunti) e si torna al Parco Impianti.',
        selector: '#grav-tour-form-save',
        placement: 'bottomRight',
        onEnter: function () { ghfEnsureOpen(); },
        delay: 500,
        dev: [{ label: 'Campi obbligatori', value: 'Canale · Tipologia · Formato · Via · Città · Stato\n(disabled finché canSave === false — qui tutti compilati)' }],
      },
    ],
  },
];

window.HANDOFF_COMPONENTS = [
  { selector: '#grav-tour-new-btn', name: 'Button "Nuovo Impianto"', level: 'Atomo', figma: 'Button — Type=Primary · Size=Large · Icon=Plus' },
  { selector: '.create-nav', name: 'Navigazione sezioni form', level: 'Molecola', custom: true,
    funzione: 'Elenco verticale delle 6 sezioni del form. La sezione attiva è evidenziata; le sezioni disabilitate per il ruolo (demo) mostrano un lucchetto.',
    figma: 'Da definire — pattern custom, non un componente standard Ant Design' },
  { selector: '.create-nav-item', name: 'Voce di sezione', level: 'Atomo', custom: true,
    funzione: 'Singola voce cliccabile del menu sezioni: stato attivo, asterisco se contiene campi obbligatori, lucchetto se disabilitata per il ruolo.',
    figma: 'Da definire — pattern custom' },
  { selector: '.ni-field', name: 'Campo form (label + controllo)', level: 'Molecola', custom: true,
    funzione: 'Wrapper standard di ogni campo del form: label + asterisco se obbligatorio + controllo Ant Design.',
    figma: 'Form.Item — Layout=Vertical' },
  { selector: '#grav-tour-add-cespite-btn', name: 'Button "Aggiungi cespite"', level: 'Atomo', figma: 'Button — Type=Default · Icon=Plus' },
  { selector: '#grav-tour-add-squadra-btn', name: 'Button "Aggiungi squadra"', level: 'Atomo', figma: 'Button — Type=Default · Icon=Plus' },
  { selector: '.grav-cespite-drawer', name: 'Sotto-drawer Cespite/Dispositivo', level: 'Organismo', custom: true,
    funzione: 'Drawer impilato sopra il form principale per la creazione di **un singolo** cespite o dispositivo. La select "Tipo" determina dinamicamente i campi mostrati.',
    composizione: 'Drawer (AntD) + Select tipo + campi dinamici (Input/Select/DatePicker/Tags) + azioni Annulla/Aggiungi',
    figma: 'Drawer — Placement=Right · Size=Default (600px)' },
  { selector: '.grav-squadra-drawer', name: 'Sotto-drawer Squadra', level: 'Organismo', custom: true,
    funzione: 'Drawer impilato sopra il form principale per l\'assegnazione di **una singola** squadra (affissione o manutenzione).',
    composizione: 'Drawer (AntD) + Select squadra + campi condizionati dal tipo + azione Salva',
    figma: 'Drawer — Placement=Right · Size=Default (520px)' },
  { selector: '#grav-tour-form-save', name: 'Button "Crea Impianto"', level: 'Atomo', figma: 'Button — Type=Primary · Icon=Plus · State=Disabled finché mancano i campi obbligatori' },
];

window.HANDOFF_NOTES = [
  {
    id: 'ruolo-demo',
    title: 'Select "Ruolo (demo)"',
    body: 'Non è un campo reale del form: serve **solo in questo prototipo** per mostrare quali sezioni si disabilitano in base al ruolo (RBAC). In produzione il ruolo è quello dell\'utente loggato, non selezionabile qui.\n- Pianificatore e Sales non hanno accesso al form: gate a monte, non gestito in questa schermata.',
  },
  {
    id: 'sezioni-facoltative',
    title: 'Solo l\'Anagrafica ha campi obbligatori',
    body: 'Le altre 5 sezioni (Iter autorizzativo, Dati tecnici, Cespiti e dispositivi, Squadre, Commerciale) sono **tutte facoltative** in creazione: l\'obiettivo è permettere di censire rapidamente un impianto anche con dati parziali, completandolo in un secondo momento dalla modifica.',
  },
  {
    id: 'add-one-at-a-time',
    title: 'Pattern "aggiungi un elemento alla volta"',
    body: 'Cespiti, Dispositivi, Squadre e Facce condividono lo stesso pattern di interazione:\n- il pulsante **Aggiungi** apre un sotto-drawer con un solo record da compilare;\n- salvando, il sotto-drawer si chiude e l\'elemento compare come **card** nella sezione;\n- si ripete l\'azione per ogni nuovo elemento — nessun form con righe multiple da gestire in una volta sola.\n==Scelta deliberata==: evita form tabellari lunghi e riduce l\'errore di compilazione su righe multiple contemporaneamente.',
  },
];
