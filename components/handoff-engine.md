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
| `HANDOFF_TOURS` | tour spotlight `[{ id, title, description, roles?, startScreen?, novita?, steps }]` — **vuoto = motore disattivato** |
| `HANDOFF_COMPONENTS` | inspector `[{ selector, name, level, custom?, funzione, figma, variant?(el) }]` |
| `HANDOFF_NOTES` | note di design inline |
| `HANDOFF_DEPENDENCIES` / `RELATIONS` / `SCENARIOS` | metadati pannello |
| `HANDOFF_OUT_OF_SPRINT` | `[{ selector, text?, note }]` — elementi fuori scope sprint |

## UI iniettata

- **Dev bar in navbar** (accanto a `#gravity-bell-btn`): switch Inspector (hover → nome, livello
  atomico, funzione, variante Figma), dropdown User story (tour), selettore versione
  (`VersionBadge`). Il dropdown del selettore versione è la sola lista di versioni selezionabili
  (id, nota, tag "Approvata" sulla versione approvata, check sulla corrente) — senza titolo né
  stato del prototipo, e senza tooltip in hover sul badge.
- **Note di design**: `CoffeeOutlined` **rossa** `#FF4A1C`, marker inline contestuale con
  popover "Nota di design" — iconografia riservata (vedi `LAYOUT.md` §6.5).
- **Fuori sprint**: classe `.ghf-oos` (outline tratteggiato + badge + tooltip) sugli elementi in
  `HANDOFF_OUT_OF_SPRINT`, toggle nel pannello User story.

## Riferimenti implementativi

- Motore: `prototype/_shared/handoff.js` (schema globali in testa al file)
- Config esempio: `prototype/planning/handoff-steps.js`
- Wiring: `prototype/planning/index.html` (loader + `HandoffDesignNote`)
