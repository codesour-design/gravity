---
description: Crea l'handoff HTML interattivo di un prototipo Gravity (come il prototipo Planning) — barra dev in navbar (Inspector componenti + dropdown Sprint Jira con tour di user story/task + Modello di dominio), toggle "Interfaccia semplificata" per gli elementi fuori sprint, e note di design inline. Genera index--handoff.html + handoff-steps.js riusando il motore condiviso handoff.js, poi verifica nel browser.
---

# Handoff Gravity (HTML) — Costruisci l'handoff interattivo

> Questa skill produce l'handoff **HTML interattivo** di un prototipo, nello stile del prototipo **Planning**.
> Per trasporre il flusso **su Figma** usa invece **/handoff-figma**.

Il risultato è una variante del prototipo (`index--handoff.html`) che, sopra l'app reale, aggiunge:

- una **barra dev nella navbar** (accanto alla campanella) con:
  - **switch Inspector componenti** → in hover su ogni elemento mostra nome, livello atomico (Atomo/Molecola/Organismo), funzione, mapping Figma, variante, tipografia e colori token;
  - **dropdown "Sprint Jira"** → tour guidati passo-passo con spotlight, uno per ogni user story o task (le task hanno un badge "Task" per distinguerle); include il toggle **"Interfaccia semplificata"** che evidenzia con outline tratteggiato rosso + badge "fuori sprint" gli elementi presenti nel prototipo ma senza una voce in sprint (`HANDOFF_OUT_OF_SPRINT`);
  - **dropdown "Modello"** → tab Scenari / Dipendenze / Relazioni del dominio (Relazioni in ultima posizione);
- **note di design inline** (icona caffè rossa `CoffeeOutlined`) ancorate ai punti UI di riferimento.

Tutta la logica vive già nel motore condiviso **`prototype/_shared/handoff.js`** — **NON va riscritto né duplicato**. La skill si limita a:
1. creare `index--handoff.html` (variante del prototipo) che carica il motore;
2. scrivere la config `handoff-steps.js` (tour, componenti, note, modello);
3. piazzare le note inline;
4. verificare nel browser.

**Riferimento canonico** (leggilo sempre prima di iniziare, è la fonte di verità del formato):
- `prototype/_shared/handoff.js` — il motore (schema degli oggetti globali, commentato in testa)
- `prototype/planning/handoff-steps.js` — config completa di esempio
- `prototype/planning/index--handoff.html` — wiring HTML + `HandoffDesignNote`

Segui le fasi nell'ordine. Non saltare passi.

---

## FASE 0 — Prerequisiti

Verifica prima di iniziare:

- Esiste un **prototipo HTML finito** in `prototype/<nome>/index.html` (o sottocartella), già funzionante nel browser.
- Il prototipo usa la **navbar condivisa** `navbar.js`: il motore handoff si aggancia all'elemento `#gravity-bell-btn` (la campanella) per inserire la barra dev. Se la navbar non c'è, la barra dev non comparirà — segnalalo.
- Il ruolo corrente è in `localStorage['gravity_proto_role']` (default `Tenant Admin`) — usato per filtrare i tour per ruolo.
- Lavora **sul branch del prototipo**, mai su `main` (vedi CLAUDE.md).

---

## FASE 1 — Raccolta informazioni

Chiedi all'utente in un'unica risposta strutturata:

**1 — Prototipo**
Quale prototipo? Percorso del file (es. `prototype/inventory/index.html`).

**2 — User story e task da documentare**
Per ogni voce (saranno i tour del dropdown "Sprint Jira"):
- Codice + titolo (es. `US#2 — Dettaglio Pianificazione (GRP-467)`); se è una **task** più granulare invece di una user story, dillo esplicitamente (badge "Task" nel pannello)
- Descrizione narrativa ("Come **ruolo** voglio… così da…")
- Ruoli che la vedono (vedi tabella sotto)
- Schermata di partenza (una delle `HANDOFF_SCREENS`)
- Se è una **novità** dell'ultimo sprint (badge "Novità")

**3 — Lingua** dei testi del canvas (di norma italiano).

**4 — Note di design** (opzionale): appunti per lo sviluppo (fuori scope, scelte aperte, sprint futuri, vincoli) e a quale elemento UI vanno ancorati.

**5 — Modello di dominio** (opzionale): relazioni tra entità, scenari stato×collegamenti, tabelle di dipendenza (es. stato × azioni abilitate).

**6 — Elementi fuori sprint** (opzionale): il prototipo spesso mostra funzionalità costruite per completezza della demo ma **senza una user story/task in questo sprint** (es. voci di menu non ancora sviluppate, pulsanti di feature future, sezioni dimostrative). Per ognuna: selettore CSS dell'elemento (anche testo per distinguere voci nello stesso menu) e una nota breve sul perché è fuori sprint. Chiedi esplicitamente all'utente quali elementi del prototipo rientrano in questo caso — **non dedurlo da solo**: è una decisione di scope che spetta al designer/PM, non deducibile dal solo codice.

**Ruoli supportati → colore Tag** (in `handoff.js`, `ROLE_COLOR`):

| Ruolo | Colore Tag AntD |
|-------|-----------------|
| Tenant Admin | `purple` |
| Operations Manager | `geekblue` |
| Planner | `green` |
| Sales | `volcano` |
| Inventory Manager | `cyan` |

Aspetta le risposte prima di procedere.

---

## FASE 2 — Esplora il prototipo e mappa il flusso

1. Leggi `index.html` del prototipo con `Read` per capire struttura, componenti e **selettori CSS stabili** (classi `.gv-*`, `.ss-*`, `.ant-*`, id). I tour e l'inspector si ancorano a questi selettori.
2. Naviga il prototipo nel browser (Playwright: `browser_navigate` + `browser_snapshot`) percorrendo ogni US click-by-click, così identifichi:
   - le **schermate** distinte (→ `HANDOFF_SCREENS`) e come rilevarle via DOM (`detect`) e come raggiungerle (`goTo`);
   - per ogni step di tour il **selettore** dell'elemento da evidenziare (o l'indice colonna `colIndex` per le tabelle) e le azioni `onEnter` necessarie ad aprire popover/drawer/modali;
   - i **componenti** presenti (→ `HANDOFF_COMPONENTS`);
   - elementi UI presenti ma **non toccati da nessuna US/task** dell'elenco ricevuto in FASE 1 — segnalali all'utente come possibili candidati per `HANDOFF_OUT_OF_SPRINT` invece di deciderlo da solo (potrebbero semplicemente non essere ancora stati raccontati in un tour, non essere davvero fuori scope).
3. Produci e condividi un breve inventario: schermate + per ogni US/task la lista degli step (titolo + selettore) + eventuali candidati fuori sprint. **Non procedere finché non è chiaro.**

---

## FASE 3 — Crea `index--handoff.html`

Crea la variante handoff **a fianco** dell'`index.html` del prototipo, stessa cartella.

> ⚠️ NON modificare l'`index.html` originale: il file di handoff è una variante `--handoff`. Le note inline e i tour esistono solo qui (in `index.html` `window.HANDOFF_NOTES` è `undefined` → i marker ritornano `null` e spariscono).

1. **Parti da una copia** di `index.html`.
2. **Carica la config PRIMA del mount** dell'app (subito dopo `navbar.js`), così le note inline hanno i dati già al primo render:
   ```html
   <script src="../navbar.js"></script>
   <!-- ...altri script condivisi (filter-drawer.js, ecc.)... -->
   <script src="./handoff-steps.js"></script>
   ```
3. **Carica il motore alla fine del `<body>`** (dopo che React ha montato l'app):
   ```html
   <script src="../handoff.js"></script>
   ```
   Adatta il numero di `../` alla profondità della cartella: per `prototype/<nome>/` è `../_shared/handoff.js`; per una sottocartella più profonda (`prototype/.../<nome>/`) aggiungi i livelli necessari fino a `prototype/_shared/handoff.js`. Stesso criterio per `navbar.js`.
4. **Aggiungi il componente note inline** `HandoffDesignNote` (+ helper `_ghfRenderNoteBody`). Copialo **invariato** da `prototype/planning/index--handoff.html` (icona `CoffeeOutlined` rossa `#FF4A1C`, popover su hover, body con `**grassetto**`, `==evidenziato==`, righe `- ` → lista).
5. **Piazza le note inline** accanto agli elementi UI di riferimento, passando l'`id` della nota:
   ```jsx
   React.createElement('span', null,
     'Pianificatore',
     React.createElement(HandoffDesignNote, { id: 'assegnazione-futura', placement: 'bottom' }))
   ```
   L'`id` deve corrispondere a un elemento di `HANDOFF_NOTES`.

---

## FASE 4 — Scrivi `handoff-steps.js`

Crea `handoff-steps.js` nella stessa cartella. Definisce gli oggetti globali letti dal motore. **Tutti i testi nella lingua scelta.** Usa come modello la config del Planning.

### `window.HANDOFF_META`
```js
window.HANDOFF_META = { title: 'Inventory', version: '1.0', date: 'Giugno 2026', author: 'Gloria Bonanno' };
```

### `window.HANDOFF_SCREENS`
Mappa `chiave → { label, detect(), goTo?() }`. `detect` ritorna `true` se sei su quella schermata (controlla il DOM); `goTo` (opzionale) la apre programmaticamente.
```js
window.HANDOFF_SCREENS = {
  'lista': {
    label: 'Lista pianificazioni',
    detect: function () { return !!document.querySelector('.page-content') && !document.querySelector('.ss-card-map'); },
    goTo:   function () { var b = document.querySelector('.plh-back'); if (b) b.click(); },
  },
  // ...
};
```

### `window.HANDOFF_OUT_OF_SPRINT` — elementi fuori sprint (opzionale)
Alimenta il toggle **"Interfaccia semplificata"** nel dropdown "Sprint Jira": quando attivo, il motore marca questi elementi con outline tratteggiato rosso + badge "fuori sprint" + tooltip. Solo per elementi presenti nel prototipo ma **senza** una voce in `HANDOFF_TOURS` in questo sprint (vedi FASE 1, punto 6) — se lo scope non è chiaro, ometti la variabile invece di indovinare.
```js
window.HANDOFF_OUT_OF_SPRINT = [
  // selector: CSS (anche su elementi portalati, es. voci di dropdown) — text: filtra per testo (opz.) — note: tooltip (opz.)
  { selector: '.ant-dropdown-menu-item', text: 'Modifica', note: 'Fuori sprint — nessuna user story per la modifica' },
  { selector: '.gv-progress-bar', note: 'Fuori sprint — barra di avanzamento budget non in sprint' },
];
```

### `window.HANDOFF_TOURS` — una voce per user story o task
```js
{
  id:          'dettaglio-pianificazione',
  title:       'US#2 — Dettaglio Pianificazione',
  description: '(GRP-467) Come **pianificatore** voglio… così da…',  // **grassetto**, ==giallo==, righe "- "
  roles:       ['Planner', 'Operations Manager'],   // omesso = visibile a tutti i ruoli
  startScreen: 'selezione-spazi',                    // chiave di HANDOFF_SCREENS
  goTo:        ghfOpenMineDraft,                     // opz.: funzione per aprire il caso giusto dalla lista
  novita:      true,                                 // opz.: badge "Novità"
  type:        'task',                                // opz.: assente/'us' = user story (default) · 'task' = attività più granulare (badge "Task")
  steps: [
    {
      title:       'Header del dettaglio',
      description: 'Testo con **grassetto** e ==evidenziato==.',
      selector:    '.gv-detail-header',   // elemento da evidenziare (spotlight)
      // colIndex: 4,                      // in alternativa a selector: evidenzia una colonna tabella
      placement:   'bottom',              // bottom | top | left | right (default bottom)
      onEnter:     function () { var b = document.querySelector('.gv-btn-collega'); if (b) b.click(); }, // opz.: apre popover/drawer prima dello step
      delay:       220,                   // opz.: ms d'attesa dopo onEnter prima di mostrare il balloon
      mask:        false,                 // opz.: disattiva il padding dello spotlight
      dev: [ { label: 'Componente', value: 'Header (DS) — Variant=Detail\nnode 91-35550' } ], // opz.: blocco { } dev (stringa o array {label,value})
      table: { headers: [...], rows: [[...]], note: '...' }, // opz.: matrice (✓ verde · ✗ grigio · ◐ ambra)
    },
    // ...
  ],
}
```
Funzioni di navigazione (`goTo`, `onEnter`) tipiche — aprire una riga, un drawer, una popconfirm — vanno scritte in cima al file (vedi gli helper `ghfOpen*` del Planning). Ordina le US per codice `US#n.m`: il motore le riordina già da solo via il numero nel titolo.

### Step "intelligenti": mostra il risultato, mai il posto sbagliato

Un tour che si limita ad aprire un form vuoto e basta è meno convincente di uno che mostra il **risultato** dell'azione — dati compilati, elemento davvero collegato/selezionato. Applica questo pattern (verificato su `prototype/inventory-systems`, tour "Iter autorizzativo") quando scrivi `onEnter`/`goTo`:

**1 — Setter React esposti per i controlli che non rispondono a click sintetici.** `Select`, `Dropdown` (menu) e `Upload` di Ant Design non reagiscono in modo affidabile a un `.click()` sparato da JS (serve un click reale del sistema operativo) — un tour non può quindi "usarli" via `onEnter`. Soluzione: nel file **solo di handoff** (mai nel prototipo), esponi le funzioni React già cablate sui controlli — e altre pensate apposta per compilare i dati — su `window.__ghf*`, con un effect **senza dipendenze** (si aggiorna ad ogni render, evitando closure stantie):
```js
React.useEffect(() => {
  window.__ghfIterPermessi = {
    openConcessioneDrawer, closePermitDrawer,     // le stesse funzioni già cablate sul menu/drawer
    hasConcessione,                                // valori derivati, sempre freschi
    selectFirstUtenza: () => setPermitRowKey(g.key + '-' + g.utilities[0].utilityNumber),
    confirmPermit: handleAddPermit,
    fillProjectExample: () => { setProgettista(v => v || 'Studio Tecnico Russo & Partners'); /* ... */ },
  };
  return () => { delete window.__ghfIterPermessi; };
});
```
Poi in `handoff-steps.js`, dentro `onEnter`: `window.__ghfIterPermessi.selectFirstUtenza()` invece di cliccare l'elemento. Stesso principio già in uso per i `Select` a cascata (`window.__ghfIdentita`, vedi Planning/inventory-systems) — estendilo a Dropdown e Upload.

**2 — Autosufficienza e idempotenza.** Ogni `onEnter` deve produrre lo stato giusto per QUEL passo indipendentemente da cosa è successo prima (l'utente può scorrere avanti, tornare indietro, saltare da "Indice"). Per uno step che deve mostrare un "risultato" (es. un campo valorizzato da un collegamento), controlla prima se il collegamento esiste già (un valore booleano esposto, es. `hasConcessione`) e agisci solo se manca — mai duplicare o dare per scontato l'ordine:
```js
function ghfEnsureConcessioneLinked(cb) {
  var api = window.__ghfIterPermessi;
  if (!api || api.hasConcessione) { cb && cb(); return; }
  api.openConcessioneDrawer();
  ghfWaitFor('.ant-drawer-body', function () {
    api.selectFirstUtenza();
    setTimeout(function () { window.__ghfIterPermessi.confirmPermit(); cb && cb(); }, 250);
  });
}
```

**3 — Mai inquadrare la cosa sbagliata: `ghfWaitFor`, non `setTimeout` a occhio.** Incatenare timeout indovinati fa sì che, prima o poi, il balloon punti a un elemento non ancora renderizzato. Aspetta l'ESISTENZA REALE del selettore nel DOM:
```js
function ghfWaitFor(selector, cb, maxWait) {
  var start = Date.now();
  setTimeout(function poll() {              // ⚠️ mai un controllo sincrono immediato
    if (document.querySelector(selector) || Date.now() - start > (maxWait || 1500)) { cb && cb(); return; }
    setTimeout(poll, 60);
  }, 60);
}
```
⚠️ Il primo controllo va **sempre ritardato di almeno un tick**, mai eseguito in modo sincrono: elementi come il wrapper di un `Drawer`/`Modal` spesso restano montati nel DOM anche dopo la chiusura, o un `Collapse` viene riusato da un'apertura precedente — un `document.querySelector` immediato li troverebbe "già lì" e scambierebbe per pronto un contenuto che React non ha ancora ri-renderizzato, facendo fallire (in silenzio) l'azione successiva o colpendo l'elemento sbagliato. Esempio reale: selezionare la riga di un accordion **collassato** non basta a mostrarla — serve anche aprire il pannello, e va fatto solo dopo `ghfWaitFor` sul selettore di quel pannello specifico, non su un proxy generico come il corpo del drawer.

**4 — Il motore non aspetta dinamicamente.** `step.delay` è un tempo FISSO che il motore attende dopo `onEnter()` prima di mostrare lo step (non collegato a promesse/`ghfWaitFor`). Per step con più azioni incatenate (apri drawer → seleziona → conferma) scegli un `delay` generoso (700–1200ms) e chiudi comunque la catena con `ghfNudge()` come correttivo finale sulla posizione dello spotlight.

### `window.HANDOFF_COMPONENTS` — registro Inspector dev
Una voce per ogni componente ispezionabile in hover. Il match usa `closest(selector)`: vince l'elemento più profondo.
```js
{
  selector:     '.gv-detail-header',          // CSS selector
  name:         'Header',
  level:        'Organismo',                   // Atomo | Molecola | Organismo | Pagina
  custom:       true,                          // opz.: badge CUSTOM (componente non standard AntD)
  funzione:     'Card titolo del dettaglio…',  // opz.: cosa fa (**grassetto**, righe "- ")
  figma:        '*Header* (DS, node 91-35550) — Variant=Detail',
  composizione: 'Link (back) + Title + Tag + Button',  // opz.: di cosa è composto
  tag:          true,    // opz.: per i Tag/Badge → mostra anche il blocco Colore
  icon:         true,    // opz.: per le icone → mostra libreria + nome icona
  variant:      function (el) { return el.textContent.trim(); }, // opz.: variante calcolata a runtime
}
```
Per gli atomi AntD standard (`.ant-btn`, `.ant-select`, `.ant-input`, `.ant-tag`, ecc.) basta `{ selector, name, level, figma }`: la variante viene rilevata da sola dalle classi DOM. Tipografia e colori dei testi sono calcolati a runtime in hover.

### `window.HANDOFF_NOTES` — note di design (popover inline + pannello)
```js
window.HANDOFF_NOTES = [
  { id: 'card-ruolo', title: 'Card KPI per ruolo',
    body: 'Le card **cambiano in base al ruolo**.\n- ==Per ruoli diversi dal Planner il design è da definire==' },
];
```
Ogni `id` va referenziato inline con `<HandoffDesignNote id="card-ruolo" />` nel file HTML (FASE 3.5).

### `window.HANDOFF_DEPENDENCIES` / `HANDOFF_RELATIONS` / `HANDOFF_SCENARIOS` — pannello "Modello"
Tre tab. Stessa forma: `{ id, title, description, table: { headers, rows, note } }`. Le marche `✓`/`✗`/`◐` sono colorate dal motore.
```js
window.HANDOFF_SCENARIOS = [
  { id: 'dati-trattativa', title: 'Dati che arrivano dalla trattativa',
    description: 'Se collegata a trattativa, questi campi sono **ereditati e read-only**.',
    table: { headers: ['Campo', 'Da trattativa', 'Senza'], rows: [['Inserzionista','✓','✗']], note: '✓ = read-only' } },
];
```
Se una sezione non serve, **ometti** la variabile (il tab mostrerà "Nessun elemento").

---

## FASE 5 — Verifica nel browser

1. Apri `index--handoff.html` nel browser (Playwright).
2. Controlla:
   - la **barra dev** appare in navbar accanto alla campanella (switch + "Sprint Jira" + "Modello");
   - lo **switch Inspector** in hover mostra le card componente corrette;
   - ogni **tour** parte, passa di step in step con spotlight sull'elemento giusto, e le azioni `onEnter` aprono popover/drawer come previsto; le task hanno il badge "Task" nel pannello;
   - i **marker caffè** delle note compaiono nei punti giusti e il popover mostra il testo;
   - il **filtro per ruolo** nasconde le US/task non pertinenti (cambia ruolo dall'avatar);
   - se è definito `HANDOFF_OUT_OF_SPRINT`, il toggle **"Interfaccia semplificata"** nel dropdown Sprint Jira evidenzia gli elementi giusti con outline tratteggiato rosso + tooltip.
3. Fai screenshot di verifica e correggi selettori/`onEnter`/`delay` finché ogni tour scorre pulito.

---

## FASE 6 — Chiusura

- Riepiloga all'utente: file creati (`index--handoff.html`, `handoff-steps.js`), US/task coperte, note e tabelle di modello aggiunte, elementi marcati fuori sprint, eventuali selettori fragili da tenere d'occhio.
- Ricorda il git workflow: commit sul branch del prototipo, poi PR verso `main` (no commit diretti su `main`).

---

## Regole

- **Riusa il motore**: non duplicare né modificare `prototype/_shared/handoff.js`. Se manca una capacità del motore, segnalalo invece di forkarlo.
- **Solo nel file `--handoff`**: l'`index.html` originale resta pulito; note e tour vivono solo nella variante.
- **Selettori stabili**: ancora tour e inspector a classi/id semantici (`.gv-*`, `.ss-*`, id), non a strutture fragili. Se un selettore utile non esiste, aggiungilo nel markup del prototipo.
- **Token sempre**: nessun colore hard-coded fuori da quelli del brand (`#3E00FB`, `#FF4A1C`, ecc.). La tipografia la gestisce il tema.
- **Lingua coerente**: tutti i testi nella lingua scelta.
- **Dati realistici**: dominio OOH/DOOH (impianti, campagne, inserzionisti, indirizzi siciliani), mai Lorem ipsum.
