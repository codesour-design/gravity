/**
 * Handoff — Inventory Systems: flusso "Nuovo impianto" (NewImpiantoFullDrawer)
 * V1 — versione attiva (in lavorazione). Copre il drawer a pagina intera:
 * - GRP-622 — Creazione: apertura, navigazione tra le sezioni, compilazione
 *   reale dei campi obbligatori e il pattern "aggiungi un elemento alla volta"
 *   nei sotto-drawer di Cespiti/Dispositivi e Squadre — con salvataggio reale,
 *   non solo apertura/chiusura.
 * - US#1 — Anagrafica e ubicazione: cascata Canale/Tipologia/Formato, nome
 *   impianto auto-generato, indirizzo con autocomplete, Zona, Proprietà, Stato.
 * - US#1.1 — Iter autorizzativo: approfondisce la sezione "Iter
 *   autorizzativo" dello stesso drawer — collegamento di concessioni/
 *   autorizzazioni, suolo e canone, progetto Genio Civile, SCIA urbanistica/
 *   commerciale.
 * - US#1.2 — Dati tecnici e facce: misure fisiche dell'impianto (con area
 *   ingombro calcolata) e configurazione di ciascuna faccia (tipo, slot,
 *   coordinate, orientamento, cono di visibilità, formato, illuminazione,
 *   dati commerciali).
 * - US#1.3 — Cespiti e dispositivi, US#1.4 — Squadre, US#1.5 — Commerciale.
 * Il resto del Parco Impianti (mappa, lista, ricerca/filtri, gestione
 * tipologie/formati) e la scheda impianto esistente non hanno user story in
 * questo sprint — vedi HANDOFF_OUT_OF_SPRINT.
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

// ── Helper di navigazione — US#1.2 Dati tecnici e facce (sezione "caratteristiche"
// del form di creazione) — sec('caratteristiche', ...) ha due box: "Caratteristiche
// fisiche" e "Facce", individuati per posizione come le altre sezioni. Il
// sotto-drawer "Aggiungi Faccia" (window.grav-face-drawer, solo nell'handoff — in
// index.html non ha className) si individua per posizione dei suoi campi diretti:
// la posizione di "Numero faretti/Watt" e "Commerciale" si sposta in base allo
// stato illuminazione scelto — ghfFillFacciaCompleta porta SEMPRE la faccia allo
// stesso stato finale (Illuminato → Faretti), così le posizioni restano stabili
// in ogni step del drawer, indipendentemente da quale step lo ha aperto per primo.
var CT_CARD_FISICHE    = '#grav-tour-form-required > div > div:nth-child(2)'; // Caratteristiche fisiche
var CT_CARD_FACCE      = '#grav-tour-form-required > div > div:nth-child(3)'; // Facce
var FD_ROW_TIPO        = '.grav-face-drawer .ant-drawer-body > div:nth-child(1)'; // Tipo faccia
var FD_ROW_COORD       = '.grav-face-drawer .ant-drawer-body > div:nth-child(4)'; // Coordinate
var FD_ROW_ORIENT      = '.grav-face-drawer .ant-drawer-body > div:nth-child(5)'; // Orientamento
var FD_ROW_STATO_ILLUM = '.grav-face-drawer .ant-drawer-body > div:nth-child(9)'; // Stato + Mezzo illuminazione
var FD_ROW_COMMERCIALE = '.grav-face-drawer .ant-drawer-body > div:nth-child(12)'; // Modello di vendita + Prezzo faccia (con Faretti selezionato)
var CT_FACE_CARD_FIRST = CT_CARD_FACCE + ' > div:nth-child(2) > div:nth-child(2) > div:first-child'; // prima FormFaceCard, dopo il pulsante Aggiungi Faccia
function ghfIsFaceDrawerOpen() {
  return !!document.querySelector('.grav-face-drawer .ant-drawer-body');
}
// Sezione "Dati tecnici" pronta: form aperto sulla sezione giusta E canale/
// tipologia/formato compilati (servono all'Anagrafica, non più alle facce:
// nessuna correlazione tipo↔slot) — cascata idempotente, richiamabile da
// ogni step senza effetti collaterali se già compilata. Compila anche un
// indirizzo di esempio: serve solo più avanti (le Coordinate della faccia
// ereditano lat/lng dall'impianto), farlo qui evita di doverlo ripetere nel
// drawer faccia.
function ghfEnsureCaratteristicheSection(cb) {
  ghfEnsureOpenAtSection('identita');
  setTimeout(function () {
    ghfCall(['__ghfIdentita', 'pickCanale']);
    setTimeout(function () {
      ghfCall(['__ghfIdentita', 'pickTipologia']);
      setTimeout(function () {
        ghfCall(['__ghfIdentita', 'pickFormato']);
        if (window.__ghfIdentita) window.__ghfIdentita.applyAddressExample();
        ghfClick('[data-section="caratteristiche"]');
        ghfNudge();
        cb && cb();
      }, 250);
    }, 250);
  }, 200);
}
// Apre il drawer "Aggiungi Faccia" (se non già aperto — riaprirlo lo resetterebbe)
// e compila DAVVERO tutti i campi con dati coerenti in un solo passaggio: ogni
// step del drawer richiama questo helper, così ciascuno mostra lo stesso
// risultato finale coerente qualunque sia lo step da cui si è entrati (anche
// saltando direttamente all'ultimo, "Commerciale", da "Indice").
function ghfFillFacciaCompleta(cb) {
  ghfEnsureCaratteristicheSection(function () {
    if (!ghfIsFaceDrawerOpen()) ghfCall(['__ghfCaratteristiche', 'openFace']);
    ghfWaitFor('.grav-face-drawer .ant-drawer-body', function () {
      var api = window.__ghfCaratteristiche;
      if (api) {
        api.pickFcTipo();
        api.setFcVisMarciaExample();
        api.setFcSlotExample();
        api.unlockFcCoord();
        api.setFcOrientExample();
        api.setFcConoExample();
        api.setFcFormatoExample();
        api.pickIlluminato();
        api.pickFaretti();
        api.setFcIllumNFarettiExample();
        api.setFcIllumWattExample();
        api.setFcVenditaExample();
        api.setFcPrezzoExample();
      }
      ghfNudge();
      cb && cb();
    }, 900);
  });
}
// Mostra il RISULTATO di "Aggiungi": compila la faccia e la salva davvero (il
// drawer si chiude da solo, come nel prototipo) invece di lasciarla a metà nel
// form — così lo step successivo trova sempre almeno una card da mostrare,
// qualunque sia lo step da cui si è entrati.
function ghfEnsureFaceSaved(cb) {
  if (document.querySelector(CT_FACE_CARD_FIRST)) { cb && cb(); return; }
  ghfFillFacciaCompleta(function () {
    // Il fill appena fatto aggiorna fcTipo ecc. in modo asincrono (setState in
    // batch): un pausa lascia a React il tempo di ri-renderizzare — e quindi
    // ricreare window.__ghfCaratteristiche con la closure fresca — PRIMA che
    // saveFaceNow() legga fcTipo, altrimenti saveFace() lo trova ancora a null
    // (valore precedente al fill) e non salva nulla in silenzio.
    setTimeout(function () {
      ghfCall(['__ghfCaratteristiche', 'saveFaceNow']);
      ghfWaitFor(CT_FACE_CARD_FIRST, function () { ghfNudge(); cb && cb(); }, 900);
    }, 200);
  });
}
// Mostra l'avviso di rimozione facce al cambio Tipologia: richiede almeno una
// faccia già salvata (altrimenti il guard lascia passare il cambio senza
// avvisare nulla, correttamente) — la crea se non esiste ancora.
function ghfEnsureTipologiaGuardModal(cb) {
  ghfEnsureFaceSaved(function () {
    ghfCall(['__ghfCaratteristiche', 'triggerTipologiaGuard']);
    ghfWaitFor('.ant-modal-confirm', function () { ghfNudge(); cb && cb(); }, 900);
  });
}

// ── Helper di navigazione — US#1.3 Cespiti e dispositivi (sezione "struttura"
// del form di creazione) — sec('struttura', ...) ha due box: "Cespiti" e
// "Dispositivi", individuati per posizione come le altre sezioni. Il
// sotto-drawer è UNICO per entrambe le categorie (.grav-cespite-drawer,
// stessa classe anche per i dispositivi): cliccare l'altro pulsante "Aggiungi"
// mentre è già aperto lo resetta sul tipo giusto da solo (openNewAsset), senza
// bisogno di chiuderlo prima.
var ST_CARD_CESPITI      = '#grav-tour-form-required > div > div:nth-child(2)'; // Cespiti
var ST_CARD_DISPOSITIVI  = '#grav-tour-form-required > div > div:nth-child(3)'; // Dispositivi
function ghfEnsureStrutturaSection(cb) {
  ghfEnsureOpenAtSection('struttura');
  ghfNudge();
  cb && cb();
}
// Apre il drawer condiviso Cespite/Dispositivo sul pulsante indicato e — quando
// il corpo esiste davvero — richiama `fillFn` (uno dei fillXxxExample esposti
// da window.__ghfCespite) per mostrare il RISULTATO compilato invece del form
// vuoto o di un solo tipo scelto a caso.
function ghfFillAsset(addBtnSelector, fillFn, cb) {
  ghfEnsureSubdrawerOpen('struttura', addBtnSelector, 'grav-squadra-drawer', function () {
    ghfWaitFor('.grav-cespite-drawer .ant-drawer-body', function () {
      if (window.__ghfCespite && fillFn) window.__ghfCespite[fillFn]();
      ghfNudge();
      cb && cb();
    }, 900);
  });
}
// Salva davvero l'elemento (chiude il sotto-drawer, come nel prototipo). Una
// pausa PRIMA di chiamare saveAssetNow lascia a React il tempo di
// ri-renderizzare dopo il fill appena fatto — altrimenti saveAsset() legge
// ancora acTipo/acVals precedenti al fill (closure non aggiornata) e non
// salva nulla in silenzio, stesso rischio già visto per le Facce.
function ghfSaveAssetNow(cb) {
  setTimeout(function () {
    ghfCall(['__ghfCespite', 'saveAssetNow']);
    ghfNudge();
    cb && cb();
  }, 250);
}

// ── Helper di navigazione — US#1.4 Squadre (sezione "affissione" del form di
// creazione, contiene i box "Affissione" e "Manutenzione") — drawer unico
// condiviso (SquadraDrawer, .grav-squadra-drawer) per entrambi i tipi, come
// per Cespiti/Dispositivi: cambiare pulsante lo resetta sul kind giusto da solo.
var SQ_CARD_AFFISSIONE   = '#grav-tour-form-required > div > div:nth-child(2)'; // Affissione
var SQ_CARD_MANUTENZIONE = '#grav-tour-form-required > div > div:nth-child(3)'; // Manutenzione
function ghfFillSquadra(addBtnSelector, fillFn, cb) {
  ghfEnsureSubdrawerOpen('affissione', addBtnSelector, 'grav-cespite-drawer', function () {
    ghfWaitFor('.grav-squadra-drawer .ant-drawer-body', function () {
      if (window.__ghfSquadra && fillFn) window.__ghfSquadra[fillFn]();
      ghfNudge();
      cb && cb();
    }, 900);
  });
}
// Stessa pausa-prima-di-salvare delle Facce/Cespiti: save() legge row.squadra
// ecc. direttamente (non via updater funzionale), quindi va richiamato dopo
// che React ha ri-renderizzato con i valori appena compilati.
function ghfSaveSquadraNow(cb) {
  setTimeout(function () {
    ghfCall(['__ghfSquadra', 'saveNow']);
    ghfNudge();
    cb && cb();
  }, 250);
}

// ── Helper di navigazione — US#1.5 Commerciale (sezione "commerciale" del
// form di creazione) — sec('commerciale', ...) ha tre box: "Identità
// commerciale", "Modello commerciale" e "Moduli". Il collegamento moduli
// filtra per canale/tipologia/formato correnti: la cascata va compilata prima
// di aprire il drawer, altrimenti propone l'intero catalogo IMPIANTI.
var COM_CARD_IDENTITA = '#grav-tour-form-required > div > div:nth-child(2)'; // Identità commerciale
var COM_CARD_MODELLO  = '#grav-tour-form-required > div > div:nth-child(3)'; // Modello commerciale
var COM_CARD_MODULI   = '#grav-tour-form-required > div > div:nth-child(4)'; // Moduli
function ghfEnsureCommercialeReady(cb) {
  ghfEnsureOpenAtSection('identita');
  setTimeout(function () {
    ghfCall(['__ghfIdentita', 'pickCanale']);
    setTimeout(function () {
      ghfCall(['__ghfIdentita', 'pickTipologia']);
      setTimeout(function () {
        ghfCall(['__ghfIdentita', 'pickFormato']);
        ghfClick('[data-section="commerciale"]');
        ghfNudge();
        cb && cb();
      }, 250);
    }, 250);
  }, 200);
}

window.HANDOFF_META = {
  title: 'Inventory — Impianti',
  version: 'V1',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
  // Storico versioni dell'handoff. Ogni versione è un file di config (il prototipo
  // resta unico: index.html + ?handoff=vX). Questo file (handoff-steps-v1.js) è
  // la versione ATTIVA: ci lavoriamo ancora sopra (nuove US/task, note, fuori
  // sprint vanno registrati qui), pur restando quella mostrata di default dal
  // bare ?handoff. handoff-steps.js (V2) è vuoto — placeholder per il prossimo
  // giro di cambiamenti, non ancora iniziato.
  // `current` è self-referenziale (riflette il file caricato, non "su cosa
  // stiamo lavorando"): qui è V1 a essere true perché questo È il file V1.
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: true, current: true, note: 'Versione approvata' },
    { id: 'V2', file: 'index.html?handoff=v2', approved: false, current: false, note: 'In lavorazione' },
  ],
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
  // Colonna "Codice Cimasa" nella tabella utenze del drawer Concessione — sospesa,
  // non esiste nell'anagrafica reale delle utenze (vedi nota iter-cimasa-sospeso).
  { selector: '.grav-cimasa-col', note: 'Fuori sprint — colonna "Codice Cimasa" sospesa: non esiste nell\'anagrafica reale delle utenze, non implementarla in questa forma finché il design non chiarisce il destino del campo' },
  // Intera sezione "Moduli" (box + pulsanti "Collega impianto" + eventuali card
  // collegate) — TASK DSN P0: oltre alla disponibilità già in creazione (fuori
  // scope finché non si chiude il capitolo 4), il selettore ha anche un bug di
  // fondo che lo rende di fatto inutilizzabile (formato cascata disallineato
  // dagli impianti censiti) e manca la distanza richiesta dal criterio — l'intera
  // funzionalità resta quindi fuori sprint, visibile solo come riferimento del
  // comportamento target (vedi note commerciale-moduli-*).
  { selector: COM_CARD_MODULI, note: 'Fuori sprint — l\'intera sezione Moduli: disponibilità in creazione fuori scope (TASK DSN P0, capitolo 4 da chiudere), selettore con formato disallineato dagli impianti censiti e senza distanza. Visibile solo come riferimento del comportamento target, non da realizzare ora' },
  // "Se venduto a moduli, applica uno sconto del __%" (box Modello commerciale) —
  // ha senso solo se esiste il concetto di modulo collegato: stesso motivo del
  // box Moduli, stessa esclusione.
  { selector: '.grav-sconto-moduli-row', note: 'Fuori sprint — lo sconto "se venduto a moduli" dipende dal concetto di modulo collegato, esso stesso fuori sprint: non ha senso implementarlo prima' },
  // Drawer "Collega impianto" (selezione impianti compatibili da collegare) —
  // stessa esclusione della sezione Moduli che lo apre.
  { selector: '.grav-moduli-drawer .ant-drawer-content', note: 'Fuori sprint — drawer di selezione moduli: stessa esclusione della sezione Moduli (TASK DSN P0)' },
  // Modal "Collegare come moduli?" proposta automaticamente al salvataggio —
  // altro punto di ingresso alla stessa funzionalità fuori scope in creazione.
  { selector: '.grav-savelink-modal .ant-modal-content', note: 'Fuori sprint — proposta di collegamento moduli al salvataggio: altro punto di ingresso a Moduli in creazione, fuori scope (TASK DSN P0)' },

  // ── Parco Impianti (schermata "lista"): tutto ciò che ci si vede è fuori
  // sprint, TRANNE il pulsante "Nuovo Impianto" e il suo drawer di creazione
  // (GRP-622, US#1–US#1.5) — mappa, lista, ricerca/filtri, tab canale e la
  // gestione tipologie/formati non hanno nessuna user story in questo sprint.
  { selector: '.grav-parco-title', note: 'Fuori sprint — titolo "Parco Impianti": nessuna user story in questo sprint, solo la creazione (GRP-622) è in scope' },
  { selector: '.ss-tab-bar', note: 'Fuori sprint — tab Tutti/OOH/DOOH del Parco Impianti: nessuna user story in questo sprint' },
  { selector: '#grav-tour-filter-bar', note: 'Fuori sprint — ricerca per zona/indirizzo e filtri avanzati del Parco Impianti: nessuna user story in questo sprint' },
  { selector: '.ss-active-filters', note: 'Fuori sprint — chip dei filtri attivi: nessuna user story in questo sprint' },
  { selector: '.grav-add-taxonomy-btn', note: 'Fuori sprint — "Aggiungi tipologia"/"Aggiungi formato": nessuna user story in questo sprint' },
  { selector: '.ooh-map-area', note: 'Fuori sprint — vista mappa del Parco Impianti (marker, popover impianto, toggle Mappa/Lista): nessuna user story in questo sprint' },
  { selector: '.ooh-list-area', note: 'Fuori sprint — vista lista/tabella del Parco Impianti: nessuna user story in questo sprint' },
  { selector: '.gfd-drawer .ant-drawer-content', note: 'Fuori sprint — drawer "Filtri avanzati": nessuna user story in questo sprint' },
];

// Avviso mostrato in cima al pannello Sprint Jira: le voci qui sotto coprono
// solo la creazione impianto, non l'intero modulo Inventory — fa fede Jira.
window.HANDOFF_SPRINT_NOTE = 'Le voci qui sotto sono ==solo i task di questa sprint relativi alla creazione del Parco Impianti==. **Fa fede la sprint su Jira**, che potrebbe includere altri task o sotto-task non rappresentati in questo pannello.';

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
    ['Inventory Manager', '✓', '✓', '✓', '✓', '✓', '✓'],
  ],
  note: '✓ = sezione visibile nel menu · ✗ = sezione non mostrata per quel ruolo. Decisione di questo sprint: Admin tenant e Inventory Manager hanno accesso completo a tutte le sezioni del form. Operation Manager non è incluso in questa matrice per ora — la sua granularità (quali sezioni, quali permessi) verrà definita in una sprint di progetto futura, insieme a un eventuale affinamento anche di questa stessa matrice.',
};

window.HANDOFF_TOURS = [
  {
    id: 'nuovo-impianto',
    title: 'GRP-622 — Creazione nuovo impianto',
    description: 'Come **Inventory Manager**, voglio creare un nuovo impianto dal Parco Impianti così da registrarlo in piattaforma anche compilando solo i dati che conosco al momento.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    type: 'task',
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
        title: 'Aggiungi la squadra',
        description: 'Il pulsante "Aggiungi" resta spento finché non si seleziona una squadra; una volta scelta, registra **davvero una sola squadra** e richiude il sotto-drawer. Nota: a differenza del drawer Cespiti, questo non ha un pulsante "Annulla" esplicito — si chiude con la ✕ in alto.',
        selector: '.grav-squadra-drawer .ant-btn-primary',
        placement: 'left',
        onEnter: function () {
          ghfEnsureSubdrawerOpen('affissione', '#grav-tour-add-squadra-btn', 'grav-cespite-drawer', function () { ghfCall(['__ghfSquadra', 'pickSquadra']); });
        },
        delay: 900,
      },
      {
        title: 'Aggiunta: ora è una card',
        description: '"Aggiungi" registra la squadra e torna alla sezione, ora con la sua **card** (squadra, tipo di affissione, costi) — qui sì una card, non un accordion: i campi di una squadra sono sempre gli stessi, quindi un formato fisso funziona. Stesso pattern di apertura/salvataggio di Cespiti e Dispositivi: si ripete per ogni squadra da assegnare.',
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
    title: 'GRP-620 — US#1 — Anagrafica e ubicazione',
    description: 'Come **Inventory Manager**, voglio compilare l\'anagrafica e l\'ubicazione dell\'impianto con un aiuto automatico sui campi derivati così da registrare rapidamente un impianto corretto e georeferenziato.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Anagrafica e ubicazione"',
        description: 'La prima sezione del form di creazione: identità dell\'impianto (canale, tipologia, formato, proprietà, stato) e la sua posizione geografica.',
        selector: '[data-section="identita"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('identita'); },
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
    title: 'GRP-624 — US#1.1 — Iter autorizzativo',
    description: 'Come **Inventory Manager**, voglio collegare l\'impianto ai titoli relativi all\'esposizione sullo spazio (concessioni/autorizzazioni, progetto Genio Civile, SCIA) così da avere in un unico posto tutto ciò che serve alla pratica edilizia e al canone.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Iter autorizzativo"',
        description: 'Nello stesso form di creazione, la sezione **Iter autorizzativo** raccoglie concessioni/autorizzazioni, suolo e canone, progetto Genio Civile e SCIA — tutto ciò che serve alla pratica edilizia in un unico posto.',
        selector: '[data-section="dati-amministrativi"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('dati-amministrativi'); },
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
  {
    id: 'dati-tecnici-facce',
    title: 'GRP-626 — US#1.2 — Dati tecnici e facce',
    description: 'Come **Inventory Manager**, voglio registrare le misure dell\'impianto e configurare liberamente tutte le sue facce così da conoscere l\'ingombro reale e i dettagli espositivi di ciascuna faccia.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Dati tecnici"',
        description: 'Terza sezione del form di creazione: misure fisiche del pannello e configurazione delle sue facce, una alla volta.',
        selector: '[data-section="caratteristiche"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('caratteristiche'); },
        delay: 700,
      },
      {
        title: 'Caratteristiche fisiche: misure e ingombro',
        description: '**Larghezza**, **Altezza** e **Profondità** in cm accettano solo numeri positivi; **Area ingombro** si ricalcola davvero in automatico da Larghezza × Altezza (in sola lettura, non editabile) ad ogni variazione. **Alt. da terra**, **Tipologia altezza** (Basso/Alto/Altissimo) e **Copertura** (Riparato/Aperto) completano l\'esposizione del sito.',
        selector: CT_CARD_FISICHE,
        placement: 'right',
        onEnter: function () { ghfEnsureCaratteristicheSection(function () { if (window.__ghfCaratteristiche) window.__ghfCaratteristiche.fillMisure(); ghfNudge(); }); },
        delay: 900,
        dev: [{ label: 'Area ingombro', value: 'useMemo(() => larghezza × altezza / 10000, [largImp, altImp])\n==Non dipende da Profondità==: corretto, l\'area espositiva è la faccia frontale, non il volume.' }],
      },
      {
        title: 'Facce: nessun limite legato alla tipologia',
        description: 'Le facce non dipendono più dalla tipologia selezionata: il contatore in alto mostra solo il numero di facce create, senza un massimo, e "Aggiungi Faccia" resta sempre attivo — se ne possono creare quante servono. Cambiando canale, tipologia o formato dopo aver già creato delle facce, un avviso informa che verranno tutte rimosse e andranno ricreate. Stesso pattern "aggiungi un elemento alla volta" di Cespiti/Dispositivi/Squadre — qui la faccia aggiunta compare come **card**, non accordion (i campi sono sempre gli stessi).',
        selector: CT_CARD_FACCE,
        placement: 'top',
        onEnter: function () { ghfEnsureCaratteristicheSection(); },
        delay: 1000,
      },
      {
        title: 'Drawer faccia: tipo, visibilità, slot',
        description: '**Tipo faccia** (Anteriore, Posteriore, Sinistra o Destra) non è obbligatorio ma va comunque scelto: "Aggiungi"/"Salva" resta spento finché non viene selezionato. **Visibile nel senso di marcia** è un toggle, di default su "No" — qui attivato per mostrare lo stato "Sì". **Numero slot** è numerico libero.',
        selector: FD_ROW_TIPO,
        placement: 'left',
        onEnter: function () { ghfFillFacciaCompleta(); },
        delay: 1300,
        dev: [{ label: 'Componente', value: 'Drawer (AntD) impilato sopra il form principale — stesso pattern di Cespite/Dispositivo e Squadra' }],
      },
      {
        title: 'Coordinate: ereditate dall\'impianto, sbloccabili',
        description: 'Le coordinate della faccia sono **precompilate e in sola lettura**, ereditate da quelle dell\'impianto (qui valorizzate con l\'indirizzo di esempio compilato in Anagrafica) — il lucchetto le sblocca per sovrascriverle manualmente. Ribloccando, tornano quelle dell\'impianto.',
        selector: FD_ROW_COORD,
        placement: 'left',
        onEnter: function () { ghfFillFacciaCompleta(); },
        delay: 1300,
      },
      {
        title: 'Orientamento, cono di visibilità, formato',
        description: '**Orientamento** è uno slider 0–360° con tacche ogni 90°. **Cono di visibilità** è un raggio numerico in metri, con prefisso "r" — unica misura della faccia in metri anziché in cm, coerente con la scala reale del dato. **Formato** è larghezza × altezza in cm, indipendente dalle misure dell\'impianto in "Caratteristiche fisiche".',
        selector: FD_ROW_ORIENT,
        placement: 'left',
        onEnter: function () { ghfFillFacciaCompleta(); },
        delay: 1300,
      },
      {
        title: 'Illuminazione: Illuminato → mezzo → dettagli',
        description: 'Tre stati: **Spento**, **Illuminato**, **Luminoso**. Scegliendo Illuminato o Luminoso compare **Mezzo di illuminazione**, con opzioni diverse per stato (Illuminato: Faretti/LED/Neon — Luminoso: LED/Neon/Diodi). Scegliendo **Faretti** compaiono anche **Numero faretti** e **Watt per faretto** — qui tutta la catena compilata per mostrarli insieme.',
        selector: FD_ROW_STATO_ILLUM,
        placement: 'left',
        onEnter: function () { ghfFillFacciaCompleta(); },
        delay: 1300,
        dev: [{ label: 'Mezzo per stato', value: "ILLUM_MEZZO_BY_STATO = { Illuminato: ['Faretti','LED','Neon'], Luminoso: ['LED','Neon','Diodi'] }" }],
      },
      {
        title: 'Commerciale: sempre modificabile',
        description: '**Modello di vendita** (Standard/Long term) e **Prezzo faccia** restano **sempre compilabili**, anche per una faccia posteriore collegata (dove invece posizione, dimensioni, slot e orientamento sono guidati dall\'anteriore e disabilitati) — a differenza di tutti gli altri campi di questo drawer.',
        selector: FD_ROW_COMMERCIALE,
        placement: 'left',
        onEnter: function () { ghfFillFacciaCompleta(); },
        delay: 1300,
      },
      {
        title: 'Faccia salvata: card riepilogativa',
        description: '"Aggiungi" salva davvero la faccia e richiude il drawer: compare come card **{Tipo}-{progressivo}** (qui "Anteriore-1"), con badge di visibilità e i campi Orientamento, Cono di visibilità, Formato, Illuminazione, Modello e Prezzo. Il menu (⋮) apre **Modifica**, **Crea posteriore** (solo sull\'Anteriore, se non ne ha già una collegata) ed **Elimina**.',
        selector: CT_FACE_CARD_FIRST,
        placement: 'top',
        onEnter: function () { ghfEnsureFaceSaved(); },
        delay: 1300,
        dev: [
          { label: 'Nota', value: '==Il criterio di accettazione elenca anche "Duplica" tra le azioni del menu== — nel prototipo non esiste: solo Modifica/Crea posteriore/Elimina. Vedi icona nota.' },
          { label: 'Bug', value: "==La card mostra ancora \"cm\" per il Cono di visibilità== (FormFaceCard: 'r ' + face.cono + ' cm', hardcoded) mentre il campo nel drawer ora è in metri — l'etichetta della card non è stata aggiornata insieme all'unità del campo." },
        ],
      },
      {
        title: 'Cambiare tipologia con facce esistenti: avviso',
        description: 'Con almeno una faccia già creata, cambiare **Canale**, **Tipologia** o **Formato** mostra questo avviso: tutte le facce configurate verranno rimosse e andranno ricreate, perché non esiste più una correlazione fissa tipo↔slot. "Cambia e rimuovi le facce" conferma ed elimina davvero; "Annulla" lascia tutto invariato.',
        selector: '.ant-modal-confirm',
        placement: 'bottom',
        onEnter: function () { ghfEnsureTipologiaGuardModal(); },
        delay: 1600,
        dev: [{ label: 'Componente', value: "antd.Modal.confirm — unica Modal (non Popconfirm) di questo flusso: il trigger è una Select, senza un pulsante singolo da ancorare (LAYOUT.md §6.6)." }],
      },
    ],
  },
  {
    id: 'cespiti-dispositivi',
    title: 'GRP-628 — US#1.3 — Cespiti e dispositivi',
    description: 'Come **Inventory Manager**, voglio registrare i componenti strutturali e i dispositivi connessi dell\'impianto così da sapere cosa è stato montato e cosa è collegato, indipendentemente dal canale.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Cespiti e dispositivi"',
        description: 'Quarta sezione del form di creazione: componenti strutturali montati e dispositivi connessi — disponibile allo stesso modo per impianti **OOH e DOOH**, senza alcuna dipendenza dal canale scelto in Anagrafica.',
        selector: '[data-section="struttura"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('struttura'); },
        delay: 700,
      },
      {
        title: 'Cespiti: empty state',
        description: 'Nessun cespite pre-creato: "Aggiungi cespite" apre il sotto-drawer dedicato — stesso pattern "aggiungi un elemento alla volta" già visto per Squadre e Facce.',
        selector: ST_CARD_CESPITI,
        placement: 'right',
        onEnter: function () { ghfEnsureStrutturaSection(); },
        delay: 700,
      },
      {
        title: 'Drawer cespite: Tipo e campi dinamici (Fondazione)',
        description: 'La select **Tipo cespite** determina i campi mostrati sotto — qui **Fondazione**: Tipo fondazione, Dimensione fondazione, Data inizio lavori, Data fine lavori, tutti compilati per mostrare il risultato.',
        selector: '.grav-cespite-drawer .ant-select',
        placement: 'left',
        onEnter: function () { ghfFillAsset('#grav-tour-add-cespite-btn', 'fillFondazioneExample'); },
        delay: 1300,
        dev: [{ label: 'Sorgente campi', value: "ASSET_TYPES.find(t => t.value === 'Fondazione').fields" }],
      },
      {
        title: 'Data fine lavori: manca la validazione dell\'ordine',
        description: 'Qui **Data inizio lavori** è stata spostata DOPO **Data fine lavori** (20/09 → 01/09): il campo lo accetta senza segnalare nulla. ==Il criterio di accettazione richiede che "Data fine lavori" non possa precedere "Data inizio lavori"==: da aggiungere.',
        selector: '.grav-cespite-drawer .ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfFillAsset('#grav-tour-add-cespite-btn', 'fillFondazioneExample', function () { if (window.__ghfCespite) window.__ghfCespite.breakFondazioneDates(); ghfNudge(); }); },
        delay: 1300,
        dev: [{ label: 'Nota', value: '==Nessun controllo `dataFine.isBefore(dataInizio)` in saveAsset()== — vedi icona nota.' }],
      },
      {
        title: 'Un tipo con più campi (Pali)',
        description: 'Cambiando tipo, i campi si sostituiscono del tutto: **Pali** ne ha 8 (Tipo pali, Numero pali, Diametro, Altezza, Interasse, N. punzonatura pali, Ditta collocazione pali, Data montaggio) — qui tutti compilati. Gli altri tipi (Cornice, Pannelli, Extra struttura) seguono lo stesso principio, con il proprio set di campi coerente (vedi tabella "Campi per tipo di Cespite" nel pannello Modello).',
        selector: '.grav-cespite-drawer .ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfFillAsset('#grav-tour-add-cespite-btn', 'fillPaliExample'); },
        delay: 1300,
      },
      {
        title: 'Più cespiti, anche dello stesso tipo',
        description: 'Ogni "Aggiungi" salva davvero un cespite e richiude il drawer: qui **due Fondazioni** aggiunte per mostrare che nulla impedisce di ripetere lo stesso tipo. Il menu (⋮) di ogni pannello apre **Visualizza** (il drawer si riapre già compilato ed editabile — Visualizza ed Edit coincidono) ed **Elimina**.',
        selector: ST_CARD_CESPITI,
        placement: 'right',
        onEnter: function () {
          ghfFillAsset('#grav-tour-add-cespite-btn', 'fillFondazioneExample', function () {
            ghfSaveAssetNow(function () {
              ghfFillAsset('#grav-tour-add-cespite-btn', 'fillFondazioneExample', function () {
                ghfSaveAssetNow();
              });
            });
          });
        },
        delay: 3200,
        dev: [{ label: 'Componente', value: 'AssetAccordion — Collapse (AntD) accordion:true, un pannello per elemento' }],
      },
      {
        title: 'Dispositivi: empty state, stesso pattern',
        description: '"Aggiungi dispositivo" apre lo **stesso sotto-drawer** dei cespiti (non uno diverso): cambia solo l\'elenco dei tipi proposti dalla select Tipo. Disponibile senza distinzione tra impianti OOH e DOOH.',
        selector: ST_CARD_DISPOSITIVI,
        placement: 'right',
        onEnter: function () { ghfEnsureStrutturaSection(); },
        delay: 700,
      },
      {
        title: 'Drawer dispositivo: campi per tipo (Player multimediale)',
        description: 'Ogni tipo di dispositivo ha 3 campi comuni (Nome, Stato, Descrizione) più campi specifici — qui **Player multimediale**: MAC address e Numero di serie sono a **chip multi-valore** (se ne può inserire più di uno), oltre a Indirizzo IP e Versione software.',
        selector: '.grav-cespite-drawer .ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfFillAsset('#grav-tour-add-dispositivo-btn', 'fillPlayerExample'); },
        delay: 1300,
        dev: [{ label: 'Componente', value: "Select mode='tags' per MAC/seriali/ID — kind: 'tags' in DEVICE_FIELDS_BY_TYPE" }],
      },
      {
        title: 'Più dispositivi, ciascuno modificabile ed eliminabile',
        description: 'Stesso principio dei cespiti: si ripete "Aggiungi dispositivo" per ognuno, ognuno diventa un pannello con il proprio menu Visualizza/Elimina. Gli altri tipi (Modem/Router, Sensore, Telecamera, Schermo/Display, Centralina, Altro) hanno da 0 a 6 campi specifici oltre ai 3 comuni (vedi tabella "Campi per tipo di Dispositivo" nel pannello Modello).',
        selector: ST_CARD_DISPOSITIVI,
        placement: 'right',
        onEnter: function () {
          ghfFillAsset('#grav-tour-add-dispositivo-btn', 'fillPlayerExample', function () { ghfSaveAssetNow(); });
        },
        delay: 1800,
      },
    ],
  },
  {
    id: 'squadre',
    title: 'GRP-630 — US#1.4 — Squadre',
    description: 'Come **Inventory Manager**, voglio assegnare le squadre di default per affissione e manutenzione, con i relativi costi, così da valorizzare automaticamente gli ordini di lavoro su questo impianto.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Squadre"',
        description: 'Quinta sezione del form di creazione: squadre di affissione (con i relativi costi) e di manutenzione assegnate di default all\'impianto.',
        selector: '[data-section="affissione"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('affissione'); },
        delay: 700,
      },
      {
        title: 'Affissione: empty state',
        description: '"Nessuna squadra di affissione assegnata" — "Aggiungi squadra" apre il sotto-drawer dedicato, stesso pattern "aggiungi un elemento alla volta" di Cespiti/Dispositivi/Facce.',
        selector: SQ_CARD_AFFISSIONE,
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('affissione'); },
        delay: 700,
      },
      {
        title: 'Drawer affissione: squadra, tipo, costi',
        description: '**Squadra** si sceglie dall\'anagrafica (ricercabile); scelta la squadra si abilitano **Tipo affissione** (multi-select) e i due costi. **Costo affissione** e **Costo preincollaggio** accettano solo valori numerici non negativi, con due decimali — qui tutti compilati per mostrare il risultato.',
        selector: '.grav-squadra-drawer .ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfFillSquadra('#grav-tour-add-squadra-btn', 'fillAffissioneExample'); },
        delay: 1300,
        dev: [{ label: 'Componente', value: "SquadraDrawer — condiviso tra Affissione e Manutenzione (kind: 'affissione' | 'manutenzione')" }],
      },
      {
        title: 'Più squadre di affissione',
        description: 'Ogni "Aggiungi" salva davvero la squadra e richiude il drawer: qui **due squadre** assegnate per mostrare che se ne possono aggiungere più di una. Il menu (⋮) di ogni card offre però solo **Rimuovi**.',
        selector: SQ_CARD_AFFISSIONE,
        placement: 'right',
        onEnter: function () {
          ghfFillSquadra('#grav-tour-add-squadra-btn', 'fillAffissioneExample', function () {
            ghfSaveSquadraNow(function () {
              ghfFillSquadra('#grav-tour-add-squadra-btn', 'fillAffissioneExample', function () {
                ghfSaveSquadraNow();
              });
            });
          });
        },
        delay: 3000,
        dev: [
          { label: 'Nota', value: '==Il criterio di accettazione chiede che ogni squadra di affissione sia "modificabile ed eliminabile"== — nel prototipo il menu ha solo "Rimuovi", nessuna azione di modifica. Vedi icona nota.' },
        ],
      },
      {
        title: 'Manutenzione: empty state',
        description: '"Nessuna squadra di manutenzione assegnata" — stesso pattern, sotto-drawer condiviso con Affissione (cambia solo il set di campi in base al tipo).',
        selector: SQ_CARD_MANUTENZIONE,
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('affissione'); },
        delay: 700,
      },
      {
        title: 'Drawer manutenzione: squadra, tipo intervento, oggetto',
        description: 'Anche qui **Squadra** si sceglie dall\'anagrafica; il drawer mostra poi **Tipo intervento** (Ordinaria/Straordinaria/Urgente/Preventiva) e **Oggetto** (testo libero) — campi propri della manutenzione, diversi da quelli dell\'affissione pur condividendo lo stesso drawer.',
        selector: '.grav-squadra-drawer .ant-drawer-body',
        placement: 'left',
        onEnter: function () { ghfFillSquadra('#grav-tour-add-man-btn', 'fillManutenzioneExample'); },
        delay: 1300,
      },
      {
        title: 'Più squadre di manutenzione',
        description: 'Come per l\'affissione, si ripete "Aggiungi squadra" per ognuna — qui **due squadre** di manutenzione assegnate. Il menu (⋮) offre solo **Rimuovi**: coerente con il criterio di accettazione, che per la manutenzione richiede solo "eliminabile" (non "modificabile").',
        selector: SQ_CARD_MANUTENZIONE,
        placement: 'right',
        onEnter: function () {
          ghfFillSquadra('#grav-tour-add-man-btn', 'fillManutenzioneExample', function () {
            ghfSaveSquadraNow(function () {
              ghfFillSquadra('#grav-tour-add-man-btn', 'fillManutenzioneExample', function () {
                ghfSaveSquadraNow();
              });
            });
          });
        },
        delay: 3000,
      },
    ],
  },
  {
    id: 'commerciale',
    title: 'GRP-631 — US#1.5 — Commerciale',
    description: 'Come **Inventory Manager**, voglio definire anche l\'identità di vendita, il listino e gli eventuali moduli dell\'impianto così da fornire i dati corretti al sales e all\'operation manager per venderlo ai clienti.',
    roles: ['Inventory Manager', 'Tenant Admin'],
    startScreen: 'lista',
    steps: [
      {
        title: 'Punto di ingresso: sezione "Commerciale"',
        description: 'Ultima sezione del form di creazione: identità di vendita, galleria fotografica, listino con calcolo IVA e moduli collegati.',
        selector: '[data-section="commerciale"]',
        placement: 'right',
        onEnter: function () { ghfEnsureOpenAtSection('commerciale'); },
        delay: 700,
      },
      {
        title: 'Identità commerciale',
        description: '**Alias impianto** è testo libero; **Circuiti** un multi-select sull\'anagrafica; **Qualità impianto** un rating a 5 stelle — senza valutazione mostra "Non valutata" invece di "0/5".',
        selector: COM_CARD_IDENTITA,
        placement: 'right',
        onEnter: function () { ghfEnsureCommercialeReady(function () { if (window.__ghfCommerciale) window.__ghfCommerciale.fillIdentitaExample(); ghfNudge(); }); },
        delay: 1000,
      },
      {
        title: 'Galleria: foto e copertina',
        description: 'Passando il mouse su una foto compare la ★ per impostarla come copertina — qui **due foto aggiunte** e la seconda impostata come copertina (badge "Copertina" + stella piena). Una sola copertina alla volta: sceglierne una nuova sostituisce sempre la precedente.',
        selector: COM_CARD_IDENTITA,
        placement: 'right',
        onEnter: function () {
          ghfEnsureCommercialeReady(function () {
            var api = window.__ghfCommerciale;
            if (api) { api.addFakePhotos(); setTimeout(function () { api.setCoverExample(); ghfNudge(); }, 200); }
          });
        },
        delay: 1300,
      },
      {
        title: 'Eliminare la copertina: manca il subentro automatico',
        description: 'Eliminando la foto impostata come copertina (qui la seconda, che lo era), ==nessuna foto rimane segnata come copertina==: il criterio di accettazione richiede che la prima foto rimanente subentri automaticamente, ma il prototipo non aggiorna la copertina quando quella attuale viene rimossa.',
        selector: COM_CARD_IDENTITA,
        placement: 'right',
        onEnter: function () {
          ghfEnsureCommercialeReady(function () {
            var api = window.__ghfCommerciale;
            if (api) { api.addFakePhotos(); setTimeout(function () { api.setCoverExample(); setTimeout(function () { api.removeCoverPhoto(); ghfNudge(); }, 200); }, 200); }
          });
        },
        delay: 1700,
        dev: [{ label: 'Nota', value: '==coverPhoto non si resetta quando il file a cui punta viene rimosso da fileList== — vedi icona nota.' }],
      },
      {
        title: 'Modello commerciale: listino con IVA in tempo reale',
        description: '**Modello di vendita**, **Prezzo lordo (IVA inclusa)** e **Aliquota IVA** (default 22%) alimentano un riquadro che calcola davvero **Imponibile**, **IVA** e **Totale** — formattati in euro con separatori italiani (punto delle migliaia, virgola dei decimali), aggiornati ad ogni modifica.',
        selector: COM_CARD_MODELLO,
        placement: 'right',
        onEnter: function () { ghfEnsureCommercialeReady(function () { if (window.__ghfCommerciale) window.__ghfCommerciale.fillModelloExample(); ghfNudge(); }); },
        delay: 1000,
      },
      {
        title: 'Sconto a moduli: percentuale disabilitata finché non si spunta',
        description: 'Il campo percentuale (0–100) resta disabilitato finché la casella "Se venduto a moduli, applica uno sconto del…" non è spuntata — qui attivata e valorizzata al 10% per mostrare il campo sbloccato.',
        selector: COM_CARD_MODELLO,
        placement: 'right',
        onEnter: function () {
          ghfEnsureCommercialeReady(function () {
            var api = window.__ghfCommerciale;
            if (api) { api.fillModelloExample(); api.toggleSconto(); setTimeout(function () { api.setScontoPctExample(); ghfNudge(); }, 200); }
          });
        },
        delay: 1300,
        dev: [{ label: 'Nota', value: '**Il modello di vendita a livello di impianto non limita quello della singola faccia**: il Radio.Group Standard/Long term nel drawer Faccia (sezione Dati tecnici) è sempre pieno indipendentemente da questo valore — corretto, nessun accoppiamento nel codice.' }],
      },
      {
        title: 'Moduli: empty state, filtrato per tipologia e formato',
        description: '"Nessun impianto collegato." — "Collega impianto" apre il selettore, che propone ==solo impianti già esistenti con lo stesso Canale, Tipologia e Formato== di questo (il vincolo non è mostrato esplicitamente all\'utente, filtra soltanto la lista).',
        selector: COM_CARD_MODULI,
        placement: 'top',
        onEnter: function () { ghfEnsureCommercialeReady(); },
        delay: 1000,
      },
      {
        title: 'Drawer "Collega impianto": nessun candidato compatibile',
        description: 'Il drawer ha ricerca testuale (ID, tipo, indirizzo). ==Con Tipologia e Formato scelti dalla cascata (es. "6×3 m") non compare mai alcun candidato==, anche se impianti dello stesso tipo esistono davvero: il catalogo formati della cascata usa una scala diversa da quella degli impianti già censiti (es. "200×140cm"). Inoltre, il criterio di accettazione chiede anche la distanza dall\'impianto corrente, assente in ogni riga del selettore.',
        selector: '.ant-drawer-body',
        placement: 'left',
        onEnter: function () {
          ghfEnsureCommercialeReady(function () {
            ghfCall(['__ghfCommerciale', 'openLink']);
            ghfWaitFor('.ant-drawer-body', function () { ghfNudge(); }, 900);
          });
        },
        delay: 1300,
        dev: [{ label: 'Nota', value: '==Formato cascata (FORMATI_PER_TIPO, es. "6×3 m") disallineato dal formato degli impianti mock (TIPO_FORMATI, es. "200×140cm")== — il filtro "stessa tipologia e formato" non troverà mai corrispondenze per un impianto appena creato. Vedi icona nota.' }],
      },
      {
        title: 'Impianto collegato: elencato e scollegabile',
        description: 'Quando un collegamento va a buon fine, l\'impianto compare come card (foto, indirizzo, formato) con "Scollega" nel menu (⋮) — qui collegato direttamente un impianto reale del catalogo, aggirando il disallineamento appena mostrato, per far vedere il risultato atteso. ==Il collegamento bidirezionale== (visibile anche dall\'impianto collegato) è un comportamento di dati/backend: non verificabile in un prototipo frontend-only senza persistenza reale — da validare in sviluppo.',
        selector: COM_CARD_MODULI,
        placement: 'top',
        onEnter: function () { ghfEnsureCommercialeReady(function () { if (window.__ghfCommerciale) window.__ghfCommerciale.forceLinkExample(); ghfNudge(); }); },
        delay: 1000,
      },
      {
        title: 'Moduli disponibile già in creazione: fuori scope per lo sviluppo reale',
        description: 'Come appena mostrato, il prototipo permette di collegare moduli **già durante la creazione**, prima ancora di salvare l\'impianto. ==Per lo sviluppo reale questo comportamento resta fuori scope==: la funzione va limitata alla modifica di un impianto già salvato, finché non si chiude la questione tecnica su come scrivere la relazione verso un impianto non ancora esistente. Il prototipo lo mostra solo come riferimento del comportamento target futuro.',
        selector: COM_CARD_MODULI,
        placement: 'top',
        onEnter: function () { ghfEnsureCommercialeReady(); },
        delay: 1000,
        dev: [{ label: 'Priorità', value: 'TASK DSN — Correzione prototipo · P0: segnalare esplicitamente in handoff, non implementare "Moduli in creazione" finché il capitolo 4 non è chiuso.' }],
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
  { selector: CT_CARD_FISICHE, name: 'Card "Caratteristiche fisiche"', level: 'Organismo', custom: true,
    funzione: 'Misure fisiche dell\'impianto (Larghezza/Altezza/Profondità), Area ingombro calcolata in automatico, esposizione del sito (Alt. da terra, Tipologia altezza, Copertura).',
    composizione: 'g4() due righe di campi (InputNumber/Select) — Area ingombro: InputNumber readOnly + variant borderless',
    figma: 'Da definire — pattern custom' },
  { selector: CT_CARD_FACCE, name: 'Card "Facce"', level: 'Organismo', custom: true,
    funzione: 'Elenca le facce configurate (FormFaceCard) col contatore del numero di facce create (nessun massimo); il pulsante "Aggiungi Faccia" resta sempre attivo.',
    composizione: 'Grid di FormFaceCard (EntityCard) + Button "Aggiungi Faccia"',
    figma: 'Da definire — pattern custom' },
  { selector: '.grav-face-drawer', name: 'Sotto-drawer Faccia', level: 'Organismo', custom: true,
    funzione: 'Drawer impilato sopra il form principale per la configurazione di **una singola** faccia — stesso pattern add-one-at-a-time di Cespite/Dispositivo e Squadra.',
    composizione: 'Drawer (AntD) + Radio.Group tipo + Switch + Slider orientamento + campi condizionati dall\'illuminazione + azioni Annulla/Aggiungi',
    figma: 'Drawer — Placement=Right · Size=Large (720px)' },
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
// Scenari (tab "Scenari" nel pannello Modello): window.HANDOFF_SCENARIOS
// omessa deliberatamente — per questo sprint non ci sono scenari utili da
// raccontare (il tab mostra "Nessun elemento"). Non un'omissione accidentale:
// se in una sprint futura emergono scenari da documentare, reintrodurla qui.
// ════════════════════════════════════════════════════════════════════════════

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
  // ── US#1.2 — Dati tecnici e facce: note di design/criteri aperti ────────
  {
    id: 'caratteristiche-facce-limite-rimosso',
    title: 'Facce: rimosso il limite legato alla tipologia',
    body: 'Il criterio di accettazione chiede di "configurare le facce entro il numero consentito dalla tipologia" — un massimo per tipologia (es. un Poster ha solo Anteriore, una Pensilina Anteriore+Posteriore).\n==Nel prototipo oggi== questo limite è stato **rimosso deliberatamente** (richiesta successiva, non un difetto): si possono creare tutte le facce che servono, senza tetto legato alla tipologia. La tabella `FACCE_PER_TIPO`/`maxFacce` non esiste più.\n**Effetto collaterale positivo**: dato che canale/tipologia/formato non correlano più 1:1 con le facce, ora un avviso (`Modal.confirm`) informa l\'utente che cambiarli rimuove tutte le facce già create — vedi step dedicato del tour.\n**Verificare con il PM** che il criterio originale (limite per tipologia) sia da considerarsi superato, e aggiornare la user story se confermato.',
  },
  {
    id: 'caratteristiche-facce-duplica-mancante',
    title: 'Card faccia: manca "Duplica" nel menu azioni',
    body: 'Il criterio di accettazione elenca "Modifica/Duplica/Elimina" come azioni della card riepilogativa.\n==Nel prototipo oggi== il menu ha **Modifica**, **Crea posteriore** (solo sulla faccia Anteriore, se non ne ha già una collegata) ed **Elimina** — non esiste un\'azione "Duplica" per copiare una faccia esistente con gli stessi valori.\n"Crea posteriore" copre un caso specifico (faccia speculare collegata), non una duplicazione libera: da chiarire con il PM se serve un\'azione "Duplica" generica in aggiunta, o se "Crea posteriore" soddisfa già il bisogno reale dietro il criterio.',
  },
  // ── US#1.3 — Cespiti e dispositivi: note di design/criteri aperti ───────
  {
    id: 'struttura-fondazione-date-validazione',
    title: 'Fondazione: manca la validazione tra le date',
    body: 'Il criterio di accettazione richiede che "Data fine lavori" non possa precedere "Data inizio lavori".\n==Nel prototipo oggi== `saveAsset()` non confronta le due date in alcun modo: si può salvare un cespite Fondazione con la data di fine lavori antecedente a quella di inizio, senza alcun avviso.',
  },
  // ── US#1.4 — Squadre: note di design/criteri aperti ─────────────────────
  {
    id: 'squadre-affissione-modifica-mancante',
    title: 'Squadra di affissione: manca "Modifica" nel menu',
    body: 'Il criterio di accettazione richiede che ogni squadra di affissione sia "modificabile ed eliminabile".\n==Nel prototipo oggi== il menu (⋮) della card offre solo **Rimuovi**: non c\'è modo di modificare Tipo affissione o i costi di una squadra già assegnata senza prima eliminarla e riassegnarla da zero.\n==Nota==: per la Manutenzione il criterio chiede solo "eliminabile" — lì il prototipo è già coerente (stesso menu, solo Rimuovi).',
  },
  // ── US#1.5 — Commerciale: note di design/criteri aperti ─────────────────
  {
    id: 'commerciale-galleria-copertina-auto',
    title: 'Galleria: la copertina non subentra automaticamente',
    body: 'Il criterio di accettazione richiede che, eliminando la foto di copertina, la prima foto rimanente diventi copertina in automatico.\n==Nel prototipo oggi== lo stato `coverPhoto` non viene mai reimpostato quando il file a cui punta viene rimosso da `fileList`: dopo l\'eliminazione nessuna foto risulta più segnata come copertina, finché l\'utente non ne sceglie una manualmente.',
  },
  {
    id: 'commerciale-moduli-distanza-mancante',
    title: 'Collega impianto: manca la distanza',
    body: 'Il criterio di accettazione chiede che il selettore moduli mostri, oltre alla ricerca testuale, anche la distanza dall\'impianto corrente.\n==Nel prototipo oggi== ogni riga mostra solo ID, tipo, indirizzo e formato — nessun calcolo o visualizzazione della distanza tra i due impianti.',
  },
  {
    id: 'commerciale-moduli-formato-disallineato',
    title: 'Moduli: il formato della cascata non combacia mai con gli impianti esistenti',
    body: '==Priorità alta, root cause a monte (Anagrafica, US#1), impatto diretto su Moduli (US#1.5)==.\nIl form di creazione compila il Formato da `FORMATI_PER_TIPO` (es. "6×3 m", "4×3 m"…) mentre tutti gli impianti già censiti hanno un Formato nella scala di `TIPO_FORMATI` (es. "200×140cm", "300×200cm"…) — due cataloghi diversi per la stessa tipologia, con stringhe che non si intersecano mai.\nConseguenza pratica: il criterio "stessa tipologia e formato" del selettore "Collega impianto" **non troverà mai un candidato compatibile** per nessun impianto creato da questo form, anche quando esistono davvero impianti dello stesso tipo/dimensione — la funzione Moduli risulta di fatto inutilizzabile su impianti nuovi finché i due cataloghi non vengono unificati.',
  },
  {
    id: 'commerciale-moduli-fuori-scope-creazione',
    title: 'TASK DSN P0 — "Moduli in creazione": non implementare',
    body: '==Fuori scope per lo sviluppo reale==: il prototipo mostra il collegamento Moduli già disponibile durante la creazione dell\'impianto, prima ancora che sia salvato.\nLo sviluppo reale **si limita al blocco in modifica** (impianto già salvato), finché non è chiusa la questione tecnica su come scrivere la relazione verso un impianto non ancora esistente (vedi capitolo 4).\nIl comportamento resta visibile nel prototipo **solo come riferimento del comportamento target** futuro — non è materiale da implementare in questo sprint.',
  },
];
