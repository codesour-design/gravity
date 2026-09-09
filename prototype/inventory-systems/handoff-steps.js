/**
 * Handoff — Inventory Systems: flusso "Nuovo impianto" (NewImpiantoFullDrawer)
 * Copre DUE user story sullo stesso drawer a pagina intera:
 * - GRP-622 — Creazione: apertura, navigazione tra le sezioni, compilazione
 *   reale dei campi obbligatori e il pattern "aggiungi un elemento alla volta"
 *   nei sotto-drawer di Cespiti/Dispositivi e Squadre — con salvataggio reale,
 *   non solo apertura/chiusura.
 * - US#1.1 — Iter autorizzativo: approfondisce la sezione "Iter
 *   autorizzativo" dello stesso drawer — collegamento di concessioni/
 *   autorizzazioni, suolo e canone, progetto Genio Civile, SCIA urbanistica/
 *   commerciale.
 * Il resto del prototipo (mappa, filtri, dettaglio di un impianto esistente…)
 * non è documentato in questo handoff — vedi HANDOFF_OUT_OF_SPRINT.
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
// La ✕ dei drawer del flusso apre un Popconfirm ("Continua a modificare" /
// "Esci e scarta") se ci sono modifiche non salvate (LAYOUT.md §6.6), invece
// di chiudere subito. Per chiudere comunque durante l'automazione del tour,
// clicchiamo la ✕ e — se compare — confermiamo "Esci e scarta".
function ghfCloseSubDrawer(rootClass) {
  var el = document.querySelector('.' + rootClass + ' .ant-drawer-close');
  if (!el) return;
  el.click();
  setTimeout(function () {
    var btn = document.querySelector('.ant-popconfirm .ant-btn-dangerous');
    if (btn) btn.click();
  }, 200);
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

// ── Helper di navigazione — US#1.1 Iter autorizzativo (sezione del form di
// creazione) — box() e boxX() non aggiungono classi/id propri: le card della
// sezione si individuano per posizione, dentro #grav-tour-form-required.
var CF_CARD_CONC      = '#grav-tour-form-required > div > div:nth-child(2)'; // Concessioni e autorizzazioni
var CF_SUOLO_ROW      = '#grav-tour-form-required > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3)'; // Tipo suolo / Categoria suolo
var CF_CARD_PROGETTO  = '#grav-tour-form-required > div > div:nth-child(3)'; // Progetto · Genio Civile
var CF_SCARICA_MODULO = '#grav-tour-form-required > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(6)'; // bottone "Scarica Modulo"
var CF_CARD_SCIA      = '#grav-tour-form-required > div > div:nth-child(4)'; // Titolo a installare (SCIA)
// Step "intelligenti": ogni azione async (apri drawer, seleziona, conferma)
// verifica che il DOM abbia davvero recepito il passo precedente prima di
// procedere al successivo — invece di incatenare setTimeout "a occhio" — così
// il balloon non punta mai a un elemento non ancora renderizzato. Il motore
// aspetta comunque un tempo FISSO (step.delay) dopo onEnter prima di mostrare
// lo step (non è configurabile): ghfWaitFor riduce il rischio nella catena di
// azioni dentro onEnter, ghfNudge() resta il correttivo finale sullo spotlight.
function ghfWaitFor(selector, cb, maxWait) {
  var start = Date.now();
  // Il primo controllo è SEMPRE dopo un tick (mai sincrono): un elemento può
  // già esistere nel DOM da un mount precedente (es. il wrapper del Drawer
  // resta montato dopo la chiusura) mentre React non ha ancora ri-renderizzato
  // il contenuto nuovo — un controllo immediato lo scambierebbe per "pronto".
  setTimeout(function poll() {
    if (document.querySelector(selector) || Date.now() - start > (maxWait || 1500)) { cb && cb(); return; }
    setTimeout(poll, 60);
  }, 60);
}
// Chiude un eventuale drawer di collegamento permesso rimasto aperto da uno
// step precedente, poi assicura che il form sia aperto sulla sezione "Iter
// autorizzativo" (riusa ghfEnsureOpenAtSection, già definito più sopra).
function ghfEnsureIterSection(cb) {
  if (window.__ghfIterPermessi) window.__ghfIterPermessi.closePermitDrawer();
  ghfEnsureOpenAtSection('dati-amministrativi');
  ghfNudge();
  cb && cb();
}
// Apre il drawer di collegamento permesso: tipo = 'concessione' | 'autorizzazione'.
// Il menu "Collega permesso" è un Dropdown AntD e, come i Select (vedi
// commento su window.__ghfIdentita), non risponde a eventi mouse sintetici:
// si passa dai setter React esposti solo nell'handoff (window.__ghfIterPermessi,
// vedi index--handoff.html). `after` (opz.) viene richiamato SOLO quando il
// corpo del drawer esiste davvero nel DOM — usato per selezionare/compilare
// qualcosa al suo interno senza indovinare un timeout.
function ghfOpenPermitDrawer(tipo, after) {
  ghfEnsureOpenAtSection('dati-amministrativi');
  ghfWaitFor('#grav-tour-form-required', function () {
    var api = window.__ghfIterPermessi;
    if (api) { tipo === 'autorizzazione' ? api.openAutorizzazioneDrawer() : api.openConcessioneDrawer(); }
    ghfWaitFor('.ant-drawer-body', function () {
      ghfNudge();
      after && after();
    });
  }, 900);
}
// Mostra il RISULTATO del collegamento (Tipo suolo valorizzato in sola
// lettura) invece del form vuoto: se non c'è già una concessione collegata,
// la collega davvero (prima utenza) prima di mostrare la sezione — così lo
// step è autosufficiente indipendentemente da cosa è successo prima negli
// step del drawer (che selezionano ma non sempre confermano, per mostrare
// l'interazione senza vincolare la narrazione).
function ghfEnsureConcessioneLinked(cb) {
  ghfEnsureIterSection(function () {
    var api = window.__ghfIterPermessi;
    if (!api || api.hasConcessione) { cb && cb(); return; }
    api.openConcessioneDrawer();
    ghfWaitFor('.ant-drawer-body', function () {
      api.selectFirstUtenza();
      setTimeout(function () {
        window.__ghfIterPermessi.confirmPermit();
        ghfNudge();
        cb && cb();
      }, 250);
    });
  });
}

// ── Helper di navigazione — US#1 Anagrafica e ubicazione (sezione del form di
// creazione) — sec('identita', ...) ha due box: "Informazioni generali" e
// "Indirizzo e coordinate", individuati per posizione come per l'Iter autorizzativo.
var AN_CARD_INFO             = '#grav-tour-form-required > div > div:nth-child(2)'; // Informazioni generali
var AN_ROW_CANALE_TIPOLOGIA  = AN_CARD_INFO + ' > div:nth-child(2) > div:nth-child(1)';
var AN_ROW_FORMATO_NOME      = AN_CARD_INFO + ' > div:nth-child(2) > div:nth-child(2)';
var AN_ROW_PROPRIETA_STATO   = AN_CARD_INFO + ' > div:nth-child(2) > div:nth-child(3)';
var AN_CARD_INDIRIZZO        = '#grav-tour-form-required > div > div:nth-child(3)'; // Indirizzo e coordinate
var AN_ROW_NAZIONE_ZONA      = AN_CARD_INDIRIZZO + ' > div:nth-child(2) > div:nth-child(3)';
function ghfEnsureAnagraficaSection(cb) {
  ghfEnsureOpenAtSection('identita');
  ghfNudge();
  cb && cb();
}
// Compila davvero la cascata Canale → Tipologia → Formato (stessa logica di
// ghfFillAnagrafica, isolata qui per mostrare SOLO la cascata senza gli altri
// campi che ghfFillAnagrafica tocca — Stato, Via, Città hanno step propri).
// ⚠️ Usa ghfCall (non un `var api = window.__ghfIdentita` catturato una volta):
// l'oggetto esposto viene RICREATO ad ogni render (opzioni tipologia/formato
// derivate da canale/tipologia correnti) — una referenza catturata prima di
// pickCanale() punta a closure con `tipologieOpts` ancora vuoto, e pickTipologia
// fallisce in silenzio. ghfCall rilegge window.__ghfIdentita al momento della chiamata.
function ghfFillCascata(cb) {
  ghfEnsureOpenAtSection('identita');
  setTimeout(function () {
    ghfCall(['__ghfIdentita', 'pickCanale']);
    setTimeout(function () {
      ghfCall(['__ghfIdentita', 'pickTipologia']);
      setTimeout(function () {
        ghfCall(['__ghfIdentita', 'pickFormato']);
        ghfNudge();
        cb && cb();
      }, 250);
    }, 250);
  }, 200);
}

window.HANDOFF_META = {
  title: 'Inventory — Impianti',
  version: '1.1',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
};

// ════════════════════════════════════════════════════════════════════════════
// Interfaccia semplificata (toggle nel pannello Sprint Jira).
// Elementi FUORI SPRINT: presenti nel prototipo (mappa/lista già toccano la
// scheda impianto per aprirla) ma senza user story in questo sprint — solo la
// creazione (GRP-622) è in scope. Il motore li evidenzia quando il toggle è attivo.
// ════════════════════════════════════════════════════════════════════════════
window.HANDOFF_OUT_OF_SPRINT = [
  // Scheda impianto (ImpiantoDetailV2): dettaglio, modifica per sezione, storico eventi —
  // raggiungibile da mappa/lista ma nessuna user story di questo sprint la copre:
  // solo la creazione (GRP-622) e l'iter autorizzativo nel form di creazione
  // (US#1.1) sono in scope.
  { selector: '.imp-detail-page', note: 'Fuori sprint — scheda impianto (dettaglio, modifica per sezione, storico eventi): nessuna user story in questo sprint, solo la creazione (GRP-622) è in scope' },
  // "Scarica Modulo" Genio Civile — presente nel form come segnaposto di demo,
  // ma la generazione del modulo regionale precompilato è esplicitamente
  // fuori scope per questo sprint (vedi nota inline sul pulsante).
  { selector: '.ant-btn', text: 'Scarica Modulo', note: 'Fuori scope per questo sprint — generazione modulo regionale Genio Civile: sistema di template multi-regione da ridisegnare, non sviluppare ora' },
];

window.HANDOFF_SCREENS = {
  'lista': {
    label: 'Parco Impianti',
    detect: function () { return !!document.getElementById('grav-tour-new-btn'); },
    goTo: function () { ghfEnsureClosed(); },
  },
};

// Matrice Ruolo × Sezione form — usata sia nello step del tour che nel
// pannello "Modello" (tab Dipendenze), per non duplicare i dati in due posti.
var ROLE_SECTION_MATRIX = {
  headers: ['Ruolo', 'Anagrafica e ubicazione', 'Iter autorizzativo', 'Dati tecnici', 'Cespiti e dispositivi', 'Squadre', 'Commerciale'],
  rows: [
    ['Admin tenant', '✓', '✓', '✓', '✓', '✓', '✓'],
    ['Inventory Manager', '✓', '✓', '✓', '✓', '✓', '✗'],
    ['Operation Manager', '✓', '✓', '✓', '✗', '✗', '✓'],
  ],
  note: '✓ = sezione visibile nel menu · ✗ = sezione non mostrata per quel ruolo',
};

window.HANDOFF_TOURS = [
  {
    id: 'nuovo-impianto',
    title: 'GRP-622 — Creazione nuovo impianto',
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
        delay: 700,
        dev: [{ label: 'Trigger', value: "onClick: () => setFullFormOpen(true)" }],
      },
      {
        title: 'Il form si apre a pagina intera',
        description: 'Il drawer occupa **tutta la larghezza** (non un pannello laterale come gli altri form): a sinistra la navigazione tra sezioni, a destra il contenuto della sezione attiva. Il selettore "Ruolo" nella dev bar in alto serve solo a questo prototipo per mostrare l\'RBAC — non è un campo reale del form: cambiandolo, le sezioni non accessibili a quel ruolo spariscono dal menu.',
        selector: '#grav-tour-form-nav',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('identita'); },
        delay: 500,
        width: 820, // balloon più largo del default (440): la matrice ha 7 colonne
        table: ROLE_SECTION_MATRIX,
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
        title: 'Aggiunto: ora è una riga nell\'accordion',
        description: '"Aggiungi" salva **davvero** questo cespite: il sotto-drawer si chiude e l\'elemento compare qui come pannello di un **accordion** (non una card), espandibile per rivederne i dettagli, rimovibile con il cestino. ==Scelta deliberata==: i campi di Cespiti e Dispositivi cambiano troppo da tipo a tipo (Fondazione ha 4 campi, Pali ne ha 8, un Player multimediale ne ha altri ancora) per stare in un formato a card fisso — l\'accordion si adatta a ciascuno. Il pulsante "Aggiungi cespite" resta disponibile per aggiungerne altri.',
        selector: '#grav-tour-form-required',
        placement: 'right',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('struttura', '#grav-tour-add-cespite-btn', 'grav-squadra-drawer', function () {
            ghfCall(['__ghfCespite', 'pickTipo']);
            setTimeout(function () { ghfClick('.grav-cespite-drawer .ant-btn-primary'); ghfNudge(); }, 250);
          });
        },
        delay: 1500,
        dev: [{ label: 'Componente', value: 'AssetAccordion — Collapse (AntD) accordion:true\nusato SOLO per Cespiti/Dispositivi; Squadre e Facce usano EntityCard' }],
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
        description: '"Salva" registra la squadra e torna alla sezione, ora con la sua **card** (squadra, tipo di affissione, costi) — qui sì una card, non un accordion: i campi di una squadra sono sempre gli stessi, quindi un formato fisso funziona. Stesso pattern di apertura/salvataggio di Cespiti e Dispositivi: si ripete per ogni squadra da assegnare.',
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
        title: 'Uscire con modifiche non salvate',
        description: 'A questo punto il form ha dati in più sezioni (Anagrafica, Cespiti, Squadre). Cliccando "Annulla" (o la ✕) compare un avviso **ancorato al pulsante** — mai una finestra a schermo intero — con "Continua a modificare" come scelta predefinita ed "Esci e scarta" esplicito, in rosso, per chi vuole davvero abbandonare. ==Stesso linguaggio di conferma su tutti i sotto-drawer del flusso== (Faccia, Cespite/Dispositivo, Squadra, Collega permesso, Collega modulo).',
        selector: '.ant-popconfirm',
        placement: 'bottom',
        onEnter: function () {
          ghfEnsureOpen();
          setTimeout(function () { ghfClick('.grav-main-drawer .ant-drawer-header .ant-btn-default'); ghfNudge(); }, 300);
        },
        delay: 700,
        dev: [{ label: 'Pattern', value: "DiscardButton + DiscardCloseIcon (LAYOUT.md §6.6)\nokButtonProps: { danger: true } · cancelText di default" }],
      },
      {
        title: 'Crea l\'impianto',
        description: 'Con i 6 campi obbligatori dell\'Anagrafica compilati, il pulsante finale è ora **attivo davvero**: cliccandolo l\'impianto viene creato con tutti i dati inseriti in questa demo (identità, cespite e squadra appena aggiunti) e si torna al Parco Impianti.',
        selector: '#grav-tour-form-save',
        placement: 'bottomRight',
        onEnter: function () {
          ghfClick('.ant-popconfirm .ant-btn-default');
          ghfEnsureOpen();
        },
        delay: 500,
        dev: [{ label: 'Campi obbligatori', value: 'Canale · Tipologia · Formato · Via · Città · Stato\n(disabled finché canSave === false — qui tutti compilati)' }],
      },
    ],
  },
  {
    id: 'anagrafica-ubicazione',
    title: 'US#1 — Anagrafica e ubicazione',
    description: 'Come **Inventory Manager**, voglio compilare l\'anagrafica e l\'ubicazione dell\'impianto con un aiuto automatico sui campi derivati così da registrare rapidamente un impianto corretto e georeferenziato.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Anagrafica e ubicazione"',
        description: 'La prima sezione del form di creazione: identità dell\'impianto (canale, tipologia, formato, proprietà, stato) e la sua posizione geografica.',
        selector: '[data-section="identita"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('dati-amministrativi'); },
        delay: 700,
      },
      {
        title: 'Cascata Canale → Tipologia → Formato',
        description: '**Canale** è il primo campo (OOH/DOOH), obbligatorio. **Tipologia** resta disabilitata finché Canale è vuoto, e mostra solo le tipologie di quel canale, raggruppate per famiglia (intestazione non selezionabile) e ricercabili per testo. **Formato** resta disabilitato finché Tipologia è vuota, e propone solo i formati di quella tipologia. Cambiando Canale si azzerano Tipologia e Formato; cambiando Tipologia si azzera Formato.',
        selector: AN_ROW_CANALE_TIPOLOGIA,
        placement: 'bottom',
        onEnter: function () { ghfFillCascata(); },
        delay: 1200,
        dev: [{ label: 'Opzioni', value: 'Tipologia: Select grouped (OptGroup) da MACRO_TIPI_PER_CANALE[canale], showSearch\nFormato: Select da FORMATI_PER_TIPO[tipologia]' }],
      },
      {
        title: 'Nome impianto generato automaticamente',
        description: 'Campo in sola lettura, composto da **{CANALE}-{Tipologia abbreviata}-{Formato}-{Sigla provincia}**: ogni segmento compare appena il campo sorgente è valorizzato (qui senza provincia perché l\'indirizzo non è ancora stato compilato — arriva nello step successivo).',
        selector: AN_ROW_FORMATO_NOME,
        placement: 'bottom',
        onEnter: function () { ghfFillCascata(); },
        delay: 1200,
        dev: [{ label: 'Nota', value: '==Manca il prefisso "{Progressivo}–" iniziale previsto dal criterio di accettazione== (per la disambiguazione di nomi duplicati, gestita dal backend — non simulabile nel prototipo senza un backend reale). Vedi icona nota.' }],
      },
      {
        title: 'Indirizzo: ricerca con suggerimenti',
        description: '"Via" è un campo di ricerca con icona di localizzazione; selezionando un suggerimento si compilano davvero N. civico, CAP, Città, Provincia, Regione, Nazione, Latitudine e Longitudine — tutti campi normali, sempre visibili e modificabili anche a mano, senza dover passare dalla ricerca.',
        selector: AN_CARD_INDIRIZZO,
        placement: 'top',
        onEnter: function () { ghfEnsureAnagraficaSection(function () { if (window.__ghfIdentita) window.__ghfIdentita.applyAddressExample(); ghfNudge(); }); },
        delay: 900,
        dev: [{ label: 'Componente', value: 'AutoComplete (AntD) — opzioni con icona EnvironmentOutlined + indirizzo + sotto-etichetta' }],
      },
      {
        title: 'Zona: a compilazione manuale',
        description: '"Zona" ==non fa parte dei campi compilati dalla ricerca indirizzo== (a differenza di CAP, Città, Provincia, ecc.): resta sempre a compilazione manuale, anche dopo aver selezionato un suggerimento — qui valorizzata a parte per mostrarlo.',
        selector: AN_ROW_NAZIONE_ZONA,
        placement: 'top',
        onEnter: function () { ghfEnsureAnagraficaSection(function () { var api = window.__ghfIdentita; if (api) { api.applyAddressExample(); api.setZonaExample(); } ghfNudge(); }); },
        delay: 900,
      },
      {
        title: 'Proprietà e Stato',
        description: '**Proprietà** è un unico select ricercabile, raggruppato in due famiglie: "Gestione diretta" (Proprietario) e "Concessionarie" (elenco a catalogo — qui selezionata una concessionaria per mostrare quel gruppo). **Stato** è obbligatorio, con quattro opzioni (Attivo, Inizializzato, In Manutenzione, Rimosso) e pallino colorato per ciascuna.',
        selector: AN_ROW_PROPRIETA_STATO,
        placement: 'bottom',
        onEnter: function () { ghfEnsureAnagraficaSection(function () { var api = window.__ghfIdentita; if (api) { api.pickProprietaConcessionaria(); api.pickStato(); } ghfNudge(); }); },
        delay: 700,
      },
    ],
  },
  {
    id: 'iter-autorizzativo',
    title: 'US#1.1 — Iter autorizzativo',
    description: 'Come **Inventory Manager**, voglio collegare l\'impianto ai titoli relativi all\'esposizione sullo spazio (concessioni/autorizzazioni, progetto Genio Civile, SCIA) così da avere in un unico posto tutto ciò che serve alla pratica edilizia e al canone.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Iter autorizzativo"',
        description: 'Nello stesso form di creazione, la sezione **Iter autorizzativo** raccoglie concessioni/autorizzazioni, suolo e canone, progetto Genio Civile e SCIA — tutto ciò che serve alla pratica edilizia in un unico posto.',
        selector: '[data-section="dati-amministrativi"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('identita'); },
        delay: 700,
        width: 820,
        table: ROLE_SECTION_MATRIX,
      },
      {
        title: 'Concessioni e autorizzazioni collegate',
        description: 'I permessi già collegati compaiono come card, con stato (pallino colorato), ente emittente e scadenza. ==Si collega, non si crea==: gli atti esistono già in anagrafica, l\'impianto si limita ad agganciarsi al numero utenza (concessione) o al protocollo (autorizzazione) giusto.',
        selector: CF_CARD_CONC,
        placement: 'bottom',
        onEnter: function () { ghfEnsureIterSection(); },
        delay: 700,
        dev: [{ label: 'Componente', value: 'FormPermitCard (EntityCard) — la stessa card riusata nel dettaglio impianto (PermitCard)' }],
      },
      {
        title: 'Collegare una concessione: ricerca + utenze',
        description: 'Il pulsante "Collega permesso" apre il menu per scegliere tra Concessione e Autorizzazione; scegliendo Concessione si apre questo drawer, con ricerca, istruzioni di selezione, l\'elenco delle concessioni **paginato** e, aprendo ciascuna, la tabella delle utenze collegabili. ==Si seleziona una sola utenza per volta==: checkbox esclusivo, non multiplo.',
        selector: '.ant-drawer-body .ant-collapse',
        placement: 'left',
        onEnter: function () { ghfOpenPermitDrawer('concessione'); },
        delay: 900,
        dev: [{ label: 'Componente', value: 'GrantsAccordion — Input ricerca + Collapse (AntD) + Pagination, riusato identico nel dettaglio impianto' }],
      },
      {
        title: 'Colonna "Codice Cimasa": in sospeso',
        description: 'La tabella utenze mostra anche "Codice Cimasa" — non ci sono azioni da fare qui, il dettaglio è nella nota sulla colonna stessa (vedi icona note).',
        selector: '.ant-collapse-content-box',
        placement: 'right',
        onEnter: function () { ghfOpenPermitDrawer('concessione'); },
        delay: 900,
      },
      {
        title: 'Atti scaduti: visibili e selezionabili',
        description: 'Gli atti scaduti (qui il Comune di Trapani, **selezionato** per mostrarlo davvero) restano visibili e selezionabili — corretto. ==Manca però l\'avviso non bloccante== richiesto dal criterio di accettazione quando si seleziona un atto scaduto: da aggiungere, senza disabilitare la conferma.',
        selector: '.ant-collapse-item:nth-child(3) .ant-collapse-header',
        placement: 'right',
        onEnter: function () {
          ghfOpenPermitDrawer('concessione', function () {
            window.__ghfIterPermessi.selectExpiredUtenza();
            // Il pannello del terzo atto (quello scaduto) è collassato di default nell'accordion:
            // aspettiamo che esista DAVVERO (non solo il drawer) prima di aprirlo, per mostrare
            // la riga selezionata e non solo lo stato interno.
            ghfWaitFor('.ant-collapse-item:nth-child(3) .ant-collapse-header', function () {
              var header = document.querySelector('.ant-collapse-item:nth-child(3) .ant-collapse-header');
              if (header) header.click();
              ghfNudge();
            });
          });
        },
        delay: 1100,
      },
      {
        title: 'Collegare più autorizzazioni in blocco',
        description: 'Scegliendo Autorizzazione dallo stesso menu, le autorizzazioni si selezionano in blocco con checkbox multiple (qui **3 già selezionate** per mostrare il risultato) e si collegano tutte insieme — a differenza della concessione, qui non c\'è vincolo di selezione singola.',
        selector: '.ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfOpenPermitDrawer('autorizzazione', function () { window.__ghfIterPermessi.selectSomeAuthorizations(); ghfNudge(); }); },
        delay: 1100,
        dev: [{ label: 'Componente', value: 'AuthorizationsList — Input ricerca + Switch "Mostra solo i selezionati" + Checkbox multiple' }],
      },
      {
        title: 'Suolo e canone: valorizzato dal collegamento',
        description: 'Quando si collega una concessione, **Tipo suolo** si valorizza in sola lettura da essa (Pubblico/Privato) — **Categoria suolo** resta invece a compilazione manuale. ==Qui la concessione è già stata collegata== (se non lo era ancora) per mostrare il campo davvero valorizzato, non solo il placeholder "Collega una concessione".',
        selector: CF_SUOLO_ROW,
        placement: 'bottom',
        onEnter: function () { ghfEnsureConcessioneLinked(); },
        delay: 700,
      },
      {
        title: 'Progetto Genio Civile: dati e documenti',
        description: 'Caricando più documenti si autocompilano i campi già censiti in anagrafica (Progettista, Direttore dei lavori, Responsabile sicurezza cantiere, Laboratorio, Geologo, Collaudatore); gli altri campi (data collaudo, calcestruzzo, acciai, ditta cemento armato, tecniche, data fine lavori) restano liberi. ==Tutti i campi si possono compilare anche interamente a mano==, senza caricare nulla — qui compilati con dati di esempio per mostrare il risultato invece del form vuoto.',
        selector: CF_CARD_PROGETTO,
        placement: 'bottom',
        onEnter: function () { ghfEnsureIterSection(function () { if (window.__ghfIterPermessi) window.__ghfIterPermessi.fillProjectExample(); ghfNudge(); }); },
        delay: 700,
      },
      {
        title: '"Scarica Modulo": fuori scope questo sprint',
        description: 'Nessuna azione da mostrare qui: il pulsante resta nel prototipo come segnaposto di demo, ma la generazione del modulo va vista come fuori scope questo sprint (dettaglio nella nota).',
        selector: CF_SCARICA_MODULO,
        placement: 'top',
        onEnter: function () { ghfEnsureIterSection(); },
        delay: 500,
      },
      {
        title: 'Titolo a installare: SCIA Urbanistica e Commerciale',
        description: 'Due blocchi paralleli, ciascuno con empty state, upload documenti e campi propri; la SCIA Urbanistica ha in più "Tecnico asseverante" e "Termine fine lavori" — qui compilati con dati di esempio coerenti (presentazione → verifica → fine lavori in ordine) per mostrare il risultato atteso. ==Manca ancora la validazione== che impedisce di impostare "Termine di verifica dell\'ente" prima di "Data di presentazione", e "Termine fine lavori" prima del "Termine di verifica": i valori di esempio sono già coerenti, ma nulla impedirebbe di invertirli.',
        selector: CF_CARD_SCIA,
        placement: 'top',
        onEnter: function () { ghfEnsureIterSection(function () { if (window.__ghfIterPermessi) window.__ghfIterPermessi.fillSciaExample(); ghfNudge(); }); },
        delay: 700,
      },
    ],
  },
];

window.HANDOFF_COMPONENTS = [
  { selector: '#grav-tour-new-btn', name: 'Button "Nuovo Impianto"', level: 'Atomo', figma: 'Button — Type=Primary · Size=Large · Icon=Plus' },
  { selector: '.ant-popconfirm', name: 'Avviso modifiche non salvate', level: 'Molecola', custom: true,
    funzione: 'Popconfirm ancorato al pulsante che scatena l\'uscita (Annulla o ✕) di ogni drawer/form del flusso — mai una Modal a schermo intero (LAYOUT.md §6.6). "Continua a modificare" è la scelta di default, "Esci e scarta" è esplicito e in rosso.',
    composizione: 'Popconfirm (AntD) — okText/cancelText + okButtonProps: { danger: true }',
    figma: 'Popconfirm — Type=Warning · Placement=Bottom' },
  { selector: '.create-nav', name: 'Navigazione sezioni form', level: 'Molecola', custom: true,
    funzione: 'Elenco verticale delle sezioni del form (fino a 6). La sezione attiva è evidenziata; le sezioni non accessibili al ruolo selezionato non vengono mostrate.',
    figma: 'Da definire — pattern custom, non un componente standard Ant Design' },
  { selector: '.create-nav-item', name: 'Voce di sezione', level: 'Atomo', custom: true,
    funzione: 'Singola voce cliccabile del menu sezioni: stato attivo, asterisco se contiene campi obbligatori.',
    figma: 'Da definire — pattern custom' },
  { selector: '.ni-field', name: 'Campo form (label + controllo)', level: 'Molecola', custom: true,
    funzione: 'Wrapper standard di ogni campo del form: label + asterisco se obbligatorio + controllo Ant Design.',
    figma: 'Form.Item — Layout=Vertical' },
  { selector: '#grav-tour-add-cespite-btn', name: 'Button "Aggiungi cespite"', level: 'Atomo', figma: 'Button — Type=Default · Icon=Plus' },
  { selector: '#grav-tour-add-squadra-btn', name: 'Button "Aggiungi squadra"', level: 'Atomo', figma: 'Button — Type=Default · Icon=Plus' },
  { selector: '#grav-tour-form-required .ant-collapse', name: 'Accordion Cespiti/Dispositivi', level: 'Organismo', custom: true,
    funzione: 'Elenca i cespiti/dispositivi aggiunti — un pannello Collapse per elemento, chiuso di default tranne il primo. Non è una card: i campi mostrati (etichetta + valore) dipendono dal tipo, quindi il pannello si adatta invece di un layout fisso.',
    composizione: 'Collapse (AntD, accordion:true) — ogni pannello: titolo + tag/stato + azioni (⋮ Visualizza/Elimina) + griglia label/valore',
    figma: 'Collapse — Type=Accordion' },
  { selector: '.grav-cespite-drawer', name: 'Sotto-drawer Cespite/Dispositivo', level: 'Organismo', custom: true,
    funzione: 'Drawer impilato sopra il form principale per la creazione di **un singolo** cespite o dispositivo. La select "Tipo" determina dinamicamente i campi mostrati.',
    composizione: 'Drawer (AntD) + Select tipo + campi dinamici (Input/Select/DatePicker/Tags) + azioni Annulla/Aggiungi',
    figma: 'Drawer — Placement=Right · Size=Default (600px)' },
  { selector: '.grav-squadra-drawer', name: 'Sotto-drawer Squadra', level: 'Organismo', custom: true,
    funzione: 'Drawer impilato sopra il form principale per l\'assegnazione di **una singola** squadra (affissione o manutenzione).',
    composizione: 'Drawer (AntD) + Select squadra + campi condizionati dal tipo + azione Salva',
    figma: 'Drawer — Placement=Right · Size=Default (520px)' },
  { selector: '#grav-tour-form-save', name: 'Button "Crea Impianto"', level: 'Atomo', figma: 'Button — Type=Primary · Icon=Plus · State=Disabled finché mancano i campi obbligatori' },
  { selector: CF_CARD_CONC, name: 'Card "Concessioni e autorizzazioni"', level: 'Organismo', custom: true,
    funzione: 'Elenca i permessi già collegati all\'impianto (FormPermitCard) e il menu per collegarne di nuovi (concessione o autorizzazione).',
    composizione: 'Row/Col di FormPermitCard + Dropdown (menu Collega Concessione/Autorizzazione) + Button',
    figma: 'Da definire — pattern custom' },
  { selector: '.ant-drawer-body .ant-collapse', name: 'GrantsAccordion (drawer Concessione)', level: 'Organismo', custom: true,
    funzione: 'Ricerca + elenco concessioni paginato, espandibili in tabella utenze con selezione a scelta singola (checkbox esclusivo).',
    composizione: 'Input ricerca + Collapse (AntD, un pannello per concessione) + Pagination + Checkbox per riga utenza',
    figma: 'Da definire — pattern custom' },
];

// ════════════════════════════════════════════════════════════════════════════
// Dipendenze tra entità (pannello "Dipendenze" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_DEPENDENCIES = [
  {
    id: 'ruolo-sezione',
    title: 'Ruolo × Sezione form',
    description: 'Quali sezioni del form "Nuovo Impianto" sono abilitate per ciascun ruolo (RBAC).',
    table: ROLE_SECTION_MATRIX,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Relazioni tra entità (pannello "Relazioni" nel tab "Modello" in navbar)
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_RELATIONS = [
  {
    id: 'entita',
    title: 'Relazioni tra entità',
    description: 'Cardinalità principali del dominio Inventory · Impianti.',
    table: {
      headers: ['Da', '', 'A', 'Cardinalità'],
      rows: [
        ['Impianto',       '→', 'Faccia',                     '1 : N'],
        ['Impianto',       '→', 'Cespite / Dispositivo',      '1 : N'],
        ['Impianto',       '→', 'Squadra (affissione/manut.)', 'N : N'],
        ['Impianto',       '→', 'Concessione',                'N : N'],
        ['Impianto',       '→', 'Autorizzazione',             'N : N'],
        ['Impianto',       '→', 'Impianto (moduli collegati)', 'N : N'],
      ],
      note: 'Cardinalità a livello di design, da confermare in fase backend. Cespiti e Dispositivi condividono la stessa collezione (discriminati da "categoria"), non due entità separate.',
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Scenari (tab "Scenari" nel pannello Modello): combinazioni di campi che
// cambiano in base al tipo di Cespite/Dispositivo selezionato.
// ════════════════════════════════════════════════════════════════════════════

window.HANDOFF_SCENARIOS = [
  {
    id: 'campi-per-tipo',
    title: 'Campi per tipo di Cespite',
    description: 'La select "Tipo" nel sotto-drawer Cespite determina quali campi compaiono: ogni tipo ha il suo set coerente, da qui la scelta dell\'accordion invece della card fissa.',
    table: {
      headers: ['Tipo', 'N. campi'],
      rows: [
        ['Fondazione',      '4'],
        ['Pali',            '8'],
        ['Cornice',         '3'],
        ['Pannelli',        '4'],
        ['Extra struttura', '6'],
      ],
      note: 'Conteggio dei campi specifici del tipo (non include i campi comuni del sotto-drawer, es. note).',
    },
  },
  {
    id: 'campi-per-tipo-dispositivo',
    title: 'Campi per tipo di Dispositivo',
    description: 'Stesso meccanismo dei Cespiti: 3 campi comuni a tutti i dispositivi (Nome, Stato, Descrizione) + campi specifici per tipo (es. MAC, IP, seriali).',
    table: {
      headers: ['Tipo', 'Campi comuni', 'Campi specifici', 'Totale'],
      rows: [
        ['Player multimediale', '3', '6', '9'],
        ['Modem / Router',      '3', '6', '9'],
        ['Telecamera',          '3', '5', '8'],
        ['Sensore',             '3', '4', '7'],
        ['Schermo / Display',   '3', '4', '7'],
        ['Centralina',          '3', '4', '7'],
        ['Altro',               '3', '0', '3'],
      ],
      note: '"Altro" ha solo i campi comuni — nessun campo specifico configurato.',
    },
  },
];

window.HANDOFF_NOTES = [
  {
    id: 'sezioni-facoltative',
    title: 'Solo l\'Anagrafica ha campi obbligatori',
    body: 'Le altre 5 sezioni (Iter autorizzativo, Dati tecnici, Cespiti e dispositivi, Squadre, Commerciale) sono **tutte facoltative** in creazione: l\'obiettivo è permettere di censire rapidamente un impianto anche con dati parziali, completandolo in un secondo momento dalla modifica.',
  },
  // ── US#1 — Anagrafica e ubicazione: note di design/criteri aperti ───────
  {
    id: 'anagrafica-nome-progressivo',
    title: 'Nome impianto: manca il prefisso "Progressivo"',
    body: 'Il criterio di accettazione descrive il formato **{Progressivo}–{CANALE}-{Tipologia abbreviata}-{Formato}-{Sigla provincia}**, con il progressivo aggiunto dal backend in caso di nomi duplicati (per garantirne l\'unicità).\n==Nel prototipo oggi== il nome si compone solo da CANALE-Tipologia-Formato-Provincia, senza alcun prefisso progressivo: la disambiguazione dei duplicati dipende da un controllo lato backend (verifica su tutti gli impianti esistenti) che un prototipo frontend-only non può simulare in modo affidabile — segnalarlo in fase di sviluppo reale, non è un difetto da correggere qui.',
  },
  {
    id: 'add-one-at-a-time',
    title: 'Pattern "aggiungi un elemento alla volta"',
    body: 'Cespiti, Dispositivi, Squadre e Facce condividono lo stesso pattern di interazione:\n- il pulsante **Aggiungi** apre un sotto-drawer con un solo record da compilare;\n- salvando, il sotto-drawer si chiude e l\'elemento compare nella sezione;\n- si ripete l\'azione per ogni nuovo elemento — nessun form con righe multiple da gestire in una volta sola.\n==Scelta deliberata==: evita form tabellari lunghi e riduce l\'errore di compilazione su righe multiple contemporaneamente.\n\nIl COMPONENTE che mostra l\'elemento aggiunto però cambia:\n- **Squadre e Facce → card** (EntityCard): i campi sono sempre gli stessi, un formato fisso funziona.\n- **Cespiti e Dispositivi → accordion** (Collapse): i campi variano troppo da tipo a tipo (una Fondazione e un Player multimediale non condividono quasi nulla) per stare in una card a layout fisso — il pannello si adatta al contenuto di ciascun tipo.',
  },
  // ── US#1.1 — Iter autorizzativo: note di design/criteri aperti ──────────
  {
    id: 'iter-cimasa-sospeso',
    title: 'Colonna "Codice Cimasa": sospesa',
    body: 'Prevista in origine nella tabella utenze del drawer di collegamento, ma **non esiste nell\'anagrafica reale delle utenze**.\n==Sospeso, priorità alta==: resta esclusa finché il design non chiarisce il destino del campo — non implementarla in questa forma.',
  },
  {
    id: 'iter-scaduti-avviso',
    title: 'Atti scaduti: manca l\'avviso non bloccante',
    body: 'Concessioni e autorizzazioni scadute **restano visibili e selezionabili** nel drawer — corretto, già così nel prototipo.\n==Manca però== l\'avviso non bloccante richiesto dal criterio di accettazione quando si seleziona/collega un atto scaduto (es. un Alert nel drawer): da aggiungere, senza disabilitare mai la conferma.',
  },
  {
    id: 'iter-scia-validazioni',
    title: 'SCIA: validazioni sulle date da aggiungere',
    body: '"Termine di verifica dell\'ente" non può precedere "Data di presentazione"; "Termine fine lavori" non può precedere il "Termine di verifica" — vincoli richiesti dal criterio di accettazione.\n==Nel prototipo oggi== questi campi non hanno ancora alcuna validazione di ordine tra le date.',
  },
  {
    id: 'iter-scarica-modulo-fuori-scope',
    title: '"Scarica modulo": fuori scope questo sprint',
    body: '==Fuori scope per questo sprint==: la generazione del modulo regionale precompilato del Genio Civile.\nIl target non è un modulo unico, ma un **sistema di template regionali multipli**, caricabili dall\'Admin tenant in base alle regioni necessarie.\n**Non svilupparla né includerla nell\'handoff** finché non è ridisegnata — nel prototipo resta visibile solo come segnaposto della demo.',
  },
  {
    id: 'iter-autorizzazioni-paginazione',
    title: 'Drawer Autorizzazioni: manca la paginazione',
    body: 'Il drawer di collegamento concessione ha ricerca + paginazione; quello di collegamento autorizzazione ha ricerca ma **non è ancora paginato**.\n==Da allineare==: con l\'anagrafica reale delle autorizzazioni la lista potrebbe crescere oltre una singola pagina, come già gestito per le concessioni.',
  },
];
