# Handoff Engine — Gravity Platform

> Fonte di verità per il motore di handoff HTML interattivo condiviso (`prototype/_shared/handoff.js`).
> Per generare un handoff usa la skill **`/handoff`**; la skill **`/handoff-figma`** è un flusso
> diverso (costruisce le schermate su Figma con la libreria DS) — non confonderli.

## Architettura: prototipo unico + loader `?handoff`

Il prototipo è l'**unica fonte** — niente copie "handoff". Il layer si attiva via query param
(riferimento: `prototype/planning/index.html`):

| URL | Mostra |
|-----|--------|
| `index.html` | prototipo pulito |
| `index.html?handoff` | versione handoff **approvata** |
| `index.html?handoff=v1` | versione specifica (inesistente → decade sull'approvata) |

- Loader inline in `<head>`: `document.write` della config di versione (sincrono → note
  disponibili al primo render).
- Loader a fine `<body>`: carica `../../handoff.js` solo se `window.__HANDOFF_ACTIVE`.
- `index--handoff.html` è uno **stub di redirect** alla versione approvata: i link di
  navigazione dell'app (navbar.js e altri prototipi) puntano lì e **non vanno cambiati** finché
  non si decide di aggiornare l'approvata.

### URL pubblici `/demo` e `/handoff` (passano dal login)

Redirect in `vercel.json` (root del repo) danno un punto d'ingresso stabile e condivisibile alle
due modalità, sempre **attraverso il login** (`prototype/single-signon/index.html`, lo stesso
flusso SSO dell'app reale) così demo e handoff si comportano come l'accesso vero:

| URL | Redirect verso | Dopo il login (tenant "Gravity white-label") |
|-----|-----------------|-----------------------------------------------|
| `/demo` | `single-signon/index.html` | home (`user-profile/index.html`), modalità demo |
| `/handoff` | `single-signon/index.html?handoff` | home, con modalità handoff propagata ai link a valle |
| `/demo/<chiave>` | `single-signon/index.html?next=<chiave>` | entry pulita del prototipo `<chiave>` (chiave del registro, es. `planning`) |
| `/handoff/<chiave>` | `single-signon/index.html?next=<chiave>&handoff` | entry handoff del prototipo `<chiave>` se esiste, altrimenti fallback sulla pulita |

La risoluzione della destinazione post-login vive in `resolveNextUrl()` dentro
`prototype/single-signon/index.html` (`App()`): legge `?next` (chiave di
`window.GRAVITY_PROTOTYPES`) e `?handoff`, e sceglie `entry`/`handoff` dello stesso record del
registro usato da `navbar.js`. Senza `next` valido ricade sulla home, propagando comunque
`?handoff` per i link a valle.

Da questi punti la navigazione resta nella modalità di partenza: sia `navbar.js` sia la navbar
inline di `user-profile/index.html` (che non usa il componente condiviso, ma ne replica il
pattern) sono **mode-aware** — rilevano `?handoff` nell'URL e scelgono, per ogni link generato
dal registro, l'entry `handoff` del prototipo target se esiste ed è la modalità corrente,
altrimenti sempre l'entry `entry` pulita (dettagli in `components/navbar.md` → "Link
mode-aware"). Per questo `registry.js` distingue esplicitamente `entry` (demo) e `handoff`
(opzionale, solo sui prototipi con layer handoff).

### Versioni = file di config, non copie HTML

`handoff-steps.js` = versione corrente; future = `handoff-steps-vX.js` + voce nel loader e in
`HANDOFF_META.versions` (id, url, `approved`, `current`). Le versioni congelano le
**annotazioni** (note/tour/scope sprint), non il prototipo: se il prototipo cambia, le versioni
vecchie mostrano il prototipo aggiornato con le vecchie annotazioni.

## Configurazione (globali letti da `handoff.js`)

| Globale | Contenuto |
|---------|-----------|
| `HANDOFF_META` | `{ title, version, date, author, versions? }` |
| `HANDOFF_SCREENS` | `{ key: { label, detect() } }` — rilevamento schermata corrente |
| `HANDOFF_TOURS` | tour spotlight `[{ id, title, description, roles?, startScreen?, novita?, type?, steps }]` — **vuoto = motore disattivato**, tranne quando `HANDOFF_META.versions` è valorizzato: in quel caso la dev bar monta comunque ridotta al solo selettore versione (per poter tornare a un'altra versione dalla UI anche su una versione ancora senza contenuti); `type` assente/`'us'` = user story (default), `'task'` = attività più granulare (stesso motore, badge "Task" nel pannello) |

Ordinamento nel dropdown Sprint Jira (`UsPanel`): prima tutti i tour `type: 'task'`, poi le user
story — dentro ciascun gruppo, per numero `US#n.m` estratto dal titolo (i titoli senza numero
restano in fondo al proprio gruppo, nell'ordine di inserimento in `HANDOFF_TOURS`).
| `HANDOFF_COMPONENTS` | inspector `[{ selector, name, level, custom?, funzione, figma, variant?(el) }]` |
| `HANDOFF_NOTES` | note di design inline |
| `HANDOFF_DEPENDENCIES` / `RELATIONS` / `SCENARIOS` | metadati pannello — la tab di ciascuna nel dropdown Modello appare **solo se ha elementi**: omettere la variabile (o lasciarla `[]`) nasconde del tutto quella tab invece di mostrarla vuota con "Nessun elemento"; con una sola tab con dati, la barra delle tab stessa non si mostra |
| `HANDOFF_OUT_OF_SPRINT` | `[{ selector, text?, note }]` — elementi fuori scope sprint |
| `HANDOFF_SPRINT_NOTE` | stringa opzionale — avviso in cima al dropdown Sprint Jira (`UsPanel`), supporta `**grassetto**`/`==evidenziato==`; assente = nessun avviso |

## UI iniettata

- **Dev bar in navbar** (accanto a `#gravity-bell-btn`): selettore versione (`VersionBadge`,
  solo se `HANDOFF_META.versions` è definito), select **Vista ruolo** (duplica il dropdown
  ruolo dell'avatar di `GravityNavbar` — stessa chiave `localStorage.gravity_proto_role`,
  sincronizzata con l'avatar via evento custom `gravity:role-change` in entrambe le direzioni;
  filtra anche Sprint Jira). Opzioni selezionabili: se **ogni** tour di `HANDOFF_TOURS` elenca
  `roles` (nessuno visibile a "tutti"), il select mostra solo l'unione di quei ruoli — quelli
  davvero coinvolti nella sprint corrente; altrimenti (o se l'unione risulta vuota) mostra la
  lista completa da `window.GRAVITY_ROLES`. L'avatar di `GravityNavbar` **non** è mai filtrato:
  resta sempre la lista completa, per navigare l'intero prototipo oltre la sprint corrente.

  Poi: switch Inspector (hover → nome, livello atomico, funzione, variante Figma), dropdown **Sprint Jira** (tour di
  user story + task, distinte da un badge "Task" sulle seconde; include il toggle "Interfaccia
  semplificata" per gli elementi fuori sprint, vedi sotto), dropdown **Modello** (tab Scenari /
  Dipendenze / Relazioni del dominio, alimentate da `HANDOFF_SCENARIOS` / `HANDOFF_DEPENDENCIES`
  / `HANDOFF_RELATIONS`). Il dropdown del selettore versione è la sola lista di versioni
  selezionabili (id, nota, tag "Approvata" sulla versione approvata, check sulla corrente) —
  senza titolo né stato del prototipo, e senza tooltip in hover sul badge.
- **Note di design**: `CoffeeOutlined` **rossa** `#FF4A1C`, marker inline contestuale con
  popover "Nota di design" — iconografia riservata (vedi `LAYOUT.md` §6.5).
- **Fuori sprint**: classe `.ghf-oos` (outline tratteggiato + badge + tooltip) sugli elementi in
  `HANDOFF_OUT_OF_SPRINT`, toggle nel pannello User story.

## Riferimenti implementativi

- Motore: `prototype/_shared/handoff.js` (schema globali in testa al file)
- Config esempio: `prototype/planning/handoff-steps.js`
- Wiring: `prototype/planning/index.html` (loader + `HandoffDesignNote`)
